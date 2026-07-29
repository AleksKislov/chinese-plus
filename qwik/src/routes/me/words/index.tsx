import { component$ } from '@builder.io/qwik';
import { Alerts } from '~/components/common/alerts/alerts';
import { PageTitle } from '~/components/common/layout/title';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { TypingGame } from '~/components/games/typing-game';
import { SearchResutlTable } from '~/components/search/search-result-table';
import { type UserWord } from '~/root';
import { PrivateWordsCard } from '~/components/me/words/private-words-card';
import { parseRussian } from '~/misc/helpers/translation';
import { ApiService } from '~/misc/actions/request';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { routeLoader$, type DocumentHead, type RequestEvent } from '@builder.io/qwik-city';
import { CalligraphyGame } from '~/components/games/calligraphy-game';
import { CsvCard } from '~/components/hsk/csv-card';

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

// Full word data (pinyin/translation/dictWordId) is only needed on this page, so it's
// fetched here directly instead of via the app-wide layout - see useGetUserWords in layout.tsx
// for the lightweight version used everywhere else.
export const useGetFullUserWords = routeLoader$(async ({ cookie }): Promise<UserWord[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return ApiService.get('/api/userwords', token, []);
});

export default component$(() => {
  const userWords = useGetFullUserWords();

  return (
    <>
      <PageTitle txt={'Мой словарик'} />

      <FlexRow>
        <Alerts />

        <Sidebar>
          <PrivateWordsCard wordsTotal={userWords.value.length} />
          <CsvCard level={null} isOldHsk={false} isPrivate={true} />
        </Sidebar>

        <MainContent>
          <CalligraphyGame
            words={userWords.value.map(({ chinese, pinyin, translation }) => ({
              level: '',
              id: 1,
              chinese,
              pinyin,
              translation: parseRussian(translation, false),
            }))}
          />
          <TypingGame
            words={userWords.value.map(({ chinese, pinyin, translation }) => ({
              level: '',
              id: 1,
              chinese,
              pinyin,
              translation: parseRussian(translation, false),
            }))}
          />
          <SearchResutlTable
            words={userWords.value.map(({ chinese, pinyin, translation, dictWordId }) => ({
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
