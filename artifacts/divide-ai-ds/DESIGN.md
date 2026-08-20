# DESIGN.md — Divide Aí · v1

Equipe: Joaquim Huck, Estevão Antunes, Artur Bresser · Última atualização: 13/08/2026

Este documento define a linguagem visual do Divide Aí. Ele existe para que qualquer tela nova — feita por pessoa ou por IA — pareça ter saído do mesmo aplicativo. Quando houver dúvida, a resposta está aqui; quando não estiver, a regra é escolher a opção mais simples e registrar a decisão neste arquivo.

---

## 1. Overview (Brand & Style)

**Referência concreta: o aplicativo Shazam.** Não a cor do Shazam — a atitude dele. Uma tela quase vazia, um único gesto central que resolve tudo, resultado em segundos, zero sensação de formulário. O Divide Aí transporta essa atitude para a mesa do restaurante: a pessoa abre o app, toca no botão gigante de fotografar a conta, e o resto acontece em volta desse gesto.

**Personalidade em três palavras:** imediato, redondo, calmo.

- **Imediato** porque o app é usado com o garçom parado ao lado da mesa e todo mundo querendo ir embora. Cada tela tem uma ação principal óbvia; nada exige leitura de instruções.
- **Redondo** porque tudo no app tem canto generosamente arredondado — botões, cartões, fotos, campos. A forma circular do botão central é a assinatura visual, como o disco do Shazam.
- **Calmo** porque o assunto é dinheiro entre amigos, um tema que já nasce tenso. A paleta é neutra e sóbria, sem vermelhos alarmantes espalhados, sem confete, sem gamificação. O app é o adulto na mesa.

**O que o Divide Aí não é:** não é um app de banco (nada de telas cinza-corporativo com dezenas de números), não é um app de festa (nada de gradientes neon), e não é uma planilha (números aparecem grandes e um de cada vez, não em tabelas densas).

---

## 2. Colors

Paleta neutra com um único acento. A regra geral: **superfícies neutras, ação em acento, dinheiro em tinta escura.** A cor de acento aparece uma vez por tela, na ação principal — nunca em dois elementos competindo.

| Papel | Nome | HEX | Onde é usada |
|---|---|---|---|
| Fundo principal | Névoa | `#F6F5F2` | Fundo de todas as telas. Um off-white quente, nunca branco puro |
| Superfície | Papel | `#FFFFFF` | Cartões, folhas modais, campos — tudo que "flutua" sobre a Névoa |
| Tinta primária | Grafite | `#1F2328` | Todo texto principal e todos os valores em dinheiro |
| Tinta secundária | Cinza-pedra | `#6E7378` | Legendas, rótulos, datas, texto de apoio |
| Acento | Azul-profundo | `#2A5CFF` | Botão principal de cada tela, o anel do botão de fotografar, links, seleção ativa |
| Acento pressionado | Azul-noite | `#1E44C4` | Estado pressionado do acento |
| Positivo | Verde-salva | `#2E9E6B` | Confirmação de pagamento, item "quitado", soma fechada |
| Atenção | Âmbar-fosco | `#C98A2D` | Pendência, item ainda sem dono, aviso suave |
| Erro | Telha | `#C4472F` | Falha de leitura da foto, campo inválido. Nunca usado para "dívida" |
| Divisor | Linha-clara | `#E7E5E0` | Bordas de 1 pt e separadores |

**Papéis por situação, não por estética:**

- Dinheiro é sempre Grafite, em qualquer contexto. Dívida não é vermelha e crédito não é verde — cor em valores transformaria a tela de fechamento num semáforo de constrangimento. O verde aparece apenas no *ato* de confirmar ("Fulano pagou ✓"), nunca no valor em si.
- O Âmbar marca o que ainda precisa de decisão (item sem dono, pessoa sem cobrança enviada). Ele guia o olho para o que falta, sem gritar.
- Modo escuro fica explicitamente fora da v1 e está registrado como non-goal de design.

---

## 3. Typography

**Família única: Nunito.** Uma sans-serif de terminais arredondados — as letras têm a mesma personalidade dos cantos do app. É aberta, legível em tela pequena, gratuita (Google Fonts) e existe em pesos suficientes. Nada de segunda família: hierarquia se faz com peso e tamanho, não com fonte nova.

**Pesos permitidos: três, e nenhum abaixo de Regular.**

