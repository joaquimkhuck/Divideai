import { Router, type IRouter } from "express";
import { and, eq, isNull } from "drizzle-orm";
import { db, accountsTable, billsTable, type AccountRow } from "@workspace/db";
import {
  GetAccountResponse,
  UpdateAccountBody,
  UpdateAccountResponse,
  ClaimBillsResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

/** Load the account row, creating it (with the free credits) on first touch. */
export async function ensureAccount(userId: string): Promise<AccountRow> {
  const [existing] = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.userId, userId));
  if (existing) return existing;
  const [created] = await db
    .insert(accountsTable)
    .values({ userId })
    .onConflictDoNothing()
    .returning();
  if (created) return created;
  const [raced] = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.userId, userId));
  return raced;
}

function toApi(account: AccountRow) {
  return { pixKey: account.pixKey, creditBalance: account.creditBalance };
}

router.get("/account", requireAuth, async (req, res) => {
  const account = await ensureAccount(req.userId!);
  res.json(GetAccountResponse.parse(toApi(account)));
});

router.patch("/account", requireAuth, async (req, res) => {
  const input = UpdateAccountBody.parse(req.body);
  await ensureAccount(req.userId!);
  const [updated] = await db
    .update(accountsTable)
    .set({ pixKey: input.pixKey === undefined ? undefined : input.pixKey })
    .where(eq(accountsTable.userId, req.userId!))
    .returning();
  res.json(UpdateAccountResponse.parse(toApi(updated)));
});

// Claim the anonymous session's bills for the signed-in account. Idempotent:
// only unclaimed bills of the current cookie are moved.
router.post("/account/claim", requireAuth, async (req, res) => {
  await ensureAccount(req.userId!);
  const moved = await db
    .update(billsTable)
    .set({ userId: req.userId! })
    .where(
      and(
        eq(billsTable.ownerToken, req.ownerToken),
        isNull(billsTable.userId),
      ),
    )
    .returning({ id: billsTable.id });
  res.json(ClaimBillsResponse.parse({ migrated: moved.length }));
});

// Privacy guardrail: remove every bill (cascades) and the profile row.
router.delete("/account/data", requireAuth, async (req, res) => {
  await db.transaction(async (tx) => {
    await tx.delete(billsTable).where(eq(billsTable.userId, req.userId!));
    await tx
      .delete(billsTable)
      .where(
        and(
          eq(billsTable.ownerToken, req.ownerToken),
          isNull(billsTable.userId),
        ),
      );
    await tx.delete(accountsTable).where(eq(accountsTable.userId, req.userId!));
  });
  res.status(204).end();
});

export default router;
