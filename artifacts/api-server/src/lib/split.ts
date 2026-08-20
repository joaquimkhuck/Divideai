/**
 * Cent-exact split logic. All amounts are integer cents.
 * Guarantees: sum of per-person amounts === items + couvert + service fee.
 */

export interface SplitItemInput {
  quantity: number;
  unitPriceCents: number;
  personIndexes: number[];
}

export interface SplitResult {
  perPersonCents: number[];
  itemsTotalCents: number;
  feeTotalCents: number;
  couvertCents: number;
  totalCents: number;
}

/** Split `total` cents into n parts differing by at most 1 cent. */
function splitEven(total: number, n: number): number[] {
  const base = Math.floor(total / n);
  const remainder = total - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}

/** Allocate `total` proportionally to weights, largest-remainder method. */
function allocateProportional(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return splitEven(total, weights.length);
  const raw = weights.map((w) => (total * w) / sum);
  const floors = raw.map(Math.floor);
  let left = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (const { i } of order) {
    if (left <= 0) break;
    floors[i] += 1;
    left -= 1;
  }
  return floors;
}

export function computeSplit(
  items: SplitItemInput[],
  peopleCount: number,
  serviceFeePercent: number,
  couvertCents: number,
): SplitResult {
  const consumption = new Array<number>(peopleCount).fill(0);
  let itemsTotalCents = 0;

  for (const item of items) {
    const itemTotal = item.quantity * item.unitPriceCents;
    itemsTotalCents += itemTotal;
    const sharers = [...new Set(item.personIndexes)].filter(
      (i) => i >= 0 && i < peopleCount,
    );
    if (sharers.length === 0) continue;
    const parts = splitEven(itemTotal, sharers.length);
    sharers.forEach((personIdx, k) => {
      consumption[personIdx] += parts[k];
    });
  }

  const couvertParts = splitEven(couvertCents, peopleCount);

  const feeTotalCents = Math.round(
    ((itemsTotalCents + couvertCents) * serviceFeePercent) / 100,
  );
  const feeParts = allocateProportional(
    feeTotalCents,
    consumption.map((c, i) => c + couvertParts[i]),
  );

  const perPersonCents = consumption.map(
    (c, i) => c + couvertParts[i] + feeParts[i],
  );
  const totalCents = itemsTotalCents + couvertCents + feeTotalCents;

  return { perPersonCents, itemsTotalCents, feeTotalCents, couvertCents, totalCents };
}
