const mongoose = require('mongoose');
const TutorChat = require('../../../models/TutorChat');
const TutorProfile = require('../../../models/TutorProfile');
const { tutorCompletion } = require('./usage');
const { tutorRejected } = require('../../../metrics');
const { tutorSystemPrompt, cleanText, parseReply, toModelMessage } = require('./prompts');
const { segmentText, attachTooltips } = require('./segment');
const { inFlight, takeGlobalQuota, takeUserQuota, refundQuota, usageOf } = require('./limits');
const { summarizeInBackground } = require('./summarize');
const { getGrammarCatalog } = require('./grammar-catalog');
const { TUTOR, HSK_LEVELS } = require('./consts');

// body: { text, level, chatId? } - no chatId starts a new chat
async function sendMessage(req, res) {
  const userId = req.user.id;
  const { chatId } = req.body || {};
  const text = typeof req.body?.text === 'string' ? cleanText(req.body.text) : '';
  const level = HSK_LEVELS.includes(Number(req.body?.level)) ? Number(req.body.level) : 1;

  if (!text) return res.status(400).json({ msg: 'Пустое сообщение' });
  if (text.length > TUTOR.MAX_MESSAGE_LEN) {
    return res.status(400).json({ msg: `Сообщение длиннее ${TUTOR.MAX_MESSAGE_LEN} символов` });
  }
  if (chatId != null && !mongoose.isValidObjectId(chatId)) {
    return res.status(400).json({ msg: 'Чат не найден' });
  }
  if (inFlight.has(userId)) {
    tutorRejected.inc({ reason: 'busy' });
    return res.status(429).json({ msg: 'Дождитесь ответа на предыдущее сообщение' });
  }

  inFlight.add(userId);
  try {
    let chat = null;
    if (chatId) {
      chat = await TutorChat.findOne({ _id: chatId, user: userId });
      if (!chat) return res.status(404).json({ msg: 'Чат не найден' });
      if (chat.messages.length >= TUTOR.MAX_CHAT_MESSAGES) {
        return res.status(400).json({ msg: 'Этот чат слишком длинный — начните новый' });
      }
    }

    if (!takeGlobalQuota()) {
      tutorRejected.inc({ reason: 'global_limit' });
      return res.status(503).json({ msg: 'Учитель сейчас перегружен, попробуйте позже' });
    }
    if (!(await takeUserQuota(userId))) {
      tutorRejected.inc({ reason: 'user_limit' });
      return res.status(429).json({
        msg: `Лимит на сегодня (${TUTOR.USER_DAILY_MESSAGES} сообщений) исчерпан. Возвращайтесь завтра!`,
      });
    }

    if (!chat) {
      // a new chat: fold the previous one into the student's profile
      const prev = await TutorChat.findOne({ user: userId })
        .sort({ updatedAt: -1 })
        .select('_id')
        .lean();
      if (prev) summarizeInBackground(userId, prev._id, req.log);
      const last = await TutorChat.findOne({ user: userId }).sort({ num: -1 }).select('num').lean();
      const num = (last?.num || 0) + 1; // lesson number, shown in the sidebar
      chat = new TutorChat({ user: userId, num, title: text.slice(0, 60), level });
    }
    chat.level = level;

    const [profile, grammar] = await Promise.all([
      TutorProfile.findOneAndUpdate(
        { user: userId },
        { $set: { level } },
        { returnDocument: 'after' },
      ).lean(),
      getGrammarCatalog(level),
    ]);

    let blocks;
    try {
      const { content } = await tutorCompletion({
        userId,
        kind: 'chat',
        log: req.log,
        json: true,
        maxTokens: TUTOR.MAX_REPLY_TOKENS,
        messages: [
          {
            role: 'system',
            content: tutorSystemPrompt({
              level,
              memory: profile?.memory,
              grammarTopics: grammar.topics,
            }),
          },
          ...chat.messages.slice(-TUTOR.HISTORY_MESSAGES).map(toModelMessage),
          { role: 'user', content: text },
        ],
      });
      blocks = parseReply(content, grammar.bySlug);
      if (!blocks.length) throw new Error(`Empty tutor reply: ${content.slice(0, 200)}`);
    } catch (err) {
      req.log.error({ err }, 'tutor: reply failed');
      await refundQuota(userId);
      return res.status(502).json({ msg: 'Учитель не смог ответить, попробуйте ещё раз' });
    }

    chat.messages.push(
      { role: 'user', text },
      {
        role: 'assistant',
        // grammar links show the lesson title as is
        blocks: blocks.map((b) => ({
          ...b,
          words: b.kind === 'grammar' ? [] : segmentText(b.text),
        })),
      },
    );
    chat.updatedAt = new Date();
    await chat.save();

    if (chat.messages.length - chat.summarizedCount >= TUTOR.SUMMARIZE_EVERY) {
      summarizeInBackground(userId, chat._id, req.log);
    }

    const messages = chat.messages.slice(-2).map((m) => m.toObject());
    await attachTooltips(messages);
    res.json({
      chat: {
        _id: chat._id,
        num: chat.num,
        title: chat.title,
        level: chat.level,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
      messages,
      usage: usageOf(profile),
    });
  } finally {
    inFlight.delete(userId);
  }
}

module.exports = { sendMessage };
