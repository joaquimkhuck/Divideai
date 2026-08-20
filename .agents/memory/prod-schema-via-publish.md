---
name: Prod schema via Publish
description: How schema changes reach production on this Replit project — and what never to do.
---

- Rule: never add migration scripts, deploy-build db pushes, or startup-time DDL for production.
- **Why:** Replit's managed Postgres applies schema in exactly two places — post-merge push to the dev DB, and the Publish flow's automatic dev→prod diff. Anything else is unsupported (see `.local/skills/database/references/database-migrations-on-publish.md`).
- **How to apply:** for new columns/tables, update the Drizzle schema and push to dev; production picks it up when the user Publishes. Code reviewers asking for "production-safe migrations" should be answered with this platform policy.
