import { component$, useContext } from '@builder.io/qwik';
import { Alerts } from '~/components/common/alerts/alerts';
import { PageTitle } from '~/components/common/layout/title';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { TypingGame } from '~/components/games/typing-game';
import { SearchResutlTable } from '~/components/search/search-result-table';
import { userContext } from '~/root';
import { PrivateWordsCard } from '~/components/me/words/private-words-card';
import { parseRussian } from '~/misc/helpers/translation';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { type DocumentHead, type RequestEvent } from '@builder.io/qwik-city';
import { CalligraphyGame } from '~/components/games/calligraphy-game';
import { CsvCard } from '~/components/hsk/csv-card';

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export default component$(() => {
  const userState = useContext(userContext);

  return (
    <>
      <PageTitle txt={'Мой словарик'} />

      <FlexRow>
        <Alerts />

        <Sidebar>
          <PrivateWordsCard wordsTotal={userState.words.length} />
          <CsvCard level={null} isOldHsk={false} isPrivate={true} />
        </Sidebar>

        <MainContent>
          <CalligraphyGame
            words={userState.words.map(({ chinese, pinyin, translation }) => ({
              level: '',
              id: 1,
              chinese,
              pinyin,
              translation: parseRussian(translation, false),
            }))}
          />
          <TypingGame
            words={userState.words.map(({ chinese, pinyin, translation }) => ({
              level: '',
              id: 1,
              chinese,
              pinyin,
              translation: parseRussian(translation, false),
            }))}
          />
          <SearchResutlTable
            words={userState.words.map(({ chinese, pinyin, translation, dictWordId }) => ({
              _id: dictWordId,
              chinese,
              pinyin,
              russian: translation,
              previous: [],
            }))}
          />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Личный словарик',
};
