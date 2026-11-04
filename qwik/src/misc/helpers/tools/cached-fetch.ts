type Entry<T> = { value: Promise<T>; expiresAt: number };

const store = new Map<string, Entry<unknown>>();

/**
 * Per-process in-memory cache for server-side loaders whose data is the same for
 * every visitor (layout loaders run on every SSR and every q-data.json prefetch).
 * Concurrent callers share one in-flight request. Results failing `isValid`
 * (e.g. ApiService's fallback value after a failed request) are not kept.
 */
export function cachedFetch<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
  isValid: (res: T) => boolean = Boolean,
): Promise<T> {
  const now = Date.now();
  const hit = store.get(key) as Entry<T> | undefined;
  if (hit && hit.expiresAt > now) return hit.value;

  const drop = () => {
    if (store.get(key) === entry) store.delete(key);
  };
  const value = load().then(
    (res) => {
      if (!isValid(res)) drop();
      return res;
    },
    (err) => {
      drop();
      throw err;
    },
  );
  const entry: Entry<T> = { value, expiresAt: now + ttlMs };
  store.set(key, entry);
  return value;
}
