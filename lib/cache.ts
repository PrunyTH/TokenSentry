import { getString, setString } from "@/lib/storage";

export async function getCachedJson<T>(key: string): Promise<T | null> {
  const raw = await getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setCachedJson(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  await setString(key, JSON.stringify(value), ttlSeconds);
}
