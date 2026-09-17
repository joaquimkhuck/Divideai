import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Fixed UUIDs keep the demo dataset easy to find and make this script
// idempotent without touching any user's anonymous or signed-in data.
const accounts = [
  { userId: "user_demo_divideai", ownerToken: "00000000-0000-4000-8000-000000000001", pixKey: "demo@divideai.pix", creditBalance: 12 },
  { userId: "user_demo_carla", ownerToken: "00000000-0000-4000-8000-000000000002", pixKey: "carla.demo@pix.com", creditBalance: 8 },
  { userId: "user_demo_rafael", ownerToken: "00000000-0000-4000-8000-000000000003", pixKey: "rafael.demo@pix.com", creditBalance: 5 },
  { userId: "user_demo_luana", ownerToken: "00000000-0000-4000-8000-000000000004", pixKey: "luana.demo@pix.com", creditBalance: 10 },
  { userId: "user_demo_gabriel", ownerToken: "00000000-0000-4000-8000-000000000005", pixKey: "gabriel.demo@pix.com", creditBalance: 3 },
  { userId: "user_demo_isabela", ownerToken: "00000000-0000-4000-8000-000000000006", pixKey: "isabela.demo@pix.com", creditBalance: 7 },
  { userId: "user_demo_pedro", ownerToken: "00000000-0000-4000-8000-000000000007", pixKey: "pedro.demo@pix.com", creditBalance: 15 },
  { userId: "user_demo_julia", ownerToken: "00000000-0000-4000-8000-000000000008", pixKey: "julia.demo@pix.com", creditBalance: 4 },
  { userId: "user_demo_thiago", ownerToken: "00000000-0000-4000-8000-000000000009", pixKey: "thiago.demo@pix.com", creditBalance: 9 },
  { userId: "user_demo_beatriz", ownerToken: "00000000-0000-4000-8000-000000000010", pixKey: "beatriz.demo@pix.com", creditBalance: 6 },
];

function splitEven(total, count) {
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
}

function allocateProportional(total, weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return splitEven(total, weights.length);
  const raw = weights.map((weight) => (total * weight) / sum);
  const result = raw.map(Math.floor);
  let remaining = total - result.reduce((a, b) => a + b, 0);
  raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction)
    .forEach(({ index }) => {
      if (remaining > 0) {
        result[index] += 1;
        remaining -= 1;
      }
    });
  return result;
}

function calculatePeople(items, peopleCount, feePercent, couvertCents) {
  const consumption = Array.from({ length: peopleCount }, () => 0);
  let itemsTotalCents = 0;

  for (const item of items) {
    const total = item.quantity * item.unitPriceCents;
    itemsTotalCents += total;
    const parts = splitEven(total, item.personIndexes.length);
    item.personIndexes.forEach((personIndex, i) => {
      consumption[personIndex] += parts[i];
    });
  }

  const couvert = splitEven(couvertCents, peopleCount);
  const feeTotalCents = Math.round(
    ((itemsTotalCents + couvertCents) * feePercent) / 100,
  );
  const fee = allocateProportional(
    feeTotalCents,
    consumption.map((amount, i) => amount + couvert[i]),
  );

  return {
    amounts: consumption.map((amount, i) => amount + couvert[i] + fee[i]),
    totalCents: itemsTotalCents + couvertCents + feeTotalCents,
  };
}

