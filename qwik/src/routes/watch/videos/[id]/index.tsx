import {
  component$,
  noSerialize,
  useSignal,
  useStore,
  useVisibleTask$,
  type NoSerialize,
} from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';

import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { type VideoCardInfo } from '..';

import { YoutubeService } from '~/misc/actions/youtube-service';
import CONSTANTS from '~/misc/consts/consts';
import { ContentPageCard } from '~/components/common/content-cards/content-page-card';
import {
  type Addressee,
  type CommentIdToReply,
  WHERE,
} from '~/components/common/comments/comment-form';
import { Subs } from '~/components/watch/subs';
import { getContentPath, parseVideoWords, withSlug } from '~/misc/helpers/content';
import { Alerts } from '~/components/common/alerts/alerts';
import { type CommentType } from '~/components/common/comments/comment-card';
import { getContentComments } from '~/misc/actions/get-content-comments';
import { ContentPageHead } from '~/components/common/ui/content-page-head';
import { CommentsFullBlock } from '~/components/common/comments/comments-full-block';
import { SubscribeCta } from '~/components/common/media/subscribe-cta';
import { getIdFromParam } from '~/misc/helpers/tools';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';
import { getOrSetVisitorId } from '~/misc/helpers/visitor-id';
import { truncateCrumb } from '~/components/common/layout/breadcrumbs';
import {
  PlayerState,
  mountRutubePlayer,
  mountYoutubePlayer,
  type VideoPlayerApi,
  type VideoPlayerType,
} from '~/components/watch/video-players';

import { PlayerSwitch } from '~/components/watch/player-switch';
import { useVideoPlayerChoice } from '~/misc/loaders/video-player-loaders';

export { PlayerState };
export { useVideoPlayerChoice } from '~/misc/loaders/video-player-loaders';

export type VideoFromDB = VideoCardInfo & {
  pySubs: string[];
  ruSubs: string[];
  chineseArr: string[][];
  cnSubs: ChineseSub[];
  rutubeSource?: string; // rutube id, optional alternative player
};

export type ChineseSub = {
  _id: ObjectId;
  start: NumString;
  dur: NumString;
  text: string;
};

export type TooltipSubs = {
  tooltipSubs: (DictWord | string)[][];
};

export const getVideoFromDB = (id: ObjectId, visitorId: string): Promise<VideoFromDB> => {
  return ApiService.get(`/api/videos/${id}?vid=${visitorId}`, undefined, null);
};

export const getWordsForTooltips = (wordsArr: string[][]) => {
  return ApiService.post('/api/dictionary/allWordsForVideo', wordsArr, undefined, []);
};

export const useGetVideo = routeLoader$(
  async (requestEvent): Promise<VideoFromDB & TooltipSubs> => {
    const { params, redirect } = requestEvent;
    const visitorId = getOrSetVisitorId(requestEvent);
    const videoFromDb = await getVideoFromDB(getIdFromParam(params.id), visitorId);
    if (!videoFromDb) throw redirect(302, '/watch/videos');
    // Unapproved videos are shown only under /watch/unapproved-videos/ (noindex).
    if (!videoFromDb.isApproved) throw redirect(302, `/watch/unapproved-videos/${videoFromDb._id}`);

    const canonicalId = withSlug(videoFromDb._id, videoFromDb.title);
    if (params.id !== canonicalId) {
      throw redirect(301, `/watch/videos/${canonicalId}`);
    }

    const tooltipSubs = await getWordsForTooltips(videoFromDb.chineseArr);
    return { ...videoFromDb, tooltipSubs };
  },
);

export const getComments = routeLoader$(({ params }): Promise<CommentType[]> => {
  return getContentComments(WHERE.video, getIdFromParam(params.id));
});

