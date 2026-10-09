/**
 * Import grammar topics from content/grammar/{level}.json into the `grammars`
 * collection. See content/grammar/README.md for the file format.
 *
 * - Topics are upserted on `slug`; re-running with an edited file overwrites.
 * - Topics of an imported level that are no longer in its file are deleted.
 * - `words` (used for tooltips) are taken from the spaces in `cn` ("我 是 学生。");
 *   a sentence without spaces is segmented with nodejieba.
 * - `audio` is kept for sentences whose text did not change (spaces aside); new or edited
 *   sentences get audio from scripts/generate-grammar-audio.js.
 * - Vocabulary check: words above the topic's level in the HSK 3.0 list
 *   (content/hsk-words/hsk3-2025.json) are reported as warnings.
 *
 * Usage (from server/):
 *   node scripts/import-grammar.js --validate-only          # no DB connection
 *   node scripts/import-grammar.js                          # dry run
 *   node scripts/import-grammar.js --apply                  # write
 *   node scripts/import-grammar.js --apply --level=1        # only content/grammar/1.json
 *
 * After applying, clear the API cache: POST /api/project/cache/refresh?tag=grammar
 * (or restart the server).
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

const nodejieba = require('nodejieba');

const APPLY = process.argv.includes('--apply');
const VALIDATE_ONLY = process.argv.includes('--validate-only');
const getArg = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : undefined;
};
const ONLY_LEVEL = getArg('level');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'grammar');
const WORDS_FILE = path.join(__dirname, '..', 'content', 'hsk-words', 'hsk3-2025.json');
const {
  GRAMMAR_CATEGORIES,
  GRAMMAR_LEVELS,
  plainCn,
  exampleAudioPath,
} = require('../src/api/services/grammar/consts');

const SLUG_RE = /^[a-z0-9-]+$/;
const HAN_RE = /\p{Script=Han}/u;
const PUNCT_RE = /^[\s\p{P}\p{S}]+$/u;
const NUMBER_RE = /^[零〇一二三四五六七八九十百千万两半]+$/;
// names, and 谢 from 谢谢 (不用谢, 谢什么)
const ALWAYS_OK = new Set(['小王', '小李', '小明', '老王', '老李', '王', '李', '明', '谢']);

// word -> lowest HSK level ('7-9' -> 7)
function loadWordLevels() {
  const levels = new Map();
  JSON.parse(fs.readFileSync(WORDS_FILE, 'utf8')).forEach((w) => {
    const cn = w.word.replace(/\d$/, '');
    const lvl = w.lvl.startsWith('7') ? 7 : Number(w.lvl[0]);
    if (!levels.has(cn) || levels.get(cn) > lvl) levels.set(cn, lvl);
  });
  return levels;
}

// words named in the syllabus grammar items of this and lower levels (杯, 没, 睡觉,
// 综上所述 …); both halves of separable verbs count too (他睡了一个小时觉)
function loadGrammarWords(level) {
  const words = new Set();
  fs.readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8')))
    .filter((d) => numericLevel(d.level) <= numericLevel(level))
    .forEach((d) =>
      d.topics.forEach((t) =>
        (t.items || []).forEach((item) =>
          item
            .replace(/[—…（）()\d]/g, ' ')
            .split(/[、，,\/\s]+/)
            .filter((w) => w && /^\p{Script=Han}+$/u.test(w) && w.length <= 4)
            .forEach((w) => {
              words.add(w);
              if (w.length === 2) [...w].forEach((ch) => words.add(ch));
            }),
        ),
      ),
    );
  return words;
}

const numericLevel = (level) => (level === '789' ? 7 : Number(level));

const isSegmented = (cn) => /\s/.test(cn.trim());

// words from the spaces in cn, punctuation split off as separate tokens:
// "小王，你 好！" -> 小王 ， 你 好 ！
function segment(cn) {
  if (!isSegmented(cn)) return nodejieba.cut(cn).filter((w) => w.trim());
  return cn
    .trim()
    .split(/\s+/)
    .flatMap((w) => w.match(/[\p{P}\p{S}]+|[^\p{P}\p{S}]+/gu));
}

// compounds jieba keeps together (看书, 同学们, 吃了) are fine when every part is known
function vocabularyProblems(words, level, wordLevels, grammarWords) {
  const max = numericLevel(level);
  const known = (w) => (wordLevels.has(w) && wordLevels.get(w) <= max) || grammarWords.has(w);
  const problems = [];
  words.forEach((w) => {
    if (PUNCT_RE.test(w) || NUMBER_RE.test(w) || ALWAYS_OK.has(w) || known(w)) return;
    // reduplicated forms of known words: 慢慢, 看看, 高高兴兴, 休息休息 (+ 的 / 地)
    const base = w.replace(/[的地]$/, '');
    const chars = [...base];
    if (chars.length === 2 && chars[0] === chars[1] && known(chars[0])) return;
    if (chars.length === 4) {
      const [a, b, c, d] = chars;
      if (a === b && c === d && known(a + c)) return; // AABB
      if (a === c && b === d && known(a + b)) return; // ABAB
    }
    // four-character patterns from the syllabus: 一A一B, 无A无B, 有A有B, 不A不B
    if (chars.length === 4 && chars[0] === chars[2] && '一无有不没'.includes(chars[0])) return;
    // try to split into known words (longest match first)
    let rest = w;
    while (rest) {
      let len = rest.length;
      while (
        len > 0 &&
        !(
          known(rest.slice(0, len)) ||
          ALWAYS_OK.has(rest.slice(0, len)) ||
          NUMBER_RE.test(rest.slice(0, len)) ||
          ['了', '们', '着', '过', '的', '儿'].includes(rest.slice(0, len))
        )
      )
        len--;
      if (!len) break;
      rest = rest.slice(len);
    }
    if (rest) {
      const lvl = wordLevels.get(w);
      problems.push(lvl ? `${w} (HSK ${lvl === 7 ? '7-9' : lvl})` : `${w} (not in HSK list)`);
    }
  });
  return problems;
}

function validateFile(data, file, wordLevels, grammarWords, seenSlugs) {
  const errors = [];
  const warnings = [];
  const err = (where, msg) => errors.push(`${file} ${where}: ${msg}`);
  const warn = (where, msg) => warnings.push(`${file} ${where}: ${msg}`);

  if (!GRAMMAR_LEVELS.includes(data.level)) err('level', `must be one of ${GRAMMAR_LEVELS}`);
  if (path.basename(file, '.json') !== data.level) err('level', 'file name must match level');
  if (!Array.isArray(data.topics) || !data.topics.length)
    err('topics', 'must be a non-empty array');

  (data.topics || []).forEach((t, ti) => {
    const at = `topics[${ti}] ${t.slug || ''}`.trim();
    if (!SLUG_RE.test(t.slug || '')) err(at, 'slug must match /^[a-z0-9-]+$/');
    if (seenSlugs.has(t.slug)) err(at, `duplicate slug (also in ${seenSlugs.get(t.slug)})`);
    seenSlugs.set(t.slug, file);
    if (!GRAMMAR_CATEGORIES.includes(t.category)) err(at, `unknown category "${t.category}"`);
    if (!t.title?.cn || !t.title?.ru) err(at, 'title.cn and title.ru are required');
    if (!t.summary) err(at, 'summary is required');
    if (!Array.isArray(t.rules) || !t.rules.length) err(at, 'rules must be a non-empty array');

    (t.rules || []).forEach((r, ri) => {
      const rat = `${at} rules[${ri}]`;
      if (!r.title) err(rat, 'title is required');
      const examples = r.examples || [];
      if (examples.length < 2 || examples.length > 3)
        warn(rat, `${examples.length} examples (expected 2-3)`);

      examples.forEach((ex, ei) => {
        const eat = `${rat} examples[${ei}]`;
        if (!ex.cn || !HAN_RE.test(ex.cn)) err(eat, 'cn must contain Chinese');
        if (!ex.py) err(eat, 'py is required');
        if (!ex.ru) err(eat, 'ru is required');
        if (ex.py && HAN_RE.test(ex.py)) err(eat, 'py contains Chinese characters');
        if (ex.cn && ex.py && /[？?]$/.test(ex.cn.trim()) !== /\?$/.test(ex.py.trim())) {
          warn(eat, 'question mark in cn and py does not match');
        }
        // jieba on the plain sentence: it keeps 打电话, 感兴趣 … together like the word list
        const jiebaWords = ex.cn ? nodejieba.cut(plainCn(ex.cn)).filter((w) => HAN_RE.test(w)) : [];
        if (ex.cn && !isSegmented(ex.cn) && jiebaWords.length > 1) {
          warn(eat, `${ex.cn} — not segmented into words (put spaces between them)`);
        }
        if (ex.cn) {
          const problems = vocabularyProblems(jiebaWords, data.level, wordLevels, grammarWords);
          if (problems.length) warn(eat, `${ex.cn} — above level: ${problems.join(', ')}`);
        }
      });
    });
  });

  return { errors, warnings };
}

function toDocument(topic, ind, level, audioByCn) {
  return {
    slug: topic.slug,
    level,
    ind,
    category: topic.category,
    group: topic.group || '',
    title: { cn: topic.title.cn, ru: topic.title.ru },
    items: topic.items || [],
    summary: topic.summary,
    rules: topic.rules.map((r) => ({
      title: r.title,
      pattern: r.pattern || undefined,
      text: r.text || undefined,
      examples: r.examples.map((ex) => {
        const cn = ex.cn.trim();
        const audio = audioByCn.get(plainCn(cn));
        return {
          cn,
          words: segment(cn),
          py: ex.py.trim(),
          ru: ex.ru.trim(),
          ...(audio === exampleAudioPath(cn) ? { audio } : {}),
        };
      }),
    })),
    notes: topic.notes || [],
    updatedAt: new Date(),
  };
}

async function run() {
  if (APPLY && VALIDATE_ONLY) throw new Error('--apply and --validate-only are exclusive');

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.json'))
    .filter((f) => !ONLY_LEVEL || f === `${ONLY_LEVEL}.json`)
    .map((f) => path.join(CONTENT_DIR, f));
  if (!files.length) throw new Error(`No content files found in ${CONTENT_DIR}`);

  const wordLevels = loadWordLevels();
  const seenSlugs = new Map();
  const parsed = [];
  const errors = [];
  const warnings = [];

  files.forEach((file) => {
    const rel = path.relative(process.cwd(), file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      errors.push(`${rel}: invalid JSON (${e.message})`);
      return;
    }
    const result = validateFile(data, rel, wordLevels, loadGrammarWords(data.level), seenSlugs);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    parsed.push({ rel, data });
  });

  warnings.forEach((w) => console.log(`WARN  ${w}`));
  if (errors.length) {
    errors.forEach((e) => console.log(`ERROR ${e}`));
    console.log(`\n${errors.length} error(s). Nothing was imported.`);
    process.exit(1);
  }

  parsed.forEach(({ rel, data }) => {
    const examples = data.topics.reduce(
      (sum, t) => sum + t.rules.reduce((s, r) => s + r.examples.length, 0),
      0,
    );
    console.log(
      `OK    ${rel}: level ${data.level}, ${data.topics.length} topics, ${examples} examples`,
    );
  });
  console.log(`${warnings.length} warning(s)`);
  if (VALIDATE_ONLY) return;

  const mongoose = require('mongoose');
  const { connectDB } = require('../src/mongo_db/db');
  const Grammar = require('../src/models/Grammar');
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);

  console.log(APPLY ? '\nAPPLYING' : '\nDRY RUN');
  for (const { data } of parsed) {
    const existing = await Grammar.find({ level: data.level }).lean();
    const existingSlugs = new Set(existing.map((d) => d.slug));
    const audioByCn = new Map();
    existing.forEach((d) =>
      d.rules.forEach((r) =>
        r.examples.forEach((ex) => ex.audio && audioByCn.set(plainCn(ex.cn), ex.audio)),
      ),
    );

    const docs = data.topics.map((t, i) => toDocument(t, i, data.level, audioByCn));
    const stale = existing.filter((d) => !docs.some((doc) => doc.slug === d.slug));

    docs.forEach((doc) => {
      const withAudio = doc.rules.reduce((s, r) => s + r.examples.filter((e) => e.audio).length, 0);
      const total = doc.rules.reduce((s, r) => s + r.examples.length, 0);
      console.log(
        `[${existingSlugs.has(doc.slug) ? 'update' : 'create'}] ${doc.slug} (${total} examples, ${withAudio} with audio)`,
      );
    });
    stale.forEach((d) => console.log(`[delete] ${d.slug}`));

    if (APPLY) {
      for (const doc of docs) {
        await Grammar.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { upsert: true });
      }
      if (stale.length) await Grammar.deleteMany({ _id: { $in: stale.map((d) => d._id) } });
    }
  }

  if (!APPLY) console.log('\nDry run (no writes). Re-run with --apply.');
  else console.log('\nDone. Clear the cache: POST /api/project/cache/refresh?tag=grammar');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
