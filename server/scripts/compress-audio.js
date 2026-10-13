/**
 * Shrink audio files (mp3, wav, m4a, ...) to a small mp3 with ffmpeg, keeping
 * speech quality practically the same. Works on local files only - upload the
 * result yourself.
 *
 * Defaults are tuned for spoken Chinese (exam recordings, TTS, dialogues):
 *   - mono: speech recordings are the same on both channels, so stereo only
 *     doubles the size; --stereo keeps two channels
 *   - LAME VBR -q:a 4 (~70-90 kb/s in mono): no audible difference for voice
 *     against a 320 kb/s source; --quality=0..9 (0 best/biggest, 9 smallest)
 *   - source sample rate kept, cover art dropped, ID3 tags kept
 * A 36-minute 320 kb/s stereo exam recording (87 MB) comes out around 20 MB.
 *
 * Needs ffmpeg: the ffmpeg-static package in server/node_modules (picked up
 * automatically), or FFMPEG_PATH=/path/to/ffmpeg, or ffmpeg in PATH.
 *
 * Usage (from server/):
 *   node scripts/compress-audio.js "/path/to/file.mp3"
 *       # -> /path/to/file.compressed.mp3, next to the original
 *   node scripts/compress-audio.js "/path/to/file.mp3" --out=./audio/compressed
 *   node scripts/compress-audio.js /path/to/folder                # every audio file in it
 *   node scripts/compress-audio.js a.mp3 b.wav --quality=6        # smaller
 *   node scripts/compress-audio.js a.mp3 --stereo                 # keep two channels
 *   node scripts/compress-audio.js a.mp3 --replace                # overwrite the original
 */
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const { promisify } = require('util');

const run = promisify(execFile);

// FFMPEG_PATH, else the ffmpeg-static package, else PATH
const FFMPEG = (() => {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  try {
    return require('ffmpeg-static');
  } catch {
    return 'ffmpeg';
  }
})();

const AUDIO_EXT = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.wma'];
const SUFFIX = '.compressed';

const getArg = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : undefined;
};
const STEREO = process.argv.includes('--stereo');
const REPLACE = process.argv.includes('--replace');
const OUT_DIR = getArg('out');
const QUALITY = getArg('quality') !== undefined ? Number(getArg('quality')) : 4;
const INPUTS = process.argv.slice(2).filter((a) => !a.startsWith('--'));

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** Files to process: each input is a file, or a folder whose audio files are taken (not recursive). */
function collectFiles(inputs) {
  return inputs.flatMap((input) => {
    const full = path.resolve(process.cwd(), input);
    if (!fs.existsSync(full)) throw new Error(`Not found: ${input}`);
    if (!fs.statSync(full).isDirectory()) return [full];
    return fs
      .readdirSync(full)
      .filter((f) => AUDIO_EXT.includes(path.extname(f).toLowerCase()))
      // never re-compress our own output
      .filter((f) => !path.basename(f, path.extname(f)).endsWith(SUFFIX))
      .map((f) => path.join(full, f));
  });
}

function outputPath(src) {
  const name = path.basename(src, path.extname(src));
  if (REPLACE) return path.join(path.dirname(src), `${name}.mp3`);
  return path.join(OUT_DIR ? path.resolve(process.cwd(), OUT_DIR) : path.dirname(src), `${name}${SUFFIX}.mp3`);
}

async function compress(src, dst) {
  // write next to the target first, so a failed run never leaves a half file
  // (or, with --replace, never destroys the original)
  const tmp = `${dst}.tmp.mp3`;
  try {
    await run(
      FFMPEG,
      [
        '-hide_banner', '-loglevel', 'error', '-y',
        '-i', src,
        '-vn', // drop embedded cover art
        '-map_metadata', '0',
        '-ac', STEREO ? '2' : '1',
        '-c:a', 'libmp3lame',
        '-q:a', String(QUALITY),
        tmp,
      ],
      { maxBuffer: 10 * 1024 * 1024 },
    );
    fs.renameSync(tmp, dst);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

async function main() {
  if (!INPUTS.length) {
    console.error('Usage: node scripts/compress-audio.js <file-or-folder> [...] [--out=DIR] [--quality=0..9] [--stereo] [--replace]');
    process.exit(1);
  }
  if (!Number.isInteger(QUALITY) || QUALITY < 0 || QUALITY > 9)
    throw new Error('--quality must be an integer 0..9 (0 best, 9 smallest)');
  if (REPLACE && OUT_DIR) throw new Error('--replace and --out are mutually exclusive');
  await run(FFMPEG, ['-version']).catch(() => {
    throw new Error('ffmpeg not found: npm i --no-save ffmpeg-static (or set FFMPEG_PATH)');
  });

  const files = collectFiles(INPUTS);
  if (!files.length) throw new Error('No audio files found');
  if (OUT_DIR) fs.mkdirSync(path.resolve(process.cwd(), OUT_DIR), { recursive: true });

  console.log(`${files.length} file(s), ${STEREO ? 'stereo' : 'mono'}, VBR quality ${QUALITY}`);
  let before = 0;
  let after = 0;
  for (const src of files) {
    const dst = outputPath(src);
    const size = fs.statSync(src).size;
    try {
      await compress(src, dst);
      // --replace on a non-mp3 source writes file.mp3 next to it - remove the original then
      if (REPLACE && dst !== src) fs.rmSync(src);
      const newSize = fs.statSync(dst).size;
      before += size;
      after += newSize;
      console.log(
        `  + ${path.basename(src)}  ${mb(size)} -> ${mb(newSize)} (-${Math.round((1 - newSize / size) * 100)}%)  ${dst}`,
      );
    } catch (e) {
      console.log(`  ! ${path.basename(src)} — ${(e.stderr || e.message).trim()}`);
    }
  }
  if (files.length > 1) console.log(`Total: ${mb(before)} -> ${mb(after)}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
