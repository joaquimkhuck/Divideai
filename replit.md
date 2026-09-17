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

- DB schema: `lib/db/src/schema/` (bills.ts, accounts.ts) — dev changes go live via `pnpm --filter @workspace/db run push`
- API contracts: `lib/api-spec/openapi.yaml` → codegen to `@workspace/api-zod` + `@workspace/api-client-react`
- Auth: Replit-managed Clerk. Server: `artifacts/api-server/src/middlewares/auth.ts` (+ `clerkProxyMiddleware.ts`); web wiring in `artifacts/divide-ai/src/App.tsx`
- Account pages: `artifacts/divide-ai/src/pages/{entrar,creditos,perfil,auth}.tsx`

## Architecture decisions

- No login before the first split (PRD guardrail): anonymous sessions use the `divideai_owner` httpOnly cookie; the Entrar prompt only appears after a bill is closed.
- Bill ownership: `bills.user_id` (Clerk id) wins when set; otherwise scoped by owner cookie with `user_id IS NULL`. `POST /api/account/claim` migrates anonymous bills idempotently on sign-in.
- Credit model: signed-in accounts start with 3 free credits; each successful photo analysis spends 1 (402 when empty). Anonymous users keep the IP rate limit only. Credit purchases are not wired to payments yet (button shows "em breve").

## Product

- Core flow: photo → AI-read items → assignment → per-person value → Pix charge via WhatsApp → history
- Optional account (after first split): saves rolês across devices, Perfil (name/email, editable Pix key used in WhatsApp charges, stats, sign out, delete all data) and Créditos (real balance, packages listed)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
