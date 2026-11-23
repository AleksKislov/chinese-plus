import CONST_URLS from '~/misc/consts/urls';
import { type TooltipSegment } from '~/misc/helpers/content/parse-text-words';

// 'cn': Chinese sentence(s) with a translation, 'note': Russian explanation (may quote Chinese words),
// 'grammar': link to a grammar lesson (slug checked by the BE, text is the lesson title)
export type TutorBlock = {
  kind: 'cn' | 'note' | 'grammar' | 'hints';
  text: string;
  ru?: string;
  slug?: string;
  audio?: string; // 'cn' block: path under CONST_URLS.myAudioURL, once generated
  segments: TooltipSegment[]; // text split into dictionary words, for tooltips
  items?: { text: string; ru?: string }[]; // 'hints': possible replies of the student
};

export type TutorMessage = {
  _id: string;
  role: 'user' | 'assistant';
  text?: string; // user message, as typed
  blocks?: TutorBlock[]; // assistant reply
  dialect?: string; // assistant reply: dialect key it was written and voiced in; '' / none = Putonghua
  autoAudio?: boolean; // client only: a reply that just arrived, its audio is generated at once
  date: string;
};

export type TutorChatItem = {
  _id: string;
  num: number; // lesson number of the user
  title: string;
  level: number;
  focus?: TutorFocus; // lesson type; missing on lessons created before lesson types
  createdAt: string;
  updatedAt: string;
};

// lesson type chosen at the start (TutorChat.focus on the BE)
export type TutorLessonKind = 'chat' | 'vocab' | 'text';
export type TutorFocus = {
  kind: TutorLessonKind;
  textId?: string;
  textTitle?: string;
  vocabTotal?: number; // 'vocab': words of the lesson
  vocabDone?: number; // 'vocab': of them practised
};
// what the client sends to start a lesson: a text by id or by a link to its page
export type TutorLessonStart = {
  kind: TutorLessonKind;
  textId?: string;
  textUrl?: string;
  vocab?: TutorVocabChoice;
};

// "Повторить мои слова": which lists, and optionally words picked by hand (word ids).
// Without wordIds the BE picks the newest + random words of the lists.
export type TutorVocabSource = 'own' | 'hsk3';
export type TutorVocabChoice = { sources: TutorVocabSource[]; wordIds?: string[] };
export type TutorVocabWord = { id: string; cn: string; py?: string };
export const VOCAB_SOURCE_LABELS: Record<TutorVocabSource, string> = {
  own: 'Мой словарик',
  hsk3: 'HSK 3.0',
};
export const TUTOR_VOCAB_MAX = 50; // same as TUTOR.VOCAB_WORDS on the BE

export type TutorTextSuggestion = {
  _id: string;
  title: string;
  level: number;
  bookmarked: boolean;
};
export const TEXT_LEVEL_LABELS: Record<number, string> = {
  1: 'лёгкий',
  2: 'средний',
  3: 'сложный',
};

type TutorChatOwner = { _id: string; name: string };

// readOnly + owner: an admin reads someone else's chat
export type TutorChat = TutorChatItem & {
  messages: TutorMessage[];
  readOnly?: boolean;
  owner?: TutorChatOwner;
};

// admin list of all users' chats
export type TutorChatOfUser = TutorChatItem & { owner: TutorChatOwner };

export type TutorUsage = { used: number; limit: number };

export type TutorOverview = {
  chats: TutorChatItem[];
  memory: string; // what the tutor remembers from previous chats
  level: number;
  usage: TutorUsage;
  isAdmin: boolean;
  tts: TutorTts;
  listenMode: boolean; // remembered "Аудирование" toggle
  ttsChoices: {
    voices: TutorChoice[];
    speeds: TutorTtsSpeed[];
    dialects?: TutorDialect[]; // missing from an older BE
  };
};

type TutorChoice = { key: string; label: string };
// short: badge (粤语); hidden: no longer offered, only labels old replies
export type TutorDialect = TutorChoice & { short?: string; hidden?: boolean };
// 粤语: `short`, else the part in brackets of the label (a BE without `short`), else the key
export const dialectShortName = (dialect: TutorDialect | undefined, key = '') =>
  dialect?.short || dialect?.label.match(/\(([^)]+)\)/)?.[1] || key;

// audio settings: keys of TTS_VOICES / TTS_SPEEDS / TUTOR_DIALECTS in
// server/src/api/services/tutor/consts.js. voice + speed: Putonghua; dialect: new replies are
// written and voiced in it ('' = Putonghua). Old replies keep the dialect they were written in.
export type TutorTtsSpeed = 'novice' | 'normal' | 'advanced';
export type TutorTts = { voice: string; speed: TutorTtsSpeed; dialect: string };
export const DEFAULT_TUTOR_TTS: TutorTts = { voice: 'teacher', speed: 'normal', dialect: '' };

export const TTS_SPEED_LABELS: Record<TutorTtsSpeed, string> = {
  novice: '0.8',
  normal: '1.0',
  advanced: '1.2',
};

// Putonghua audio is generated per voice + speed: a new key means stored audio paths are stale
// (the dialect setting is not in it: it never changes the audio of existing replies)
export const ttsKey = ({ voice, speed }: TutorTts) => `${voice}|${speed}`;
// a reply in a dialect always has the same voice: its audio never goes stale
export const messageTtsKey = (message: TutorMessage, tts: TutorTts) =>
  message.dialect ? `dialect|${message.dialect}` : ttsKey(tts);

export type SendTutorMessageResult =
  | { chat: TutorChatItem; messages: TutorMessage[]; usage: TutorUsage }
  | { error: string };

export const TUTOR_PATH = '/tutor/';
export const tutorChatUrl = (chatId: string) => `${TUTOR_PATH}?chat=${chatId}`;
export const TUTOR_LEVELS = [1, 2, 3, 4, 5, 6];
export const TUTOR_MAX_LEN = 1000; // same as TUTOR.MAX_MESSAGE_LEN in server/src/api/services/tutor/consts.js
export const OBJECT_ID_RE = /^[0-9a-f]{24}$/;

export const formatLessonDate = (date: string) =>
  new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

// a just-generated clip plays from the response (data), an existing one from the bucket.
// MiniMax clips are mp3, Qwen (dialect) clips wav.
export const tutorAudioUrl = ({ audio, data }: { audio: string; data?: string }) =>
  data
    ? `data:${audio.endsWith('.wav') ? 'audio/wav' : 'audio/mpeg'};base64,${data}`
    : `${CONST_URLS.myAudioURL}${audio}`;
