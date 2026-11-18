import { server$ } from '@builder.io/qwik-city';
import CONST_URLS from '~/misc/consts/urls';
import { MAX_CHARS, SHEET_FONTS, type SheetFont } from '~/components/propisi/types';

// 行书 glyphs for a sheet: one SVG path per char from the bucket (no CORS there, so the FE server
// fetches them). Cached in memory: a sheet's chars come in one call and repeat across users.
// null - the font has no such char, the sheet draws it as 楷书

const MAX_CACHED = 20000; // ~1.5 KB each
const cache = new Map<string, string | null>();

const fetchGlyph = async (font: SheetFont, ch: string) => {
  const key = `${font}/${ch.codePointAt(0)!.toString(16)}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const res = await fetch(`${CONST_URLS.propisiFontsUrl}${key}.json`);
  if (!res.ok && res.status !== 404 && res.status !== 403) {
    throw new Error(`glyph ${key}: HTTP ${res.status}`);
  }
  const d: string | null = res.ok ? await res.json() : null;
  if (cache.size >= MAX_CACHED) cache.clear();
  cache.set(key, d);
  return d;
};

export const getGlyphs = server$(async (font: SheetFont, chars: string) => {
  const list = [...new Set([...chars])].filter((ch) => /\p{Script=Han}/u.test(ch));
  if (font === 'kai' || !SHEET_FONTS.some((f) => f.id === font) || list.length > MAX_CHARS) {
    return {};
  }

  const glyphs: Record<string, string | null> = {};
  await Promise.all(
    list.map(async (ch) => {
      glyphs[ch] = await fetchGlyph(font, ch).catch((err) => {
        console.log('[propisi]', err);
        return null;
      });
    }),
  );
  return glyphs;
});
