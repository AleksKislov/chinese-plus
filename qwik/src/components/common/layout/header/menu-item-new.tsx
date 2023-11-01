import { component$ } from "@builder.io/qwik";
import MenuLink from "./menu-link";
import type { MenuLinkProps } from "./menu-link";

export type MenuItemProps = {
  links: MenuLinkProps[];
  name: string;
};

export const MenuItemNew = component$(({ links, name }: MenuItemProps) => {
  return (
    <li>
      <details class='z-40'>
        <summary>{name}</summary>
        <ul class='w-52 bg-base-200'>
          {links.map((link, ind) => (
            <MenuLink href={link.href} text={link.text} key={ind} />
          ))}
        </ul>
      </details>
    </li>
  );
});
