import { component$, useSignal } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import MenuLink from './menu-link';
import type { MenuLinkProps } from './menu-link';
import { dropdownArrowBottom } from '../../media/svg';

export type MenuItemProps = {
  links: MenuLinkProps[];
  name: string;
};

const stripTrailingSlash = (path: string) =>
  path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

export const MenuItem = component$(({ links, name }: MenuItemProps) => {
  const isOpen = useSignal(false);
  const loc = useLocation();
  const pathname = stripTrailingSlash(loc.url.pathname);
  const hasActiveChild = links.some(
    (link) => stripTrailingSlash(link.href) === pathname,
  );

  return (
    <li
      class="dropdown dropdown-hover hover:text-secondary"
      onMouseEnter$={() => (isOpen.value = true)}
      onMouseLeave$={() => (isOpen.value = false)}
    >
      <label
        tabIndex={0}
        class={`my-1 hover:text-secondary ${
          hasActiveChild ? 'text-secondary font-semibold' : ''
        }`}
        onClick$={() => (isOpen.value = !isOpen.value)}
      >
        {name}
        {dropdownArrowBottom}
      </label>
      <ul
        class={`dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-64 text-base-content ${
          isOpen.value ? '' : 'hidden'
        }`}
        onClick$={() => (isOpen.value = false)}
      >
        {links.map((link, ind) => (
          <MenuLink href={link.href} text={link.text} key={ind} />
        ))}
      </ul>
    </li>
  );
});
