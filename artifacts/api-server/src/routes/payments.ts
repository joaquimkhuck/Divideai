import { Router, type IRouter, type Request } from "express";
import { and, eq } from "drizzle-orm";
import Stripe from "stripe";
import { db, billsTable, billPeopleTable } from "@workspace/db";
import {
  CreateCheckoutSessionResponse,
  GetCheckoutSessionResponse,
  GetPaymentsConfigResponse,
} from "@workspace/api-zod";
import { billOwnerWhere } from "../middlewares/auth";

const router: IRouter = Router();

function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return secretKey ? new Stripe(secretKey) : null;
}

function appUrl(req: Request): string | null {
  const configured = process.env.PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) return configured;

  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
  const protocol = forwardedProto || req.protocol;
  const host = forwardedHost || req.get("host");
  return host ? `${protocol}://${host}` : null;
}

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
    success_url: `${origin}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/role/${id}`,
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

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const billId = Number(session.metadata?.billId);
  const personId = Number(session.metadata?.personId);
  if (!billId || !personId) {
    res.status(404).json({ message: "Pagamento não encontrado." });
    return;
  }

  const [owned] = await db
    .select({ id: billsTable.id })
    .from(billsTable)
    .where(and(eq(billsTable.id, billId), billOwnerWhere(req)));
  if (!owned) {
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
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
    }),
  );
});

export default router;
