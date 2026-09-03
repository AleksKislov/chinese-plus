/**
 * Import HSK mock exams authored as JSON into the hskexams collection.
 *
 * Exams are written by hand (or generated offline) under server/content/hsk-exams
 * and imported with this script. Every exam is upserted on its `slug`, so the
 * workflow for fixing a mistake is: edit the JSON, re-run the script, done - the
 * existing document is overwritten in place and never duplicated.
 *
 * Pictures and audio are produced separately. This script does not upload media;
 * it validates the content, records the hasAudio/hasImage flags, and can emit a
 * manifest listing every media file still to be generated, what to generate it
 * from (the TTS script or the image prompt) and the exact Object Storage key to
 * upload it to - see src/api/services/hsk-exams/media-paths.js.
 *
 * Usage:
 *   node scripts/import-hsk-exams.js                                   # dry run, all exams
 *   node scripts/import-hsk-exams.js --apply
 *   node scripts/import-hsk-exams.js --dir=content/hsk-exams/new/1 --apply
 *   node scripts/import-hsk-exams.js --slug=new-1-exam-1 --apply       # just one exam
 *   node scripts/import-hsk-exams.js --apply --publish                 # also set isApproved
 *   node scripts/import-hsk-exams.js --media-manifest=media-todo.json  # what's left to generate
 *   node scripts/import-hsk-exams.js --validate-only                   # no DB needed
 *
 * A dry run parses and validates everything and prints exactly what would change,
 * so it is always safe to run first. --validate-only goes further and never opens
 * a DB connection at all, which is the fast loop to use while writing content.
 */
const path = require('path');
const fs = require('fs');

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
const HskExam = require('../src/models/HskExam');
const {
  getQuestionAudioKey,
  getQuestionImageKey,
  getBankImageKey,
} = require('../src/api/services/hsk-exams/media-paths');

const DEFAULT_DIR = path.join(__dirname, '..', 'content', 'hsk-exams');

const APPLY = process.argv.includes('--apply');
const PUBLISH = process.argv.includes('--publish');
// Validate + emit the media manifest without ever touching Mongo.
const VALIDATE_ONLY = process.argv.includes('--validate-only');

const getArg = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : null;
};

const DIR = getArg('dir') ? path.resolve(process.cwd(), getArg('dir')) : DEFAULT_DIR;
const ONLY_SLUG = getArg('slug');
const MANIFEST_PATH = getArg('media-manifest');

const SECTION_TYPES = ['listening', 'reading', 'writing'];
// Question types answered from the part-level bank rather than their own options.
const BANK_ANSWER_TYPES = [
  'listening-picture-match',
  'reading-picture-match',
  'reading-sentence-match',
  'reading-fill-blank',
];
// Question types graded against free text rather than a label.
const FREE_TEXT_TYPES = ['writing-sentence-order', 'writing-character'];
const UNGRADED_TYPES = ['writing-essay'];

/** Recursively collect every .json file under a directory. */
function findJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findJsonFiles(full);
    return entry.isFile() && entry.name.endsWith('.json') ? [full] : [];
  });
}

/**
 * Validates one parsed exam. Returns a list of human-readable problems - an
 * empty list means the exam is importable. Everything is checked in one pass so
 * a bad file reports all of its problems at once instead of one per re-run.
 */
