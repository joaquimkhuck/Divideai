import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import Stripe from "stripe";
import { db, billsTable, billPeopleTable } from "@workspace/db";
import {
  CreateCheckoutSessionResponse,
  GetCheckoutSessionResponse,
  GetPaymentsConfigResponse,
} from "@workspace/api-zod";
import { billOwnerWhere } from "../middlewares/auth";
import { getStripe, appUrl } from "../lib/stripe";

const router: IRouter = Router();

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

router.get("/payments/config", (_req, res) => {
  res.json(
    GetPaymentsConfigResponse.parse({ enabled: getStripe() !== null }),
  );
});

router.post("/bills/:id/people/:personId/checkout", async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ message: "Stripe ainda não foi configurado." });
    return;
  }

  const id = parseId(req.params.id);
  const personId = parseId(req.params.personId);
  if (id === null || personId === null) {
    res.status(404).json({ message: "Pessoa não encontrada." });
    return;
  }

  const origin = appUrl(req);
  if (!origin) {
    res.status(400).json({ message: "Não consegui identificar a URL da aplicação." });
    return;
  }

  const [person] = await db
    .select({
      id: billPeopleTable.id,
      name: billPeopleTable.name,
      amountCents: billPeopleTable.amountCents,
      billId: billPeopleTable.billId,
    })
    .from(billPeopleTable)
    .innerJoin(billsTable, eq(billsTable.id, billPeopleTable.billId))
    .where(
      and(
        eq(billPeopleTable.id, personId),
        eq(billPeopleTable.billId, id),
        billOwnerWhere(req),
      ),
    )
    .limit(1);

  if (!person) {
    res.status(404).json({ message: "Pessoa não encontrada." });
    return;
  }
  if (person.amountCents <= 0) {
    res.status(400).json({ message: "Essa parte não tem valor para cobrar." });
    return;
  }

  // App nativo: o checkout abre no navegador do sistema (@capacitor/browser),
  // então a volta precisa ser por deep link — capacitor://localhost não é
  // navegável de fora do app. O header não é credencial, só troca a URL de
  // retorno; qualquer chamador pode mandá-lo.
  const isNativeReturn = req.header("x-app-platform") === "ios";
  const successUrl = isNativeReturn
    ? "divideai://pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}"
    : `${origin}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = isNativeReturn
    ? `divideai://role/${id}`
    : `${origin}/role/${id}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: `Parte de ${person.name} no Divide Aí`,
            description: "Pagamento de uma conta dividida",
          },
          unit_amount: person.amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      billId: String(id),
      personId: String(personId),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  if (!session.url) {
    res.status(502).json({ message: "Stripe não retornou uma URL de pagamento." });
    return;
  }

  res.status(201).json(
    CreateCheckoutSessionResponse.parse({
      sessionId: session.id,
      url: session.url,
    }),
  );
});

router.get("/payments/checkout-session/:sessionId", async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ message: "Stripe ainda não foi configurado." });
    return;
  }

  const sessionId = req.params.sessionId;
  if (!sessionId) {
    res.status(404).json({ message: "Pagamento não encontrado." });
    return;
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    if (err instanceof Stripe.errors.StripeInvalidRequestError) {
      res.status(404).json({ message: "Pagamento não encontrado." });
      return;
    }
    res.status(502).json({ message: "Não consegui falar com o Stripe." });
    return;
  }

  const billId = Number(session.metadata?.billId);
  const personId = Number(session.metadata?.personId);
  if (!billId || !personId) {
    res.status(404).json({ message: "Pagamento não encontrado." });
    return;
  }

  // Authorization here is the Stripe session id itself (unguessable), not the
  // anonymous owner cookie: the payer is very often a friend the bill owner
  // sent the link to, so they never have the owner's cookie.
  const [person] = await db
    .select({
      id: billPeopleTable.id,
      name: billPeopleTable.name,
      restaurantName: billsTable.restaurantName,
    })
    .from(billPeopleTable)
    .innerJoin(billsTable, eq(billsTable.id, billPeopleTable.billId))
    .where(and(eq(billPeopleTable.id, personId), eq(billPeopleTable.billId, billId)))
    .limit(1);
  if (!person) {
    res.status(404).json({ message: "Pagamento não encontrado." });
    return;
  }

  // Test-mode checkout has no webhook: settle the person's share here, the
  // same way the manual "Pago" toggle does, so the success page reflects it.
  if (session.payment_status === "paid") {
    await db
      .update(billPeopleTable)
      .set({ paid: true, paidAt: new Date() })
      .where(and(eq(billPeopleTable.id, personId), eq(billPeopleTable.paid, false)));
  }

  res.json(
    GetCheckoutSessionResponse.parse({
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      personName: person.name,
      restaurantName: person.restaurantName,
      billId,
    }),
  );
});

export default router;
