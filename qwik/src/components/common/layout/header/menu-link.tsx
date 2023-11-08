import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export type MenuLinkProps = {
  href: string;
  text: string;
};

export default component$(({ href, text }: MenuLinkProps) => {
  return (
    <li>
      <Link
        href={href}
        class='my-1 hover:text-secondary active:text-secondary focus:text-secondary'
      >
        {text}
      </Link>
    </li>
  );
});
