import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { ApiService } from '~/misc/actions/request';
import { userContext } from '~/root';
import { Sidebar } from '~/components/common/layout/sidebar';
import { DictionarySearch } from '~/components/search/dictionary-search';
import { Alerts } from '~/components/common/alerts/alerts';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';

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
  nameSlug?: string | null; // the word is a Russian name with its own page on /names
  wordSlug?: string | null; // the word has its own page on /na-kitayskom
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

export {
  isChinese,
  isPinyin,
  isRussian,
  isValidWildcardPattern,
  isWildcardPattern,
  WILDCARD_CHAR,
  WILDCARD_MAX_LENGTH,
} from '~/components/search/dictionary-query';

// Landing page for the dictionary section: just the search box. Individual word entries
// live at /dictionary/{word}, which is where this redirects to once a word is submitted.
export default component$(() => {
  const { isAdmin, isModerator } = useContext(userContext);

  return (
    <>
      <Breadcrumbs items={[{ name: 'Словарь' }]} />
      <PageTitle txt={'Китайско-русский словарь'} />

      <FlexRow>
        <Sidebar noAds={true}></Sidebar>

        <MainContent>
          <Alerts />
          <div class="prose">
            <DictionarySearch>
              {(isAdmin || isModerator) && (
                <Link
                  prefetch="js"
                  href="/dictionary/add"
                  class="link link-hover link-secondary text-sm w-fit"
                >
                  + Добавить слово в словарь
                </Link>
              )}
            </DictionarySearch>
          </div>
        </MainContent>
        <Sidebar>
          <div class="card card-compact bg-base-200 mt-3">
            <div class="card-body">
              <span class="text-sm">
                Поиск:
                <br />- традиционные и упрощённые иероглифы,
                <br />- пиньинь без тонов ("nihao"), <br />- шаблон со звездочкой "*" вместо
                неизвестного иероглифа, <br />- ручной ввод мышью или на тачпаде.
              </span>
            </div>
          </div>
        </Sidebar>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Китайско-русский словарь онлайн — перевод, пиньинь, иероглифы | Chinese+',
  meta: [
    {
      name: 'description',
      content:
        'Китайско-русский словарь с анимацией написания иероглифов. Поиск по традиционным и упрощённым иероглифам, по пиньинь без тонов, по шаблону, а также ручной ввод иероглифов.',
    },
  ],
};