function validateExam(exam, file) {
  const errors = [];
  const at = (loc) => `${path.basename(file)} ${loc}`;

  if (!exam || typeof exam !== 'object') return [`${path.basename(file)}: not a JSON object`];
  if (!['old', 'new'].includes(exam.version))
    errors.push(at(`version: expected "old" or "new", got ${JSON.stringify(exam.version)}`));
  if (!exam.level) errors.push(at('level: required'));
  if (!exam.slug) errors.push(at('slug: required'));
  else if (!/^[a-z0-9-]+$/.test(exam.slug))
    errors.push(at(`slug "${exam.slug}": only lowercase letters, digits and dashes`));
  if (!Array.isArray(exam.sections) || !exam.sections.length)
    errors.push(at('sections: required, at least one'));

  (exam.sections || []).forEach((section, sInd) => {
    const sLoc = `sections[${sInd}]`;
    if (!SECTION_TYPES.includes(section.type))
      errors.push(at(`${sLoc}.type: expected one of ${SECTION_TYPES.join('/')}`));
    if (!Array.isArray(section.parts) || !section.parts.length)
      errors.push(at(`${sLoc}.parts: required, at least one`));

    (section.parts || []).forEach((part, pInd) => {
      const pLoc = `${sLoc}.parts[${pInd}]`;
      const bankLabels = (part.bank || []).map((b) => b.label);
      const dupBank = bankLabels.filter((l, i) => bankLabels.indexOf(l) !== i);
      if (dupBank.length) errors.push(at(`${pLoc}.bank: duplicate labels ${dupBank.join(', ')}`));
      (part.bank || []).forEach((b, bInd) => {
        if (!b.label) errors.push(at(`${pLoc}.bank[${bInd}].label: required`));
        if (b.hasImage && !b.imagePrompt)
          errors.push(at(`${pLoc}.bank[${bInd}].imagePrompt: required when hasImage is true`));
        if (!b.hasImage && !b.textCn && !b.textRu)
          errors.push(at(`${pLoc}.bank[${bInd}]: needs textCn/textRu or hasImage`));
      });

      if (!Array.isArray(part.questions) || !part.questions.length)
        errors.push(at(`${pLoc}.questions: required, at least one`));

      (part.questions || []).forEach((q, qInd) => {
        const qLoc = `${pLoc}.questions[${qInd}]`;
        if (!q.questionType) {
          errors.push(at(`${qLoc}.questionType: required`));
          return;
        }

        const optionLabels = (q.options || []).map((o) => o.label);
        const usesBank = BANK_ANSWER_TYPES.includes(q.questionType);
        const validLabels = usesBank ? bankLabels : optionLabels;

        if (UNGRADED_TYPES.includes(q.questionType)) {
          // essays have no key - nothing to check
        } else if (FREE_TEXT_TYPES.includes(q.questionType)) {
          if (!q.correctAnswer) errors.push(at(`${qLoc}.correctAnswer: required`));
        } else if (!q.correctAnswer) {
          errors.push(at(`${qLoc}.correctAnswer: required`));
        } else if (!validLabels.includes(q.correctAnswer)) {
          errors.push(
            at(
              `${qLoc}.correctAnswer "${q.correctAnswer}" is not one of the ` +
                `${usesBank ? 'part bank' : 'question option'} labels ` +
                `[${validLabels.join(', ') || 'none'}]`
            )
          );
        }

        if (usesBank && !bankLabels.length)
          errors.push(at(`${qLoc}: type "${q.questionType}" needs a non-empty ${pLoc}.bank`));
        if (!usesBank && !optionLabels.length && !FREE_TEXT_TYPES.includes(q.questionType) &&
          !UNGRADED_TYPES.includes(q.questionType))
          errors.push(at(`${qLoc}.options: required for type "${q.questionType}"`));

        // Listening questions are answered from audio, so a missing script means
        // the question can never be rendered even once media generation runs.
        if (section.type === 'listening' && q.hasAudio !== false && !q.ttsText)
          errors.push(at(`${qLoc}.ttsText: required for a listening question with audio`));
        if (q.hasImage && !q.imagePrompt)
          errors.push(at(`${qLoc}.imagePrompt: required when hasImage is true`));
      });
    });
  });

  return errors;
}

/**
 * Normalises a validated exam into the shape the Mongoose model expects, filling
 * in the indexes and running question numbers so the JSON does not have to
 * repeat them by hand.
 */