const demos = [
  {
    userId: "user_demo_divideai",
    ownerToken: "00000000-0000-4000-8000-000000000001",
    restaurantName: "Cantina do Bairro · demonstração",
    createdAt: "2026-08-26T20:30:00.000Z",
    serviceFeePercent: 10,
    couvertCents: 0,
    people: [
      { name: "Ana" },
      { name: "Bruno" },
      { name: "Carla" },
      { name: "Diego" },
    ],
    items: [
      { description: "Pizza margherita", quantity: 2, unitPriceCents: 2800, personIndexes: [0, 1, 2, 3] },
      { description: "Suco natural", quantity: 2, unitPriceCents: 900, personIndexes: [0, 1] },
    ],
    paidIndexes: [0, 1],
  },
  {
    userId: "user_demo_divideai",
    ownerToken: "00000000-0000-4000-8000-000000000001",
    restaurantName: "Sushi Nipo · demonstração",
    createdAt: "2026-08-28T22:10:00.000Z",
    serviceFeePercent: 10,
    couvertCents: 1500,
    people: [{ name: "Marina" }, { name: "Lúcia" }, { name: "Rafael" }],
    items: [
      { description: "Combinado 32 peças", quantity: 1, unitPriceCents: 15990, personIndexes: [0, 1] },
      { description: "Temaki salmão", quantity: 2, unitPriceCents: 2450, personIndexes: [0] },
      { description: "Água com gás", quantity: 3, unitPriceCents: 650, personIndexes: [0, 1, 2] },
    ],
    paidIndexes: [],
  },
  {
    userId: "user_demo_divideai",
    ownerToken: "00000000-0000-4000-8000-000000000001",
    restaurantName: "Pão & Brasa · demonstração",
    createdAt: "2026-08-30T13:15:00.000Z",
    serviceFeePercent: 0,
    couvertCents: 600,
    people: [{ name: "João" }, { name: "Bia" }],
    items: [
      { description: "Hambúrguer artesanal", quantity: 2, unitPriceCents: 3290, personIndexes: [0, 1] },
      { description: "Batata da casa", quantity: 1, unitPriceCents: 1890, personIndexes: [0, 1] },
      { description: "Refrigerante", quantity: 1, unitPriceCents: 700, personIndexes: [1] },
    ],
    paidIndexes: [0, 1],
  },
  {
    userId: "user_demo_carla",
    ownerToken: "00000000-0000-4000-8000-000000000002",
    restaurantName: "Bistrô da Praça · demonstração",
    createdAt: "2026-08-22T20:45:00.000Z",
    serviceFeePercent: 10,
    couvertCents: 2000,
    people: [{ name: "Carla" }, { name: "André" }, { name: "Nina" }, { name: "Pedro" }, { name: "Sofia" }],
    items: [
      { description: "Risoto de cogumelos", quantity: 2, unitPriceCents: 4200, personIndexes: [0, 1] },
      { description: "Peixe grelhado", quantity: 1, unitPriceCents: 5800, personIndexes: [2] },
      { description: "Salada da casa", quantity: 2, unitPriceCents: 1800, personIndexes: [0, 1, 2, 3, 4] },
      { description: "Suco de uva", quantity: 3, unitPriceCents: 1200, personIndexes: [0, 3, 4] },
    ],
    paidIndexes: [0, 1, 2],
  },
  {
    userId: "user_demo_carla",
    ownerToken: "00000000-0000-4000-8000-000000000002",
    restaurantName: "Churrasco do Sul · demonstração",
    createdAt: "2026-08-29T21:20:00.000Z",
    serviceFeePercent: 10,
    couvertCents: 0,
    people: [{ name: "Carla" }, { name: "André" }, { name: "Nina" }, { name: "Pedro" }],
    items: [
      { description: "Picanha fatiada", quantity: 1, unitPriceCents: 8990, personIndexes: [0, 1, 2, 3] },
      { description: "Linguiça artesanal", quantity: 2, unitPriceCents: 2190, personIndexes: [1, 2, 3] },
      { description: "Cerveja long neck", quantity: 4, unitPriceCents: 990, personIndexes: [0, 1, 3] },
    ],
    paidIndexes: [],
  },
  {
    userId: "user_demo_rafael",
    ownerToken: "00000000-0000-4000-8000-000000000003",
    restaurantName: "Café Aurora · demonstração",
    createdAt: "2026-08-18T15:10:00.000Z",
    serviceFeePercent: 0,
    couvertCents: 0,
    people: [{ name: "Rafael" }, { name: "Elisa" }],
    items: [
      { description: "Brunch completo", quantity: 2, unitPriceCents: 3890, personIndexes: [0, 1] },
      { description: "Café coado", quantity: 2, unitPriceCents: 650, personIndexes: [0, 1] },
      { description: "Torta de limão", quantity: 1, unitPriceCents: 1600, personIndexes: [0] },
    ],
    paidIndexes: [0, 1],
  },
  {
    userId: "user_demo_rafael",
    ownerToken: "00000000-0000-4000-8000-000000000003",
    restaurantName: "Trattoria Bella · demonstração",
    createdAt: "2026-08-27T20:00:00.000Z",
    serviceFeePercent: 10,
    couvertCents: 1200,
    people: [{ name: "Rafael" }, { name: "Elisa" }, { name: "Vitor" }],
    items: [
      { description: "Massa ao pesto", quantity: 1, unitPriceCents: 4690, personIndexes: [0] },
      { description: "Lasanha bolonhesa", quantity: 1, unitPriceCents: 4990, personIndexes: [1] },
      { description: "Pizza quatro queijos", quantity: 1, unitPriceCents: 5290, personIndexes: [0, 1, 2] },
      { description: "Tiramisù", quantity: 2, unitPriceCents: 1890, personIndexes: [2] },
    ],
    paidIndexes: [0],
  },
  {
    userId: "user_demo_luana",
    ownerToken: "00000000-0000-4000-8000-000000000004",
    restaurantName: "Boteco Central · demonstração",
    createdAt: "2026-08-24T19:40:00.000Z",
    serviceFeePercent: 10,
    couvertCents: 1800,
    people: [{ name: "Luana" }, { name: "Caio" }, { name: "Fernanda" }, { name: "Igor" }, { name: "Malu" }, { name: "Otávio" }],
    items: [
      { description: "Porção de pastéis", quantity: 3, unitPriceCents: 2690, personIndexes: [0, 1, 2, 3, 4, 5] },
      { description: "Bolinho de bacalhau", quantity: 2, unitPriceCents: 3290, personIndexes: [0, 1, 2, 3] },
      { description: "Caipirinha", quantity: 4, unitPriceCents: 1890, personIndexes: [0, 2, 4, 5] },
      { description: "Refrigerante", quantity: 2, unitPriceCents: 700, personIndexes: [1, 3] },
    ],
    paidIndexes: [0, 2, 4],
  },
  {
    userId: "user_demo_luana",
    ownerToken: "00000000-0000-4000-8000-000000000004",
    restaurantName: "Tacos da Vila · demonstração",
    createdAt: "2026-08-31T00:05:00.000Z",
    serviceFeePercent: 10,
    couvertCents: 0,
    people: [{ name: "Luana" }, { name: "Caio" }, { name: "Fernanda" }],
    items: [
      { description: "Taco de carne", quantity: 3, unitPriceCents: 1690, personIndexes: [0, 1, 2] },
      { description: "Nachos com guacamole", quantity: 1, unitPriceCents: 2990, personIndexes: [0, 1, 2] },
      { description: "Churros", quantity: 2, unitPriceCents: 1290, personIndexes: [0] },
    ],
    paidIndexes: [],
  },
  {
    userId: "user_demo_gabriel",
    ownerToken: "00000000-0000-4000-8000-000000000005",
    restaurantName: "Maré Alta · demonstração",
    createdAt: "2026-08-21T18:30:00.000Z",
    serviceFeePercent: 10,
    couvertCents: 900,
    people: [{ name: "Gabriel" }, { name: "Helena" }, { name: "Davi" }],
    items: [
      { description: "Moqueca de peixe", quantity: 1, unitPriceCents: 11990, personIndexes: [0, 1, 2] },
      { description: "Arroz branco", quantity: 1, unitPriceCents: 1890, personIndexes: [0, 1, 2] },
      { description: "Água de coco", quantity: 3, unitPriceCents: 890, personIndexes: [0, 1, 2] },
    ],
    paidIndexes: [0, 1],
  },
  {
    userId: "user_demo_gabriel",
    ownerToken: "00000000-0000-4000-8000-000000000005",
    restaurantName: "Verde Mesa · demonstração",
    createdAt: "2026-08-25T12:50:00.000Z",
    serviceFeePercent: 0,
    couvertCents: 0,
    people: [{ name: "Gabriel" }, { name: "Helena" }],
    items: [
      { description: "Bowl mediterrâneo", quantity: 2, unitPriceCents: 3590, personIndexes: [0, 1] },
      { description: "Suco verde", quantity: 2, unitPriceCents: 1100, personIndexes: [0, 1] },
    ],
    paidIndexes: [0, 1],
  },
];

