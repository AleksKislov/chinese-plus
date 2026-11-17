import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import CONSTANTS from '~/misc/consts/consts';
import { ACTIVE_MENU_CLASS, isLinkActive } from './menu-active';

export type MenuLinkProps = {
  href: string;
  text: string;
  curVocabSize?: number;
};

export default component$(({ href, text, curVocabSize }: MenuLinkProps) => {
  const vocabSize = CONSTANTS.users.vocabSize;
  const loc = useLocation();
  const isActive = isLinkActive(loc.url.pathname, href);

  return (
    <li>
      <Link
        href={href}
        class={`my-1 hover:text-secondary active:text-secondary focus:text-secondary ${
          isActive ? ACTIVE_MENU_CLASS : ''
        }`}
        aria-current={isActive ? 'page' : undefined}
        prefetch="js"
      >
        {typeof curVocabSize === 'number' ? (
          <>
            {text}{' '}
            <div class="badge badge-xs badge-primary text-xs">
              {curVocabSize} <span class="mx-1 mb-0.5">|</span> {vocabSize}
            </div>
          </>
        ) : (
          text
        )}
      </Link>
    </li>
  );
});
