import { component$ } from '@builder.io/qwik';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Link, type DocumentHead } from '@builder.io/qwik-city';
import { MainContent } from '~/components/common/layout/main-content';
import { Sidebar } from '~/components/common/layout/sidebar';
import { PageTitle } from '~/components/common/layout/title';
import { CharactersLinkCard } from '~/components/common/content-cards/characters-link-card';
import { PhoneticsLinkCard } from '~/components/common/content-cards/phonetics-link-card';

export const points = [
  {
    char: '壹',
    title: 'Первым делом...',
    txt: 'Китайский язык - иероглифический, но перед тем как усваивать все самые распространенные (как правило, сложные) иероглифы нужно сделать 2 вещи:',
  },
  {
    char: '贰',
    title: 'Далее - лексика и грамматика',
    txt: (
      <span>
        Далее можно начать знакомиться с лексикой и грамматикой китайского языка. Лексику можно
        начинать учить с 1-го уровня{' '}
        <Link class="link font-bold hover:link-success" href="/hsk/2/table">
          HSK
        </Link>
      </span>
    ),
  },
  {
    char: '叁',
    title: 'От простого к сложному',
    txt: (
      <span>
        Одновременно с пунктом 2 можно начинать слушать аудиоуроки и читать простые{' '}
        <Link class="link font-bold hover:link-success" href="/read/texts">
          тексты
        </Link>
        , слушать озвучку носителем языка
      </span>
    ),
  },
  {
    char: '肆',
    title: 'Изучение каждый день',
    txt: (
      <span>
        По мере увеличения словарного запаса наращивайте свой уровень и переходите к более сложным
        материалам, например, к просмотру{' '}
        <Link class="link font-bold hover:link-success" href="/watch/videos">
          видео
        </Link>{' '}
        на китайском языке с интерактивными субтитрами.
      </span>
    ),
  },
];

export default component$(() => {
  return (
    <>
      <PageTitle txt={'С чего начать изучать китайский'} />

      <FlexRow>
        <Sidebar>
          <CharactersLinkCard />
          <PhoneticsLinkCard />
        </Sidebar>

        <MainContent>
          <div class="mt-3"></div>
          {points.map((x, ind) => (
            <div class="flex mb-2" key={ind}>
              <div class="alert alert-success max-w-fit justify-center flex text-2xl text-success-content h-16 mt-1">
                <span class="px-1">{x.char}</span>
              </div>
              <div class="ml-3">
                <div class="prose">
                  <h3>{x.title}</h3>
                </div>
                <div>{x.txt}</div>

                {ind === 0 && (
                  <>
                    <div class="flex mt-3">
                      <div class="alert alert-info max-w-fit justify-center	flex text-2xl text-info-content h-16 mt-1">
                        <span class="px-1">一</span>
                      </div>
                      <div class="ml-3">
                        <div class="prose">
                          <h3>Пиньинь</h3>
                        </div>
                        <div>
                          У каждого иероглифа есть свое произношение, это произношение записывается
                          латинскими буквами с указанием тонов (всего их 4) над гласными - пиньинем.
                          Чтобы разобраться с фонетикой, смотрите{' '}
                          <Link
                            class="link font-bold hover:link-success"
                            href="/watch/phonetics-lessons"
                          >
                            видео-курс
                          </Link>{' '}
                          с носителем языка. Рекомендуем так же пользоваться нашей{' '}
                          <Link
                            class="link font-bold hover:link-success"
                            href="/start/pinyin-chart"
                          >
                            таблицей
                          </Link>{' '}
                          пиньиня с озвучкой
                        </div>
                      </div>
                    </div>

                    <div class="flex mt-3">
                      <div class="alert alert-info max-w-fit justify-center	flex text-2xl text-info-content h-16 mt-1">
                        <span class="px-1">二</span>
                      </div>
                      <div class="ml-3">
                        <div class="prose">
                          <h3>Иероглифы</h3>
                        </div>
                        <div>
                          Сначала нужно узнать из каких вообще{' '}
                          <Link class="link font-bold hover:link-success" href="/start/strokes">
                            черт
                          </Link>{' '}
                          состоят иероглифы, как их писать. Потом можете посмотреть{' '}
                          <Link
                            class="link font-bold hover:link-success"
                            href="/watch/characters-lessons"
                          >
                            видео-курс
                          </Link>{' '}
                          по иероглифике: правила написания иероглифов, их разновидности и пр. Эта
                          нформация полезна для систематизации знаний и запоминания.
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ С чего начать изучать китайский язык',
  meta: [
    {
      name: 'description',
      content: 'Короткая статья о том, как лучше начать изучать китайский язык',
    },
  ],
};
