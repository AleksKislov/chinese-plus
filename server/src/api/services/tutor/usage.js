const TutorUsage = require('../../../models/TutorUsage');
const { chatCompletion } = require('../_misc/siliconflow-chat');
const metrics = require('../../../metrics');

// USD per 1M tokens; defaults: DeepSeek-V4.1-Flash on SiliconFlow
const price = (name, fallback) => Number(process.env[name]) || fallback;
const PRICES = {
  input: price('TUTOR_PRICE_INPUT_PER_M', 0.15),
  output: price('TUTOR_PRICE_OUTPUT_PER_M', 0.6),
  cached: price('TUTOR_PRICE_CACHED_PER_M', price('TUTOR_PRICE_INPUT_PER_M', 0.15)),
};

// USD per 1M TTS characters; defaults: MiniMax speech-2.8 hd $100, turbo $60
const ttsPricePerM = () =>
  price('TUTOR_PRICE_TTS_PER_M_CHARS', /-hd$/.test(process.env.MINIMAX_TTS_MODEL || '') ? 100 : 60);

// OpenAI-style or DeepSeek-style usage -> { prompt, completion, cached }
const readUsage = (usage = {}) => ({
  prompt: usage.prompt_tokens || 0,
  completion: usage.completion_tokens || 0,
  cached: usage.prompt_tokens_details?.cached_tokens || usage.prompt_cache_hit_tokens || 0,
});

const costOf = ({ prompt, completion, cached }) =>
  ((prompt - cached) * PRICES.input + cached * PRICES.cached + completion * PRICES.output) / 1e6;

// chatCompletion + usage accounting: log line (Loki), metrics (Grafana), daily totals per user (DB).
// kind: 'chat' | 'summary'
async function tutorCompletion({ userId, kind, log, ...params }) {
  const started = Date.now();
  let result;
  try {
    result = await chatCompletion(params);
  } catch (err) {
    metrics.tutorRequests.inc({ kind, status: 'error' });
    saveUsage(userId, { failedRequests: 1 }, log);
    throw err;
  }

  const seconds = (Date.now() - started) / 1000;
  const tokens = readUsage(result.usage);
  const costUsd = costOf(tokens);

  log.info(
    { tutor: { kind, userId: String(userId), seconds, tokens, costUsd } },
    'tutor: llm call',
  );

  metrics.tutorRequests.inc({ kind, status: 'ok' });
  metrics.tutorDuration.observe({ kind }, seconds);
  metrics.tutorTokens.inc({ kind, type: 'prompt' }, tokens.prompt);
  metrics.tutorTokens.inc({ kind, type: 'completion' }, tokens.completion);
  metrics.tutorTokens.inc({ kind, type: 'cached' }, tokens.cached);
  metrics.tutorCost.inc({ kind }, costUsd);

  saveUsage(
    userId,
    {
      [kind === 'chat' ? 'chatRequests' : 'summaryRequests']: 1,
      promptTokens: tokens.prompt,
      completionTokens: tokens.completion,
      cachedTokens: tokens.cached,
      costUsd,
    },
    log,
  );
  return result;
}

// background: accounting must never break or slow down a reply
function saveUsage(userId, inc, log) {
  const day = new Date().toISOString().slice(0, 10);
  TutorUsage.updateOne({ user: userId, day }, { $inc: inc }, { upsert: true }).catch((err) =>
    log.error({ err }, 'tutor: usage not saved'),
  );
}

// a new audio clip was generated (cached clips cost nothing and are only counted in metrics)
function recordTts({ userId, chars, seconds, log }) {
  const costUsd = (chars * ttsPricePerM()) / 1e6;
  log.info(
    { tutor: { kind: 'tts', userId: String(userId), seconds, chars, costUsd } },
    'tutor: tts call',
  );
  metrics.tutorTts.inc({ status: 'generated' });
  metrics.tutorTtsChars.inc(chars);
  metrics.tutorTtsCost.inc(costUsd);
  saveUsage(userId, { ttsRequests: 1, ttsChars: chars, ttsCostUsd: costUsd }, log);
}

module.exports = { tutorCompletion, recordTts };
