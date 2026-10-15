import { component$, type Signal, useSignal } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city';
import { useDeleteTutorChat } from '~/misc/actions/tutor/delete-chat';
import { useClearTutorMemory } from '~/misc/actions/tutor/clear-memory';
import { formatLessonDate, TUTOR_PATH, type TutorChatItem, tutorChatUrl } from './types';
import { xMarkSvg } from '../common/media/svg';

type TutorChatsCardProps = {
  chats: Signal<TutorChatItem[]>;
  currentChatId: Signal<string | undefined>;
  memory: string;
};

export const TutorChatsCard = component$(
  ({ chats, currentChatId, memory }: TutorChatsCardProps) => {
    const nav = useNavigate();
    const deleteChat = useDeleteTutorChat();
    const clearMemory = useClearTutorMemory();
    const memoryText = useSignal(memory);

    return (
      <div class="card bg-primary text-primary-content">
        <div class="card-body p-4">
          <p class="card-title">Мои уроки</p>
          <button type="button" class="btn btn-sm btn-secondary" onClick$={() => nav(TUTOR_PATH)}>
            + Новый урок
          </button>
        </div>

        {chats.value.length > 0 && (
          <div class="bg-base-100 text-base-content max-h-96 overflow-y-auto">
            {chats.value.map((chat) => (
              <div key={chat._id} class="flex items-stretch border-b border-base-300">
                <Link
                  href={tutorChatUrl(chat._id)}
                  class={`flex-1 min-w-0 px-4 py-2 hover:bg-base-200 ${
                    chat._id === currentChatId.value ? 'bg-base-200 font-bold' : ''
                  }`}
                >
                  <div class="truncate">
                    {chat.num && <span class="opacity-60 mr-1">{chat.num}.</span>}
                    {chat.title}
                  </div>
                  <div class="text-xs opacity-60 font-normal">
                    {formatLessonDate(chat.createdAt)}
                  </div>
                </Link>
                {/* attached to the row like the search button in the dictionary */}
                <button
                  type="button"
                  class="btn btn-square rounded-none h-auto min-h-0"
                  aria-label="Удалить урок"
                  disabled={deleteChat.isRunning}
                  onClick$={async () => {
                    if (!confirm(`Удалить урок «${chat.title}»?`)) return;
                    const { value } = await deleteChat.submit({ chatId: chat._id });
                    if (value?.status !== 'done') return;
                    chats.value = chats.value.filter((c) => c._id !== chat._id);
                    if (chat._id === currentChatId.value) nav(TUTOR_PATH);
                  }}
                >
                  {xMarkSvg}
                </button>
              </div>
            ))}
          </div>
        )}

        <div class="collapse collapse-arrow bg-base-100 text-base-content rounded-t-none">
          <input type="checkbox" aria-label="Что помнит учитель" />
          <div class="collapse-title text-sm font-bold">Что помнит учитель</div>
          <div class="collapse-content text-sm">
            {memoryText.value ? (
              <>
                <p class="whitespace-pre-wrap">{memoryText.value}</p>
                <button
                  type="button"
                  class="btn btn-xs btn-outline btn-error mt-2"
                  disabled={clearMemory.isRunning}
                  onClick$={async () => {
                    if (!confirm('Учитель забудет всё, что знает о вас. Продолжить?')) return;
                    const { value } = await clearMemory.submit();
                    if (value?.status === 'done') memoryText.value = '';
                  }}
                >
                  Очистить память
                </button>
              </>
            ) : (
              <p class="opacity-70">
                Пока ничего. После нескольких сообщений учитель запомнит ваш уровень, интересы и
                частые ошибки.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
);
