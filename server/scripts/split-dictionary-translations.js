/**
 * One-off migration: parse the DSL markup in `dictionaries.russian` into JSON and
 * split it into two new collections. `dictionaries` itself is never modified.
 *
 *   dictionarytranslations - one document per dictionary word:
 *     { wordId, chinese, lang, senses: [Node], exampleCount, ruTerms?, parseWarnings? }
 *   dictionaryexamples - one document per example:
 *     { wordId, chinese, lang, senseId, order, zh, pinyin?, labels?, translation, content? }
 *
 * `senses` is a tree (homonyms -> sections -> numbered senses -> sub-senses), and
 * `examples.senseId` is the position of a node in that tree ('2.1' = senses[1].senses[0],
 * null when the example is not under any sense). Full shape and the parser:
 * src/api/services/dictionary/translations/ (shared with the API, which re-syncs
 * a word's documents when it is edited).
 *
 * Russian search (lang 'ru' only, see translations/ru-search-terms.js):
 *   ruTerms - normalized short glosses, plain index: exact / anchored-prefix lookup
 *   senses[.senses...].text - russian text index ($text, stemmed), partial on lang 'ru':
 *     queries must include { lang: 'ru' } to use it
 *   dictionaryexamples.translation also gets a russian text index.
 *
 * `lang` is detected per word, because the field named `russian` also holds english
 * glosses ("[m1]stator winder[/m]") and chinese explanations:
 *   'ru' - any cyrillic in the senses, 'zh' - chinese explanation, 'en' - otherwise.
 *
 * Usage:
 *   node scripts/split-dictionary-translations.js                 # dry run: parse all, print stats
 *   node scripts/split-dictionary-translations.js --word=的,猫    # print the documents that would be inserted
 *   node scripts/split-dictionary-translations.js --apply         # write (target collections must be empty)
 *   node scripts/split-dictionary-translations.js --apply --rebuild   # drop both target collections first
 *   node scripts/split-dictionary-translations.js --limit=1000
 *   node scripts/split-dictionary-translations.js --apply --target-db=dict_test --word=的,猫
 *     # --target-db writes the new collections into another database (source is still read
 *     # from the configured one), to try the migration without touching the real database
 */
const path = require('path');

require('dotenv').config({
  path: path.join(
    __dirname,
    '..',
    'config',
    process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod'
  ),
});

const mongoose = require('mongoose');
const { connectDB } = require('../src/mongo_db/db');
const { buildDocuments } = require('../src/api/services/dictionary/translations/build-documents');

const APPLY = process.argv.includes('--apply');
const REBUILD = process.argv.includes('--rebuild');
const argValue = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.slice(name.length + 3) : undefined;
};
const LIMIT = Number(argValue('limit') || 0);
const WORDS = argValue('word') ? argValue('word').split(',') : null;
const TARGET_DB = argValue('target-db');

const SOURCE = 'dictionaries';
const TRANSLATIONS = 'dictionarytranslations';
const EXAMPLES = 'dictionaryexamples';
const BATCH_SIZE = 1000;
const LOG_EVERY = 50000;
const WARNING_SAMPLES = 30;
// text indexes take the language from this field when a document has it; nothing sets it,
// so every document uses 'russian' (and lang 'zh', unsupported by mongo, never breaks inserts)
const RU_TEXT_INDEX_OPTIONS = { default_language: 'russian', language_override: 'textLang' };
// the parsed tree is at most 5 levels deep (homonym > section > header > sense > sub-sense)
const SENSE_TEXT_PATHS = [1, 2, 3, 4, 5].map((depth) => `${'senses.'.repeat(depth)}text`);

async function prepareTargets(db) {
  const existing = (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name);
  for (const name of [TRANSLATIONS, EXAMPLES]) {
    if (!existing.includes(name)) continue;
    if (REBUILD) {
      await db.collection(name).drop();
      console.log(`Dropped ${name}`);
    } else if (await db.collection(name).estimatedDocumentCount()) {
      throw new Error(`${name} is not empty. Re-run with --rebuild to drop and recreate it.`);
    }
  }
}

