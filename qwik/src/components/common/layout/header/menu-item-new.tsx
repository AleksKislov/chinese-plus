import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import MenuLink from './menu-link';
import type { MenuLinkProps } from './menu-link';

export type MenuItemProps = {
  links: MenuLinkProps[];
  name: string;
};

const stripTrailingSlash = (path: string) =>
  path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

export const MenuItemNew = component$(({ links, name }: MenuItemProps) => {
  const loc = useLocation();
  const pathname = stripTrailingSlash(loc.url.pathname);
  const hasActiveChild = links.some(
    (link) => stripTrailingSlash(link.href) === pathname,
  );

  return (
    <li>
      <details class="z-40">
        <summary class={hasActiveChild ? 'text-secondary font-semibold' : ''}>
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
