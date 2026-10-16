// MiniMax text-to-speech (https://platform.minimax.io/docs/api-reference/speech-t2a-http)
// env: MINIMAX_API_KEY (required),
//      MINIMAX_API_URL   default https://api.minimax.io/v1,
//      MINIMAX_TTS_MODEL default speech-2.8-turbo (or speech-2.8-hd),
//      MINIMAX_TTS_VOICE default Chinese (Mandarin)_Lyrical_Voice (list: mm-test.sh voices),
//      MINIMAX_TTS_SPEED default 0.9 (a bit slower than natural, for learners)
// voice / speed can be overridden per call (the tutor's per-user settings).
// Errors carry the upstream response: log them, never send them to the client.
const ttsConfig = ({ voice, speed } = {}) => ({
  model: process.env.MINIMAX_TTS_MODEL || 'speech-2.8-turbo',
  voice: voice || process.env.MINIMAX_TTS_VOICE || 'Chinese (Mandarin)_Lyrical_Voice',
  speed: speed || Number(process.env.MINIMAX_TTS_SPEED) || 0.9,
});

// Chinese text -> { mp3: Buffer, chars: billable characters }
async function synthesizeSpeech(text, options) {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) throw new Error('MINIMAX_API_KEY is not set');

  const baseUrl = process.env.MINIMAX_API_URL || 'https://api.minimax.io/v1';
  const { model, voice, speed } = ttsConfig(options);

  const response = await fetch(`${baseUrl}/t2a_v2`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      text,
      stream: false,
      language_boost: 'Chinese',
      voice_setting: { voice_id: voice, speed, vol: 1, pitch: 0 },
      audio_setting: { sample_rate: 32000, bitrate: 128000, format: 'mp3', channel: 1 },
    }),
    signal: AbortSignal.timeout(30_000),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.base_resp?.status_code !== 0 || !data?.data?.audio) {
    throw new Error(
      `MiniMax TTS ${response.status}: ${JSON.stringify(data?.base_resp || data).slice(0, 300)}`,
    );
  }
  return {
    mp3: Buffer.from(data.data.audio, 'hex'),
    chars: data.extra_info?.usage_characters || text.length,
  };
}

module.exports = { synthesizeSpeech, ttsConfig };
