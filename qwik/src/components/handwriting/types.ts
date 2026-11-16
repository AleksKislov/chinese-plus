// Admin page /admin/handwriting/: the admin traces characters with a stylus, the pen movement is
// saved (BE api/handwriting, model server/src/models/Handwriting.js) to build an animated font.

// [x, y, pressure, t]: x, y 0..1000 on the writing square (y down), pressure 0..1,
// t ms since the first point of the character
export type PenPoint = [number, number, number, number];
// one touch of the pen to the screen, pen down -> pen up
export type PenStroke = PenPoint[];

export type HandwritingData = {
  strokes: PenStroke[];
  size: number; // writing square in CSS px when recorded
  pen: boolean; // written with a stylus: real pressure
};

export type SavedHandwriting = HandwritingData & { font: string; char: string; updatedAt: string };

export type HandwritingChar = { ch: string; py: string; ru: string };

export type HandwritingPageData = {
  chars: HandwritingChar[];
  saved: string[]; // chars already saved for the font
  font: string;
  source: string; // ?chars= or ?hsk= as typed, to show in the form
};

export const HANDWRITING_PATH = '/admin/handwriting/';
export const GRID = 1000; // coordinates of saved points
export const MAX_CHARS = 60; // api/writing-sheets/chars limit
export const HSK_SETS = ['3-1', '3-2', '3-3', '3-4', '3-5', '3-6', '3-789'];
export const DEFAULT_HSK = '3-1';
export const FONT_ID_RE = /^[a-z0-9-]{1,40}$/;
export const HAN_RE = /^\p{Script=Han}$/u;

export const KAI_FONT = "'KaiTi', 'STKaiti', 'Kaiti SC', 'Noto Serif SC', serif";
