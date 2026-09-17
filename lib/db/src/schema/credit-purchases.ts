import { pgTable, serial, text, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * One row per settled Stripe Checkout Session that granted credits.
 * `stripeSessionId` is unique so crediting the account is idempotent even if
 * the status endpoint is called more than once for the same session.
 */
export const creditPurchasesTable = pgTable(
  "credit_purchases",
  {
    id: serial("id").primaryKey(),
    stripeSessionId: text("stripe_session_id").notNull(),
    userId: text("user_id").notNull(),
    credits: integer("credits").notNull(),
    amountCents: integer("amount_cents").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("credit_purchases_stripe_session_id_uq").on(t.stripeSessionId),
  ],
);

export type CreditPurchaseRow = typeof creditPurchasesTable.$inferSelect;
