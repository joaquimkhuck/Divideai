# StatusBadge (Etiquetas de status)
Source: DESIGN.md §6 L123, §2 L35–37, §3 L71.
Cápsula; rótulo mínimo 12 Regular, caixa alta, espaçamento +6% ("PAGO", "PENDENTE", "SEM DONO").
- paid/PAGO: Verde-salva — só no ato de confirmar, nunca no valor.
- pending/PENDENTE, SEM DONO: Âmbar-fosco — o que ainda precisa de decisão.
- error: Telha — falha de sistema apenas.
Implementation: restyled scaffold `badge.tsx` with variants default/paid/pending/error/outline.
