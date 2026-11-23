// Qwen TTS on Alibaba Cloud Model Studio (DashScope), used for the tutor's Chinese dialects
// (https://www.alibabacloud.com/help/en/model-studio/qwen-tts-api).
// env: DASHSCOPE_API_KEY (required),
//      DASHSCOPE_API_URL default https://dashscope-intl.aliyuncs.com/api/v1 (Singapore; the key
//                        must be from the same region),
//      QWEN_TTS_MODEL    default qwen3-tts-flash
// The voice decides the dialect (TUTOR_DIALECTS in tutor/consts.js). No speed setting.
// Errors carry the upstream response: log them, never send them to the client.
const QWEN_MAX_CHARS = 600; // input.text limit of the API

const qwenTtsConfig = ({ voice } = {}) => ({
  model: process.env.QWEN_TTS_MODEL || 'qwen3-tts-flash',
  voice,
});

// Chinese text -> { audio: Buffer (wav), chars: billable characters }
async function synthesizeQwenSpeech(text, options) {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) throw new Error('DASHSCOPE_API_KEY is not set');
  if (text.length > QWEN_MAX_CHARS) throw new Error(`Qwen TTS: text longer than ${QWEN_MAX_CHARS}`);

  const baseUrl = process.env.DASHSCOPE_API_URL || 'https://dashscope-intl.aliyuncs.com/api/v1';
  const { model, voice } = qwenTtsConfig(options);

  const response = await fetch(`${baseUrl}/services/aigc/multimodal-generation/generation`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, input: { text, voice, language_type: 'Chinese' } }),
    signal: AbortSignal.timeout(30_000),
  });
  const data = await response.json().catch(() => null);
  const url = data?.output?.audio?.url;
  if (!response.ok || !url) {
    throw new Error(
      `Qwen TTS ${response.status}: ${JSON.stringify(
        data ? { code: data.code, message: data.message } : null,
      ).slice(0, 300)}`,
    );
  }

  // the clip is returned as a link valid for 24h: download it now
  const file = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!file.ok) throw new Error(`Qwen TTS audio download ${file.status}`);
  return {
    audio: Buffer.from(await file.arrayBuffer()),
    chars: data.usage?.characters || text.length,
  };
}

module.exports = { synthesizeQwenSpeech, qwenTtsConfig };
