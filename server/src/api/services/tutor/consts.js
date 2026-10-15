const TUTOR = {
  MAX_MESSAGE_LEN: 1000, // same as TUTOR_MAX_LEN in qwik/src/components/tutor/types.ts
  HISTORY_MESSAGES: 16, // last messages of the chat sent to the model
  MAX_CHAT_MESSAGES: 300, // then the user has to start a new chat
  USER_DAILY_MESSAGES: Number(process.env.TUTOR_USER_DAILY_LIMIT) || 100,
  GLOBAL_DAILY_MESSAGES: Number(process.env.TUTOR_GLOBAL_DAILY_LIMIT) || 5000, // budget guard
  SUMMARIZE_EVERY: 20, // new messages in a chat before the profile is updated
  MAX_MEMORY_LEN: 1500,
  MAX_REPLY_TOKENS: 1500,
  MAX_SUMMARY_TOKENS: 800,
  MAX_BLOCKS: 30,
  MAX_BLOCK_LEN: 1500,
  CHATS_IN_LIST: 50,
};

const HSK_LEVELS = [1, 2, 3, 4, 5, 6];

module.exports = { TUTOR, HSK_LEVELS };
