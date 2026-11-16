import { KAI_FONT } from './types';

// Model fonts to trace on /admin/handwriting/. Each font gets its own saved set of characters.
// To add one: convert it to woff2 (smaller than ttf), put it into public/fonts/handwriting/
// and add an entry here. The id is saved with every character: never rename an id.
export type HandwritingFont = {
  id: string; // a-z, 0-9 and '-'
  name: string;
  file?: string; // in public/fonts/handwriting/; none = system font
  family?: string; // css font-family of a system font
};

export const HANDWRITING_FONTS: HandwritingFont[] = [
  { id: 'mini-yingbi-xingshu', name: '迷你简硬笔行书', file: 'mini-yingbi-xingshu.woff2' },
  { id: 'mini-yingbi-kaishu', name: '迷你简硬笔楷书', file: 'mini-yingbi-kaishu.woff2' },
  { id: 'aini-wenrou', name: '爱你是我的温柔', file: 'aini-wenrou.woff2' },
  { id: 'xingyue-xingshu', name: '星月行书', file: 'xingyue-xingshu.woff2' },
  { id: 'honglei-xiaozhitiao', name: '鸿雷小纸条青春体', file: 'honglei-xiaozhitiao.woff2' },
];

export const DEFAULT_FONT = HANDWRITING_FONTS[0].id;

export const findFont = (id: string) => HANDWRITING_FONTS.find((f) => f.id === id);

// css font-family of a font: its own @font-face, Kaiti behind it while the file loads
export const fontFamily = (font: HandwritingFont) =>
  font.file ? `'hw-${font.id}', ${KAI_FONT}` : font.family || KAI_FONT;

// @font-face of every font with a file; the browser downloads a file only when it is used
export const fontFaceCss = HANDWRITING_FONTS.filter((f) => f.file)
  .map(
    (f) =>
      `@font-face{font-family:'hw-${f.id}';src:url('/fonts/handwriting/${f.file}') format('woff2');font-display:swap;}`,
  )
  .join('\n');