async function createIndexes(db) {
  await db.collection(TRANSLATIONS).createIndexes([
    { key: { wordId: 1, lang: 1 }, unique: true },
    { key: { chinese: 1 } },
    { key: { ruTerms: 1 } },
    {
      key: Object.fromEntries(SENSE_TEXT_PATHS.map((p) => [p, 'text'])),
      name: 'senses_text',
      partialFilterExpression: { lang: 'ru' },
      ...RU_TEXT_INDEX_OPTIONS,
    },
  ]);
  await db.collection(EXAMPLES).createIndexes([
    { key: { wordId: 1, order: 1 } },
    { key: { chinese: 1 } },
    { key: { translation: 'text' }, name: 'translation_text', ...RU_TEXT_INDEX_OPTIONS },
  ]);
}

async function run() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);
  const { db } = mongoose.connection;
  const targetDb = TARGET_DB ? mongoose.connection.client.db(TARGET_DB) : db;

  const query = WORDS ? { chinese: { $in: WORDS } } : {};
  const total = WORDS
    ? await db.collection(SOURCE).countDocuments(query)
    : await db.collection(SOURCE).estimatedDocumentCount();
  console.log(
    `${APPLY ? 'APPLYING' : 'DRY RUN'} - ~${total} dictionary entries${LIMIT ? `, limited to ${LIMIT}` : ''}` +
      `${APPLY ? `, writing to ${targetDb.databaseName}` : ''}`
  );
  if (APPLY) await prepareTargets(targetDb);

  const cursor = db
    .collection(SOURCE)
    .find(query, { projection: { chinese: 1, russian: 1 } })
    .limit(LIMIT)
    .batchSize(BATCH_SIZE);

  const stats = {
    processed: 0,
    translations: 0,
    examples: 0,
    ruTerms: 0,
    withWarnings: 0,
    byLang: {},
    maxBytes: 0,
  };
  const warningSamples = [];
  let translationBatch = [];
  let exampleBatch = [];

  const flush = async (force) => {
    if (APPLY && translationBatch.length && (force || translationBatch.length >= BATCH_SIZE)) {
      await targetDb.collection(TRANSLATIONS).insertMany(translationBatch, { ordered: false });
      translationBatch = [];
    }
    if (APPLY && exampleBatch.length && (force || exampleBatch.length >= BATCH_SIZE)) {
      await targetDb.collection(EXAMPLES).insertMany(exampleBatch, { ordered: false });
      exampleBatch = [];
    }
    if (!APPLY) {
      translationBatch = [];
      exampleBatch = [];
    }
  };

  for await (const doc of cursor) {
    stats.processed += 1;
    const { translation, examples } = buildDocuments(doc);
    if (WORDS) console.log(JSON.stringify({ translation, examples }, null, 2));

    if (translation.parseWarnings) {
      stats.withWarnings += 1;
      if (warningSamples.length < WARNING_SAMPLES) {
        warningSamples.push(`${doc.chinese} (${doc._id}): ${translation.parseWarnings.join(' | ')}`);
      }
    }

    const bytes = Buffer.byteLength(JSON.stringify(translation));
    if (bytes > stats.maxBytes) {
      stats.maxBytes = bytes;
      stats.maxBytesWord = doc.chinese;
    }

    translationBatch.push(translation);
    exampleBatch.push(...examples);

    stats.translations += 1;
    stats.examples += examples.length;
    stats.ruTerms += (translation.ruTerms || []).length;
    stats.byLang[translation.lang] = (stats.byLang[translation.lang] || 0) + 1;

    await flush(false);
    if (stats.processed % LOG_EVERY === 0) console.log(`processed ${stats.processed}/${total}`);
  }
  await flush(true);

  if (APPLY) {
    await createIndexes(targetDb);
    console.log('Indexes created');
  }

  console.log('Done.', stats);
  if (warningSamples.length) console.log(`Warning samples:\n  ${warningSamples.join('\n  ')}`);
  if (!APPLY) console.log('Dry run only - no writes made. Re-run with --apply to persist.');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
