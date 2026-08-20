# ItemCard (Cartão de item)
Source: DESIGN.md §7 L142, §4 L90–92, §3 L74–76.
Papel, raio 24. Linha única: descrição do item Regular 17 à esquerda, valor ExtraBold 20 à direita (Grafite, tabular-nums, sempre com centavos). Abaixo, chips das pessoas atribuídas. Item sem dono ganha etiqueta Âmbar "SEM DONO". Máx. dois tamanhos de texto por cartão. Sombra nível 1 (blur 8, 6%, y2).
Implementation: new `item-card.tsx` composing Card + PersonChip + StatusBadge.
