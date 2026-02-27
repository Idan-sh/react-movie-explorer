/**
 * Rate Limiter Utility
 *
 * Sliding-window rate limiter.
 * Tracks recent request timestamps and rejects requests
 * that would exceed `maxRequests` within the last `windowMs`.
 */

export interface RateLimiter {
  canRequest(): boolean;
  record(): void;
}

export function createRateLimiter(maxRequests: number, windowMs: number): RateLimiter {
  const timestamps: number[] = [];

  return {
    canRequest(): boolean {
      const now = Date.now();
      while (timestamps.length > 0 && now - timestamps[0] > windowMs) {
        timestamps.shift();
      }
      return timestamps.length < maxRequests;
    },

    record(): void {
      timestamps.push(Date.now());
    },
  };
}
