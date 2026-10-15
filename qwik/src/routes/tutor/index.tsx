import { $, component$, sync$, useSignal, useTask$ } from '@builder.io/qwik';
import { isBrowser } from '@builder.io/qwik/build';
import { type DocumentHead, Link, routeLoader$, useNavigate } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { useSendTutorMessage } from '~/misc/actions/tutor/send-message';
import { PageTitle } from '~/components/common/layout/title';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { TextHeadBtns } from '~/components/common/read/text-head-btns';
import { FontSizeBtns } from '~/components/common/content-cards/content-page-card';
import { GrammarWordModals } from '~/components/grammar/grammar-word-modals';
import {
  TutorMessageBubble,
  TutorTypingBubble,
  TutorWelcomeBubble,
} from '~/components/tutor/tutor-message';
import { TutorTipsCard } from '~/components/tutor/tutor-tips-card';
import { TutorChatsCard } from '~/components/tutor/tutor-chats-card';
import { TutorAdminChatsCard } from '~/components/tutor/tutor-admin-chats-card';
import CONST_URLS from '~/misc/consts/urls';
import {
  formatLessonDate,
  OBJECT_ID_RE,
  TUTOR_LEVELS,
  TUTOR_MAX_LEN,
  TUTOR_PATH,
  type SendTutorMessageResult,
  type TutorChat,
  type TutorChatOfUser,
  type TutorMessage,
  type TutorOverview,
  tutorChatUrl,
} from '~/components/tutor/types';

// null: not logged in
export const useTutorOverview = routeLoader$(async ({ cookie }): Promise<TutorOverview | null> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return null;
  return ApiService.get('/api/tutor/chats', token, {
    chats: [],
    memory: '',
    level: 1,
    usage: { used: 0, limit: 0 },
    isAdmin: false,
  });
});

// admin: latest lessons of all users (read-only)
export const useTutorAllChats = routeLoader$(
  async ({ cookie, resolveValue }): Promise<TutorChatOfUser[]> => {
    const overview = await resolveValue(useTutorOverview);
    if (!overview?.isAdmin) return [];
    return ApiService.get('/api/tutor/all-chats', getTokenFromCookie(cookie), []);
  },
);

// ?chat=<id>
export const useTutorChat = routeLoader$(async ({ cookie, query }): Promise<TutorChat | null> => {
  const token = getTokenFromCookie(cookie);
  const chatId = query.get('chat');
  if (!token || !chatId || !OBJECT_ID_RE.test(chatId)) return null;
  return ApiService.get(`/api/tutor/chats/${chatId}`, token, null);
});

