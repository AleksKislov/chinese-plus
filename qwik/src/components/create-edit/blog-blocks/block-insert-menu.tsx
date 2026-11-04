import { component$, type QRL } from '@builder.io/qwik';
import { plusSvg } from '~/components/common/media/svg';

export type InsertableBlockType = 'carousel' | 'video' | 'chinese';

type BlockInsertMenuProps = {
  onInsert$: QRL<(type: InsertableBlockType) => void>;
};

export const BlockInsertMenu = component$(({ onInsert$ }: BlockInsertMenuProps) => {
  return (
    <div class="dropdown dropdown-hover">
      <div tabIndex={0} role="button" class="btn btn-xs btn-ghost btn-circle">
        {plusSvg}
      </div>
      <ul
        tabIndex={0}
        class="dropdown-content z-10 menu p-2 shadow bg-base-200 rounded-box w-56 text-base-content"
      >
        <li>
          <button type="button" onClick$={() => onInsert$('carousel')}>
            🖼️ Картинки
          </button>
        </li>
        <li>
          <button type="button" onClick$={() => onInsert$('video')}>
            ▶️ Видео
          </button>
        </li>
        <li>
          <button type="button" onClick$={() => onInsert$('chinese')}>
            中 Китайский текст
          </button>
        </li>
      </ul>
    </div>
  );
});
