import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const COOKIE_NAME = "divideai_owner";
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
 */
export function ownerToken(req: Request, res: Response, next: NextFunction) {
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
