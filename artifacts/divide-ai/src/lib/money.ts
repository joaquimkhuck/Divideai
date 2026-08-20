// Divide Aí — money helpers. All API values are integer cents.
// DESIGN.md §3: money always with cents, tabular-nums, formatted pt-BR BRL.

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format integer cents as "R$ 89,90". */
export function formatCents(cents: number): string {
  return brl.format((cents ?? 0) / 100);
}

/** Format a decimal reais value (e.g. 89.9) as "89,90" for masked inputs. */
export function centsToInput(cents: number): string {
  return ((cents ?? 0) / 100).toFixed(2).replace(".", ",");
}

/** Parse a masked BRL input like "89,90" or "1.089,90" into integer cents. */
export function inputToCents(value: string): number {
  if (!value) return 0;
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10);
}

/** Format a raw digit string into a live BRL mask "1.089,90". */
export function maskBRL(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const cents = parseInt(digits, 10);
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