| Peso | Uso |
|---|---|
| **ExtraBold (800)** | Valores em dinheiro e o número-herói de cada tela |
| **Bold (700)** | Títulos de tela, nomes de pessoas, botões |
| **Regular (400)** | Corpo, descrições de itens, legendas |

Light e Thin são proibidos — o app é usado em restaurante, meia-luz, telefone com brilho baixo e um pouco de pressa. Traço fino morre nesse ambiente.

**Escala (tamanhos em pontos):**

| Papel | Tamanho / Peso | Exemplo |
|---|---|---|
| Número-herói | 44 / ExtraBold | O "R$ 87,50" da tela de resultado |
| Título de tela | 26 / Bold | "Quem comeu o quê?" |
| Valor em lista | 20 / ExtraBold | Preço ao lado de cada pessoa |
| Corpo | 17 / Regular | Nome dos itens da conta |
| Legenda | 14 / Regular | "Taxa de serviço incluída" |
| Rótulo mínimo | 12 / Regular, caixa alta, espaçamento +6% | "PENDENTE" |

**Regras fixas:**
- Valores em dinheiro sempre em ExtraBold, sempre com centavos ("R$ 30,00", nunca "R$ 30"). Precisão visual comunica que a conta fecha no centavo — é o guardrail nº 1 do PRD virando tipografia.
- Números tabulares (algarismos de largura igual) em qualquer coluna de valores, para os centavos alinharem.
- Máximo de dois tamanhos de texto por cartão. Se precisar de um terceiro, o cartão está fazendo coisa demais.

---

## 4. Layout & Spacing

**Grade de 8.** Todo espaçamento é múltiplo de 8 pt: 8, 16, 24, 32, 48. O 4 pt existe só para ajuste fino interno (entre ícone e rótulo). Valor fora da escala é bug de design.

- **Margem lateral de tela:** 24 pt, sempre.
- **Entre cartões:** 16 pt.
- **Respiro interno de cartão:** 16 pt em todos os lados.
- **Zona do polegar:** a ação principal de cada tela mora no terço inferior, alcançável com uma mão — o app é usado de pé, segurando o telefone sobre a mesa.

**O que encosta em quê:**
- Nome da pessoa e seu valor formam um par inseparável: mesma linha, nome à esquerda, valor à direita, unidos por alinhamento — nunca separados por linha pontilhada.
- Foto do item lido e texto extraído ficam no mesmo cartão durante a revisão, para o usuário conferir sem alternar telas.
- Nada de elemento solto: todo conteúdo vive dentro de um cartão ou de uma lista. O fundo Névoa nunca recebe texto diretamente, exceto o título da tela.

**Uma coluna, sempre.** Nenhuma tela da v1 tem layout em duas colunas. Listas são empilhadas, cheias na largura, roláveis. A densidade vem do bom uso da linha (nome + valor), não de grade.

---

## 5. Elevation & Depth

O app é **quase plano, com uma exceção teatral.**

- **Nível 0 — Fundo:** a Névoa. Sem sombra, sem textura.
- **Nível 1 — Cartões:** flutuam 1 pt acima do fundo com sombra mínima (desfoque 8, opacidade 6%, deslocamento vertical 2). O efeito é de papel sobre mesa, não de janela sobre janela.
- **Nível 2 — Folha modal:** telas de confirmação e o fluxo de cobrança sobem como folha ancorada na base (bottom sheet), com sombra mais presente (desfoque 24, opacidade 12%) e o fundo escurecido a 40%. É o único momento de profundidade real.
- **Nível 3 — O botão de fotografar:** a exceção teatral. O botão circular central da tela inicial tem a sombra mais generosa do app (desfoque 32, opacidade 18%) e um leve anel pulsante em Azul-profundo quando a tela está ociosa — o convite ao gesto, herdado diretamente do disco do Shazam. Nenhum outro elemento pode pulsar.

Proibido: sombras coloridas, brilhos, vidro fosco, paralaxe. A profundidade serve à hierarquia, não à decoração.

---

## 6. Shapes

A forma é a assinatura da marca. **Tudo é redondo, e o quanto é redondo está tabelado:**

| Elemento | Raio de canto |
|---|---|
| Botão de fotografar (herói) | Círculo perfeito, 96 pt de diâmetro |
| Botões comuns | Cápsula (raio = metade da altura) |
| Cartões | 24 pt |
| Folha modal | 28 pt nos cantos superiores |
| Campos de entrada | 16 pt |
| Fotos e avatares | Avatares circulares; foto da conta com 16 pt |
| Etiquetas de status ("PAGO", "PENDENTE") | Cápsula |

