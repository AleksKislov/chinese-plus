import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { VideoLessonCard } from "~/components/watch/video-lesson-card";
import { ApiService } from "~/misc/actions/request";
import { WHERE } from "~/components/common/comments/comment-form";

export type VideoLessonInfo = {
  _id: ObjectId;
  title: string;
  source: string;
  hits: number;
  tags: string[];
  category: "phonetics" | "characters";
  lvl: 1;
  desc: string;
  comments_id: CommentId[];
  likes: ContentLike[];
  date: ISODate;
  user: ShortUserInfo;
};

export const getVideos = routeLoader$((): Promise<VideoLessonInfo[]> => {
  return ApiService.get(`/api/videos/all-video-lessons?category=phonetics`, undefined, []);
});

export default component$(() => {
  const videos = getVideos().value;
  return (
    <>
      <PageTitle txt={"Уроки фонетики китайского языка"} />
      <FlexRow>
        <Sidebar>
          <div class='card bg-primary text-primary-content'>
            <div class='card-body'>
              <h2 class='card-title'>Смотри и произноси</h2>
              <p>
                Подробные видео-уроки по фонетике китайского языка с носителем. Научитесь как
                произносить пиньинь, тоны, инициали, финали, сочетания тонов и пр.
              </p>
            </div>
          </div>
        </Sidebar>

        <MainContent>
          {videos.map((video, ind) => (
            <VideoLessonCard key={ind} video={video} contentType={WHERE.phoneticsLesson} />
          ))}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Видео уроки фонетики китайского языка",
  meta: [
    {
      name: "description",
      content:
        "Видео уроки фонетики и произношения китайского языка с носителем. Как произносить пиньинь, тоны, инициали, финали, сочетания тонов и пр.",
    },
  ],
};
