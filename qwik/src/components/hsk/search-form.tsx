import {
  $,
  component$,
  useOnDocument,
  useSignal,
  type Signal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { ApiService } from '~/misc/actions/request';
import { type OldHskWordType } from '~/routes/hsk/2/table';
import { type NewHskWordType } from '~/routes/hsk/3/table';
import { searchSvg } from '../common/media/svg';
import { globalAction$, z, zod$ } from '@builder.io/qwik-city';

type HskSearchFormProps = {
  hskWords: Signal<OldHskWordType[] | NewHskWordType[]>;
  isOldHsk: boolean;
};

export const useGetHskWords = globalAction$(
  async (params): Promise<OldHskWordType[] | NewHskWordType[]> => {
    const { path, chinese } = params;
    if (!chinese) return [];
    return ApiService.post(path, { chinese }, undefined, []);
  },
  zod$({
    path: z.string(),
    chinese: z.string(),
  }),
);

export const HskSearchForm = component$(({ hskWords, isOldHsk }: HskSearchFormProps) => {
  const chineseWord = useSignal('');

  const getInput = $((e: InputEvent) => {
    const trgt = e.target as HTMLInputElement;
    chineseWord.value = trgt.value;
  });

  const path = `/api/${isOldHsk ? 'lexicon' : 'newhskwords'}/search`;

  const getHskWords = useGetHskWords();

  useVisibleTask$(({ track }) => {
    const res = track(() => getHskWords.value);
    if (!res) return;
    hskWords.value = res;
  });

  useOnDocument(
    'keydown',
    $((e) => {
      if ((e as KeyboardEvent).key === 'Enter')
        getHskWords.submit({ path, chinese: chineseWord.value });
    }),
  );

  return (
    <div class="form-control text-base-content">
      <div class="input-group">
        <input
          type="text"
          placeholder="汉字..."
          class="input input-bordered input input-primary w-full"
          onInput$={getInput}
        />
        <button
          class="btn btn-square"
          onClick$={() => {
            getHskWords.submit({ path, chinese: chineseWord.value });
          }}
        >
          {searchSvg}
        </button>
      </div>
    </div>
  );
});
