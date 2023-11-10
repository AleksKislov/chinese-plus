import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { VideoLessonCard } from "~/components/watch/video-lesson-card";
import { ApiService } from "~/misc/actions/request";
import { type VideoLessonInfo } from "../phonetics-lessons";
import { WHERE } from "~/components/common/comments/comment-form";

export const getVideos = routeLoader$((): Promise<VideoLessonInfo[]> => {
  return ApiService.get(`/api/videos/all-video-lessons?category=characters`, undefined, []);
});

export default component$(() => {
  const videos = getVideos().value;
  return (
    <>
      <PageTitle txt={"Уроки китайской иероглифики"} />
      <FlexRow>
        <Sidebar>
          <div class='card bg-primary text-primary-content'>
            <div class='card-body'>
              <h2 class='card-title'>Смотри и пиши</h2>
              <p>
                Данный курс поможет узнать, что такое китайские иероглифы, из каких частей и
                черточек состоят, каких типов они бывают, как правильно их писать и др. Но главное -
                эти знания помогут их запоминать.
              </p>
            </div>
          </div>
        </Sidebar>

        <MainContent>
          {videos.map((video, ind) => (
            <VideoLessonCard key={ind} video={video} contentType={WHERE.charactersLesson} />
          ))}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Видео уроки китайской иероглифике",
  meta: [
    {
      name: "description",
      content:
        "Видео уроки по китайской иероглифике: как писать, из каких частей и черт состоят, каких типов бывают, как запоминать.",
    },
  ],
};
