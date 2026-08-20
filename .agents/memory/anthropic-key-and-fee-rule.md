---
name: Anthropic key & fee rule
description: Why bill analysis uses a user secret instead of Replit AI Integrations, and the service-fee rule that must stay mirrored.
---

- Bill analysis uses the user's own Anthropic key (secret `ANTHROPIC_API_KEY_DIVIDE_AI`), not Replit AI Integrations. **Why:** phone verification blocked enabling AI Integrations for this account.
- Fee rule: service fee = % of (items + couvert). **How to apply:** it is implemented in both the frontend draft store and the server split logic — change both in lockstep.
