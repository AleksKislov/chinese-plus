import { $, component$, useContext, useOnDocument, useSignal } from '@builder.io/qwik';
import { type DocumentHead, Link, useNavigate } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { searchSvg } from '~/components/common/media/svg';
import { ApiService } from '~/misc/actions/request';
import { alertsContext } from '~/root';
import { Sidebar } from '~/components/common/layout/sidebar';

export const HanziWriterSettings = {
  width: 60,
  height: 60,
  padding: 0,
  showOutline: true,
  radicalColor: '#168F16',
  delayBetweenLoops: 3000,
};

export type SEGMENTER_VERSION = 'v1' | 'v2' | 'v3';

export const SEGMENTER_ENUM = {
  v1: 'v1', // from start default
  v2: 'v2', // from end
  v3: 'v3', // nodejieba
};

export type RuWord = {
  word: {
    _id: ObjectId;
    ru: string;
    cn: string;
  } | null;
  other: { value: string; canBeFound: boolean }[];
};

export const segmenter = async (
  text: string,
  version: SEGMENTER_VERSION = 'v1',
): Promise<string[]> => {
  return ApiService.post('/api/dictionary/segmenter?version=' + version, { text }, undefined, []);
};

export const getChineseWordsArr = async (input: string): Promise<string[]> => {
  const arr = await segmenter(input);
  return arr.filter((word) => /\p{Script=Han}/u.test(word));
};

export const isRussian = (str: string): boolean => {
  return /[Ѐ-ӿ]/.test(str);
};

export const isChinese = (str: string): boolean => {
  return /\p{Script=Han}/u.test(str);
};

// Landing page for the dictionary section: just the search box. Individual word entries
// live at /dictionary/{word}, which is where this redirects to once a word is submitted.
export default component$(() => {
  const nav = useNavigate();
  const input = useSignal('');
  const alertsState = useContext(alertsContext);

  const goToWord = $(() => {
    const inputStr = input.value.trim();
    if (!inputStr) return;

    if (isChinese(inputStr) || isRussian(inputStr)) {
      nav('/dictionary/' + encodeURIComponent(inputStr));
    } else {
      alertsState.push({
        bg: 'alert-error',
        text: 'Поиск только по китайским или русским словам',
      });
    }
  });

  useOnDocument(
    'keydown',
    $((e) => {
      if ((e as KeyboardEvent).key === 'Enter') goToWord();
    }),
  );

  return (
    <>
      <PageTitle txt={'Китайско-русский словарь'} />

      <FlexRow>
        <Sidebar>
          <div class="card card-compact bg-base-200">
            <div class="card-body">
              <span>
                База слов взята с{' '}
                <Link
                  class="link link-hover link-secondary font-bold"
                  href={'https://bkrs.info/'}
                  target="_blank"
                >
                  БКРС
                </Link>
              </span>
            </div>
          </div>
        </Sidebar>
        <MainContent>
          <div class="prose">
            <div class="form-control">
              <div class="input-group w-full">
                <input
                  type="text"
                  placeholder="汉字…"
                  class="input input-bordered w-full"
                  value={input.value}
                  onInput$={(e) => (input.value = (e.target as HTMLInputElement)?.value || '')}
                />
                <button class="btn btn-square" onClick$={goToWord}>
                  {searchSvg}
                </button>
              </div>
            </div>
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Онлайн-словарь китайского языка',
  meta: [
    {
      name: 'description',
      content: 'Перевод китайских слов и иероглифов на русский язык с анимацией написания.',
    },
  ],
};
