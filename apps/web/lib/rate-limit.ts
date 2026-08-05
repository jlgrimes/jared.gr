import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * The site's endpoints spend real money on every call and sit on the public internet, so
 * both of them go through here.
 *
 * Upstash is used when it's configured. Without it we fall back to an in-process counter,
 * which is genuinely weak on serverless — each instance keeps its own tally, so the true
 * ceiling is roughly (limit x instances) — but it still stops a single tab hammering the
 * endpoint, and it means the site runs with no extra service wired up.
 */
const hasUpstash =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

const upstash = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(12, '10 m'),
      prefix: 'jared.gr:flow',
      analytics: false,
    })
  : null;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_IN_WINDOW = 12;
const memory = new Map<string, { count: number; resetAt: number }>();

const checkInMemory = (key: string) => {
  const now = Date.now();
  const entry = memory.get(key);

  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic sweep — this map lives as long as the instance does.
    if (memory.size > 5000) {
      for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
    }
    return { success: true };
  }

  entry.count += 1;
  return { success: entry.count <= MAX_IN_WINDOW };
};

/** Best-effort client identity. Spoofable, but it's a speed bump, not an auth boundary. */
export const clientKey = (req: Request) => {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip =
    forwarded?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  return ip;
};

export const rateLimit = async (req: Request) => {
  const key = clientKey(req);
  if (upstash) {
    const { success } = await upstash.limit(key);
    return success;
  }
  return checkInMemory(key).success;
};

export const rateLimited = () =>
  new Response(
    JSON.stringify({
      error:
        "Flow is resting — that's a lot of questions in a short window. Try again in a few minutes, or email hi@jared.gr.",
    }),
    { status: 429, headers: { 'content-type': 'application/json' } }
  );
