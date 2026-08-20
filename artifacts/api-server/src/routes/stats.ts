import { Router, type IRouter } from "express";
import { eq, and, inArray } from "drizzle-orm";
import { db, billsTable, billPeopleTable } from "@workspace/db";
import { GetStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (req, res) => {
  const bills = await db
    .select()
    .from(billsTable)
    .where(eq(billsTable.ownerToken, req.ownerToken));
  const pendingRows = bills.length
    ? await db
        .select({
          personId: billPeopleTable.id,
          billId: billPeopleTable.billId,
          name: billPeopleTable.name,
          amountCents: billPeopleTable.amountCents,
        })
        .from(billPeopleTable)
        .where(
          and(
            eq(billPeopleTable.paid, false),
            inArray(
              billPeopleTable.billId,
              bills.map((b) => b.id),
            ),
          ),
        )
    : [];

  const byBill = new Map(bills.map((b) => [b.id, b]));
  const data = {
    billCount: bills.length,
    totalSplitCents: bills.reduce((a, b) => a + b.totalCents, 0),
    pendingCents: pendingRows.reduce((a, p) => a + p.amountCents, 0),
    pendingPeople: pendingRows.map((p) => ({
      billId: p.billId,
      personId: p.personId,
      name: p.name,
      amountCents: p.amountCents,
      restaurantName: byBill.get(p.billId)?.restaurantName ?? null,
    })),
  };
  res.json(GetStatsResponse.parse(data));
});

export default router;
