// Rutube video ids are 32 hex chars: rutube.ru/video/<id>/ or rutube.ru/play/embed/<id>
const RUTUBE_ID_REGEX = /(?:^|\/)([0-9a-f]{32})(?:\/|\?|$)/i;

export const getRutubeId = (url: string): string | null => {
  return url.trim().match(RUTUBE_ID_REGEX)?.[1]?.toLowerCase() || null;
};

export const getRutubeVideoUrl = (id: string) => `https://rutube.ru/video/${id}/`;

export const getRutubeEmbedUrl = (id: string) => `https://rutube.ru/play/embed/${id}`;
