import { Router, type IRouter } from "express";
import { inArray, desc, eq, and } from "drizzle-orm";
import {
  db,
  billsTable,
  billItemsTable,
  billPeopleTable,
  itemAssignmentsTable,
  type BillRow,
} from "@workspace/db";
import {
  AnalyzeBillBody,
  AnalyzeBillResponse,
  CreateBillBody,
  CreateBillResponse,
  GetBillResponse,
  ListBillsResponse,
  SetPersonPaidBody,
  SetPersonPaidResponse,
} from "@workspace/api-zod";
import { analyzeBillImage, BillReadError } from "../lib/ai";
import { computeSplit } from "../lib/split";
import { rateLimit } from "../middlewares/rate-limit";

const router: IRouter = Router();

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // client downscales to ~1600px JPEG

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** Server-side financial sanity limits (beyond generated schema). */
function validateBillInput(input: {
  serviceFeePercent: number;
  couvertCents: number;
  items: { description: string; quantity: number; unitPriceCents: number }[];
  people: { name: string }[];
}): string | null {
  if (input.serviceFeePercent < 0 || input.serviceFeePercent > 100)
    return "Taxa de serviço inválida.";
  if (input.couvertCents > 10_000_00) return "Couvert inválido.";
  if (input.items.length > 200 || input.people.length > 30)
    return "Conta grande demais.";
  for (const it of input.items) {
    if (it.description.length > 200) return "Descrição de item longa demais.";
    if (it.quantity > 999 || it.unitPriceCents > 100_000_00)
      return "Item com valores inválidos.";
  }
  for (const p of input.people) {
    if (p.name.length > 80) return "Nome longo demais.";
  }
  return null;
}

async function loadBills(bills: BillRow[]) {
  if (bills.length === 0) return [];
  const ids = bills.map((b) => b.id);
  const items = await db
    .select()
    .from(billItemsTable)
    .where(inArray(billItemsTable.billId, ids));
  const people = await db
    .select()
    .from(billPeopleTable)
    .where(inArray(billPeopleTable.billId, ids));
  const assignments = items.length
    ? await db
        .select()
        .from(itemAssignmentsTable)
        .where(
          inArray(
            itemAssignmentsTable.itemId,
            items.map((i) => i.id),
          ),
        )
    : [];

  return bills.map((bill) => {
    const billPeople = people.filter((p) => p.billId === bill.id);
    return {
      id: bill.id,
      restaurantName: bill.restaurantName,
      createdAt: bill.createdAt.toISOString(),
      serviceFeePercent: bill.serviceFeePercent,
      couvertCents: bill.couvertCents,
      totalCents: bill.totalCents,
      settled: billPeople.length > 0 && billPeople.every((p) => p.paid),
      items: items
        .filter((i) => i.billId === bill.id)
        .map((i) => ({
          id: i.id,
          description: i.description,
          quantity: i.quantity,
          unitPriceCents: i.unitPriceCents,
          totalCents: i.quantity * i.unitPriceCents,
          personIds: assignments
            .filter((a) => a.itemId === i.id)
            .map((a) => a.personId),
        })),
      people: billPeople.map((p) => ({
        id: p.id,
        name: p.name,
        amountCents: p.amountCents,
        paid: p.paid,
        paidAt: p.paidAt ? p.paidAt.toISOString() : null,
      })),
    };
  });
}

// IP-keyed limit so minting new owner cookies cannot bypass it.
const analyzeLimiter = rateLimit({ max: 10, windowMs: 60 * 60 * 1000 });

router.post("/bills/analyze", analyzeLimiter, async (req, res) => {
  const { imageBase64 } = AnalyzeBillBody.parse(req.body);
  const raw = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  if (
    imageBase64.startsWith("data:") &&
    !/^data:image\/(jpeg|png|webp|gif);base64,/.test(imageBase64)
  ) {
    res.status(422).json({ message: "Formato de imagem não suportado." });
    return;
  }
  if (
    (raw.length * 3) / 4 > MAX_IMAGE_BYTES ||
    !/^[A-Za-z0-9+/=\s]+$/.test(raw.slice(0, 1000))
  ) {
    res.status(422).json({ message: "Imagem grande demais ou inválida." });
    return;
  }
  try {
    const draft = await analyzeBillImage(imageBase64);
    res.json(AnalyzeBillResponse.parse(draft));
  } catch (err) {
    if (err instanceof BillReadError) {
      res.status(422).json({ message: "Não conseguimos ler essa foto." });
      return;
    }
    throw err;
  }
});

