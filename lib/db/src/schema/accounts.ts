import { pgTable, text, integer, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/** Credits granted when an account is created (first analyses on the house). */
export const INITIAL_CREDITS = 3;

/**
 * Account profile for signed-in users (Clerk user id as primary key).
 * Anonymous sessions have no row here — they are scoped by the owner cookie.
 */
export const accountsTable = pgTable(
  "accounts",
  {
    userId: text("user_id").primaryKey(),
    pixKey: text("pix_key"),
    creditBalance: integer("credit_balance").notNull().default(INITIAL_CREDITS),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check("accounts_credit_balance_check", sql`${t.creditBalance} >= 0`),
  ],
);

export type AccountRow = typeof accountsTable.$inferSelect;