const client = await pool.connect();
try {
  await client.query("BEGIN");

  // Only rows belonging to these fixed demo owners are replaced.
  for (const account of accounts) {
    await client.query("DELETE FROM bills WHERE owner_token = $1", [
      account.ownerToken,
    ]);
    await client.query(
      `INSERT INTO accounts (user_id, pix_key, credit_balance, created_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE
       SET pix_key = EXCLUDED.pix_key, credit_balance = EXCLUDED.credit_balance`,
      [
        account.userId,
        account.pixKey,
        account.creditBalance,
        "2026-08-20T12:00:00.000Z",
      ],
    );
  }

  for (const demo of demos) {
    const split = calculatePeople(
      demo.items,
      demo.people.length,
      demo.serviceFeePercent,
      demo.couvertCents,
    );
    const billResult = await client.query(
      `INSERT INTO bills
        (owner_token, user_id, restaurant_name, service_fee_percent, couvert_cents, total_cents, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        demo.ownerToken,
        demo.userId,
        demo.restaurantName,
        demo.serviceFeePercent,
        demo.couvertCents,
        split.totalCents,
        demo.createdAt,
      ],
    );
    const billId = billResult.rows[0].id;
    const personIds = [];
    for (let i = 0; i < demo.people.length; i += 1) {
      const personResult = await client.query(
        `INSERT INTO bill_people (bill_id, name, amount_cents, paid, paid_at)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
          billId,
          demo.people[i].name,
          split.amounts[i],
          demo.paidIndexes.includes(i),
          demo.paidIndexes.includes(i) ? demo.createdAt : null,
        ],
      );
      personIds.push(personResult.rows[0].id);
    }
    for (const item of demo.items) {
      const itemResult = await client.query(
        `INSERT INTO bill_items (bill_id, description, quantity, unit_price_cents)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [billId, item.description, item.quantity, item.unitPriceCents],
      );
      await client.query(
        `INSERT INTO item_assignments (item_id, person_id)
         SELECT $1, unnest($2::int[])`,
        [itemResult.rows[0].id, item.personIndexes.map((i) => personIds[i])],
      );
    }
  }

  await client.query("COMMIT");
  console.log(`Seeded ${demos.length} fictional demo bills.`);
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Demo seed failed:", error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}