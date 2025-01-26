import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { markUpRuText } from '~/misc/helpers/translation';
import { type RuWord } from '~/routes/search';

type SearchRuResultType = {
  ruWord: RuWord;
  showExamples: boolean;
};

export const SearchRuResult = component$(({ ruWord, showExamples }: SearchRuResultType) => {
  const { word } = ruWord;

  const isError = !ruWord.word && ruWord.other?.length;
  return (
    <>
      {isError ? (
        <>
          <span class="text-error">Ничего не найдено. Возможно, вы искали:</span>
          <ul class="list-none">
            {ruWord.other.map((x, ind) => (
              <li key={ind}>
                {x.canBeFound ? (
                  <Link
                    href={'/search?q=' + x.value}
                    class="link link-hover link-secondary font-bold"
                  >
                    {x.value}
                  </Link>
                ) : (
                  x.value
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div dangerouslySetInnerHTML={markUpRuText(word?.cn || '', showExamples)}></div>
        </>
      )}
    </>
  );
});
