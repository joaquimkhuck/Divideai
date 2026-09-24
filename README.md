# Divide Aí

> Divida a conta do restaurante por consumo, a partir de uma foto.

Fluxo core: **foto da conta → IA extrai os itens → grupo atribui itens a pessoas → valor por pessoa → cobrança via Pix**.

## Índice

- [Sobre](#sobre)
- [Estrutura do monorepo](#estrutura-do-monorepo)
- [Como rodar](#como-rodar)
- [Publicação](#publicação)
- [API](#api)
- [Motor de cálculo](#motor-de-cálculo)
- [Modelo de dados](#modelo-de-dados)
- [Custo da feature de IA](#custo-da-feature-de-ia)
- [Design system e mockups](#design-system-e-mockups)
- [Documentação](#documentação)
- [Time](#time)

## Sobre

Divide Aí resolve um problema conhecido de qualquer grupo que come junto: a conta chega única e dividir por consumo exige somar itens à mão. O resultado usual é dividir por igual mesmo com consumos diferentes, ou uma pessoa pagar tudo e cobrar os outros depois; parte desse dinheiro não volta.

O app elimina a conta de cabeça: uma foto da conta vira uma lista de itens editável, cada pessoa marca o que consumiu (incluindo itens compartilhados) e o app fecha o valor exato de cada um, com taxa de serviço e couvert no cálculo.

### Princípios de produto

- **Créditos transparentes**: o crédito é gasto ao confirmar a conta (fechar o rolê), não na leitura da foto — a leitura é livre para tentar, mas exige saldo positivo; revisão e divisão não consomem créditos à parte.
- **Sem cadastro antes do primeiro resultado**: sessão anônima via cookie; quem abre o app chega ao valor por pessoa sem login.
- **A soma sempre fecha**: os valores individuais batem com o total da conta, sem sobrar nem faltar centavo.

## Estrutura do monorepo

pnpm workspaces + Node.js 24 + TypeScript 5.9, hospedado no Replit.

```
Divideai/
├── artifacts/
│   ├── api-server/          # API Express 5 (extração por IA, CRUD de contas, split)
│   ├── divide-ai-ds/        # Design system (tokens, componentes, DESIGN.md)
│   └── mockup-sandbox/      # 15 telas mockup mobile (390×844)
├── lib/
│   ├── api-spec/            # OpenAPI (fonte da verdade do contrato) + config Orval
│   ├── api-client-react/    # Hooks React gerados a partir do OpenAPI
│   ├── api-zod/             # Schemas Zod gerados a partir do OpenAPI
│   └── db/                  # Schema Drizzle + config (PostgreSQL)
├── attached_assets/         # PRD v1
├── scripts/                 # Utilitários (hooks de merge etc.)
└── replit.md                # Guia operacional do workspace
```

Contrato de API é codegen-first: edite `lib/api-spec/openapi.yaml`, rode o codegen e nunca edite os arquivos gerados à mão.

## Como rodar

```bash
# API (usa a variável PORT)
pnpm --filter @workspace/api-server run dev

# Typecheck de todos os pacotes
pnpm run typecheck

# Typecheck + build
pnpm run build

# Regenerar hooks React e schemas Zod a partir do OpenAPI
pnpm --filter @workspace/api-spec run codegen

# Aplicar mudanças de schema no banco (só em dev)
pnpm --filter @workspace/db run push
```

### Variáveis de ambiente

| Variável | Descrição | Obrigatória |
|---|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL | Sim |
| `ANTHROPIC_API_KEY_2` | Chave da API Anthropic (leitura da foto da conta) | Sim |
| `CLERK_SECRET_KEY` | Chave privada do Clerk para login opcional | Não |
| `CLERK_PUBLISHABLE_KEY` | Chave pública do Clerk usada pela API | Não |
| `VITE_CLERK_PUBLISHABLE_KEY` | Chave pública do Clerk para o app web | Não |
| `SESSION_SECRET` | Segredo usado pelas sessões do servidor | Sim |
| `STRIPE_SECRET_KEY` | Chave de teste do Stripe para pagar a parte via Checkout | Não |
| `PUBLIC_APP_URL` | URL pública usada no retorno do Checkout | Não |

## Publicação

App publicado em **https://divideai.pangeia.cloud**, fora do editor do Replit.

- Hospedagem: container no Coolify (VPS), montado pelo `Dockerfile` da raiz: Caddy entrega o front e repassa `/api` para a API Express, com Postgres próprio. O deploy é disparado no Coolify a partir do `main`.
- HTTPS: certificado Let's Encrypt emitido e renovado automaticamente.
- Domínio: `pangeia.cloud`, registrado na Hostinger. Dono da conta: Estevão Antunes. **Vence em 23/01/2027.** O subdomínio `divideai` aponta por registro A para o servidor.
- Chaves (`STRIPE_SECRET_KEY`, `CLERK_SECRET_KEY`, `ANTHROPIC_API_KEY_2`) ficam só nas variáveis de ambiente do servidor; nenhuma vai para o navegador nem para o repositório.

## API

Endpoints definidos em `lib/api-spec/openapi.yaml`:

| Método/Rota | O que faz |
|---|---|
| `GET /healthz` | Health check |
| `POST /bills/analyze` | Recebe a foto da conta, extrai itens via Claude (valores em centavos, taxa de serviço, couvert, total detectado) |
| `POST /bills` · `GET /bills` | Cria e lista contas da sessão |
| `GET/PATCH /account` | Consulta saldo e atualiza a chave Pix da conta autenticada |
| `POST /account/claim` | Vincula rolês anônimos à conta autenticada |
| `DELETE /account/data` | Apaga os dados da conta autenticada |
| `GET/DELETE /bills/{id}` | Lê ou apaga uma conta |
| `PATCH /bills/{id}/people/{personId}/paid` | Marca pessoa como paga (toggle manual) |
| `POST /bills/{id}/people/{personId}/checkout` | Abre um Checkout Stripe (teste) para a parte da pessoa; 503 se `STRIPE_SECRET_KEY` não estiver configurado |
| `GET /payments/checkout-session/{sessionId}` | Consulta o status do Checkout após o retorno e marca a pessoa como paga quando `paid` |
| `GET /payments/config` | Informa se o pagamento via Stripe está disponível (usado para mostrar/esconder o botão) |
| `GET /credits/packages` | Lista os pacotes de créditos (preço definido no servidor) |
| `POST /credits/checkout` | Abre um Checkout Stripe (teste) para comprar um pacote de créditos; 503 se `STRIPE_SECRET_KEY` não estiver configurado |
| `GET /credits/checkout-session/{sessionId}` | Consulta o status do Checkout de créditos e credita a conta uma única vez quando `paid` (idempotente via `credit_purchases`) |
| `GET /stats` | Estatísticas |

Toda conta pertence a um **owner token anônimo** (cookie httpOnly) ou a um usuário autenticado pelo Clerk. Leituras e escritas são filtradas pelo proprietário. Se a imagem não for uma conta legível, a extração responde `{"error":"unreadable"}`.

Leitura da foto: SDK da Anthropic com prompt especializado em comandas brasileiras, respondendo JSON puro com valores monetários em centavos inteiros.

## Motor de cálculo

`artifacts/api-server/src/lib/split.ts`: aritmética 100% em **centavos inteiros**, nunca float.

- Item compartilhado por N pessoas: divisão inteira com sobra distribuída de forma determinística (partes diferem em no máximo 1 centavo).
- Taxa de serviço e couvert: rateio proporcional ao consumo de cada um, pelo método do maior resto (largest remainder).
- Invariante garantido: `soma(valores por pessoa) === itens + couvert + taxa de serviço`.

## Modelo de dados

Schema Drizzle em `lib/db/src/schema/`:

- `accounts`: perfil Clerk, chave Pix e saldo de créditos
- `bills`: owner_token, user_id, restaurant_name, service_fee_percent, couvert_cents, total_cents
- `bill_items`: description, quantity, unit_price_cents
- `bill_people`: name, amount_cents, paid, paid_at
- `item_assignments`: item ↔ pessoa (N:N)

## Custo da feature de IA

A leitura da foto é a única chamada paga do produto, em `POST /bills/analyze`. A imagem domina a
conta: das ~2.800 tokens de entrada de uma análise, cerca de 2.500 são a foto já reduzida a 1600px
pelo cliente e redimensionada pela API. A saída é o JSON dos itens, ~400 tokens.

| | 1 chamada | mil chamadas |
|---|---|---|
| Claude Sonnet 4.5, o modelo em uso (US$ 3,00/1M entrada e US$ 15,00/1M saída) | US$ 0,014 | US$ 14,37 |
| gpt-5.6-luna, modelo de referência (US$ 0,20/1M entrada e US$ 1,20/1M saída) | US$ 0,001 | US$ 1,04 |

Escolhemos um modelo de visão forte e não o mais barato porque a tarefa não é classificar texto
limpo: é ler comanda de restaurante brasileiro fotografada torta, com papel amassado, térmico
apagado e abreviação de garçom. Erro de centavo aqui quebra o invariante do motor de cálculo e
o usuário perde a confiança na conta inteira. O custo por chamada continua abaixo de dois centavos
de dólar, e a alavanca que importa nesta fase não é o preço do modelo, é o número de chamadas.

Preços conferidos na tabela oficial da Anthropic em 10/09/2026.

## Design system e mockups

- **Fonte da verdade visual**: [`artifacts/divide-ai-ds/DESIGN.md`](artifacts/divide-ai-ds/DESIGN.md) + `tokens.json`. Atitude Shazam (imediato, redondo, calmo), paleta Névoa/Azul-profundo, Nunito em 3 pesos, grade de 8 pt. Nunca edite à mão os arquivos gerados (`src/index.css`, `src/generated/tokens.tsx`).
- **Componentes**: button, card, avatar, person-chip, item-card, charge-sheet, settlement-row, status-badge, review-field, scan-progress, empty-state. Referências em `artifacts/divide-ai-ds/docs/references/components/`.
- **Mockups**: 15 telas mobile em `artifacts/mockup-sandbox/src/ds/divide-ai-ds/mockups/` (Home, Leitura, RevisarItens, QuemComeu, Resultado, Cobranca, Historico, Creditos, Convidado, Entrar, Perfil, RoleDetalhe, ErroLeitura, EstadoVazio, Pessoas).

## Documentação

- [PRD v1](attached_assets/PRD-divide-ai-v1_1786969664710.md): problema, metas, guardrails, user stories por milestone
- [DESIGN.md](artifacts/divide-ai-ds/DESIGN.md): linguagem visual completa
- [replit.md](replit.md): guia operacional do workspace (comandos, gotchas, decisões)

## Time

Joaquim Huck · Estevão Antunes · Artur Bresser
