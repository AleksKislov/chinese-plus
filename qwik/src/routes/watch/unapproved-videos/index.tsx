import { component$, useSignal, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { ApiService } from '~/misc/actions/request';

import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { VideoCard } from '~/components/watch/video-card';
import { type VideoCardInfo } from '../videos';
import { routeAction$, type DocumentHead } from '@builder.io/qwik-city';
import { MoreBtnAndLoader } from '~/components/common/ui/more-btn-and-loader';

export const getVideosWithSkip = routeAction$((params): Promise<VideoCardInfo[]> => {
  return ApiService.get(`/api/videos/not_approved?skip=${params.skip}`, undefined, []);
});

export default component$(() => {
  const videos = useSignal<VideoCardInfo[]>([]);
  const skipSignal = useSignal(0);
  const getSkipVideos = getVideosWithSkip();

  useVisibleTask$(({ track }) => {
    const skip = track(() => skipSignal.value);
    getSkipVideos.submit({ skip });
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => getSkipVideos.value);
    if (!res) return;
    videos.value = [...videos.value, ...res];
  });

  return (
    <>
      <PageTitle txt={'Видео на проверке'} />
      <FlexRow>
        <Sidebar>
          <div class="card bg-primary text-primary-content">
            <div class="card-body">
              <h2 class="card-title">Данные видео</h2>
              <p>еще не проверены модераторами</p>
            </div>
          </div>
        </Sidebar>

        <MainContent>
          {videos.value.map((video, ind) => (
            <VideoCard key={ind} video={video} isUnapproved={true} />
          ))}

          <MoreBtnAndLoader isLoading={getSkipVideos.isRunning} skipSignal={skipSignal} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Видео на китайском с субтитрами',
  meta: [
    {
      name: 'description',
      content:
        'Видео на китайском языке с тройными субтитрами: иероглифы, перевод и пиньинь. Плюс всплывающий перевод каждого слова.',
    },
  ],
};
