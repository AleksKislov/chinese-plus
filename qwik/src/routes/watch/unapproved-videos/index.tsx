import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { ApiService } from "~/misc/actions/request";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { VideoCard } from "~/components/watch/video-card";
import { type VideoCardInfo } from "../videos";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const videos = useSignal<VideoCardInfo[]>([]);
  const skip = useSignal(0);

  const getVideos = $((): Promise<VideoCardInfo[]> => {
    return ApiService.get(`/api/videos/not_approved?skip=${skip.value}`, undefined, []);
  });

  useTask$(async ({ track }) => {
    track(() => skip.value);
    videos.value = await getVideos();
  });

  return (
    <>
      <PageTitle txt={"Видео на проверке"} />
      <FlexRow>
        <Sidebar>
          <div class='card bg-primary text-primary-content'>
            <div class='card-body'>
              <h2 class='card-title'>Данные видео</h2>
              <p>еще не проверены модераторами</p>
            </div>
          </div>
        </Sidebar>

        <MainContent>
          {videos.value.map((video, ind) => (
            <VideoCard key={ind} video={video} isUnapproved={true} />
          ))}

          <div class={"flex flex-col items-center"}>
            <button
              type='button'
              class={`btn btn-sm btn-info btn-outline`}
              onClick$={async () => {
                skip.value += 10;
                videos.value = [...videos.value, ...(await getVideos())];
              }}
            >
              Еще
            </button>
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Китайские видео с субтитрами",
  meta: [
    {
      name: "description",
      content:
        "Видео на китайском языке с тройными субтитрами: иероглифы, перевод и пиньинь. Плюс всплывающий перевод каждого слова.",
    },
  ],
};
