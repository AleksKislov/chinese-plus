const { LRUCache } = require('lru-cache');

// Standard analytics "session" length (same window Google Analytics uses by
// default): repeat requests for the same item from the same visitor within
// this window don't count as a new hit.
const SESSION_WINDOW = 30 * 60 * 1000;

// Entries are tiny (a short string key), so a generous cap here is cheap
// insurance against a busy 30-min window - eviction below this only causes
// an occasional extra hit count, never a crash, so erring high is free.
const seen = new LRUCache({ max: 50_000, ttl: SESSION_WINDOW });

/**
 * True the first time a given visitor requests a given content item within
 * the session window, false on refreshes within that window. Always true
 * (i.e. always count the hit) when no visitorId is supplied, e.g. calls made
 * directly against the API rather than through the qwik frontend.
 */
function shouldCountHit(type, id, visitorId) {
  if (!visitorId) return true;

  const key = `${type}:${id}:${visitorId}`;
  if (seen.has(key)) return false;

  seen.set(key, true);
  return true;
}

module.exports = { shouldCountHit };
