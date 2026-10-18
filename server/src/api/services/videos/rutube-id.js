// accepts a full Rutube link (rutube.ru/video/<id>/, rutube.ru/play/embed/<id>) or a bare id
const RUTUBE_ID_REGEX = /(?:^|\/)([0-9a-f]{32})(?:\/|\?|$)/i;

// '' -> '' (removes the Rutube player), invalid -> null
function parseRutubeUrl(rutubeUrl) {
  const trimmedUrl = rutubeUrl.trim();
  if (!trimmedUrl) return '';
  return trimmedUrl.match(RUTUBE_ID_REGEX)?.[1]?.toLowerCase() || null;
}

module.exports = { parseRutubeUrl };
