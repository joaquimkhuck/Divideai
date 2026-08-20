# ReviewField (Campo de revisão — Input)
Source: DESIGN.md §7 L150, §6 L121.
Campo raio 16, fundo Papel, borda Linha-clara; em foco, borda Azul-profundo 2pt. Erro de leitura: borda Telha (`destructive`) + legenda explicando o que conferir (nunca usado para "dívida"). Implementation: restyled scaffold `input.tsx` (aria-invalid → borda Telha).
