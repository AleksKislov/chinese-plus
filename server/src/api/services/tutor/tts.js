const crypto = require('crypto');
const mongoose = require('mongoose');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const TutorChat = require('../../../models/TutorChat');
const TutorProfile = require('../../../models/TutorProfile');
const TutorAudio = require('../../../models/TutorAudio');
const { s3 } = require('../_misc/s3-client');
const { synthesizeSpeech, ttsConfig } = require('../_misc/minimax-tts');
const { synthesizeQwenSpeech, qwenTtsConfig } = require('../_misc/qwen-tts');
const { getUserPrivileges } = require('../_misc/get-user-privileges');
const { ttsInFlight, takeTtsQuota } = require('./limits');
const { recordTts } = require('./usage');
const { tutorTts } = require('../../../metrics');
const {
  TUTOR,
  TTS_VOICES,
  TTS_SPEEDS,
  DEFAULT_TTS,
  TTS_SAMPLE_TEXT,
  TUTOR_DIALECTS,
} = require('./consts');

// the site plays audio from {bucket}/audio/… (CONST_URLS.myAudioURL)
const bucketKey = (audioPath) => `audio/${audioPath}`;

const NOT_FOUND = 'Аудио не найдено';

class TtsError extends Error {
  constructor(status, msg) {
    super(msg);
    this.status = status;
  }
}

const dialectOf = (key) =>
  typeof key === 'string' && Object.hasOwn(TUTOR_DIALECTS, key) ? TUTOR_DIALECTS[key] : null;
// can be chosen now (hidden ones only voice their old replies)
const isOfferedDialect = (key) => Boolean(dialectOf(key) && !dialectOf(key).hidden);

// stored settings (keys) -> { voice, speed, dialect } keys that exist + MiniMax options
// (Putonghua). The dialect only decides how NEW replies are written and voiced.
function resolveTts(stored) {
  const tts = stored || {};
  const voice = TTS_VOICES[tts.voice] ? tts.voice : DEFAULT_TTS.voice;
  const speed = TTS_SPEEDS[tts.speed] ? tts.speed : DEFAULT_TTS.speed;
  const dialect = isOfferedDialect(tts.dialect) ? tts.dialect : DEFAULT_TTS.dialect;
  return {
    voice,
    speed,
    dialect,
    options: { voice: TTS_VOICES[voice].id, speed: TTS_SPEEDS[speed] },
  };
}

// how to voice text written in `dialect` (a reply's message.dialect): '' / none = Putonghua
// with the user's MiniMax voice + speed; a dialect = its Qwen voice, the same for everyone.
// null = a dialect key that no longer exists: not voiced at all, so dialect text is never
// read by a Putonghua (or another dialect's) voice.
const voiceOptions = (dialect, tts) => {
  if (!dialect) return resolveTts(tts).options;
  const entry = dialectOf(dialect);
  return entry ? { provider: 'qwen', voice: entry.voice } : null;
};

// keyed by model + voice (+ speed) + sentence: the same phrase with the same settings is
// generated once for all users; other settings give another file. MiniMax: mp3, Qwen: wav.
// (The MiniMax key format is unchanged, so clips made before dialects still match.)
const audioPathOf = (text, options) => {
  if (options.provider === 'qwen') {
    const { model, voice } = qwenTtsConfig(options);
    const hash = crypto.createHash('sha1').update(`qwen|${model}|${voice}|${text}`).digest('hex');
    return `tutor/${hash.slice(0, 16)}.wav`;
  }
  const { model, voice, speed } = ttsConfig(options);
  const hash = crypto.createHash('sha1').update(`${model}|${voice}|${speed}|${text}`).digest('hex');
  return `tutor/${hash.slice(0, 16)}.mp3`;
};

const contentTypeOf = (audioPath) => (audioPath.endsWith('.wav') ? 'audio/wav' : 'audio/mpeg');

// -> { audio: Buffer, chars } from the provider of these options
const synthesize = (text, options) =>
  options.provider === 'qwen'
    ? synthesizeQwenSpeech(text, options)
    : synthesizeSpeech(text, options).then(({ mp3, chars }) => ({ audio: mp3, chars }));

// background: the index must never break or slow down playing
const indexAudio = (path, log) =>
  TutorAudio.updateOne({ path }, { $setOnInsert: { path } }, { upsert: true }).catch((err) =>
    log.error({ err }, 'tutor: audio not indexed'),
  );