router.get("/bills", async (req, res) => {
  const bills = await db
    .select()
    .from(billsTable)
    .where(eq(billsTable.ownerToken, req.ownerToken))
    .orderBy(desc(billsTable.createdAt));
  res.json(ListBillsResponse.parse(await loadBills(bills)));
});

router.post("/bills", async (req, res) => {
  const input = CreateBillBody.parse(req.body);

  const invalid = validateBillInput(input);
  if (invalid) {
    res.status(400).json({ message: invalid });
    return;
  }

  const orphan = input.items.find((it) => it.personIndexes.length === 0);
  if (orphan) {
    res.status(400).json({ message: "Todo item precisa de pelo menos um dono." });
    return;
  }
  const badIndex = input.items.some((it) =>
    it.personIndexes.some((i) => i >= input.people.length),
  );
  if (badIndex) {
    res.status(400).json({ message: "Índice de pessoa inválido." });
    return;
  }

  const split = computeSplit(
    input.items,
    input.people.length,
    input.serviceFeePercent,
    input.couvertCents,
  );

  const billId = await db.transaction(async (tx) => {
    const [bill] = await tx
      .insert(billsTable)
      .values({
        ownerToken: req.ownerToken,
        restaurantName: input.restaurantName ?? null,
        serviceFeePercent: input.serviceFeePercent,
        couvertCents: input.couvertCents,
        totalCents: split.totalCents,
      })
      .returning();

    const people = await tx
      .insert(billPeopleTable)
      .values(
        input.people.map((p, i) => ({
          billId: bill.id,
          name: p.name,
          amountCents: split.perPersonCents[i],
        })),
      )
      .returning();

    for (const item of input.items) {
      const [row] = await tx
        .insert(billItemsTable)
        .values({
          billId: bill.id,
          description: item.description,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
        })
        .returning();
      const sharers = [...new Set(item.personIndexes)];
      if (sharers.length > 0) {
        await tx.insert(itemAssignmentsTable).values(
          sharers.map((idx) => ({ itemId: row.id, personId: people[idx].id })),
        );
      }
    }
    return bill.id;
  });

  const [bill] = await db.select().from(billsTable).where(eq(billsTable.id, billId));
  const [full] = await loadBills([bill]);
  res.status(201).json(CreateBillResponse.parse(full));
});

router.get("/bills/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(404).json({ message: "Rolê não encontrado." });
    return;
  }
  const [bill] = await db
    .select()
    .from(billsTable)
    .where(and(eq(billsTable.id, id), eq(billsTable.ownerToken, req.ownerToken)));
  if (!bill) {
    res.status(404).json({ message: "Rolê não encontrado." });
    return;
  }
  const [full] = await loadBills([bill]);
  res.json(GetBillResponse.parse(full));
});

router.delete("/bills/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(404).json({ message: "Rolê não encontrado." });
    return;
  }
  const deleted = await db
    .delete(billsTable)
    .where(and(eq(billsTable.id, id), eq(billsTable.ownerToken, req.ownerToken)))
    .returning({ id: billsTable.id });
  if (deleted.length === 0) {
    res.status(404).json({ message: "Rolê não encontrado." });
    return;
  }
  res.status(204).end();
});

router.patch("/bills/:id/people/:personId/paid", async (req, res) => {
  const id = parseId(req.params.id);
  const personId = parseId(req.params.personId);
  if (id === null || personId === null) {
    res.status(404).json({ message: "Pessoa não encontrada." });
    return;
  }
  const { paid } = SetPersonPaidBody.parse(req.body);

  const [owned] = await db
    .select({ id: billsTable.id })
    .from(billsTable)
    .where(and(eq(billsTable.id, id), eq(billsTable.ownerToken, req.ownerToken)));
  if (!owned) {
    res.status(404).json({ message: "Pessoa não encontrada." });
    return;
  }

  const [person] = await db
    .select()
    .from(billPeopleTable)
    .where(eq(billPeopleTable.id, personId));
  if (!person || person.billId !== id) {
    res.status(404).json({ message: "Pessoa não encontrada." });
    return;
  }
  await db
    .update(billPeopleTable)
    .set({ paid, paidAt: paid ? new Date() : null })
    .where(eq(billPeopleTable.id, personId));

  const [bill] = await db.select().from(billsTable).where(eq(billsTable.id, id));
  const [full] = await loadBills([bill]);
  res.json(SetPersonPaidResponse.parse(full));
});

export default router;
