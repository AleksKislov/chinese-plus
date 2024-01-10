import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import CONSTANTS from "~/misc/consts/consts";

export type MenuLinkProps = {
  href: string;
  text: string;
  curVocabSize?: number;
};

export default component$(({ href, text, curVocabSize }: MenuLinkProps) => {
  const vocabSize = CONSTANTS.users.vocabSize;

  return (
    <li>
      <Link
        href={href}
        class='my-1 hover:text-secondary active:text-secondary focus:text-secondary'
      >
        {typeof curVocabSize === "number" ? (
          <>
            {text}{" "}
            <div class='badge badge-xs badge-primary text-xs'>
              {curVocabSize} <span class='mx-1 mb-0.5'>|</span> {vocabSize}
            </div>
          </>
        ) : (
          text
        )}
      </Link>
    </li>
  );
});
