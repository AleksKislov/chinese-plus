const TUTOR = {
  MAX_MESSAGE_LEN: 1000, // same as TUTOR_MAX_LEN in qwik/src/components/tutor/types.ts
  HISTORY_MESSAGES: 16, // last messages of the chat sent to the model
  MAX_CHAT_MESSAGES: 300, // then the user has to start a new chat
  USER_DAILY_MESSAGES: Number(process.env.TUTOR_USER_DAILY_LIMIT) || 100,
  USER_DAILY_TTS: Number(process.env.TUTOR_USER_DAILY_TTS) || 200, // new audio clips (cached ones are free)
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
// Check / change ids with ~/Desktop/mm-test.sh voices. id null: MINIMAX_TTS_VOICE.
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

const DEFAULT_TTS = { voice: 'teacher', speed: 'normal' };

// sample for the settings preview; fixed here, so it can't be used to voice arbitrary text
const TTS_SAMPLE_TEXT = '你好！我是你的中文老师。我们一起学习吧！';

module.exports = { TUTOR, HSK_LEVELS, TTS_VOICES, TTS_SPEEDS, DEFAULT_TTS, TTS_SAMPLE_TEXT };
