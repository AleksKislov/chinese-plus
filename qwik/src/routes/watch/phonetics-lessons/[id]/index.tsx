import { component$, useSignal, useStore } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { type VideoLessonInfo } from "..";

import { YoutubeService } from "~/misc/actions/youtube-service";
import { ContentPageCard } from "~/components/common/content-cards/content-page-card";
import {
  type Addressee,
  type CommentIdToReply,
  WHERE,
  CommentForm,
} from "~/components/common/comments/comment-form";
import { Alerts } from "~/components/common/alerts/alerts";
import { type CommentType } from "~/components/common/comments/comment-card";
import { getContentComments } from "~/misc/actions/get-content-comments";
import { CommentsBlock } from "~/components/common/comments/comments-block";
import { CommentsBlockTitle } from "~/components/common/comments/comments-block-title";
import { ContentPageHead } from "~/components/common/ui/content-page-head";
import { VideoLessonCategory } from "~/components/watch/video-lesson-card";

export const getComments = routeLoader$(({ params }): Promise<CommentType[]> => {
  return getContentComments(WHERE.phoneticsLesson, params.id);
});

export const getVideo = routeLoader$(({ params }): Promise<VideoLessonInfo> => {
  return ApiService.get(`/api/videos/video-lessons/${params.id}`, undefined, null);
});

export default component$(() => {
  const video = getVideo();
  const comments = getComments();

  const addressees = useSignal<Addressee[]>([]);
  const commentIdToReplyStore = useStore<CommentIdToReply>({
    commentId: "",
    name: "",
    userId: "",
  });

  const {
    _id: videoId,
    title,
    source,
    date,
    hits,
    tags,
    category,
    lvl,
    desc,
    likes,
    user: { _id: userId, name: userName },
  } = video.value;

  return (
    <>
      <ContentPageHead title={title} hits={hits} path='/watch/phonetics-lessons' />

      <FlexRow>
        <Sidebar>
          <ContentPageCard
            isApproved={true}
            desc={desc}
            tags={tags}
            userId={userId}
            userName={userName}
            date={date}
            lvl={lvl}
            picUrl={YoutubeService.getVideoPicUrl(source)}
            category={VideoLessonCategory[category]}
            likes={likes}
            contentType={WHERE.phoneticsLesson}
            contentId={videoId}
          />
        </Sidebar>

        <MainContent>
          <Alerts />

          <div class='aspect-w-16 aspect-h-9 mb-3'>
            <iframe
              class='rounded-lg shadow-lg'
              width='560'
              height='315'
              src={`https://www.youtube.com/embed/${source}?si=lXAKe7vNBOaFKz6D&amp;controls=0`}
              title='YouTube video player'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            ></iframe>
          </div>

          <div class={"mt-2"}>
            <CommentsBlockTitle />
            <CommentForm
              contentId={videoId}
              where={WHERE.phoneticsLesson}
              path={undefined}
              commentIdToReply={commentIdToReplyStore}
              addressees={addressees}
            />
            <CommentsBlock
              comments={comments.value}
              commentIdToReply={commentIdToReplyStore}
              addressees={addressees}
            />
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const videoInfo = resolveValue(getVideo);

  return {
    title: `Chinese+ Китайская фонетика с носителем: ${videoInfo.title}`,
    meta: [
      {
        name: "description",
        content: `Видео-урок китайской фонетики с носителем языка: ${videoInfo.desc}`,
      },
    ],
  };
};
