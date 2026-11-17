import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import MenuLink from './menu-link';
import type { MenuLinkProps } from './menu-link';
import { ACTIVE_MENU_CLASS, isGroupActive } from './menu-active';

export type MenuItemProps = {
  links: MenuLinkProps[];
  name: string;
};

export const MenuItemNew = component$(({ links, name }: MenuItemProps) => {
  const loc = useLocation();
  const hasActiveChild = isGroupActive(
    loc.url.pathname,
    links.map((link) => link.href),
  );

  return (
    <li>
      <details class="z-40">
        <summary class={hasActiveChild ? ACTIVE_MENU_CLASS : ''}>
          {name}
        </summary>
        <ul class="w-52 bg-base-200">
          {links.map((link, ind) => (
            <MenuLink href={link.href} text={link.text} key={ind} />
          ))}
        </ul>
      </details>
    </li>
  );
});
