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
  exampleRu: string | null;
  bank: ExamChoice[];
  questions: ExamQuestion[];
};

export type ExamSectionType = 'listening' | 'reading' | 'writing';

export type ExamSection = {
  type: ExamSectionType;
  titleCn: string | null;
  titleRu: string | null;
  durationMinutes: number | null;
  parts: ExamPart[];
};

export type HskExamType = {
  _id: string;
  version: 'old' | 'new';
  level: string;
  slug: string;
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
