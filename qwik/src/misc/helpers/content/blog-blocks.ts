export type BlogTextBlock = { type: 'text'; text: string };
export type BlogImageBlock = { type: 'image'; url: string; caption?: string };
export type BlogCarouselImage = { url: string; caption?: string };
export type BlogCarouselBlock = { type: 'carousel'; images: BlogCarouselImage[] };
export type BlogVideoBlock = { type: 'video'; url: string };
export type BlogChineseBlock = { type: 'chinese'; words: string[] };

export type BlogBlock =
  | BlogTextBlock
  | BlogImageBlock
  | BlogCarouselBlock
  | BlogVideoBlock
  | BlogChineseBlock;

export const newBlogBlock = (type: BlogBlock['type']): BlogBlock => {
  switch (type) {
    case 'image':
      return { type: 'image', url: '', caption: '' };
    case 'carousel':
      return { type: 'carousel', images: [] };
    case 'video':
      return { type: 'video', url: '' };
    case 'chinese':
      return { type: 'chinese', words: [] };
    default:
      return { type: 'text', text: '' };
  }
};

// the cover shown on cards/OG tags is the first image, not a separately stored field
export const getCoverImage = (content: BlogBlock[] | undefined): string => {
  for (const block of content || []) {
    if (block.type === 'image' && block.url) return block.url;
    if (block.type === 'carousel' && block.images[0]?.url) return block.images[0].url;
  }
  return '';
};

// the card description is the post's own text, not a separately stored field
export const getPreviewText = (content: BlogBlock[] | undefined, maxLen = 180): string => {
  const firstText = (content || []).find(
    (block): block is BlogTextBlock => block.type === 'text' && Boolean(block.text.trim()),
  );
  if (!firstText) return '';

  const text = firstText.text.trim();
  return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + '…' : text;
};

const YOUTUBE_ID_REGEX = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/;
const VIMEO_ID_REGEX = /vimeo\.com\/(?:video\/)?(\d+)/;

// resolves known platforms (youtube, vimeo) to their embed url; for anything
// else falls back to the pasted url as-is (works if it's already an /embed/
// link, but the host may still refuse to be framed for a plain page url)
export const getVideoEmbedUrl = (url: string): string | null => {
  const trimmed = (url || '').trim();
  if (!trimmed) return null;

  const ytMatch = trimmed.match(YOUTUBE_ID_REGEX);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = trimmed.match(VIMEO_ID_REGEX);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return /^https?:\/\//.test(trimmed) ? trimmed : null;
};
