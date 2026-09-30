import { component$, useSignal, useStore } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';

import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { type VideoLessonInfo } from '..';

import { YoutubeService } from '~/misc/actions/youtube-service';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';
import { ContentPageCard } from '~/components/common/content-cards/content-page-card';
import {
  type Addressee,
  type CommentIdToReply,
  WHERE,
} from '~/components/common/comments/comment-form';
import { Alerts } from '~/components/common/alerts/alerts';
import { type CommentType } from '~/components/common/comments/comment-card';
import { getContentComments } from '~/misc/actions/get-content-comments';
import { ContentPageHead } from '~/components/common/ui/content-page-head';
import { VideoLessonCategory } from '~/components/watch/video-lesson-card';
import { CommentsFullBlock } from '~/components/common/comments/comments-full-block';
import { getIdFromParam } from '~/misc/helpers/tools';
import { withSlug } from '~/misc/helpers/content';
import { getOrSetVisitorId } from '~/misc/helpers/visitor-id';
import { truncateCrumb } from '~/components/common/layout/breadcrumbs';

export const getComments = routeLoader$(({ params }): Promise<CommentType[]> => {
  return getContentComments(WHERE.phoneticsLesson, getIdFromParam(params.id));
});

export const getVideo = routeLoader$(async (requestEvent): Promise<VideoLessonInfo> => {
  const { params, redirect } = requestEvent;
  const visitorId = getOrSetVisitorId(requestEvent);
  const video = await ApiService.get(
    `/api/videos/video-lessons/${getIdFromParam(params.id)}?vid=${visitorId}`,
    undefined,
    null,
  );
  if (!video) throw redirect(302, '/watch/phonetics-lessons');

  const canonicalId = withSlug(video._id, video.title);
  if (params.id !== canonicalId) {
    throw redirect(301, `/watch/phonetics-lessons/${canonicalId}`);
  }

  return video;
});

export default component$(() => {
  const video = getVideo();
  const comments = getComments();

  const addressees = useSignal<Addressee[]>([]);
  const commentIdToReplyStore = useStore<CommentIdToReply>({
    commentId: '',
    name: '',
    userId: '',
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
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: title,
          description: desc,
          thumbnailUrl: YoutubeService.getVideoPicUrl(source),
          uploadDate: date,
          embedUrl: `https://www.youtube.com/embed/${source}`,
        }}
      />
      <ContentPageHead
        title={title}
        hits={hits}
        crumbs={[
          { name: 'Уроки фонетики', href: '/watch/phonetics-lessons/' },
          { name: truncateCrumb(title) },
        ]}
      />

      <FlexRow>
        <Sidebar>
          <ContentPageCard
            isApproved={true}
            title={title}
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

          <div class="aspect-w-16 aspect-h-9 mb-3">
            <iframe
              class="rounded-lg shadow-lg"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${source}?controls=0`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>

          <CommentsFullBlock
            contentId={videoId}
            where={WHERE.phoneticsLesson}
            path={undefined}
            commentIdToReply={commentIdToReplyStore}
            addressees={addressees}
            comments={comments.value}
          />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const videoInfo = resolveValue(getVideo);
  const title = `${videoInfo.title} — урок китайской фонетики с носителем | Chinese+`;
  const description = `Видео-урок китайской фонетики с носителем языка: ${videoInfo.desc}`;
  const url = `${CONST_URLS.siteUrl}/watch/phonetics-lessons/${withSlug(
    videoInfo._id,
    videoInfo.title,
  )}/`;

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'video.other' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: YoutubeService.getVideoPicUrl(videoInfo.source) },
    ],
  };
};
