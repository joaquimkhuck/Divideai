import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  real,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

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
    restaurantName: text("restaurant_name"),
    serviceFeePercent: real("service_fee_percent").notNull().default(0),
    couvertCents: integer("couvert_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("bills_owner_token_idx").on(t.ownerToken)],
);

export const billItemsTable = pgTable("bill_items", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id")
    .notNull()
    .references(() => billsTable.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPriceCents: integer("unit_price_cents").notNull(),
});

export const billPeopleTable = pgTable("bill_people", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id")
    .notNull()
    .references(() => billsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amountCents: integer("amount_cents").notNull(),
  paid: boolean("paid").notNull().default(false),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export const itemAssignmentsTable = pgTable("item_assignments", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => billItemsTable.id, { onDelete: "cascade" }),
  personId: integer("person_id")
    .notNull()
    .references(() => billPeopleTable.id, { onDelete: "cascade" }),
});

export type BillRow = typeof billsTable.$inferSelect;
export type BillItemRow = typeof billItemsTable.$inferSelect;
export type BillPersonRow = typeof billPeopleTable.$inferSelect;
export type ItemAssignmentRow = typeof itemAssignmentsTable.$inferSelect;
