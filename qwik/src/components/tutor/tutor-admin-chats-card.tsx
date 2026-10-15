import { component$, type Signal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { formatLessonDate, type TutorChatOfUser, tutorChatUrl } from './types';

type TutorAdminChatsCardProps = {
  chats: TutorChatOfUser[];
  currentChatId: Signal<string | undefined>;
};

// admin only: latest lessons of all users, opened read-only
export const TutorAdminChatsCard = component$(
  ({ chats, currentChatId }: TutorAdminChatsCardProps) => {
    return (
      <div class="card bg-warning text-warning-content mt-3">
        <div class="card-body p-4">
          <p class="card-title text-base">Уроки пользователей (админ)</p>
          <p class="text-xs">Только чтение</p>
        </div>
        <div class="bg-base-100 text-base-content max-h-96 overflow-y-auto">
          {chats.map((chat) => (
            <Link
              key={chat._id}
              href={tutorChatUrl(chat._id)}
              class={`block px-4 py-2 border-b border-base-300 hover:bg-base-200 ${
                chat._id === currentChatId.value ? 'bg-base-200 font-bold' : ''
              }`}
            >
              <div class="truncate">{chat.title}</div>
              <div class="text-xs opacity-60 font-normal truncate">
                {chat.owner.name || '—'} · урок {chat.num || '?'} · HSK {chat.level} ·{' '}
                {formatLessonDate(chat.createdAt)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  },
);
