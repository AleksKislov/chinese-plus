import { component$, useSignal } from '@builder.io/qwik';
import MenuLink from './menu-link';
import type { MenuLinkProps } from './menu-link';
import { dropdownArrowBottom } from '../../media/svg';

export type MenuItemProps = {
  links: MenuLinkProps[];
  name: string;
};

export const MenuItem = component$(({ links, name }: MenuItemProps) => {
  const isOpen = useSignal(false);

  return (
    <li
      class="dropdown dropdown-hover hover:text-secondary"
      onMouseEnter$={() => (isOpen.value = true)}
      onMouseLeave$={() => (isOpen.value = false)}
    >
      <label
        tabIndex={0}
        class="my-1 hover:text-secondary"
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
