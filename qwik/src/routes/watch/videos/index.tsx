import { component$, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead, routeAction$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { VideoCard } from "~/components/watch/video-card";
import { UnsetFiltersBtn } from "~/components/common/ui/unset-filters-btn";
import { CategoryFilter } from "~/components/common/ui/category-filter";
import { WHERE } from "~/components/common/comments/comment-form";
import { MoreBtnAndLoader } from "~/components/common/ui/more-btn-and-loader";

export type VideoCategory =
  | "misc"
  | "song"
  | "ads"
  | "cartoon"
  | "sciense"
  | "documentary"
  | "news";

// export enum VideoCategories {
//   misc = "misc",
//   song = "song",
//   ads = "ads",
//   cartoon = "cartoon",
//   sciense = "sciense",
//   documentary = "documentary",
//   news = "news",
// }

export type VideoCardInfo = {
  _id: ObjectId;
  category: VideoCategory;
  tags: string[];
  hits: number;
  title: string;
  desc: string;
  lvl: 1 | 2 | 3;
  length: number;
  source: string;
  isApproved: 1 | 0 | undefined;
  user: ShortUserInfo;
  comments_id: CommentId[];
  likes: ContentLike[];
  date: ISODate;
};

export type LevelUnion = "0" | "1" | "2" | "3";

export const getVideosWithParams = routeAction$((params): Promise<VideoCardInfo[]> => {
  return ApiService.get(`/api/videos/infinite?skip=0&category=${params.category}`, undefined, []);
});

export const getVideosWithSkip = routeAction$((params): Promise<VideoCardInfo[]> => {
  const { skip, category } = params;
  return ApiService.get(`/api/videos/infinite?skip=${skip}&category=${category}`, undefined, []);
});

export default component$(() => {
  const videos = useSignal<VideoCardInfo[]>([]);
  const getVideos = getVideosWithParams();
  const getSkipVideos = getVideosWithSkip();
  const categorySignal = useSignal("");
  const skipSignal = useSignal(0);

  useVisibleTask$(({ track }) => {
    const category = track(() => categorySignal.value);
    videos.value = [];
    getVideos.submit({ category });
  });

  useVisibleTask$(({ track }) => {
    const skip = track(() => skipSignal.value);
    if (skip === 0) return;
    getSkipVideos.submit({
      skip,
      category: categorySignal.value,
    });
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => getVideos.value);
    if (!res) return;
    videos.value = res;
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => getSkipVideos.value);
    if (!res) return;
    videos.value = [...videos.value, ...res];
  });

  return (
    <>
      <PageTitle txt={"Видео на китайском с субтитрами"} />
      <FlexRow>
        <Sidebar>
          <div class='card bg-primary text-primary-content'>
            <div class='card-body'>
              <h2 class='card-title'>Смотри и учись</h2>
              <p>
                Умные тройные субтитры (оригинал, пиньинь и перевод) для видео на китайском языке.
              </p>
            </div>
          </div>
        </Sidebar>

        <MainContent>
          <div class='grid sm:grid-cols-4 grid-cols-2 gap-1 mb-3'>
            <CategoryFilter categorySignal={categorySignal} contentType={WHERE.video} />
            <UnsetFiltersBtn categorySignal={categorySignal} skipSignal={skipSignal} />
          </div>

          {videos.value.map((video, ind) => (
            <VideoCard key={ind} video={video} />
          ))}

          <MoreBtnAndLoader
            isLoading={getVideos.isRunning || getSkipVideos.isRunning}
            skipSignal={skipSignal}
          />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Видео на китайском с субтитрами",
  meta: [
    {
      name: "description",
      content:
        "Видео на китайском языке с тройными субтитрами: иероглифы, перевод и пиньинь. Плюс всплывающий перевод каждого слова.",
    },
  ],
};
