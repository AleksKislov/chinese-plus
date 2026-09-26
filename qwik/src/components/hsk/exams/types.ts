/**
 * Shapes returned by api/hsk-exams. Mirrors server/src/models/HskExam.js, plus
 * the audioUrl/imageUrl the API derives from the storage key conventions in
 * server/src/api/services/hsk-exams/media-paths.js.
 */

export type ExamChoice = {
  label: string;
  textCn: string | null;
  textRu: string | null;
  pinyin: string | null;
  hasImage: boolean;
  imageUrl: string | null;
};

export type ExamQuestionType =
  | 'listening-true-false'
  | 'listening-picture-match'
  | 'listening-choice'
  | 'reading-true-false'
  | 'reading-picture-match'
  | 'reading-sentence-match'
  | 'reading-fill-blank'
  | 'reading-choice'
  | 'writing-sentence-order'
  | 'writing-character'
  | 'writing-essay';

export type ExamQuestion = {
  ind: number;
  number: number | null;
  questionType: ExamQuestionType;
  promptCn: string | null;
  promptRu: string | null;
  pinyin: string | null;
  ttsText: string | null;
  hasAudio: boolean;
  audioStartSec: number | null;
  hasImage: boolean;
  options: ExamChoice[];
  correctAnswer: string | null;
  explanationRu: string | null;
  audioUrl: string | null;
  imageUrl: string | null;
};

export type ExamPart = {
  ind: number;
  instructionCn: string | null;
  instructionRu: string | null;
  bank: ExamChoice[];
  // Alternative to per-entry bank pictures: ONE combined picture covering every
  // letter (HSK 1 listening part 3's A-F strip). When set, this is the only
  // bank picture to render - individual bank entries carry no image of their
  // own alongside it.
  bankHasImage: boolean;
  bankImageUrl: string | null;
  // Set at content authoring time and never touched by upload/delete - unlike
  // bankHasImage (which the admin upload/delete endpoints flip to track
  // whether the file currently exists), this only reflects which of the two
  // bank-picture layouts the part was written for. Use this, not
  // bankHasImage, to decide which layout to render - otherwise deleting the
  // combined picture flips bankHasImage to false and strands the part in the
  // per-letter layout with no way back.
  bankImagePrompt: string | null;
  // Worked example(s) shown before the real questions (例如) - same shape as a
  // real question (same image/audio/options), so the real picture the example
  // sentence describes renders instead of just a text caption. `number` is
  // always null; not part of the graded set.
  examples: ExamQuestion[];
  questions: ExamQuestion[];
};

export type ExamSectionType = 'listening' | 'reading' | 'writing';

export type ExamSection = {
  type: ExamSectionType;
  titleCn: string | null;
  titleRu: string | null;
  durationMinutes: number | null;
  // One continuous recording for the whole section, as on a real exam paper.
  // Mutually exclusive with per-question audio.
  hasAudio: boolean;
  audioUrl: string | null;
  parts: ExamPart[];
};

export type HskExamType = {
  _id: string;
  version: 'old' | 'new';
  level: string;
  slug: string;
  isApproved: boolean;
  title: { cn: string | null; ru: string | null };
  descriptionRu: string | null;
  ind: number;
  durationMinutes: number | null;
  sections: ExamSection[];
};

export type HskExamListItem = {
  _id: string;
  version: 'old' | 'new';
  level: string;
  slug: string;
  title: { cn: string | null; ru: string | null };
  descriptionRu: string | null;
  ind: number;
  durationMinutes: number | null;
  questionsNum: number;
  sectionTypes: ExamSectionType[];
  isApproved: boolean;
};

export const SECTION_TITLES_RU: Record<ExamSectionType, string> = {
  listening: 'Аудирование',
  reading: 'Чтение',
  writing: 'Письмо',
};

// Kept in sync with BANK_ANSWER_TYPES in server/scripts/import-hsk-exams.js:
// these answer with a label from the part's shared bank instead of their own options.
const BANK_ANSWER_TYPES: ExamQuestionType[] = [
  'listening-picture-match',
  'reading-picture-match',
  'reading-sentence-match',
  'reading-fill-blank',
];

const FREE_TEXT_TYPES: ExamQuestionType[] = ['writing-sentence-order', 'writing-character'];

export const usesBank = (t: ExamQuestionType): boolean => BANK_ANSWER_TYPES.includes(t);
export const isFreeText = (t: ExamQuestionType): boolean => FREE_TEXT_TYPES.includes(t);
export const isUngraded = (t: ExamQuestionType): boolean => t === 'writing-essay';

/** The choices a question is answered from - either its own or the part's bank. */
export const getChoices = (q: ExamQuestion, part: ExamPart): ExamChoice[] =>
  usesBank(q.questionType) ? part.bank : q.options;

/** Stable key for a question inside one exam, used for the answer store. */
export const questionKey = (sectionInd: number, partInd: number, qInd: number): string =>
  `${sectionInd}-${partInd}-${qInd}`;

/**
 * Whether an answer is correct. Essays are never auto-graded, so they always
 * report false and are excluded from the score.
 */
export const isCorrect = (q: ExamQuestion, answer: string | undefined): boolean => {
  if (!answer || !q.correctAnswer || isUngraded(q.questionType)) return false;
  if (isFreeText(q.questionType)) return answer.trim() === q.correctAnswer.trim();
  return answer === q.correctAnswer;
};
