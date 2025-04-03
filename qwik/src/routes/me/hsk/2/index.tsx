import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { type RequestEvent, routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { Alerts } from '~/components/common/alerts/alerts';
import { OldHskTable } from '~/components/hsk/hsk-table';
import { ApiService } from '~/misc/actions/request';
import { PageTitle } from '~/components/common/layout/title';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { type UserOldHskWordType } from '~/routes/hsk/2/table';
import { PrivateHskCard } from '~/components/me/hsk/private-hsk-card';
import { TypingGame } from '~/components/games/typing-game';
import { CalligraphyGame } from '~/components/games/calligraphy-game';
import { CsvCard } from '~/components/hsk/csv-card';

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export const getUserHsk2Words = routeLoader$(async ({ cookie }): Promise<UserOldHskWordType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return await ApiService.get('/api/words', token, []);
});

export default component$(() => {
  const userHskWords = getUserHsk2Words();
  const lvlSignal = useSignal('1');
  const wordsSignal = useSignal<UserOldHskWordType[] | null>(userHskWords?.value || []);
  const lvlWordsNum = useSignal({
    1: wordsSignal.value?.filter((word) => word.level === 1).length || 0,
    2: wordsSignal.value?.filter((word) => word.level === 2).length || 0,
    3: wordsSignal.value?.filter((word) => word.level === 3).length || 0,
    4: wordsSignal.value?.filter((word) => word.level === 4).length || 0,
    5: wordsSignal.value?.filter((word) => word.level === 5).length || 0,
    6: wordsSignal.value?.filter((word) => word.level === 6).length || 0,
    total: wordsSignal.value?.length || 0,
  });
  useTask$(({ track }) => {
    track(() => lvlSignal.value);
    wordsSignal.value = null;
    setTimeout(() => {
      if (!+lvlSignal.value) {
        wordsSignal.value = userHskWords?.value;
      } else {
        wordsSignal.value = userHskWords?.value.filter((word) => word.level === +lvlSignal.value);
      }
    }, 100);
  });

  return (
    <>
      <PageTitle txt={'Мой словарик HSK 2.0'} />

      <FlexRow>
        <Alerts />

        <Sidebar>
          <PrivateHskCard lvlSignal={lvlSignal} lvlWordsNumMap={lvlWordsNum.value} />
          <CsvCard level={null} isOldHsk={true} isPrivate={true} />
        </Sidebar>

        <MainContent>
          {/* это костыль */}
          {wordsSignal.value ? (
            <>
              <CalligraphyGame
                words={wordsSignal.value?.map((x) => ({
                  chinese: x.chinese,
                  level: '' + x.level,
                  id: x.word_id,
                  pinyin: x.pinyin,
                  translation: x.translation,
                }))}
              />
              <TypingGame
                words={wordsSignal.value?.map((x) => ({
                  chinese: x.chinese,
                  level: '' + x.level,
                  id: x.word_id,
                  pinyin: x.pinyin,
                  translation: x.translation,
                }))}
              />
            </>
          ) : (
            <div class="card bg-base-200 text-base-content w-full mb-6">
              <div class="card-body">
                <div>
                  <div class="prose mb-2">
                    <h3 class="card-title">Успей напечатать</h3>
                  </div>
                  <p>
                    Наберите хотя бы 10 слов в список ниже, чтобы активировать тест и проверить свои
                    знания
                  </p>
                </div>
              </div>
              <div class="flex justify-center">
                {[...new Array(10)].map((x, ind) => (
                  <div
                    key={ind}
                    class={`badge mx-2 mb-2 border border-base-300 ${'bg-neutral-content'}`}
                  >
                    {' '}
                  </div>
                ))}
              </div>
            </div>
          )}

          {wordsSignal.value && (
            <OldHskTable
              hskWords={wordsSignal.value}
              userHskWords={wordsSignal.value}
              isPrivate={true}
            />
          )}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Личный словарик HSK',
};
