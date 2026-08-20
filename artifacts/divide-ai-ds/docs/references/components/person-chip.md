# PersonChip (Chip de pessoa)
Source: DESIGN.md §7 L144, §6 L127–128.
Cápsula de 36pt de altura: avatar circular com a inicial do nome + primeiro nome em Bold 14.
- Selecionado: fundo Azul-profundo, texto branco.
- Não selecionado: fundo Papel (`card`), borda Linha-clara.
- Componente central da tela "quem comeu o quê"; usado para qualquer atribuição.
Implementation: new `person-chip.tsx` (button element, aria-pressed), composes ui/avatar.