export default component$(() => {
  const video = useGetVideo();
  const comments = getComments();
  const playerChoice = useVideoPlayerChoice();
  const hideBtnsSig = useSignal<string[]>([]);
  const playerWrapRef = useSignal<HTMLElement>();
  const playerApi = useSignal<NoSerialize<VideoPlayerApi>>();
  const subCurrentInd = useSignal(0);
  const curWordInd = useSignal(-1);
  const playerState = useSignal<number>(PlayerState.ended);
  const isPaused = useSignal(false);

  const commentIdToReplyStore = useStore<CommentIdToReply>({
    commentId: '',
    name: '',
    userId: '',
  });

  const addressees = useSignal<Addressee[]>([]);

  const {
    _id: videoId,
    title,
    source,
    date,
    hits,
    tags,
    user: { _id: userId, name: userName },
    category,
    lvl,
    length,
    desc,
    likes,
    cnSubs,
    ruSubs,
    pySubs,
    chineseArr,
    tooltipSubs,
    rutubeSource,
  } = video.value;

  // Rutube by default when the video has it: YouTube is throttled for much of our audience
  const playerType = useSignal<VideoPlayerType>(
    rutubeSource && playerChoice.value !== 'youtube' ? 'rutube' : 'youtube',
  );

  const mainSub = useSignal(parseVideoWords(chineseArr, tooltipSubs));

  useVisibleTask$(({ track }) => {
    track(() => isPaused.value);
    const player = playerApi.value;
    if (!player) return;

    if (isPaused.value && playerState.value === PlayerState.playing) {
      player.pause();
    }

    if (!isPaused.value && playerState.value === PlayerState.paused) {
      player.play();
    }
  });

  // (re)mounts the chosen player; switching destroys the previous one
  useVisibleTask$(({ track, cleanup }) => {
    const type = track(() => playerType.value);
    const container = playerWrapRef.value;
    if (!container) return;

    let player: VideoPlayerApi | undefined;
    let isCleanedUp = false;

    if (type === 'rutube' && rutubeSource) {
      player = mountRutubePlayer(container, rutubeSource);
      playerApi.value = noSerialize(player);
    } else {
      mountYoutubePlayer(container, source).then((ytPlayer) => {
        if (isCleanedUp) return ytPlayer.destroy();
        player = ytPlayer;
        playerApi.value = noSerialize(ytPlayer);
      });
    }

    cleanup(() => {
      isCleanedUp = true;
      player?.destroy();
      playerApi.value = undefined;
      playerState.value = PlayerState.ended;
      isPaused.value = false;
    });
  });

  useVisibleTask$(({ cleanup }) => {
    const interval = setInterval(() => {
      const player = playerApi.value;
      playerState.value = player?.getPlayerState() ?? PlayerState.ended;
      const curTime = player?.getCurrentTime() || 0;

      const ind = cnSubs.findIndex(({ start, dur }) => {
        return +start < curTime && +start + +dur > curTime;
      });
      if (ind < 0) return;
      subCurrentInd.value = ind;

      const lineLen = mainSub.value[ind].length;
      const secStep = +cnSubs[ind].dur / lineLen;
      const curInnerTime = curTime - +cnSubs[ind].start;
      curWordInd.value = curInnerTime / secStep;
    }, 100);

    cleanup(() => clearInterval(interval));
  });

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
        crumbs={[{ name: 'Видео', href: '/watch/videos/' }, { name: truncateCrumb(title) }]}
      />

      <FlexRow>
        <Sidebar>
          <ContentPageCard
            isApproved={true}
            title={title}
            desc={desc}
            length={length}
            tags={tags}
            userId={userId}
            userName={userName}
            date={date}
            lvl={lvl}
            picUrl={YoutubeService.getVideoPicUrl(source)}
            category={CONSTANTS.videoCategories[category]}
            likes={likes}
            contentType={WHERE.video}
            contentId={videoId}
          />
        </Sidebar>

        <MainContent>
          <Alerts />

          {rutubeSource && <PlayerSwitch playerType={playerType} />}

          <div class="aspect-w-16 aspect-h-9 mb-3">
            {/* players are mounted here imperatively, see video-players.ts */}
            <div class="rounded-lg overflow-hidden" ref={playerWrapRef}></div>
          </div>

          <Subs
            hideBtnsSig={hideBtnsSig}
            main={mainSub.value[subCurrentInd.value]}
            ru={ruSubs[subCurrentInd.value]}
            py={pySubs[subCurrentInd.value]}
            curWordInd={curWordInd.value}
            playerState={playerState}
            isPaused={isPaused}
          />

          <SubscribeCta />

          <CommentsFullBlock
            contentId={videoId}
            where={WHERE.video}
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
  const videoInfo = resolveValue(useGetVideo);
  const title = `${videoInfo.title} — видео на китайском с субтитрами и переводом | Chinese+`;
  const description = `Видео на китайском языке с переводом и субтитрами: ${videoInfo.desc}`;
  const url =
    CONST_URLS.siteUrl +
    getContentPath(WHERE.video, videoInfo._id, false, undefined, undefined, videoInfo.title);

  return {
    title,
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        property: 'og:title',
        content: title,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:type',
        content: 'video.other',
      },
      {
        property: 'og:url',
        content: url,
      },
      {
        property: 'og:image',
        content: YoutubeService.getVideoPicUrl(videoInfo.source),
      },
      {
        name: 'twitter:card',
        content: 'video_image_' + videoInfo._id,
      },
      {
        name: 'twitter:image',
        content: YoutubeService.getVideoPicUrl(videoInfo.source),
      },
    ],
  };
};
