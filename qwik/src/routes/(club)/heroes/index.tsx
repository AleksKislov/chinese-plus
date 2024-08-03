import { $, component$, useSignal, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$, Link } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { PageTitle } from '~/components/common/layout/title';
import { ApiService } from '~/misc/actions/request';
import { Sidebar } from '~/components/common/layout/sidebar';
import { CreateTextCard } from '~/components/read/create-text-card';
import { MainContent } from '~/components/common/layout/main-content';
import { AvatarImg } from '~/components/common/media/avatar-img';
import { Loader } from '~/components/common/ui/loader';
import { chevronDown, chevronSvg, chevronUp } from '~/components/common/media/svg';

export type ClubHero = {
  userId: ObjectId;
  name: string;
  newAvatar?: NewAvatar;
  texts: number;
  videos: number;
  donates: number;
};

export const useGetHeroes = routeLoader$((): Promise<ClubHero[]> => {
  return ApiService.get(`/api/texts/statistics`, undefined, []);
});

export default component$(() => {
  const heroes = useGetHeroes();
  const sorted = useSignal<ClubHero[] | null>(null);

  type SortBy = 'texts' | 'videos' | 'donates';

  const sortSignal = useSignal(false);
  const sortBy = useSignal<SortBy>('texts');

  useTask$(() => {
    sorted.value = heroes.value;
  });

  useVisibleTask$(({ track }) => {
    const bool = track(() => sortSignal.value);
    const sortType = track(() => sortBy.value);
    const res = heroes.value;
    sorted.value = null;

    setTimeout(() => {
      sorted.value = res.sort((a, b) =>
        bool ? a[sortType] - b[sortType] : b[sortType] - a[sortType],
      );
    });
  });

  const getSvg = $((str: SortBy) => {
    return sortBy.value !== str ? chevronSvg : sortSignal.value ? chevronUp : chevronDown;
  });

  const changeSort = $((str: SortBy) => {
    if (sortBy.value !== str) {
      sortBy.value = str;
      sortSignal.value = false;
      return;
    }
    sortSignal.value = !sortSignal.value;
  });

  return (
    <>
      <PageTitle txt={'Герои клуба Chinese+'} />
      <FlexRow>
        <Sidebar>
          <div class="card bg-primary text-primary-content">
            <div class="card-body">
              <p>Герои делятся текстами и видео со всеми нами! А донаты держат проект на плаву</p>
            </div>
          </div>
          <CreateTextCard />
        </Sidebar>

        <MainContent>
          {sorted.value ? (
            <div class="overflow-x-auto">
              <table class="table text-base-content">
                <thead>
                  <tr>
                    <th>Герой</th>
                    <th>
                      <div
                        class="flex cursor-pointer hover:text-secondary"
                        onClick$={() => changeSort('texts')}
                      >
                        <span>Тексты</span>
                        {getSvg('texts')}
                      </div>
                    </th>
                    <th>
                      <div
                        class="flex cursor-pointer hover:text-secondary"
                        onClick$={() => changeSort('videos')}
                      >
                        <span>Видео</span>
                        {getSvg('videos')}
                      </div>
                    </th>
                    <th>
                      <div
                        class="flex cursor-pointer hover:text-secondary"
                        onClick$={() => changeSort('donates')}
                      >
                        <span>Донаты</span>
                        {getSvg('donates')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.value.map((hero) => (
                    <tr>
                      <td>
                        <Link href={'/users/' + hero.userId}>
                          <div class="flex">
                            <div class="avatar">
                              <div class="mask mask-squircle w-10 h-10">
                                <AvatarImg
                                  userName={hero.name}
                                  newAvatar={hero.newAvatar}
                                  size={48}
                                />
                              </div>
                            </div>
                            <div class="link mt-2 ml-3">{hero.name}</div>
                          </div>
                        </Link>
                      </td>
                      <td>{hero.texts}</td>
                      <td>{hero.videos || 0}</td>
                      <td>{hero.donates || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Loader />
          )}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Герои клуба',
  meta: [
    {
      name: 'description',
      content: 'Эти герои делятся текстами и видео со всеми нами',
    },
  ],
};
