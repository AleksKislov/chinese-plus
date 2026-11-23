const TUTOR = {
  MAX_MESSAGE_LEN: 1000, // same as TUTOR_MAX_LEN in qwik/src/components/tutor/types.ts
  HISTORY_MESSAGES: 16, // last messages of the chat sent to the model
  MAX_CHAT_MESSAGES: 300, // then the user has to start a new chat
  USER_DAILY_MESSAGES: Number(process.env.TUTOR_USER_DAILY_LIMIT) || 100,
  // new audio clips (cached ones are free); every new reply generates its clips right away
  USER_DAILY_TTS: Number(process.env.TUTOR_USER_DAILY_TTS) || 400,
  GLOBAL_DAILY_MESSAGES: Number(process.env.TUTOR_GLOBAL_DAILY_LIMIT) || 5000, // budget guard
  SUMMARIZE_EVERY: 20, // new messages in a chat before the profile is updated
  MAX_MEMORY_LEN: 1500,
  MAX_REPLY_TOKENS: 1500,
  MAX_SUMMARY_TOKENS: 800,
  MAX_BLOCKS: 30,
  MAX_BLOCK_LEN: 1500,
  CHATS_IN_LIST: 50,
  VOCAB_WORDS: 50, // words of a 'vocab' lesson (from the user's vocabulary lists)
  VOCAB_NEWEST: 20, // of them, the most recently added; the rest random
  LESSON_TEXT_LEN: 1500, // Chinese characters of a 'text' lesson (first page)
};

const HSK_LEVELS = [1, 2, 3, 4, 5, 6];

// MiniMax system voices a user can choose; the client only ever sends the key.
const TTS_VOICES = {
  teacher: { id: null, label: 'Учитель Ван (по умолчанию)' },
  girl: { id: 'female-shaonv', label: 'Девушка' },
  woman: { id: 'female-yujie', label: 'Женщина' },
  soft: { id: 'female-tianmei', label: 'Мягкий женский' },
  youth: { id: 'male-qn-qingse', label: 'Юноша' },
  man: { id: 'male-qn-jingying', label: 'Мужчина' },
  announcerF: { id: 'presenter_female', label: 'Диктор, женский' },
  announcerM: { id: 'presenter_male', label: 'Диктор, мужской' },
};

// labels: TTS_SPEED_LABELS in qwik/src/components/tutor/types.ts
const TTS_SPEEDS = { novice: 0.75, normal: 1, advanced: 1.2 };

// dialect: '' = Putonghua (MiniMax voice + speed above), otherwise a key of TUTOR_DIALECTS
const DEFAULT_TTS = { voice: 'teacher', speed: 'normal', dialect: '' };

// sample for the settings preview; fixed here, so it can't be used to voice arbitrary text
const TTS_SAMPLE_TEXT = '你好！我是你的中文老师。我们一起学习吧！';

// Dialects a user can switch to: the teacher writes new replies in it (prompts.js) and they are
// voiced by Qwen TTS (_misc/qwen-tts.js) with `voice`, the Qwen system voice that speaks it.
// Each reply stores its dialect key (TutorChat message.dialect) and is always voiced with that
// entry's voice: a switch never changes old replies, and dialect text is never read by another
// voice. So NEVER delete or rename an entry (or change its voice to another dialect): to stop
// offering it, set `hidden: true` (old replies keep their voice and badge).
// short: badge on the reply and the toolbar. name: for the prompt.
// sample: optional preview phrase written in the dialect.
const TUTOR_DIALECTS = {
  cantonese: {
    label: 'Кантонский (粤语), женский голос',
    short: '粤语',
    name: 'Cantonese (粤语, as spoken in Guangzhou and Hong Kong)',
    voice: 'Kiki',
    sample: '你好！我系你嘅中文老师，我哋一齐学中文啦！',
  },
  cantoneseM: {
    label: 'Кантонский (粤语), мужской голос',
    short: '粤语',
    name: 'Cantonese (粤语, as spoken in Guangzhou and Hong Kong)',
    voice: 'Rocky',
    sample: '你好！我系你嘅中文老师，我哋一齐学中文啦！',
  },
  sichuan: {
    label: 'Сычуаньский (四川话), женский голос',
    short: '四川话',
    name: 'Sichuanese (四川话)',
    voice: 'Sunny',
  },
  sichuanM: {
    label: 'Сычуаньский (四川话), мужской голос',
    short: '四川话',
    name: 'Sichuanese (四川话)',
    voice: 'Eric',
  },
  beijing: {
    label: 'Пекинский (北京话)',
    short: '北京话',
    name: 'Beijing dialect (北京话)',
    voice: 'Dylan',
  },
  tianjin: {
    label: 'Тяньцзиньский (天津话)',
    short: '天津话',
    name: 'Tianjin dialect (天津话)',
    voice: 'Peter',
  },
  shanghai: {
    label: 'Шанхайский (上海话)',
    short: '上海话',
    name: 'Shanghainese (上海话, Wu Chinese)',
    voice: 'Jada',
  },
  nanjing: {
    label: 'Нанкинский (南京话)',
    short: '南京话',
    name: 'Nanjing dialect (南京话)',
    voice: 'Li',
  },
  shaanxi: {
    label: 'Шэньсийский (陕西话)',
    short: '陕西话',
    name: 'Shaanxi dialect (陕西话)',
    voice: 'Marcus',
  },
  minnan: {
    label: 'Миньнань (闽南话)',
    short: '闽南话',
    name: 'Southern Min / Hokkien (闽南话)',
    voice: 'Roy',
  },
};

module.exports = {
  TUTOR,
  HSK_LEVELS,
  TTS_VOICES,
  TTS_SPEEDS,
  DEFAULT_TTS,
  TTS_SAMPLE_TEXT,
  TUTOR_DIALECTS,
};
