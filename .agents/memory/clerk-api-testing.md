---
name: Testing Clerk-protected APIs from the shell
description: Signed-in routes can be exercised without a browser login
---

`clerkMiddleware`/`getAuth` accept `Authorization: Bearer <session JWT>` as well as cookies, and the Clerk Backend API (auth'd with `CLERK_SECRET_KEY`) can mint a session token for any user (create user → create session → create session token).

**Why:** browser sign-in can't be automated from the agent shell; this is the reliable way to validate auth-scoped routes end-to-end.

**How to apply:** mint a short-lived token, curl the API with it, and delete the test user afterwards to keep the dev user store clean.
