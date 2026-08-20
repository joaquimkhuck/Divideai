# Divide Aí — component inventory

Source: `DESIGN.md` (package root; copy of the user's DESIGN-divide-ai-v1, seção 7 "Components", com apoio das seções 2–6 e 8). Spec-seeded (DESIGN.md components section) — the scaffold shadcn library is the implementation source; each family is restyled to the reference with token CSS vars. Read the family's reference file under `docs/references/components/` before modifying it.

Normalization: DESIGN.md describes styles per role ("Botão-herói", "Botão primário", "Botão secundário" → one `Button` family with variants; "Etiquetas de status" → `StatusBadge`; etc.).

| Family | Reference | Depends on | Evidence (DESIGN.md) | Chunk | Status |
|---|---|---|---|---|---|
| button | components/button.md | — | §7 Botão-herói / primário / secundário (L136–140) | 1 (pilot) | implemented |
| person-chip | components/person-chip.md | avatar | §7 Chip de pessoa (L144); §6 chips (L128) | 1 (pilot) | implemented |
| item-card | components/item-card.md | card, person-chip, status-badge | §7 Cartão de item (L142) | 1 (pilot) | implemented |
| review-field | components/review-field.md | — | §7 Campo de revisão (L150); §6 campos raio 16 (L121) | 1 (pilot) | implemented |
| status-badge | components/status-badge.md | — | §6 etiquetas cápsula (L123); §2 Verde-salva/Âmbar (L35–36) | 1 (pilot) | implemented |
| avatar | components/avatar.md | — | §6 avatares circulares com inicial (L122, L127) | 2 | implemented |
| card | components/card.md | — | §6 cartões raio 24 (L119); §5 nível 1 (L103) | 2 | implemented |
| settlement-row | components/settlement-row.md | avatar | §7 Linha de fechamento (L146) | 2 | implemented |
| charge-sheet | components/charge-sheet.md | button, review-field | §7 Folha de cobrança (L148); §5 nível 2 (L104) | 2 | implemented |
| scan-progress | components/scan-progress.md | — | §7 Barra de progresso da leitura (L152) | 3 | implemented |
| empty-state | components/empty-state.md | button | §7 Estado vazio (L154) | 3 | implemented |

Dependency primitives kept from the scaffold for chunk 1: `card.tsx` (item-card surface) and `avatar.tsx` (person-chip initial avatar) — promoted to full families with stories in chunk 2. All other scaffold stock components/demos were removed (not in the source's component set).
