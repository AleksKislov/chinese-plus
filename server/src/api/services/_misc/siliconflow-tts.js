// SiliconFlow text-to-speech (https://docs.siliconflow.com/en/api-reference/audio/create-speech)
// env: SILICONFLOW_API_KEY (required),
//      SILICONFLOW_API_URL   default https://api.siliconflow.com/v1 (use https://api.siliconflow.cn/v1 for a .cn account),
//      SILICONFLOW_TTS_MODEL default fishaudio/fish-speech-1.5 (or FunAudioLLM/CosyVoice2-0.5B),
//      SILICONFLOW_TTS_VOICE default anna (alex, anna, bella, benjamin, charles, claire, david, diana),
//      SILICONFLOW_TTS_SPEED default 0.75 (slower than natural, for learners)
async function synthesizeSpeech(text) {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) throw new Error('SILICONFLOW_API_KEY is not set');

  const baseUrl = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.com/v1';
  // const model = process.env.SILICONFLOW_TTS_MODEL || 'fishaudio/fish-speech-1.5';
  const model = 'FunAudioLLM/CosyVoice2-0.5B';
  const voice = process.env.SILICONFLOW_TTS_VOICE || 'anna';

  const response = await fetch(`${baseUrl}/audio/speech`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      // CosyVoice sometimes clips the last syllable; a trailing pause gives it room to finish
      input: `${text}。,.`,
      // input: '今天是 二 零 二 六 年 十月一号。..',
      voice: voice.includes(':') ? voice : `${model}:${voice}`,
      response_format: 'mp3',
      sample_rate: 44100,
      speed: Number(process.env.SILICONFLOW_TTS_SPEED) || 0.9,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`SiliconFlow TTS ${response.status}: ${await response.text()}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

module.exports = { synthesizeSpeech };
