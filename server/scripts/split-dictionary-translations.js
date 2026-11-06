/**
 * One-off migration: parse the DSL markup of the dictionary entries into JSON and split it into
 * two new collections. The markup is read from `deprecated_dictionary_russian` once
 * scripts/move-russian-to-deprecated.js has moved it there, else from `dictionaries.russian`.
 * Neither source is modified.
 *
 *   dictionarytranslations - one document per dictionary word:
 *     { wordId, chinese, lang, senses: [Node], exampleCount, ruTerms?, parseWarnings? }
 *   dictionaryexamples - one document per example:
 *     { wordId, chinese, lang, senseId, order, zh, pinyin?, labels?, translation, content? }
 *
 * `senses` is a tree (homonyms -> sections -> numbered senses -> sub-senses), and
 * `examples.senseId` is the position of a node in that tree ('2.1' = senses[1].senses[0],
 * null when the example is not under any sense). Full shape and the parser:
 * src/api/services/dictionary/translations/.
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
 *   node scripts/split-dictionary-translations.js --update        # dry run: count words whose output changed
 *   node scripts/split-dictionary-translations.js --update --apply
 *     # re-parses every entry and replaces only the translations / examples that differ from the
 *     # stored ones (e.g. after a parser fix): nothing is dropped, the site keeps its translations
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
    process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod',
  ),
});

const mongoose = require('mongoose');
const { connectDB } = require('../src/mongo_db/db');
const { buildDocuments } = require('../src/api/services/dictionary/translations/build-documents');

const APPLY = process.argv.includes('--apply');
const REBUILD = process.argv.includes('--rebuild');
const UPDATE = process.argv.includes('--update');
const argValue = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.slice(name.length + 3) : undefined;
};
const LIMIT = Number(argValue('limit') || 0);
const WORDS = argValue('word') ? argValue('word').split(',') : null;
const TARGET_DB = argValue('target-db');

const DEPRECATED = 'deprecated_dictionary_russian';
const DICTIONARIES = 'dictionaries';
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
  await db
    .collection(EXAMPLES)
    .createIndexes([
      { key: { wordId: 1, order: 1 } },
      { key: { chinese: 1 } },
      { key: { translation: 'text' }, name: 'translation_text', ...RU_TEXT_INDEX_OPTIONS },
    ]);
}

// a stored document without its _id, to compare with a freshly built one
const comparable = ({ _id, ...doc }) => JSON.stringify(doc);

/** Writes the built documents that differ from the stored ones (`--update`). */
async function updateChanged(db, built, stats, changedSamples) {
  const ids = built.map((b) => b.translation.wordId);
  const [stored, storedExamples] = await Promise.all([
    db
      .collection(TRANSLATIONS)
      .find({ wordId: { $in: ids } })
      .toArray(),
    db
      .collection(EXAMPLES)
      .find({ wordId: { $in: ids } })
      .sort({ order: 1 })
      .toArray(),
  ]);
  const storedById = new Map(stored.map((t) => [String(t.wordId), comparable(t)]));
  const examplesById = new Map();
  storedExamples.forEach((ex) => {
    const key = String(ex.wordId);
    examplesById.set(key, [...(examplesById.get(key) || []), comparable(ex)]);
  });

  const changed = built.filter(({ translation, examples }) => {
    const id = String(translation.wordId);
    return (
      storedById.get(id) !== comparable(translation) ||
      (examplesById.get(id) || []).join('\n') !== examples.map(comparable).join('\n')
    );
  });
  stats.changed += changed.length;
  changed.forEach(
    ({ translation }) =>
      changedSamples.length < WARNING_SAMPLES && changedSamples.push(translation.chinese),
  );
  if (!APPLY || !changed.length) return;

  await db.collection(TRANSLATIONS).bulkWrite(
    changed.map(({ translation }) => ({
      replaceOne: {
        filter: { wordId: translation.wordId },
        replacement: translation,
        upsert: true,
      },
    })),
  );
  await db
    .collection(EXAMPLES)
    .deleteMany({ wordId: { $in: changed.map((c) => c.translation.wordId) } });
  const examples = changed.flatMap((c) => c.examples);
  if (examples.length) await db.collection(EXAMPLES).insertMany(examples, { ordered: false });
}

async function run() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);
  const { db } = mongoose.connection;
  const targetDb = TARGET_DB ? mongoose.connection.client.db(TARGET_DB) : db;

  // the deprecated copy once the markup is moved out of `dictionaries` (it holds all of it from
  // the first step of the move on; a few names added before the move do not make it the source)
  const [moved, notMoved] = await Promise.all([
    db.collection(DEPRECATED).estimatedDocumentCount(),
    db.collection(DICTIONARIES).countDocuments({ russian: { $exists: true } }),
  ]);
  const SOURCE = moved && moved >= notMoved ? DEPRECATED : DICTIONARIES;

  const query = WORDS ? { chinese: { $in: WORDS } } : {};
  const total = WORDS
    ? await db.collection(SOURCE).countDocuments(query)
    : await db.collection(SOURCE).estimatedDocumentCount();
  console.log(
    `${APPLY ? 'APPLYING' : 'DRY RUN'} - ~${total} entries from ${SOURCE}${LIMIT ? `, limited to ${LIMIT}` : ''}` +
      `${APPLY ? `, writing to ${targetDb.databaseName}` : ''}`,
  );
  // --rebuild drops both collections: with --word / --limit only part of them would come back
  if (REBUILD && (WORDS || LIMIT || UPDATE))
    throw new Error('--rebuild rebuilds everything: drop --word / --limit / --update');
  if (APPLY && !UPDATE) await prepareTargets(targetDb);

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
    ...(UPDATE && { changed: 0 }),
  };
  const warningSamples = [];
  const changedSamples = [];
  let updateBatch = [];
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
        warningSamples.push(
          `${doc.chinese} (${doc._id}): ${translation.parseWarnings.join(' | ')}`,
        );
      }
    }

    const bytes = Buffer.byteLength(JSON.stringify(translation));
    if (bytes > stats.maxBytes) {
      stats.maxBytes = bytes;
      stats.maxBytesWord = doc.chinese;
    }

    if (UPDATE) {
      updateBatch.push({ translation, examples });
      if (updateBatch.length >= BATCH_SIZE) {
        await updateChanged(targetDb, updateBatch, stats, changedSamples);
        updateBatch = [];
      }
    } else {
      translationBatch.push(translation);
      exampleBatch.push(...examples);
    }

    stats.translations += 1;
    stats.examples += examples.length;
    stats.ruTerms += (translation.ruTerms || []).length;
    stats.byLang[translation.lang] = (stats.byLang[translation.lang] || 0) + 1;

    await flush(false);
    if (stats.processed % LOG_EVERY === 0) console.log(`processed ${stats.processed}/${total}`);
  }
  await flush(true);
  if (updateBatch.length) await updateChanged(targetDb, updateBatch, stats, changedSamples);

  if (APPLY && !UPDATE) {
    await createIndexes(targetDb);
    console.log('Indexes created');
  }

  console.log('Done.', stats);
  if (warningSamples.length) console.log(`Warning samples:\n  ${warningSamples.join('\n  ')}`);
  if (changedSamples.length) console.log(`Changed: ${changedSamples.join(' ')}`);
  if (!APPLY) console.log('Dry run only - no writes made. Re-run with --apply to persist.');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
