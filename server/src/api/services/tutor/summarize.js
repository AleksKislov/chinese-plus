const TutorChat = require('../../../models/TutorChat');
const TutorProfile = require('../../../models/TutorProfile');
const { tutorCompletion } = require('./usage');
const { SUMMARY_PROMPT, cleanText } = require('./prompts');
const { TUTOR } = require('./consts');

const MAX_TRANSCRIPT_LEN = 12000;
const running = new Set(); // user ids

// folds the chat messages that are not in TutorProfile.memory yet into it
async function summarizeChat(chatId, log) {
  const chat = await TutorChat.findById(chatId).lean();
  if (!chat) return;
  const fresh = chat.messages.slice(chat.summarizedCount);
  if (fresh.length < 2) return;

  const profile = await TutorProfile.findOne({ user: chat.user }).select('memory').lean();
  const transcript = fresh
    .map((m) =>
      m.role === 'user'
        ? `Ученик: ${m.text}`
        : `Учитель: ${m.blocks.map((b) => (b.ru ? `${b.text} (${b.ru})` : b.text)).join(' ')}`,
    )
    .join('\n')
    .slice(-MAX_TRANSCRIPT_LEN);

  const { content } = await tutorCompletion({
    userId: chat.user,
    kind: 'summary',
    log,
    maxTokens: TUTOR.MAX_SUMMARY_TOKENS,
    messages: [
      { role: 'system', content: SUMMARY_PROMPT },
      {
        role: 'user',
        content: `<current_notes>\n${profile?.memory || '(пусто)'}\n</current_notes>\n<new_lessons>\n${transcript}\n</new_lessons>`,
      },
    ],
  });
  const memory = cleanText(content).slice(0, TUTOR.MAX_MEMORY_LEN);
  if (!memory) return;

  await TutorProfile.updateOne(
    { user: chat.user },
    { $set: { memory, memoryUpdatedAt: new Date() } },
    { upsert: true },
  );
  await TutorChat.updateOne({ _id: chatId }, { $set: { summarizedCount: chat.messages.length } });
}

// background job: never throws, one at a time per user
async function summarizeInBackground(userId, chatId, log) {
  const key = String(userId);
  if (running.has(key)) return;
  running.add(key);
  try {
    await summarizeChat(chatId, log);
  } catch (err) {
    log.error({ err }, 'tutor: summary failed');
  } finally {
    running.delete(key);
  }
}

module.exports = { summarizeInBackground };
