import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import Stripe from "stripe";
import { db, accountsTable, creditPurchasesTable } from "@workspace/db";
import {
  GetCreditPackagesResponse,
  CreateCreditsCheckoutSessionBody,
  CreateCreditsCheckoutSessionResponse,
  GetCreditsCheckoutSessionResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";
import { ensureAccount } from "./account";
import { getStripe, appUrl } from "../lib/stripe";
import { CREDIT_PACKAGES, getCreditPackage } from "../lib/credit-packages";

const router: IRouter = Router();

router.get("/credits/packages", (_req, res) => {
  res.json(GetCreditPackagesResponse.parse({ packages: CREDIT_PACKAGES }));
});

router.post("/credits/checkout", requireAuth, async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ message: "Stripe ainda não foi configurado." });
    return;
  }

  const input = CreateCreditsCheckoutSessionBody.parse(req.body);
  const pkg = getCreditPackage(input.packageId);
  if (!pkg) {
    res.status(400).json({ message: "Pacote de créditos inválido." });
    return;
  }

  const origin = appUrl(req);
  if (!origin) {
    res.status(400).json({ message: "Não consegui identificar a URL da aplicação." });
    return;
  }

  const userId = req.userId!;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: `${pkg.credits} créditos no Divide Aí`,
            description: "Créditos para análise de contas por foto",
          },
          unit_amount: pkg.amountCents,
        },
        quantity: 1,
      },
    ],
    client_reference_id: userId,
    metadata: {
      kind: "credits",
      userId,
      packageId: pkg.id,
      credits: String(pkg.credits),
    },
    success_url: `${origin}/creditos/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/creditos`,
  });

  if (!session.url) {
    res.status(502).json({ message: "Stripe não retornou uma URL de pagamento." });
    return;
  }

  res.status(201).json(
    CreateCreditsCheckoutSessionResponse.parse({
      sessionId: session.id,
      url: session.url,
    }),
  );
});

router.get<{ sessionId: string }>("/credits/checkout-session/:sessionId", requireAuth, async (req, res) => {
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
  const userId = req.userId!;

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

  if (session.metadata?.kind !== "credits" || session.metadata?.userId !== userId) {
    res.status(404).json({ message: "Pagamento não encontrado." });
    return;
  }

  const credits = Number(session.metadata.credits);

  await ensureAccount(userId);

  if (session.payment_status === "paid" && Number.isInteger(credits) && credits > 0) {
    await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(creditPurchasesTable)
        .values({
          stripeSessionId: session.id,
          userId,
          credits,
          amountCents: session.amount_total ?? 0,
        })
        .onConflictDoNothing({ target: creditPurchasesTable.stripeSessionId })
        .returning({ id: creditPurchasesTable.id });

      // Only the insert that actually happened credits the account — a
      // second call for the same session hits the unique conflict instead.
      if (inserted.length > 0) {
        await tx
          .update(accountsTable)
          .set({ creditBalance: sql`${accountsTable.creditBalance} + ${credits}` })
          .where(eq(accountsTable.userId, userId));
      }
    });
  }

  const [account] = await db
    .select({ creditBalance: accountsTable.creditBalance })
    .from(accountsTable)
    .where(eq(accountsTable.userId, userId));

  res.json(
    GetCreditsCheckoutSessionResponse.parse({
      status: session.status,
      paymentStatus: session.payment_status,
      credits,
      creditBalance: account?.creditBalance ?? 0,
    }),
  );
});

export default router;
