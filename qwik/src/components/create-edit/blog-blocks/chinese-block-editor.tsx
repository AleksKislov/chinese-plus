import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { type BlogChineseBlock } from '~/misc/helpers/content';
import { parseTextWords } from '~/misc/helpers/content';
import { useSegmentAndGetTooltips } from '~/routes/(content)/create/text';
import { getWordsForTooltips } from '~/routes/read/texts/[id]';
import { Paragraph } from '~/components/read/paragraph';
import { FontSizeBtns } from '~/components/common/content-cards/content-page-card';

export const ChineseBlockEditor = component$(({ block }: { block: BlogChineseBlock }) => {
  const segmentAction = useSegmentAndGetTooltips();
  const rawText = useSignal(block.words.join(''));
  const tooltipTxt = useSignal<(string | DictWord)[][]>([]);
  const currentWord = useSignal<DictWord | null>(null);

  useTask$(async () => {
    if (!block.words.length) return;
    const dbWords = await getWordsForTooltips(block.words, true);
    tooltipTxt.value = parseTextWords(block.words, dbWords);
  });

  useTask$(({ track }) => {
    const res = track(() => segmentAction.value);
    if (!res) return;
    block.words = res.allwords;
    tooltipTxt.value = res.tooltipTxt;
  });

  return (
    <div>
      <div class="label">
        <span class="label-text">Китайский текст (с подсказками по словам)</span>
      </div>
      <textarea
        class="textarea textarea-bordered w-full"
        placeholder="汉字..."
        bind:value={rawText}
      ></textarea>
      <button
        type="button"
        class="btn btn-sm btn-outline mt-1"
        disabled={!rawText.value.trim() || segmentAction.isRunning}
        onClick$={() => segmentAction.submit({ txt: rawText.value.trim() })}
      >
        Сегментировать
      </button>

      {tooltipTxt.value.length > 0 && (
        <div class="mt-2">
          {tooltipTxt.value.map((parag, i) => (
            <Paragraph
              key={i}
              ind={i}
              fontSize={FontSizeBtns.md}
              tooltipedParag={parag}
              translation={''}
              strLen={0}
              currentWord={currentWord}
              showTranslation={false}
              forEditing={true}
              hideParagNum={true}
            />
          ))}
        </div>
      )}
    </div>
  );
});
