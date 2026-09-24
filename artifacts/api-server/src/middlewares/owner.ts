import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const COOKIE_NAME = "divideai_owner";
const HEADER_NAME = "x-owner-token";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
// UUID v4 format — reject anything a client might have tampered with.
const TOKEN_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

declare global {
  namespace Express {
    interface Request {
      ownerToken: string;
    }
  }
}

/**
 * Anonymous owner identity: issues an httpOnly cookie with a random UUID on
 * first use and exposes it as `req.ownerToken`. No login required — bills
 * are scoped to this token.
 *
 * Native clients (Capacitor, where `capacitor://localhost` can't hold a
 * cross-origin cookie) send the same UUID via the `X-Owner-Token` header
 * instead — they generate it once on-device and persist it themselves. The
 * header takes precedence and skips the cookie entirely; the cookie flow
 * below is untouched for the web.
 */
export function ownerToken(req: Request, res: Response, next: NextFunction) {
  const headerToken = req.header(HEADER_NAME);
  if (headerToken && TOKEN_RE.test(headerToken)) {
    req.ownerToken = headerToken;
    next();
    return;
  }

  let token: string | undefined = req.cookies?.[COOKIE_NAME];
  if (!token || !TOKEN_RE.test(token)) {
    token = randomUUID();
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR_MS,
      path: "/",
    });
  }
  req.ownerToken = token;
  next();
}
