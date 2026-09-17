import { Router, type IRouter, type Request } from "express";
import { and, eq } from "drizzle-orm";
import Stripe from "stripe";
import {
  db,
  billsTable,
  billPeopleTable,
} from "@workspace/db";
import {
  CreateCheckoutSessionBody,
  CreateCheckoutSessionResponse,
  GetCheckoutSessionResponse,
} from "@workspace/api-zod";

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

router.post("/payments/checkout-session", async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ message: "Stripe ainda não foi configurado." });
    return;
  }

  const input = CreateCheckoutSessionBody.parse(req.body);
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
        eq(billPeopleTable.id, input.personId),
        eq(billPeopleTable.billId, input.billId),
        eq(billsTable.ownerToken, req.ownerToken),
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
      billId: String(input.billId),
      personId: String(input.personId),
      ownerToken: req.ownerToken,
    },
    success_url: `${origin}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/role/${input.billId}`,
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
  if (session.metadata?.ownerToken !== req.ownerToken) {
    res.status(404).json({ message: "Pagamento não encontrado." });
    return;
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
