# Button (Botão-herói / primário / secundário)
Source: DESIGN.md §7 L136–140, §6 L117–118, §8.
- **hero**: círculo perfeito 96pt, fundo Azul-profundo (`primary`), ícone de câmera branco, sombra generosa (blur 32, 18%), anel pulsante Azul-profundo quando ocioso (único elemento que pode pulsar). Pressionado: afunda 2pt e escurece p/ Azul-noite (`accentForeground` L / hover darker). Só existe na tela inicial.
- **default (primário)**: cápsula 56pt de altura, largura total menos margens, fundo Azul-profundo, rótulo Bold 17 branco. Um por tela, no rodapé/terço inferior. Desabilitado: fundo Linha-clara (`border`), texto Cinza-pedra (`mutedForeground`) — não opacity.
- **secondary (secundário)**: mesma cápsula, fundo transparente, borda 1,5pt Grafite, rótulo Grafite. Para "voltar", "editar", "agora não".
- Também expostos: ghost e link (apoio; link em Azul-profundo).
- Cantos: cápsula (rounded-full). Nunca canto reto.