**Regras:**
- Nenhum canto reto visível em elemento interativo. O raio mínimo do app é 16 pt.
- Avatares de pessoas são sempre círculos com a inicial do nome sobre fundo neutro — sem foto de perfil na v1, o cadastro precisa ser instantâneo.
- Os "chips" de pessoa (usados para atribuir itens) são cápsulas com avatar à esquerda: o elemento mais repetido do app, e o mais reconhecivelmente redondo.

---

## 7. Components

As peças que se repetem, descritas em texto. Cada uma tem um dono visual claro.

**Botão-herói (fotografar conta).** Círculo de 96 pt, fundo Azul-profundo, ícone de câmera branco ao centro, anel pulsante quando ocioso. Existe apenas na tela inicial. Pressionado, afunda 2 pt e escurece para Azul-noite.

**Botão primário.** Cápsula de 56 pt de altura, largura total menos as margens, fundo Azul-profundo, rótulo Bold 17 branco. Um por tela, sempre no rodapé. Desabilitado: fundo Linha-clara, texto Cinza-pedra.

**Botão secundário.** Mesma cápsula, fundo transparente, borda 1,5 pt em Grafite, rótulo Grafite. Para "voltar", "editar", "agora não".

**Cartão de item.** Papel, raio 24. Linha única: descrição do item em Regular 17 à esquerda, valor em ExtraBold 20 à direita. Abaixo, os chips das pessoas atribuídas. Item sem dono ganha etiqueta Âmbar "SEM DONO".

**Chip de pessoa.** Cápsula de 36 pt de altura: avatar circular com inicial + primeiro nome em Bold 14. Selecionado: fundo Azul-profundo, texto branco. Não selecionado: fundo Papel, borda Linha-clara. É o componente central da tela "quem comeu o quê".

**Linha de fechamento.** Nome da pessoa (Bold 17) à esquerda, valor (ExtraBold 20, Grafite) à direita. Ao confirmar pagamento, um selo circular Verde-salva com ✓ surge à direita do valor e a linha inteira reduz a opacidade para 60%.

**Folha de cobrança.** Bottom sheet com raio 28 no topo. Contém: valor-herói da pessoa cobrada (44 ExtraBold), chave Pix em campo copiável, botão primário "Cobrar no WhatsApp".

**Campo de revisão.** Campo raio 16, fundo Papel, borda Linha-clara; em foco, borda Azul-profundo 2 pt. Usado para corrigir item lido errado. Erro de leitura marca a borda em Telha com legenda explicando o que conferir.

**Barra de progresso da leitura.** Enquanto a IA lê a foto: anel circular em Azul-profundo girando sobre a miniatura da foto — nunca barra horizontal, nunca esqueleto cinza. O círculo é a marca até no carregamento.

**Estado vazio.** Ilustração nenhuma na v1: título Bold 26 + uma frase Regular 17 + botão primário. Ex.: "Nenhum rolê ainda" / "Fotografe a primeira conta para começar."

---

## 8. Do's and Don'ts

**Faça**

- Uma ação principal por tela, em Azul-profundo, no terço inferior.
- Todo valor em dinheiro em ExtraBold, com centavos, em Grafite.
- Todo canto com raio 16 ou mais; em dúvida, arredonde mais.
- Some os valores individuais em toda tela de fechamento e mostre "✓ fecha com o total" em Verde-salva — o guardrail do centavo é visível, não só interno.
- Use os chips de pessoa para qualquer atribuição; é o gesto que o usuário aprende uma vez e repete sempre.
- Escreva rótulos como gente: "Quem comeu isto?", não "Selecionar participantes".

**Não faça**

- Não use vermelho para valores devidos — Telha é só para erro de sistema.
- Não use fonte fina, condensada ou uma segunda família tipográfica.
- Não coloque duas ações em acento na mesma tela, nem acento em elemento decorativo.
- Não crie tabela densa de números; a unidade é a linha nome + valor.
- Não use confete, emoji em excesso ou animação de comemoração ao fechar a conta — pagar não é prêmio.
- Não desenhe telas para o garçom ou modo maquininha: essa interface não existe no produto.
- Não exija cadastro visualmente antes do primeiro resultado: nenhuma tela de login pode aparecer antes da primeira conta dividida (guardrail do PRD).
- Não introduza cor, raio ou espaçamento fora das tabelas deste documento sem registrar a mudança aqui primeiro.
