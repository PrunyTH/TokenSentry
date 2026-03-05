import { incrementWithTtl } from "@/lib/storage";

const WINDOW_SECONDS = 10 * 60;
const MAX_REQUESTS = 30;

export type RateLimitResult = {
  allowed: boolean;
  retryAfter: number;
};

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const key = `rl:${ip}`;
  const count = await incrementWithTtl(key, WINDOW_SECONDS);
  if (count > MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: WINDOW_SECONDS,
    };
  }
  return {
    allowed: true,
    retryAfter: 0,
  };
}
