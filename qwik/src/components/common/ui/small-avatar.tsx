import { component$ } from '@builder.io/qwik';
import { AvatarImg } from '../media/avatar-img';
import { solidStarSvg } from '../media/svg';

type SmallAvatarProps = {
  userName: string;
  newAvatar?: NewAvatar;
  role?: UserRole;
};

const ROLE_BADGES: Partial<Record<UserRole, { title: string; color: string; tooltip: string }>> = {
  admin: { title: 'Админ', color: 'text-error', tooltip: 'tooltip-error' },
  moderator: { title: 'Модератор', color: 'text-warning', tooltip: 'tooltip-warning' },
};

export const SmallAvatar = component$(({ userName, newAvatar, role }: SmallAvatarProps) => {
  const badge = role && ROLE_BADGES[role];

  return (
    // daisyUI's `.avatar > div` clips its content, so only the inner circle clips the image
    // and the role badge stays fully visible on top of it
    <div class="relative w-12 h-12 !overflow-visible">
      <div class="w-12 h-12 overflow-hidden rounded-full ring-1 ring-neutral ring-offset-base-100 ring-offset-1">
        {userName && <AvatarImg userName={userName} newAvatar={newAvatar} size={48} />}
      </div>
      {badge && (
        // `role-badge` lets a parent tooltip hide itself while this one is shown
        <span class="role-badge absolute -bottom-1.5 -right-1.5 z-10">
          <span class={`tooltip tooltip-bottom ${badge.tooltip}`} data-tip={badge.title}>
            <span
              class={`flex rounded-full bg-base-100 p-0.5 ring-1 ring-neutral ${badge.color}`}
              aria-label={badge.title}
            >
              {solidStarSvg}
            </span>
          </span>
        </span>
      )}
    </div>
  );
});