function toDocument(exam) {
  const sections = exam.sections.map((section) => {
    let runningNumber = 1;
    return {
      type: section.type,
      titleCn: section.titleCn ?? null,
      titleRu: section.titleRu ?? null,
      durationMinutes: section.durationMinutes ?? null,
      parts: section.parts.map((part, pInd) => ({
        ind: part.ind ?? pInd,
        instructionCn: part.instructionCn ?? null,
        instructionRu: part.instructionRu ?? null,
        exampleRu: part.exampleRu ?? null,
        bank: (part.bank || []).map((b) => ({
          label: b.label,
          textCn: b.textCn ?? null,
          textRu: b.textRu ?? null,
          pinyin: b.pinyin ?? null,
          hasImage: Boolean(b.hasImage),
          imagePrompt: b.imagePrompt ?? null,
        })),
        questions: part.questions.map((q, qInd) => ({
          ind: q.ind ?? qInd,
          number: q.number ?? runningNumber++,
          questionType: q.questionType,
          promptCn: q.promptCn ?? null,
          promptRu: q.promptRu ?? null,
          pinyin: q.pinyin ?? null,
          ttsText: q.ttsText ?? null,
          hasAudio: Boolean(q.hasAudio),
          hasImage: Boolean(q.hasImage),
          imagePrompt: q.imagePrompt ?? null,
          options: (q.options || []).map((o) => ({
            label: o.label,
            textCn: o.textCn ?? null,
            textRu: o.textRu ?? null,
            pinyin: o.pinyin ?? null,
            hasImage: Boolean(o.hasImage),
          })),
          correctAnswer: q.correctAnswer ?? null,
          explanationRu: q.explanationRu ?? null,
        })),
      })),
    };
  });

  return {
    version: exam.version,
    level: String(exam.level),
    slug: exam.slug,
    title: { cn: exam.title?.cn ?? null, ru: exam.title?.ru ?? null },
    descriptionRu: exam.descriptionRu ?? null,
    ind: exam.ind ?? 0,
    durationMinutes: exam.durationMinutes ?? null,
    sections,
    updatedAt: new Date(),
  };
}

/**
 * Every media file this exam expects, with the source to generate it from and
 * the storage key to upload it to. `pending` marks the ones not yet generated.
 */
function collectMedia(exam) {
  const items = [];
  exam.sections.forEach((section) => {
    section.parts.forEach((part, pInd) => {
      const ctx = {
        version: exam.version,
        level: String(exam.level),
        slug: exam.slug,
        sectionType: section.type,
        partInd: part.ind ?? pInd,
      };

      (part.bank || []).forEach((b) => {
        if (!b.hasImage) return;
        items.push({
          kind: 'image',
          key: getBankImageKey(ctx, b.label),
          prompt: b.imagePrompt ?? null,
          note: `bank ${b.label} of ${section.type} part ${ctx.partInd}`,
        });
      });

      part.questions.forEach((q, qInd) => {
        const ind = q.ind ?? qInd;
        if (q.hasAudio) {
          items.push({
            kind: 'audio',
            key: getQuestionAudioKey(ctx, ind),
            ttsText: q.ttsText ?? null,
            note: `${section.type} part ${ctx.partInd} question ${ind}`,
          });
        }
        if (q.hasImage) {
          items.push({
            kind: 'image',
            key: getQuestionImageKey(ctx, ind),
            prompt: q.imagePrompt ?? null,
            note: `${section.type} part ${ctx.partInd} question ${ind}`,
          });
        }
      });
    });
  });
  return items;
}

