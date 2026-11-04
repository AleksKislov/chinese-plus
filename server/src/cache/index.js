const { LRUCache } = require('lru-cache');

// Safety-net TTLs. Real invalidation happens via invalidateTag() when the
// underlying data changes (see callers of invalidateTag); these just bound
// how stale an entry can get if a code path forgets to invalidate.
const TTL = {
  SHORT: 2 * 60 * 1000, // 2 min - lists with fast-changing counters (likes/hits)
  MEDIUM: 10 * 60 * 1000, // 10 min - approved-content lists
  LONG: 60 * 60 * 1000, // 1 hour - admin-managed config
  DAY: 24 * 60 * 60 * 1000, // 1 day - effectively static dictionary data
};

const cache = new LRUCache({ max: 500, ttl: TTL.MEDIUM });

// tag -> Set of cache keys, so a single data-change event can drop every
// response derived from that data without knowing the exact URLs involved.
const tagIndex = new Map();

function buildKey(req) {
  return `${req.method}:${req.originalUrl}`;
}

function addToTag(tag, key) {
  if (!tagIndex.has(tag)) tagIndex.set(tag, new Set());
  tagIndex.get(tag).add(key);
}

/**
 * Express middleware that caches a GET route's JSON response.
 * @param {string|string[]} tags - tag(s) this response should be invalidated under
 * @param {{ttl?: number, shouldCache?: (req) => boolean}} [options]
 */
function cacheRoute(tags, options = {}) {
  const tagList = Array.isArray(tags) ? tags : [tags];
  const { ttl, shouldCache = () => true } = options;

  return function (req, res, next) {
    if (!shouldCache(req)) return next();

    const key = buildKey(req);
    const hit = cache.get(key);
    if (hit) {
      res.set('X-Cache', 'HIT');
      return res.status(hit.status).json(hit.body);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode < 400) {
        cache.set(key, { status: res.statusCode, body }, ttl ? { ttl } : undefined);
        tagList.forEach((tag) => addToTag(tag, key));
      }
      res.set('X-Cache', 'MISS');
      return originalJson(body);
    };
    next();
  };
}

function invalidateTag(tag) {
  const keys = tagIndex.get(tag);
  if (!keys) return 0;
  let removed = 0;
  keys.forEach((key) => {
    if (cache.delete(key)) removed++;
  });
  tagIndex.delete(tag);
  return removed;
}

function invalidateAll() {
  const removed = cache.size;
  cache.clear();
  tagIndex.clear();
  return removed;
}

module.exports = { cacheRoute, invalidateTag, invalidateAll, TTL };
