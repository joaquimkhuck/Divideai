// Divide Aí — friendly pt-BR date formatting for rolês.

const time = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

const shortDate = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

/** "Hoje, 21h40" / "Ontem, 13h05" / "14 ago, 21h40". */
export function formatRoleDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  const hhmm = time.format(d).replace(":", "h");
  if (sameDay) return `Hoje, ${hhmm}`;
  if (isYesterday) return `Ontem, ${hhmm}`;
  return `${shortDate.format(d).replace(".", "")}, ${hhmm}`;
}

/** "14/08" — used as a title suffix. */
export function formatShortDay(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}
