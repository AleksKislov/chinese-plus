import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { type RequestEvent, routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { Alerts } from '~/components/common/alerts/alerts';
import { NewHskTable } from '~/components/hsk/new-hsk-table';
import { ApiService } from '~/misc/actions/request';
import { PageTitle } from '~/components/common/layout/title';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { type NewHskWordType } from '~/routes/hsk/3/table/[...lvl]';
import { PrivateHskCard } from '~/components/me/hsk/private-hsk-card';
import { TypingGame } from '~/components/games/typing-game';
import { CalligraphyGame } from '~/components/games/calligraphy-game';
import { CsvCard } from '~/components/hsk/csv-card';
import { WORD_LEVELS } from '~/components/hsk/words-seo';
import { parseRussian } from '~/misc/helpers/translation';
import { type TestWord } from '~/routes/hsk/2/tests/[...lvl]';

// a word of the current HSK 3.0 list (`_id` is its hskword2025 _id) + when it was added
export type UserHsk3WordType = NewHskWordType & { date: string };

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export const useGetUserHsk3Words = routeLoader$(async ({ cookie }): Promise<UserHsk3WordType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return await ApiService.get('/api/userhsk3words', token, []);
});

const toTestWords = (words: UserHsk3WordType[]): TestWord[] =>
  words.map(({ cn, lvl, py, id, ru, audio }) => ({
    id,
    audio,
    level: lvl,
    chinese: cn,
    pinyin: py,
    translation: parseRussian(ru, false),
  }));

export default component$(() => {
  const userHskWords = useGetUserHsk3Words();
  const lvlSignal = useSignal('total');
  const wordsSignal = useSignal<UserHsk3WordType[] | null>(userHskWords.value || []);
  const lvlWordsNum = useSignal({
    ...Object.fromEntries(
      WORD_LEVELS.new.map((lvl) => [lvl, userHskWords.value.filter((x) => x.lvl === lvl).length]),
    ),
    total: userHskWords.value.length,
  });

  // on a level click: null for a moment remounts the games with that level's words.
  // Not on SSR - a timeout there would fire after the page is rendered, leaving it empty.
  useTask$(({ track }) => {
    const lvl = track(() => lvlSignal.value);
    const words =
      lvl === 'total' ? userHskWords.value : userHskWords.value.filter((x) => x.lvl === lvl);
    if (isServer) {
      wordsSignal.value = words;
      return;
    }
    wordsSignal.value = null;
    setTimeout(() => (wordsSignal.value = words), 100);
  });

  return (
    <>
      <PageTitle txt={'Мой словарик HSK 3.0'} />

      <FlexRow>
        <Alerts />

        <Sidebar>
          <PrivateHskCard lvlSignal={lvlSignal} lvlWordsNumMap={lvlWordsNum.value} isHsk3={true} />
          <CsvCard level={null} isOldHsk={false} isPrivate={true} isUserHsk3={true} />
        </Sidebar>

        <MainContent>
          {wordsSignal.value && (
            <>
              <CalligraphyGame words={toTestWords(wordsSignal.value)} />
              <TypingGame words={toTestWords(wordsSignal.value)} />
              <NewHskTable
                hskWords={wordsSignal.value}
                userHskWordIds={wordsSignal.value.map((x) => x._id)}
                isPrivate={true}
              />
            </>
          )}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Личный словарик HSK 3.0',
};
