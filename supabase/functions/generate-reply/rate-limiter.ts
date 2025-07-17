// Simple in-memory rate limiter for edge functions
interface RateLimitEntry {
  count: number;
  lastRequest: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function isRateLimited(
  identifier: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance to cleanup
    for (const [key, value] of rateLimitStore.entries()) {
      if (now - value.lastRequest > windowMs * 2) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!entry) {
    rateLimitStore.set(identifier, { count: 1, lastRequest: now });
    return false;
  }

  // Reset count if window has expired
  if (now - entry.lastRequest > windowMs) {
    entry.count = 1;
    entry.lastRequest = now;
    return false;
  }

  // Increment count and check limit
  entry.count++;
  entry.lastRequest = now;

  return entry.count > maxRequests;
}

export function getRemainingRequests(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): number {
  const entry = rateLimitStore.get(identifier);
  if (!entry) return maxRequests;

  const now = Date.now();
  if (now - entry.lastRequest > windowMs) {
    return maxRequests;
  }

  return Math.max(0, maxRequests - entry.count);
}