/**
 * 行书 fonts for the propisi sheets -> Yandex bucket (propisi-fonts/<font>/<code point hex>.json),
 * read by the qwik FE server (misc/actions/propisi/get-glyphs.ts, ids must match SHEET_FONTS in
 * qwik/src/components/propisi/types.ts) and drawn as SVG paths, so a sheet loads only its own
 * characters (~1-2 KB each) instead of a 4-10 MB font.
 *
 * Each file is one SVG path (JSON string) in a 1000x1000 box, y down: the font is centred on its
 * median glyph centre and scaled so that a median glyph is GLYPH_SIZE units, so all fonts sit the
 * same way in the cells.
 *
 * Fonts (git-ignored, free for commercial use), scripts/fonts/propisi/:
 *   zqp.ttf      瑞美加张清平硬笔行书 1.1 (猫啃网)
 *   changan.ttf  平方长安体 (平方造字, 100font)
 *   ssq.ttf      平方上上谦体 (平方造字, 猫啃网)
 *
 * Dev and prod share the bucket, so one run covers both. Re-run after replacing a font.
 *
 * Usage (from server/):
 *   node scripts/upload-propisi-fonts.js --out=./tmp/propisi-fonts --chars=永你好
 *       # only write the files locally, to look at them
 *   NODE_ENV=development node scripts/upload-propisi-fonts.js --apply
 *   NODE_ENV=development node scripts/upload-propisi-fonts.js --apply --font=changan
 */
const path = require('path');
const fs = require('fs');

require('dotenv').config({
  path: path.join(
    __dirname,
    '..',
    'config',
    process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod',
  ),
});

const fontkit = require('fontkit'); // comes with pdfkit
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../src/api/services/_misc/s3-client');

const FONTS = ['zqp', 'changan', 'ssq'];
const FONT_DIR = path.join(__dirname, 'fonts', 'propisi');
const PREFIX = 'propisi-fonts';
const GLYPH_SIZE = 800;
const CONCURRENCY = 32;

const APPLY = process.argv.includes('--apply');
const getArg = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : undefined;
};
const ONLY_FONT = getArg('font');
const ONLY_CHARS = getArg('chars');
const OUT_DIR = getArg('out');
const BUCKET = process.env.YA_S3_BUCKET;

const isHan = (cp) => (cp >= 0x3400 && cp <= 0x9fff) || (cp >= 0xf900 && cp <= 0xfaff);
const median = (nums) => [...nums].sort((a, b) => a - b)[Math.floor(nums.length / 2)];

// relative commands with integer coordinates: about half the size of absolute ones
function toPath(commands, transform) {
  let cur = [0, 0];
  const out = [];
  const rel = (...nums) => {
    const parts = [];
    for (let i = 0; i < nums.length; i += 2) {
      const [x, y] = transform(nums[i], nums[i + 1]);
      parts.push(x - cur[0], y - cur[1]);
    }
    cur = transform(nums[nums.length - 2], nums[nums.length - 1]);
    return parts.join(' ');
  };
  for (const { command, args } of commands) {
    if (command === 'moveTo') out.push(`m${rel(...args)}`);
    else if (command === 'lineTo') out.push(`l${rel(...args)}`);
    else if (command === 'quadraticCurveTo') out.push(`q${rel(...args)}`);
    else if (command === 'bezierCurveTo') out.push(`c${rel(...args)}`);
    else if (command === 'closePath') out.push('z');
  }
  return out.join('').replace(/ -/g, '-');
}

function fontGlyphs(id) {
  const font = fontkit.openSync(path.join(FONT_DIR, `${id}.ttf`));
  const codePoints = ONLY_CHARS
    ? [...ONLY_CHARS].map((ch) => ch.codePointAt(0))
    : font.characterSet.filter(isHan);

  // position and size from all the font's characters, so --chars gives the same files
  const boxes = font.characterSet
    .filter(isHan)
    .map((cp) => font.glyphForCodePoint(cp).path.bbox)
    .filter((b) => b.maxX > b.minX);
  const cx = median(boxes.map((b) => (b.minX + b.maxX) / 2));
  const cy = median(boxes.map((b) => (b.minY + b.maxY) / 2));
  const scale = GLYPH_SIZE / median(boxes.map((b) => Math.max(b.maxX - b.minX, b.maxY - b.minY)));
  const transform = (x, y) => [
    Math.round(500 + (x - cx) * scale),
    Math.round(500 - (y - cy) * scale),
  ];
  console.log(`${id}: ${font.familyName}, ${codePoints.length} chars, scale ${scale.toFixed(3)}`);

  return codePoints
    .map((cp) => ({ cp, d: toPath(font.glyphForCodePoint(cp).path.commands, transform) }))
    .filter(({ d }) => d);
}

async function inBatches(items, fn) {
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    await Promise.all(items.slice(i, i + CONCURRENCY).map(fn));
    if (APPLY && (i / CONCURRENCY) % 20 === 0) console.log(`  ${i}/${items.length}`);
  }
}

async function main() {
  for (const id of ONLY_FONT ? [ONLY_FONT] : FONTS) {
    const glyphs = fontGlyphs(id);
    const outDir = OUT_DIR && path.join(OUT_DIR, id);
    if (outDir) fs.mkdirSync(outDir, { recursive: true });
    let bytes = 0;

    await inBatches(glyphs, async ({ cp, d }) => {
      const name = `${cp.toString(16)}.json`;
      const body = JSON.stringify(d);
      bytes += body.length;
      if (outDir) fs.writeFileSync(path.join(outDir, name), body);
      if (APPLY) {
        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: `${PREFIX}/${id}/${name}`,
            Body: body,
            ContentType: 'application/json',
            CacheControl: 'public, max-age=86400',
            ACL: 'public-read',
          }),
        );
      }
    });
    console.log(
      `${id}: ${glyphs.length} glyphs, avg ${(bytes / glyphs.length / 1024).toFixed(1)} KB` +
        `${APPLY ? `, uploaded to ${PREFIX}/${id}/` : ''}`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
