import { $, component$, useSignal, useTask$ } from '@builder.io/qwik';
import { countZnChars } from '~/misc/helpers/content';
import { FlexRow } from '../common/layout/flex-row';
import { Paragraph } from '../read/paragraph';
import { FontSizeBtns } from '../common/content-cards/content-page-card';
import { useNavigate } from '@builder.io/qwik-city';
import { useSegmentAndGetTooltips } from '~/routes/(content)/create/text';
import { useEditPageText } from '~/routes/(content)/edit/book-page/[id]';
import { SEGMENTER_ENUM } from '~/routes/search';

export type BookOrigPageContent = {
  _id: ObjectId;
  length: number;
  translation: string[];
  origintext: string[];
  chinese_arr: string[];
};

type TextPreprocessFormProps = {
  store: Partial<BookOrigPageContent>;
};

export const EditBookPagePreprocessForm = component$(({ store }: TextPreprocessFormProps) => {
  const segmentAction = useSegmentAndGetTooltips();
  const editTextAction = useEditPageText();
  const canPublish = useSignal(false);
  const nav = useNavigate();

  // const alertsState = useContext(alertsContext);
  const chineseText = useSignal((store.origintext || []).join('\n\n'));
  const origTranslation = useSignal((store.translation || []).join('\n\n'));
  const tooltipTxt = useSignal<(string | DictWord)[][] | string[]>([]);
  const currentWord = useSignal<DictWord | null>(null);

  useTask$(({ track }) => {
    track(() => chineseText.value?.length);
    canPublish.value = false;
  });

  useTask$(({ track }) => {
    track(() => origTranslation.value?.length);
    canPublish.value = false;
  });

  useTask$(({ track }) => {
    track(() => editTextAction.value);

    if (editTextAction.value?.status === 'done') {
      nav(`/read/books`);
    }
  });

  useTask$(({ track }) => {
    const val = track(() => segmentAction.value);
    if (!val) return;
    store.chinese_arr = val.allwords;
    tooltipTxt.value = val.tooltipTxt;
    canPublish.value = true;
  });

  const preprocessForm = $(() => {
    const translationParagraphs = (origTranslation.value || '')
      .trim()
      .split('\n')
      .map((parag) => parag.trim())
      .filter((parag) => Boolean(parag));

    const trimmedChineseTxt = (chineseText.value || '').trim().replace(/\n\s*\n/g, '\n');
    const chineseTextParagraphs = trimmedChineseTxt
      .split('\n')
      .map((parag) => parag.trim())
      .filter((parag) => Boolean(parag));

    origTranslation.value = translationParagraphs.join('\n\n');
    chineseText.value = chineseTextParagraphs.join('\n\n');

    store.length = countZnChars(chineseText.value);
    store.origintext = chineseTextParagraphs;
    store.translation = translationParagraphs;

    segmentAction.submit({ txt: trimmedChineseTxt, version: SEGMENTER_ENUM.v3 });
  });

  const editText = $(async () => {
    const { _id, origintext, translation } = store;

    editTextAction.submit({
      pageId: _id,
      origintext,
      translation,
    });
  });

  const handleKeyDown = $((e: MouseEvent) => {
    const trgt = e.target as HTMLTextAreaElement;
    trgt.style.height = trgt.scrollHeight + 'px';
  });

  return (
    <>
      <FlexRow>
        {/* ввод кит. текста */}
        <div class="w-full basis-1/2 mt-3 ml-7 mr-3">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Китайский текст</span>
            </label>
            <textarea
              onClick$={handleKeyDown}
              class="textarea textarea-bordered h-24"
              placeholder="汉字..."
              bind:value={chineseText}
            ></textarea>
          </div>
        </div>
        {/* ввод рус. перевода */}
        <div class="w-full basis-1/2 mt-3 mr-7 ml-3">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Русский перевод</span>
            </label>
            <textarea
              onClick$={handleKeyDown}
              class="textarea textarea-bordered h-24"
              placeholder="Ваш перевод..."
              bind:value={origTranslation}
            ></textarea>
          </div>
        </div>
      </FlexRow>

      <FlexRow>
        <div class="mt-3 ml-7">
          <button
            class="btn btn-primary w-48"
            disabled={Boolean(!(chineseText.value.length && origTranslation.value.length))}
            onClick$={preprocessForm}
          >
            Предобработать
          </button>
        </div>
      </FlexRow>

      <div class="mr-7 ml-7">
        {tooltipTxt.value.length > 0 &&
          tooltipTxt.value.map((parag, i) => (
            <Paragraph
              key={i}
              ind={i}
              fontSize={FontSizeBtns.md}
              tooltipedParag={parag as (string | DictWord)[]}
              translation={store.translation?.[i] || ''}
              strLen={countZnChars(store.origintext?.[i] || '')}
              currentWord={currentWord}
              showTranslation={true}
              forEditing={true}
            />
          ))}
      </div>

      <FlexRow>
        <div class="mt-3 ml-7">
          <button
            class="btn btn-primary w-48"
            disabled={!canPublish.value || editTextAction.isRunning}
            onClick$={editText}
          >
            Отредактировать
          </button>
        </div>
      </FlexRow>
    </>
  );
});
