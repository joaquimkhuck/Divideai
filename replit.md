# Divide Aí

Mockups and design system for Divide Aí — an app for groups of friends to split a restaurant bill by what each person actually ate (photo → AI-read items → assignment → per-person value → Pix charge).

## Design & mockups

- Design system: `artifacts/divide-ai-ds` (`@workspace/divide-ai-ds`). Source of truth: `artifacts/divide-ai-ds/DESIGN.md` + `tokens.json`. Never hand-edit generated `src/index.css`/`src/generated/tokens.tsx`.
- Mockup screens (15 mobile 390×844 frames on the canvas): `artifacts/mockup-sandbox/src/ds/divide-ai-ds/mockups/` — Home, Pessoas, Leitura, RevisarItens, QuemComeu, Convidado, Resultado, Cobranca, Historico, Entrar, Creditos, Perfil, RoleDetalhe, ErroLeitura, EstadoVazio.
- PRD: `attached_assets/PRD-divide-ai-v1_1786969664710.md`.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