export default component$(() => {
  const overview = useTutorOverview();
  const chatData = useTutorChat();
  const allChats = useTutorAllChats();
  const sendMessage = useSendTutorMessage();
  const nav = useNavigate();

  const chatId = useSignal<string | undefined>(chatData.value?._id);
  const messages = useSignal<TutorMessage[]>(chatData.value?.messages || []);
  const chats = useSignal(overview.value?.chats || []);
  const usage = useSignal(overview.value?.usage);
  const level = useSignal(chatData.value?.level || overview.value?.level || 1);
  const draft = useSignal('');
  const error = useSignal('');

  const currentWord = useSignal<DictWord | null>(null);
  const showPinyin = useSignal(level.value <= 2);
  // from HSK 4 the teacher speaks Chinese only: translations are hidden until asked for
  const showTranslation = useSignal(level.value < 4);
  const fontSizeSig = useSignal(FontSizeBtns.md);
  const inputRef = useSignal<HTMLTextAreaElement>();

  // another chat opened (or "new chat")
  useTask$(({ track }) => {
    const chat = track(() => chatData.value);
    chatId.value = chat?._id;
    messages.value = chat?.messages || [];
    if (chat) level.value = chat.level;
    error.value = '';
  });

  // keep the last message in view
  useTask$(({ track }) => {
    track(() => messages.value.length);
    track(() => sendMessage.isRunning);
    if (isBrowser && messages.value.length) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  });

  const send = $(async () => {
    const text = draft.value.trim();
    if (!text || sendMessage.isRunning) return;
    if (text.length > TUTOR_MAX_LEN) {
      error.value = `Сообщение длиннее ${TUTOR_MAX_LEN} символов`;
      return;
    }

    const pending: TutorMessage = {
      _id: `pending-${Date.now()}`,
      role: 'user',
      text,
      date: new Date().toISOString(),
    };
    messages.value = [...messages.value, pending];
    draft.value = '';
    error.value = '';

    const { value } = await sendMessage.submit({ chatId: chatId.value, text, level: level.value });
    const result = value as SendTutorMessageResult | undefined;
    const withoutPending = messages.value.filter((m) => m._id !== pending._id);

    if (!result || 'error' in result) {
      messages.value = withoutPending;
      draft.value = text;
      error.value = result?.error || 'Учитель не смог ответить, попробуйте ещё раз';
      return;
    }

    const { chat } = result;
    messages.value = [...withoutPending, ...result.messages];
    usage.value = result.usage;
    chats.value = [chat, ...chats.value.filter((c) => c._id !== chat._id)];
    if (!chatId.value) {
      chatId.value = chat._id;
      nav(tutorChatUrl(chat._id), { replaceState: true });
    }
  });

  const pickSuggestion = $((text: string) => {
    draft.value = text;
    inputRef.value?.focus();
  });

  if (!overview.value) {
    return (
      <>
        <PageTitle txt="AI-учитель китайского" />
        <div class="card bg-base-200 max-w-2xl">
          <div class="card-body">
            <p>
              Практикуйте китайский в переписке с AI-учителем: он объяснит слова и грамматику,
              исправит ошибки и поговорит с вами на вашем уровне HSK. Каждое слово в ответах — с
              переводом и пиньинем.
            </p>
            <div class="card-actions">
              <Link href="/login" class="btn btn-primary btn-sm">
                Войти
              </Link>
              <Link href="/register" class="btn btn-outline btn-sm">
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const limitReached = Boolean(usage.value?.limit && usage.value.used >= usage.value.limit);
  // an admin reading someone else's lesson: no input (the BE rejects it anyway)
  const readOnly = Boolean(chatData.value?.readOnly);

  return (
    <>
      <PageTitle txt="AI-учитель китайского" />

      <FlexRow>
        <Sidebar noAds={true}>
          <TutorChatsCard chats={chats} currentChatId={chatId} memory={overview.value.memory} />
          <TutorTipsCard level={level.value} onPick$={pickSuggestion} />
          {allChats.value.length > 0 && (
            <TutorAdminChatsCard chats={allChats.value} currentChatId={chatId} />
          )}
        </Sidebar>

        <MainContent>
          {/* stays on screen: level, font size, pinyin and translation can be changed anytime */}
          <div class="sticky top-0 z-20 bg-base-100 flex flex-wrap items-center gap-2 py-2 mb-2 border-b border-base-300">
            <select
              class="select select-bordered select-sm"
              aria-label="Уровень HSK"
              disabled={readOnly}
              value={String(level.value)}
              onChange$={(_, el) => (level.value = Number(el.value))}
            >
              {TUTOR_LEVELS.map((lvl) => (
                <option key={lvl} value={String(lvl)} selected={lvl === level.value}>
                  {`HSK ${lvl}`}
                </option>
              ))}
            </select>
            <div class="flex-1">
              <TextHeadBtns
                showTranslation={showTranslation}
                fontSizeSig={fontSizeSig}
                showPinyin={showPinyin}
              />
            </div>
          </div>

          {chatData.value && (
            <div class="text-sm opacity-70 mb-2">
              {chatData.value.num ? `Урок ${chatData.value.num} · ` : ''}начат{' '}
              {formatLessonDate(chatData.value.createdAt)}
              {chatData.value.owner && ` · ${chatData.value.owner.name}`}
            </div>
          )}
          {readOnly && (
            <div class="alert alert-info py-2 mb-2 text-sm">
              <span>Урок другого пользователя — только чтение</span>
            </div>
          )}

          <div class="flex flex-col gap-1 min-h-[40vh]">
            {!messages.value.length && <TutorWelcomeBubble level={level.value} />}

            {messages.value.map((message) => (
              <TutorMessageBubble
                key={message._id}
                message={message}
                currentWord={currentWord}
                showPinyin={showPinyin.value}
                showTranslation={showTranslation.value}
                fontSize={fontSizeSig.value}
              />
            ))}

            {sendMessage.isRunning && <TutorTypingBubble />}
          </div>

          <div class={`sticky bottom-0 bg-base-100 pt-2 pb-3 z-20 ${readOnly ? 'hidden' : ''}`}>
            {error.value && (
              <div class="alert alert-warning py-2 mb-2 text-sm">
                <span>{error.value}</span>
              </div>
            )}
            <div class="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                class="textarea textarea-bordered textarea-primary flex-1 text-base leading-snug"
                rows={2}
                maxLength={TUTOR_MAX_LEN}
                placeholder={
                  limitReached
                    ? 'Лимит сообщений на сегодня исчерпан'
                    : 'Напишите учителю… (Enter — отправить, Shift+Enter — новая строка)'
                }
                disabled={limitReached}
                bind:value={draft}
                // Enter sends, Shift+Enter is a new line (sync$: preventDefault must run synchronously)
                onKeyDown$={[
                  sync$((ev: KeyboardEvent) => {
                    if (ev.key === 'Enter' && !ev.shiftKey && !ev.isComposing) ev.preventDefault();
                  }),
                  $((ev: KeyboardEvent) => {
                    if (ev.key === 'Enter' && !ev.shiftKey && !ev.isComposing) send();
                  }),
                ]}
              />
              <button
                type="button"
                class="btn btn-primary"
                disabled={sendMessage.isRunning || limitReached || !draft.value.trim()}
                onClick$={send}
              >
                Отправить
              </button>
            </div>
            {usage.value && (
              <div class="text-xs opacity-60 mt-1">
                Сегодня: {usage.value.used} / {usage.value.limit} сообщений
              </div>
            )}
          </div>

          <GrammarWordModals currentWord={currentWord} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'AI-учитель китайского языка — практика с переводом и пиньинем | Chinese+',
  meta: [
    {
      name: 'description',
      content:
        'Переписка с AI-учителем китайского: объяснения слов и грамматики, исправление ошибок и разговорная практика на вашем уровне HSK.',
    },
    { property: 'og:url', content: `${CONST_URLS.siteUrl}${TUTOR_PATH}` },
  ],
  links: [{ rel: 'canonical', href: `${CONST_URLS.siteUrl}${TUTOR_PATH}` }],
};