// sets `audio` on the 'cn' blocks whose clip already exists (stored on the block or in the
// TutorAudio index) and removes it from the rest, so the client can show which sentences play
// instantly. A reply's clip depends on its dialect (message.dialect) and, for Putonghua, on the
// viewer's settings `tts` (TutorProfile.tts). Mutates and returns messages (lean / toObject()).
async function markAvailableAudio(messages, tts) {
  const expected = new Map();
  messages.forEach((m) => {
    const options = voiceOptions(m.dialect, tts);
    // a removed dialect: clips already stored on its blocks (right voice) stay, nothing new
    if (!options) return;
    (m.blocks || [])
      .filter((b) => b.kind === 'cn')
      .forEach((b) => expected.set(b, audioPathOf(b.text, options)));
  });
  const blocks = [...expected.keys()];
  const unknown = [
    ...new Set(blocks.filter((b) => b.audio !== expected.get(b)).map((b) => expected.get(b))),
  ];
  const indexed = unknown.length
    ? new Set(
        (
          await TutorAudio.find({ path: { $in: unknown } })
            .select('path')
            .lean()
        ).map((a) => a.path),
      )
    : new Set();

  blocks.forEach((b) => {
    const path = expected.get(b);
    if (b.audio === path || indexed.has(path)) b.audio = path;
    else delete b.audio;
  });
  return messages;
}

// upload -> index; resolves true once the clip can be served from the bucket. Only then is it
// recorded anywhere, so nobody gets a path to a file that isn't there yet.
async function storeAudio({ audio, file, log }) {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.YA_S3_BUCKET,
        Key: bucketKey(audio),
        Body: file,
        ContentType: contentTypeOf(audio),
        // the key changes with the text or the settings, so the file never changes
        CacheControl: 'public, max-age=31536000, immutable',
        ACL: 'public-read',
      }),
    );
    await indexAudio(audio, log);
    return true;
  } catch (err) {
    log.error({ err }, 'tutor: audio not stored'); // the next click generates it again
    return false;
  }
}

// -> { audio, file? } for the text with these settings. Existing clips (TutorAudio index) are
// returned by path. A new one is generated (and counted) and returned as a file too, so the client
// plays it at once; the upload runs in the background, then onStored() (e.g. remember it on the
// message). Clips from before the index are generated again once.
async function ensureAudio({ text, options, userId, log, onStored }) {
  const audio = audioPathOf(text, options);
  if (await TutorAudio.exists({ path: audio })) {
    tutorTts.inc({ status: 'cached' });
    return { audio };
  }

  if (ttsInFlight.has(userId)) {
    tutorTts.inc({ status: 'rejected' });
    throw new TtsError(429, 'Подождите, предыдущее аудио ещё готовится');
  }
  ttsInFlight.add(userId);
  try {
    if (!(await takeTtsQuota(userId))) {
      tutorTts.inc({ status: 'rejected' });
      throw new TtsError(
        429,
        `Лимит озвучки на сегодня (${TUTOR.USER_DAILY_TTS}) исчерпан. Возвращайтесь завтра!`,
      );
    }
    const started = Date.now();
    let file;
    let chars;
    try {
      ({ audio: file, chars } = await synthesize(text, options));
    } catch (err) {
      tutorTts.inc({ status: 'error' });
      log.error({ err, provider: options.provider || 'minimax' }, 'tutor: tts failed');
      throw new TtsError(502, 'Не удалось озвучить, попробуйте ещё раз');
    }
    recordTts({
      userId,
      provider: options.provider || 'minimax',
      chars,
      seconds: (Date.now() - started) / 1000,
      log,
    });

    storeAudio({ audio, file, log }).then((stored) => stored && onStored?.());
    return { audio, file };
  } finally {
    ttsInFlight.delete(userId);
  }
}

// the clip as JSON: its path, plus the file itself (base64 mp3 / wav, see the extension of
// `audio`) when it was just generated
const audioResponse = ({ audio, file }) =>
  file ? { audio, data: file.toString('base64') } : { audio };

const sendTtsError = (res, err) => {
  if (err instanceof TtsError) return res.status(err.status).json({ msg: err.message });
  throw err;
};

const userTts = async (userId) =>
  (await TutorProfile.findOne({ user: userId }).select('tts').lean())?.tts;

