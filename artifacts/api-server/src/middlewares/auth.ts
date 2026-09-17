import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { and, eq, isNull, or, type SQL } from "drizzle-orm";
import { billsTable } from "@workspace/db";

/** Clerk user id, or null when the request is anonymous. */
export function getUserId(req: Request): string | null {
  const auth = getAuth(req);
  return (auth?.userId as string | undefined) ?? null;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ message: "Entre para acessar sua conta." });
    return;
  }
  req.userId = userId;
  next();
}

/**
 * Ownership scope for bills: signed-in users see their claimed bills plus the
 * still-unclaimed bills of the current anonymous session; anonymous sessions
 * see only unclaimed bills of their cookie.
 */
export function billOwnerWhere(req: Request): SQL {
  const userId = getUserId(req);
  const anonymous = and(
    eq(billsTable.ownerToken, req.ownerToken),
    isNull(billsTable.userId),
  )!;
  if (!userId) return anonymous;
  return or(eq(billsTable.userId, userId), anonymous)!;
}
