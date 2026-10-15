import { type TooltipSegment } from '~/misc/helpers/content/parse-text-words';

// 'cn': Chinese sentence(s) with a translation, 'note': Russian explanation (may quote Chinese words),
// 'grammar': link to a grammar lesson (slug checked by the BE, text is the lesson title)
export type TutorBlock = {
  kind: 'cn' | 'note' | 'grammar';
  text: string;
  ru?: string;
  slug?: string;
  segments: TooltipSegment[]; // text split into dictionary words, for tooltips
};

export type TutorMessage = {
  _id: string;
  role: 'user' | 'assistant';
  text?: string; // user message, as typed
  blocks?: TutorBlock[]; // assistant reply
  date: string;
};

export type TutorChatItem = {
  _id: string;
  num: number; // lesson number of the user
  title: string;
  level: number;
  createdAt: string;
  updatedAt: string;
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
};

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