// body: { chatId, messageId, block } -> { audio, data? } (path under the audio bucket; base64
// file when just generated): a reply in a dialect with that dialect's voice, a Putonghua one
// with the user's voice and speed. Only Chinese ("cn") blocks of the tutor's replies: the text
// comes from the DB, never from the client, so this can't be used to voice arbitrary text.
async function getBlockAudio(req, res) {
  const userId = req.user.id;
  const { chatId, messageId } = req.body || {};
  const blockInd = Number(req.body?.block);
  if (
    !mongoose.isValidObjectId(chatId) ||
    !mongoose.isValidObjectId(messageId) ||
    !Number.isInteger(blockInd) ||
    blockInd < 0 ||
    blockInd >= TUTOR.MAX_BLOCKS
  ) {
    return res.status(400).json({ msg: NOT_FOUND });
  }

  // only the requested message ($ projection), in parallel with the user's settings
  const [chat, tts] = await Promise.all([
    TutorChat.findOne(
      { _id: chatId, 'messages._id': messageId },
      { user: 1, 'messages.$': 1 },
    ).lean(),
    userTts(userId),
  ]);
  const isOwner = chat && String(chat.user) === String(userId);
  // like getChat: owner, or an admin reading the chat
  if (!chat || (!isOwner && !(await getUserPrivileges(userId)).isAdmin)) {
    return res.status(404).json({ msg: NOT_FOUND });
  }
  const message = chat.messages?.[0];
  const block = message?.role === 'assistant' && message.blocks?.[blockInd];
  if (!block || block.kind !== 'cn') return res.status(404).json({ msg: NOT_FOUND });

  const options = voiceOptions(message.dialect, tts);
  if (!options) return res.status(404).json({ msg: 'Озвучка этого диалекта недоступна' });
  const path = audioPathOf(block.text, options);
  if (block.audio === path) {
    tutorTts.inc({ status: 'cached' });
    return res.json({ audio: path });
  }

  // remember the last version (for these settings) on the block, once it is in the bucket
  const rememberOnBlock = () =>
    TutorChat.updateOne(
      { _id: chatId, 'messages._id': messageId },
      { $set: { [`messages.$.blocks.${blockInd}.audio`]: path } },
    ).catch((err) => req.log.error({ err }, 'tutor: audio not saved on the block'));

  let audio;
  try {
    audio = await ensureAudio({
      text: block.text,
      options,
      userId,
      log: req.log,
      onStored: rememberOnBlock,
    });
  } catch (err) {
    return sendTtsError(res, err);
  }
  if (!audio.file) rememberOnBlock(); // already in the bucket
  res.json(audioResponse(audio));
}

const validSettings = ({ voice, speed, dialect = '' } = {}) =>
  Boolean(TTS_VOICES[voice] && TTS_SPEEDS[speed] && (dialect === '' || isOfferedDialect(dialect)));

// body: { voice, speed, dialect? } (keys) -> { audio, data? } of a fixed sample phrase, to try
// the settings before saving them: the dialect's voice, or (Putonghua) the voice + speed
async function getSampleAudio(req, res) {
  const { voice, speed, dialect = '' } = req.body || {};
  if (!validSettings({ voice, speed, dialect })) return res.status(400).json({ msg: NOT_FOUND });

  const options = voiceOptions(dialect, { voice, speed });
  try {
    const audio = await ensureAudio({
      text: dialectOf(dialect)?.sample || TTS_SAMPLE_TEXT,
      options,
      userId: req.user.id,
      log: req.log,
    });
    res.json(audioResponse(audio));
  } catch (err) {
    sendTtsError(res, err);
  }
}

// body: { voice, speed, dialect? } (keys; dialect '' = Putonghua) -> saved settings
async function updateTtsSettings(req, res) {
  const { voice, speed, dialect = '' } = req.body || {};
  if (!validSettings({ voice, speed, dialect })) {
    return res.status(400).json({ msg: 'Неизвестный голос, скорость или диалект' });
  }
  await TutorProfile.updateOne(
    { user: req.user.id },
    { $set: { tts: { voice, speed, dialect } } },
    { upsert: true },
  );
  res.json({ tts: { voice, speed, dialect } });
}

// for the client: choices without MiniMax / Qwen voice ids
const ttsChoices = () => ({
  voices: Object.entries(TTS_VOICES).map(([key, { label }]) => ({ key, label })),
  speeds: Object.keys(TTS_SPEEDS),
  // all of them (badges of old replies); `hidden` ones are not offered in the select
  dialects: Object.entries(TUTOR_DIALECTS).map(([key, { label, short, hidden }]) => ({
    key,
    label,
    short,
    ...(hidden && { hidden: true }),
  })),
});

module.exports = {
  getBlockAudio,
  getSampleAudio,
  updateTtsSettings,
  resolveTts,
  audioPathOf,
  markAvailableAudio,
  ttsChoices,
};
