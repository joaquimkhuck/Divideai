import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  real,
  timestamp,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const billsTable = pgTable(
  "bills",
  {
    id: serial("id").primaryKey(),
    /**
     * Anonymous owner token (httpOnly cookie value). Every bill belongs to
     * the anonymous session that created it; all reads/writes are scoped to
     * this value. Empty string marks legacy rows that predate scoping.
     */
    ownerToken: text("owner_token").notNull().default(""),
    /**
     * Signed-in owner (Clerk user id). Null for anonymous bills. When a user
     * signs in, their anonymous bills are claimed by setting this column.
     * When set, it wins over ownerToken for scoping.
     */
    userId: text("user_id"),
    restaurantName: text("restaurant_name"),
    serviceFeePercent: real("service_fee_percent").notNull().default(0),
    couvertCents: integer("couvert_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
      index("bills_owner_token_idx").on(t.ownerToken),
      index("bills_user_id_idx").on(t.userId),
      index("bills_owner_created_idx").on(t.ownerToken, t.createdAt),
      index("bills_user_created_idx").on(t.userId, t.createdAt),
      check(
        "bills_service_fee_percent_check",
        sql`${t.serviceFeePercent} >= 0 AND ${t.serviceFeePercent} <= 100`,
      ),
      check(
        "bills_couvert_cents_check",
        sql`${t.couvertCents} >= 0`,
      ),
      check("bills_total_cents_check", sql`${t.totalCents} >= 0`),
  ],
);

export const billItemsTable = pgTable(
  "bill_items",
  {
    id: serial("id").primaryKey(),
    billId: integer("bill_id")
      .notNull()
      .references(() => billsTable.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    quantity: integer("quantity").notNull().default(1),
    unitPriceCents: integer("unit_price_cents").notNull(),
  },
  (t) => [
    index("bill_items_bill_id_idx").on(t.billId),
    check("bill_items_quantity_check", sql`${t.quantity} > 0`),
    check(
      "bill_items_unit_price_check",
      sql`${t.unitPriceCents} >= 0`,
    ),
  ],
);

export const billPeopleTable = pgTable(
  "bill_people",
  {
    id: serial("id").primaryKey(),
    billId: integer("bill_id")
      .notNull()
      .references(() => billsTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    amountCents: integer("amount_cents").notNull(),
    paid: boolean("paid").notNull().default(false),
    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (t) => [
    index("bill_people_bill_id_idx").on(t.billId),
    check("bill_people_amount_check", sql`${t.amountCents} >= 0`),
  ],
);

export const itemAssignmentsTable = pgTable(
  "item_assignments",
  {
    id: serial("id").primaryKey(),
    itemId: integer("item_id")
      .notNull()
      .references(() => billItemsTable.id, { onDelete: "cascade" }),
    personId: integer("person_id")
      .notNull()
      .references(() => billPeopleTable.id, { onDelete: "cascade" }),
  },
  (t) => [
    uniqueIndex("item_assignments_item_person_uq").on(t.itemId, t.personId),
    index("item_assignments_person_id_idx").on(t.personId),
  ],
);

export type BillRow = typeof billsTable.$inferSelect;
export type BillItemRow = typeof billItemsTable.$inferSelect;
export type BillPersonRow = typeof billPeopleTable.$inferSelect;
export type ItemAssignmentRow = typeof itemAssignmentsTable.$inferSelect;

