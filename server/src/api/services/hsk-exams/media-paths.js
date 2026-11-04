/**
 * Object Storage key conventions for HSK exam media.
 *
 * Pictures and audio are generated outside the app and uploaded separately, so
 * the keys have to be derivable from the exam JSON alone - nothing is stored on
 * the question except a hasAudio/hasImage flag. Both the import script (which
 * emits the media manifest telling you where to put each file) and any consumer
 * rebuilding a playback URL go through here, so the two can never drift.
 *
 * Layout in the bucket:
 *   hsk-exams/old/1/old-1-exam-1/listening/p0/q0.mp3
 *   hsk-exams/old/1/old-1-exam-1/listening/p2/bank-A.webp
 *   hsk-exams/old/1/old-1-exam-1/listening/p1/q0-opt-A.webp
 */

const MEDIA_ROOT = 'hsk-exams';
const AUDIO_EXT = 'mp3';
const IMAGE_EXT = 'webp';
// Shared with the admin upload endpoint - these are small textbook
// illustrations shown at ~120-220px, not photographs, so keep them light.
const IMAGE_MAX_WIDTH = 640;
const IMAGE_QUALITY = 85;

// Public base of the existing Yandex Object Storage bucket (see qwik CONST_URLS).
const MEDIA_BASE_URL =
  process.env.YA_S3_PUBLIC_URL || 'https://storage.yandexcloud.net/buyilehu/';

/** Full public URL for a storage key. */
const toPublicUrl = (key) => `${MEDIA_BASE_URL.replace(/\/+$/, '')}/${key}`;

const partDir = ({ version, level, slug, sectionType, partInd }) =>
  `${MEDIA_ROOT}/${version}/${level}/${slug}/${sectionType}/p${partInd}`;

/**
 * One continuous recording for a whole section - the way a real HSK paper is
 * sat: spoken instructions, the worked example, every question and the timed
 * pauses in a single track. Used instead of per-question audio when the section
 * sets hasAudio.
 */
const getSectionAudioKey = ({ version, level, slug, sectionType }) =>
  `${MEDIA_ROOT}/${version}/${level}/${slug}/${sectionType}/section.${AUDIO_EXT}`;

/** Audio for a single question (the TTS render of question.ttsText). */
const getQuestionAudioKey = (ctx, questionInd) => `${partDir(ctx)}/q${questionInd}.${AUDIO_EXT}`;

/** Picture attached to a single question. */
const getQuestionImageKey = (ctx, questionInd) => `${partDir(ctx)}/q${questionInd}.${IMAGE_EXT}`;

/** Picture for one lettered entry in a part's shared bank (the A-F strip). */
const getBankImageKey = (ctx, label) => `${partDir(ctx)}/bank-${label}.${IMAGE_EXT}`;

/**
 * ONE combined picture covering the whole bank (all its letters together) -
 * the alternative to getBankImageKey when the part uses part.bankHasImage
 * instead of per-entry bank pictures.
 */
const getPartBankImageKey = (ctx) => `${partDir(ctx)}/bank.${IMAGE_EXT}`;

/**
 * Picture for one lettered option of a single question - the A/B/C picture
 * choice used by HSK 1 listening part 2, where the pictures belong to the
 * question rather than to a bank shared across the part.
 */
const getOptionImageKey = (ctx, questionInd, label) =>
  `${partDir(ctx)}/q${questionInd}-opt-${label}.${IMAGE_EXT}`;

/**
 * Audio for one worked example (例如) that carries its own recording rather
 * than being covered by the section's single track. Rare in practice (this
 * project's exams so far all use section-level listening audio, which already
 * includes the spoken examples) but kept distinct from getQuestionAudioKey so
 * example 0 and real question 0 in the same part can never collide.
 */
const getExampleAudioKey = (ctx, exampleInd) => `${partDir(ctx)}/ex${exampleInd}.${AUDIO_EXT}`;

/**
 * Picture for a worked example (例如) - the same idea as a question's own
 * picture, but namespaced `ex` instead of `q` so example 0 and real question
 * 0 in the same part never collide on the same key.
 */
const getExampleImageKey = (ctx, exampleInd) => `${partDir(ctx)}/ex${exampleInd}.${IMAGE_EXT}`;

/** Picture for one lettered option of a worked example (mirrors getOptionImageKey). */
const getExampleOptionImageKey = (ctx, exampleInd, label) =>
  `${partDir(ctx)}/ex${exampleInd}-opt-${label}.${IMAGE_EXT}`;

module.exports = {
  MEDIA_ROOT,
  MEDIA_BASE_URL,
  AUDIO_EXT,
  IMAGE_EXT,
  IMAGE_MAX_WIDTH,
  IMAGE_QUALITY,
  toPublicUrl,
  getSectionAudioKey,
  getQuestionAudioKey,
  getQuestionImageKey,
  getBankImageKey,
  getPartBankImageKey,
  getOptionImageKey,
  getExampleAudioKey,
  getExampleImageKey,
  getExampleOptionImageKey,
};
