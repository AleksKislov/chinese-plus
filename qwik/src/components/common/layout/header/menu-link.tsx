import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import CONSTANTS from '~/misc/consts/consts';

export type MenuLinkProps = {
  href: string;
  text: string;
  curVocabSize?: number;
};

const stripTrailingSlash = (path: string) =>
  path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

export default component$(({ href, text, curVocabSize }: MenuLinkProps) => {
  const vocabSize = CONSTANTS.users.vocabSize;
  const loc = useLocation();
  const isActive =
    stripTrailingSlash(loc.url.pathname) === stripTrailingSlash(href);

  return (
    <li>
      <Link
        href={href}
        class={`my-1 hover:text-secondary active:text-secondary focus:text-secondary ${
          isActive ? 'text-secondary font-semibold' : ''
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