async function run() {
  if (APPLY && VALIDATE_ONLY) {
    console.error('--apply and --validate-only are mutually exclusive.');
    process.exit(1);
  }

  const files = findJsonFiles(DIR).sort();
  if (!files.length) {
    console.error(`No .json exam files found under ${DIR}`);
    process.exit(1);
  }

  const parsed = [];
  const allErrors = [];

  for (const file of files) {
    let exam;
    try {
      exam = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      allErrors.push(`${path.basename(file)}: invalid JSON - ${err.message}`);
      continue;
    }
    if (ONLY_SLUG && exam.slug !== ONLY_SLUG) continue;

    const errors = validateExam(exam, file);
    if (errors.length) allErrors.push(...errors);
    else parsed.push({ file, exam });
  }

  if (ONLY_SLUG && !parsed.length && !allErrors.length) {
    console.error(`No exam with slug "${ONLY_SLUG}" found under ${DIR}`);
    process.exit(1);
  }

  const dupes = parsed
    .map(({ exam }) => exam.slug)
    .filter((s, i, arr) => arr.indexOf(s) !== i);
  if (dupes.length) allErrors.push(`Duplicate slugs across files: ${[...new Set(dupes)].join(', ')}`);

  if (allErrors.length) {
    console.error(`\nValidation failed with ${allErrors.length} problem(s):`);
    allErrors.forEach((e) => console.error(`  - ${e}`));
    console.error('\nNothing was imported. Fix the content and re-run.');
    process.exit(1);
  }

  const mode = VALIDATE_ONLY ? 'VALIDATE ONLY' : APPLY ? 'APPLYING' : 'DRY RUN';
  console.log(`${mode} - ${parsed.length} valid exam(s) from ${DIR}\n`);

  if (!VALIDATE_ONLY) {
    const MONGO_DB = process.env.MONGO_IN_CONTAINER
      ? process.env.CONTAINER_MONGO_DB
      : process.env.MONGO_DB;
    await connectDB(MONGO_DB);
  }

  const manifest = [];
  let created = 0;
  let updated = 0;

  for (const { file, exam } of parsed) {
    const doc = toDocument(exam);
    const media = collectMedia(exam);
    const pendingAudio = media.filter((m) => m.kind === 'audio').length;
    const pendingImages = media.filter((m) => m.kind === 'image').length;
    const questionCount = doc.sections.reduce(
      (sum, s) => sum + s.parts.reduce((n, p) => n + p.questions.length, 0),
      0
    );

    const existing = VALIDATE_ONLY
      ? null
      : await HskExam.findOne({ slug: doc.slug }).select('_id').lean();
    const action = VALIDATE_ONLY ? 'ok' : existing ? 'update' : 'create';
    if (existing) updated++;
    else created++;

    console.log(
      `  [${action}] ${doc.slug}  (${doc.version} HSK ${doc.level}, ` +
        `${doc.sections.length} section(s), ${questionCount} question(s), ` +
        `${pendingAudio} audio + ${pendingImages} image file(s) expected)  <- ${path.basename(file)}`
    );

    manifest.push({ slug: doc.slug, media });

    if (APPLY) {
      const update = { ...doc };
      if (PUBLISH) update.isApproved = true;
      await HskExam.findOneAndUpdate(
        { slug: doc.slug },
        // $set replaces sections wholesale, so removing a question from the JSON
        // actually removes it on re-import. $setOnInsert keeps isApproved/date
        // from being reset every time an already-published exam is corrected.
        { $set: update, $setOnInsert: { date: new Date(), ...(PUBLISH ? {} : { isApproved: false }) } },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }
  }

  if (VALIDATE_ONLY) {
    console.log(`\nAll ${parsed.length} exam(s) valid. No DB connection was opened.`);
  } else {
    console.log(
      `\n${APPLY ? 'Imported' : 'Would import'}: ${created} new, ${updated} updated.` +
        (PUBLISH
          ? ' (published: isApproved=true)'
          : ' (left unpublished - pass --publish to publish)')
    );
  }

  if (MANIFEST_PATH) {
    const out = path.resolve(process.cwd(), MANIFEST_PATH);
    fs.writeFileSync(out, JSON.stringify(manifest, null, 2), 'utf8');
    const total = manifest.reduce((n, m) => n + m.media.length, 0);
    console.log(`Media manifest written to ${out} (${total} file(s) to generate).`);
  }

  if (!APPLY && !VALIDATE_ONLY)
    console.log('Dry run only - no writes made. Re-run with --apply to persist.');

  if (!VALIDATE_ONLY) await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
