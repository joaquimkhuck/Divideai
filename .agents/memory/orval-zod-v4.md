---
name: Orval emits zod v4 API
description: Codegen fails with "Property 'int' does not exist" when the api-zod package resolves zod v3
---
Orval (v8.23+) generates `zod.int()` — zod v4 API. The workspace catalog pins zod v3.25, so `lib/api-zod` must depend on `"zod": "^4"` directly (already done).

**Why:** codegen typecheck fails with TS2339 `Property 'int' does not exist` if zod resolves to v3.
**How to apply:** if codegen breaks after dependency reshuffles, check `lib/api-zod/package.json` still pins zod ^4.
