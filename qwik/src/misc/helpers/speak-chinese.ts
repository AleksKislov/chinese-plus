import CONST_URLS from '~/misc/consts/urls';

// Pronunciation of HSK words: the recorded mp3 when there is one, else the browser's own voice
// (Web Speech API) - the fallback for words that have no recording yet. Browser-only, no request
// to our API. Browsers without a Chinese system voice (e.g. Chrome on some desktops) use their
// online zh-CN voice; with none at all the result is whatever the default voice makes of it.
//
// warmChinese (on hover / touch of a play button) starts loading the mp3 and the voices, so the
// click plays at once instead of waiting for the download.

const isChineseVoice = (v: SpeechSynthesisVoice) => /^(zh|cmn)/i.test(v.lang);
// mainland Mandarin first (zh-CN, cmn-Hans-CN), then any Chinese voice (zh-TW, zh-HK)
const pickVoice = (voices: SpeechSynthesisVoice[]) =>
  voices.find((v) => /^(zh[-_]CN|cmn[-_]Hans)/i.test(v.lang)) || voices.find(isChineseVoice);

const hasSpeech = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export const speakChinese = (text: string) => {
  if (!hasSpeech() || !text) return;
  const synth = window.speechSynthesis;
  synth.cancel(); // a new click replaces what is still being spoken
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.85; // a bit slower than the default: single words for learners
  // getVoices() can be empty until the browser loads them; lang alone still picks a voice
  const voice = pickVoice(synth.getVoices());
  if (voice) utterance.voice = voice;
  synth.speak(utterance);
};

// mp3s already requested on this page, by url (a few dozen at most: one per hovered button)
const audioCache = new Map<string, HTMLAudioElement>();
const MAX_CACHED = 50;

const getAudio = (url: string) => {
  let audio = audioCache.get(url);
  if (!audio) {
    if (audioCache.size >= MAX_CACHED) audioCache.delete(audioCache.keys().next().value!);
    audio = new Audio(url);
    audio.preload = 'auto';
    audio.load(); // iOS ignores the preload hint
    audioCache.set(url, audio);
  }
  return audio;
};

const audioUrl = (audioPath: string) => `${CONST_URLS.myAudioURL}${audioPath}`;

/** Starts loading what playChinese will need: the mp3, or the browser's voices. */
export const warmChinese = (audioPath: string | null | undefined) => {
  if (audioPath) getAudio(audioUrl(audioPath));
  else if (hasSpeech()) window.speechSynthesis.getVoices();
};

/** The recorded mp3 (path under CONST_URLS.myAudioURL) when there is one, else the browser voice. */
export const playChinese = (audioPath: string | null | undefined, text: string) => {
  if (!audioPath) return speakChinese(text);
  const audio = getAudio(audioUrl(audioPath));
  audio.currentTime = 0;
  audio.play().catch(() => speakChinese(text));
};
