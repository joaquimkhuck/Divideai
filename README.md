# Divide Aí

> Divida a conta do restaurante por consumo, a partir de uma foto.

Fluxo core: **foto da conta → IA extrai os itens → grupo atribui itens a pessoas → valor por pessoa → cobrança via Pix**.

## Índice

- [Sobre](#sobre)
- [Estrutura do monorepo](#estrutura-do-monorepo)
- [Como rodar](#como-rodar)
- [API](#api)
- [Motor de cálculo](#motor-de-cálculo)
- [Modelo de dados](#modelo-de-dados)
- [Design system e mockups](#design-system-e-mockups)
- [Documentação](#documentação)
- [Time](#time)

## Sobre

Divide Aí resolve um problema conhecido de qualquer grupo que come junto: a conta chega única e dividir por consumo exige somar itens à mão. O resultado usual é dividir por igual mesmo com consumos diferentes, ou uma pessoa pagar tudo e cobrar os outros depois; parte desse dinheiro não volta.

O app elimina a conta de cabeça: uma foto da conta vira uma lista de itens editável, cada pessoa marca o que consumiu (incluindo itens compartilhados) e o app fecha o valor exato de cada um, com taxa de serviço e couvert no cálculo.

### Princípios de produto

- **Nunca paywall no fluxo core**: foto, itens e atribuição são sempre grátis.
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
# API (porta 5000)
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
| `ANTHROPIC_API_KEY` | Chave da API Anthropic (leitura da foto da conta) | Sim |

## API

Endpoints definidos em `lib/api-spec/openapi.yaml`:

| Método/Rota | O que faz |
|---|---|
| `GET /healthz` | Health check |
| `POST /bills/analyze` | Recebe a foto da conta, extrai itens via Claude (valores em centavos, taxa de serviço, couvert, total detectado) |
| `POST /bills` · `GET /bills` | Cria e lista contas da sessão |
| `GET/PUT/DELETE /bills/{id}` | Lê, edita e apaga uma conta |
| `PATCH /bills/{id}/people/{personId}/paid` | Marca pessoa como paga |
| `GET /stats` | Estatísticas |

Toda conta pertence a um **owner token anônimo** (cookie httpOnly); leituras e escritas são escopadas a esse token. Se a imagem não for uma conta legível, a extração responde `{"error":"unreadable"}`.

Leitura da foto: SDK da Anthropic com prompt especializado em comandas brasileiras, respondendo JSON puro com valores monetários em centavos inteiros.

## Motor de cálculo

`artifacts/api-server/src/lib/split.ts`: aritmética 100% em **centavos inteiros**, nunca float.

- Item compartilhado por N pessoas: divisão inteira com sobra distribuída de forma determinística (partes diferem em no máximo 1 centavo).
- Taxa de serviço e couvert: rateio proporcional ao consumo de cada um, pelo método do maior resto (largest remainder).
- Invariante garantido: `soma(valores por pessoa) === itens + couvert + taxa de serviço`.

## Modelo de dados

Schema Drizzle em `lib/db/src/schema/`:

- `bills`: owner_token, restaurant_name, service_fee_percent, couvert_cents, total_cents
- `bill_items`: description, quantity, unit_price_cents
- `bill_people`: name, amount_cents, paid, paid_at
- `item_assignments`: item ↔ pessoa (N:N)

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
