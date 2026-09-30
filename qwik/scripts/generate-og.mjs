/**
 * Renders the 1200x630 social preview images into public/img/og/: the site-wide
 * fallback (chineseplus.png, used by RouterHead) and the HSK exam and word list pages (names match ogImagePath() in
 * src/components/hsk/exams/levels.ts and getWordsSeo() in src/components/hsk/words-seo.ts).
 * Re-run after adding a level or changing the copy:
 *
 *   node scripts/generate-og.mjs
 *
 * Uses @resvg/resvg-js (already in node_modules via the build toolchain; if it
 * ever goes missing: npm i -D @resvg/resvg-js) and macOS system fonts.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'img', 'og');
const FONTS = ['/System/Library/Fonts/Helvetica.ttc', '/System/Library/Fonts/Hiragino Sans GB.ttc'];

// Mirrors OLD_LEVEL_FORMAT / HSK_LEVELS in src/components/hsk/exams/levels.ts.
const OLD = {
  1: '40 заданий · ~40 минут · 150 слов',
  2: '60 заданий · ~55 минут · 300 слов',
  3: '80 заданий · ~90 минут · 600 слов',
  4: '100 заданий · ~105 минут · 1200 слов',
  5: '100 заданий · ~125 минут · 2500 слов',
  6: '101 задание · ~140 минут · 5000 слов',
};
const NEW = { 1: 300, 2: 500, 3: 1000, 4: 2000, 5: 3600, 6: 5400, 7: 10960 };

// Words introduced at each level - mirrors hskInfo in src/misc/consts/consts.ts.
const OLD_WORDS = { 1: 150, 2: 150, 3: 300, 4: 600, 5: 1300, 6: 2500 };
const NEW_WORDS = { 1: 300, 2: 200, 3: 500, 4: 1000, 5: 1600, 6: 1800, 789: 5560 };

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const svg = ({ kicker, big, sub, badge, glyph = '考' }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="1" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="1150" y="560" text-anchor="end" font-family="Hiragino Sans GB" font-size="520" fill="#38bdf8" fill-opacity="0.08">${glyph}</text>
  <rect x="80" y="80" width="12" height="470" rx="6" fill="#38bdf8"/>
  <text x="130" y="140" font-family="Helvetica" font-weight="bold" font-size="40" fill="#e2e8f0">Chinese<tspan fill="#818cf8">+</tspan></text>
  <text x="130" y="250" font-family="Helvetica" font-size="56" fill="#94a3b8">${esc(kicker)}</text>
  <text x="126" y="400" font-family="Helvetica" font-weight="bold" font-size="${
    big.length > 8 ? 120 : 170
  }" fill="#f8fafc">${esc(big)}</text>
  ${
    badge
      ? `<rect x="130" y="440" width="${
          badge.length * 22 + 48
        }" height="56" rx="28" fill="#818cf8"/>
  <text x="154" y="479" font-family="Helvetica" font-weight="bold" font-size="32" fill="#0f172a">${esc(
    badge,
  )}</text>`
      : ''
  }
  <text x="130" y="${
    badge ? 555 : 480
  }" font-family="Helvetica" font-size="36" fill="#cbd5e1">${esc(sub)}</text>
</svg>`;

const images = {
  'hsk-exams': {
    kicker: 'Пробные экзамены онлайн',
    big: 'HSK 1–9',
    sub: 'HSK 2.0 и HSK 3.0 · аудирование, чтение, письмо',
  },
  'hsk-exams-old': {
    kicker: 'Пробные экзамены онлайн',
    big: 'HSK 1–6',
    badge: 'HSK 2.0',
    sub: 'С проверкой ответов и пояснениями',
  },
  'hsk-exams-new': {
    kicker: 'Пробные экзамены онлайн',
    big: 'HSK 3.0',
    badge: 'Новый стандарт',
    sub: 'Уровни 1–9 · с проверкой ответов',
  },
};
for (const [lvl, sub] of Object.entries(OLD)) {
  images[`hsk-exams-old-${lvl}`] = {
    kicker: 'Пробный экзамен онлайн',
    big: `HSK ${lvl}`,
    badge: 'HSK 2.0',
    sub,
  };
}
for (const [lvl, words] of Object.entries(NEW)) {
  const label = lvl === '7' ? '7–9' : lvl;
  images[`hsk-exams-new-${lvl}`] = {
    kicker: 'Пробный экзамен онлайн',
    big: `HSK ${label}`,
    badge: 'HSK 3.0',
    sub: `${words} слов · с проверкой ответов`,
  };
}

const WORDS_KICKER = 'Слова с переводом и озвучкой';
images['hsk-words-old'] = {
  kicker: WORDS_KICKER,
  big: 'HSK 1–6',
  badge: 'HSK 2.0',
  sub: '5000 слов · пиньинь · тесты · CSV для Anki',
  glyph: '词',
};
images['hsk-words-new'] = {
  kicker: WORDS_KICKER,
  big: 'HSK 3.0',
  badge: 'Список 2025',
  sub: '10960 слов · пиньинь · тесты · CSV для Anki',
  glyph: '词',
};
for (const [lvl, n] of Object.entries(OLD_WORDS)) {
  images[`hsk-words-old-${lvl}`] = {
    kicker: WORDS_KICKER,
    big: `HSK ${lvl}`,
    badge: 'HSK 2.0',
    sub: `${n} слов уровня · тесты · CSV для Anki`,
    glyph: '词',
  };
}
for (const [lvl, n] of Object.entries(NEW_WORDS)) {
  const label = lvl === '789' ? '7–9' : lvl;
  images[`hsk-words-new-${lvl}`] = {
    kicker: WORDS_KICKER,
    big: `HSK ${label}`,
    badge: 'HSK 3.0 · 2025',
    sub: `${n} слов уровня · тесты · CSV для Anki`,
    glyph: '词',
  };
}

images['chineseplus'] = {
  kicker: 'Китайский язык онлайн',
  big: 'Chinese+',
  sub: 'Тексты · видео · HSK · словарь · бесплатно',
  glyph: '中',
};

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, data] of Object.entries(images)) {
  const png = new Resvg(svg(data), {
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Helvetica' },
  })
    .render()
    .asPng();
  writeFileSync(join(OUT_DIR, `${name}.png`), png);
  console.log(`${name}.png  ${(png.length / 1024).toFixed(0)} KB`);
}
