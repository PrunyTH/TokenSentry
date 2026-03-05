type MemoryEntry = {
  value: string;
  expiresAt: number;
};

const memory = new Map<string, MemoryEntry>();

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

function isUpstashReady() {
  return Boolean(upstashUrl && upstashToken);
}

async function upstashRequest(path: string, init?: RequestInit) {
  const res = await fetch(`${upstashUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${upstashToken}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Upstash error ${res.status}`);
  }
  return res.json();
}

function memoryGetRaw(key: string): string | null {
  const now = Date.now();
  const hit = memory.get(key);
  if (!hit) return null;
  if (hit.expiresAt < now) {
    memory.delete(key);
    return null;
  }
  return hit.value;
}

export async function getString(key: string): Promise<string | null> {
  if (isUpstashReady()) {
    try {
      const data = await upstashRequest(`/get/${encodeURIComponent(key)}`);
      return (data?.result as string | null) ?? null;
    } catch {
      return memoryGetRaw(key);
    }
  }
  return memoryGetRaw(key);
}

export async function setString(
  key: string,
  value: string,
  ttlSeconds: number
): Promise<void> {
  if (isUpstashReady()) {
    try {
      await upstashRequest(
        `/set/${encodeURIComponent(key)}/${encodeURIComponent(
          value
        )}?EX=${ttlSeconds}`,
        { method: "POST" }
      );
      return;
    } catch {
      // fallback to memory below
    }
  }
  memory.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export async function incrementWithTtl(
  key: string,
  ttlSeconds: number
): Promise<number> {
  if (isUpstashReady()) {
    try {
      const inc = await upstashRequest(`/incr/${encodeURIComponent(key)}`, {
        method: "POST",
      });
      const value = Number(inc?.result ?? 0);
      if (value === 1) {
        await upstashRequest(
          `/expire/${encodeURIComponent(key)}/${ttlSeconds}`,
          { method: "POST" }
        );
      }
      return value;
    } catch {
      // fallback to memory below
    }
  }

  const raw = memoryGetRaw(key);
  const curr = raw ? Number(raw) : 0;
  const next = curr + 1;
  memory.set(key, {
    value: String(next),
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
  return next;
}
