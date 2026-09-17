export interface CreditPackage {
  id: string;
  credits: number;
  amountCents: number;
}

/** Source of truth for prices — the client reads these via GET /credits/packages. */
export const CREDIT_PACKAGES: CreditPackage[] = [
  { id: "p5", credits: 5, amountCents: 500 },
  { id: "p15", credits: 15, amountCents: 1350 },
  { id: "p40", credits: 40, amountCents: 3200 },
];

export function getCreditPackage(id: string): CreditPackage | undefined {
  return CREDIT_PACKAGES.find((p) => p.id === id);
}
