import type { Request, Response, NextFunction } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Minimal in-memory fixed-window rate limiter for expensive endpoints.
 * Keys on client IP (cannot be reset by minting a new owner cookie).
 * Task 4 will layer proper per-user credit accounting on top of this.
 */
export function rateLimit(opts: { max: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    // Occasional cleanup so the map cannot grow unbounded.
    if (buckets.size > 10_000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    const key = req.ip ?? "unknown";
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
      next();
      return;
    }
    bucket.count += 1;
    if (bucket.count > opts.max) {
      res
        .status(429)
        .json({ message: "Muitas leituras de foto. Tente de novo em breve." });
      return;
    }
    next();
  };
}
