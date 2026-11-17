import { KAI_FONT } from './types';

// Model fonts to trace on /admin/handwriting/. Each font gets its own saved set of characters.
// A whole Chinese font is 2-3 MB, so it is served in slices of characters: font.css lists them
// with unicode-range and the browser downloads only the slices of the characters it shows.
// To add a font: put <id>.woff2 (or .ttf) into public/fonts/handwriting/, run
// `python3 scripts/split-handwriting-fonts.py <id>` (writes public/fonts/handwriting/<id>/)
// and add an entry here. The id is saved with every character: never rename an id.
// The font files are not in git: copy public/fonts/handwriting/ to the server's checkout.
export type HandwritingFont = {
  id: string; // a-z, 0-9 and '-': the file name and the folder of its slices
  name: string;
};

export const HANDWRITING_FONTS: HandwritingFont[] = [
  { id: 'mini-yingbi-xingshu', name: '迷你简硬笔行书' },
  { id: 'mini-yingbi-kaishu', name: '迷你简硬笔楷书' },
  { id: 'aini-wenrou', name: '爱你是我的温柔' },
  { id: 'xingyue-xingshu', name: '星月行书' },
  { id: 'honglei-xiaozhitiao', name: '鸿雷小纸条青春体' },
];

export const DEFAULT_FONT = HANDWRITING_FONTS[0].id;

export const findFont = (id: string) => HANDWRITING_FONTS.find((f) => f.id === id);

// the font's @font-face rules, one per slice (scripts/split-handwriting-fonts.py)
export const fontCssUrl = (font: HandwritingFont) => `/fonts/handwriting/${font.id}/font.css`;

export const fontFaceName = (font: HandwritingFont) => `hw-${font.id}`;

// css font-family of a font: its slices, Kaiti behind them while a slice loads
export const fontFamily = (font: HandwritingFont) => `'${fontFaceName(font)}', ${KAI_FONT}`;
