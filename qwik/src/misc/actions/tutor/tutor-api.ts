import { server$, z } from '@builder.io/qwik-city';
import { ApiService } from '../request';
import { getTokenFromCookie } from '../auth';
import {
  OBJECT_ID_RE,
  type SendTutorMessageResult,
  TUTOR_MAX_LEN,
  type TutorTextSuggestion,
  type TutorTts,
} from '~/components/tutor/types';

// AI tutor calls made after user actions. server$ instead of globalAction$: it also runs on the
// FE server (PUBLIC_BASE_URL is not reachable from the browser in production), but it does NOT
// re-run the page's route loaders, which after every click reloaded the whole lesson.
// Plain fetch instead of ApiService, so the BE message (daily limits etc.) reaches the user.

type Failure = { error: string };
// path in the audio bucket; data = base64 mp3 when the clip was just generated (play it at once,
// it is still being uploaded)
export type TutorAudioResult = { audio: string; data?: string };

const LOGIN = 'Войдите, чтобы заниматься с учителем';

async function tutorFetch<T>(
  token: string,
  method: 'GET' | 'POST' | 'PUT',
  path: string,
  body: object | null,
  failed: string,
): Promise<T | Failure> {
  try {
    const res = await fetch(`${ApiService.baseUrl}/api/tutor${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      ...(body && { body: JSON.stringify(body) }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) return { error: data?.msg || failed };
    return data as T;
  } catch (err) {
    console.log(`[tutor] ${method} ${path} failed`, err);
    return { error: failed };
  }
}

const objectId = z.string().regex(OBJECT_ID_RE);
const ttsSchema = z.object({
  voice: z.string().regex(/^[a-zA-Z]{1,20}$/), // checked against TTS_VOICES on the BE
  speed: z.enum(['novice', 'normal', 'advanced']),
});

const sendSchema = z.object({
  chatId: objectId.optional(),
  // empty only to start a 'vocab' / 'text' lesson: the teacher speaks first
  text: z.string().trim().max(TUTOR_MAX_LEN),
  level: z.number().int().min(1).max(6),
  lesson: z
    .object({
      kind: z.enum(['chat', 'vocab', 'text']),
      textId: objectId.optional(),
      textUrl: z.string().max(500).optional(), // only the text id is taken from it, on the BE
    })
    .optional(),
});

export const sendTutorMessage = server$(async function (
  params: z.infer<typeof sendSchema>,
): Promise<SendTutorMessageResult> {
  const parsed = sendSchema.safeParse(params);
  if (!parsed.success) return { error: 'Неверное сообщение' };
  const token = getTokenFromCookie(this.cookie);
  if (!token) return { error: LOGIN };
  return tutorFetch(
    token,
    'POST',
    '/messages',
    parsed.data,
    'Учитель не смог ответить, попробуйте ещё раз',
  );
});

const audioSchema = z.object({
  chatId: objectId,
  messageId: objectId,
  block: z.number().int().min(0).max(29),
});

// audio of a Chinese block of a tutor reply (generated on the first request)
export const fetchTutorAudio = server$(async function (
  params: z.infer<typeof audioSchema>,
): Promise<TutorAudioResult | Failure> {
  const parsed = audioSchema.safeParse(params);
  if (!parsed.success) return { error: 'Аудио не найдено' };
  const token = getTokenFromCookie(this.cookie);
  if (!token) return { error: LOGIN };
  return tutorFetch(token, 'POST', '/tts', parsed.data, 'Не удалось озвучить');
});

// fixed sample phrase with these settings, to try a voice
export const fetchTutorSample = server$(async function (
  params: TutorTts,
): Promise<TutorAudioResult | Failure> {
  const parsed = ttsSchema.safeParse(params);
  if (!parsed.success) return { error: 'Неизвестный голос' };
  const token = getTokenFromCookie(this.cookie);
  if (!token) return { error: LOGIN };
  return tutorFetch(token, 'POST', '/tts/sample', parsed.data, 'Не удалось озвучить');
});

export const saveTutorTts = server$(async function (
  params: TutorTts,
): Promise<{ tts: TutorTts } | Failure> {
  const parsed = ttsSchema.safeParse(params);
  if (!parsed.success) return { error: 'Неизвестный голос' };
  const token = getTokenFromCookie(this.cookie);
  if (!token) return { error: LOGIN };
  return tutorFetch(token, 'PUT', '/settings', parsed.data, 'Не удалось сохранить');
});

// remembered "Аудирование" toggle
export const saveTutorListenMode = server$(async function (
  listenMode: boolean,
): Promise<{ listenMode: boolean } | Failure> {
  if (typeof listenMode !== 'boolean') return { error: 'Неверное значение' };
  const token = getTokenFromCookie(this.cookie);
  if (!token) return { error: LOGIN };
  return tutorFetch(token, 'PUT', '/listen-mode', { listenMode }, 'Не удалось сохранить');
});

// "Обсудить текст": bookmarked texts first, then random texts of the level
export const fetchTutorTexts = server$(async function (
  level: number,
): Promise<TutorTextSuggestion[] | Failure> {
  if (!Number.isInteger(level) || level < 1 || level > 6) return { error: 'Неверный уровень' };
  const token = getTokenFromCookie(this.cookie);
  if (!token) return { error: LOGIN };
  return tutorFetch(token, 'GET', `/texts?level=${level}`, null, 'Не удалось загрузить тексты');
});
