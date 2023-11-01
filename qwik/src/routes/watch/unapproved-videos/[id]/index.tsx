import { component$, noSerialize, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";

import YTframeLoader from "youtube-iframe";
import { YoutubeService } from "~/misc/actions/youtube-service";
import CONSTANTS from "~/misc/consts/consts";
import { ContentPageCard } from "~/components/common/content-cards/content-page-card";
import {
  type Addressee,
  type CommentIdToReply,
  WHERE,
  CommentForm,
} from "~/components/common/comments/comment-form";
import { Subs } from "~/components/watch/subs";
import { parseVideoWords } from "~/misc/helpers/content";
import { Alerts } from "~/components/common/alerts/alerts";
import { type CommentType } from "~/components/common/comments/comment-card";
import { getContentComments } from "~/misc/actions/get-content-comments";
import { CommentsBlock } from "~/components/common/comments/comments-block";
import { CommentsBlockTitle } from "~/components/common/comments/comments-block-title";
import { ContentPageHead } from "~/components/common/ui/content-page-head";
import {
  type TooltipSubs,
  type VideoFromDB,
  getWordsForTooltips,
  PlayerState,
} from "../../videos/[id]";

export const getVideoFromDB = (id: ObjectId): Promise<VideoFromDB> => {
  return ApiService.get(`/api/videos/${id}`, undefined, null);
};

export const getComments = routeLoader$(({ params }): Promise<CommentType[]> => {
  return getContentComments(WHERE.video, params.id);
});

export const useGetVideo = routeLoader$(async ({ params }): Promise<VideoFromDB & TooltipSubs> => {
  const videoFromDb = await getVideoFromDB(params.id);
  const tooltipSubs = await getWordsForTooltips(videoFromDb.chineseArr);
  return { ...videoFromDb, tooltipSubs };
});

type YTPlayer = {
  player: {
    playerInfo?: {
      currentTime: number;
    };
  };
};

export default component$(() => {
  const video = useGetVideo();
  const comments = getComments();
  const YtPlayerId = "ytPlayerId";
  const hideBtnsSig = useSignal<string[]>([]);
  const ytSig = useStore<YTPlayer>({ player: {} });
  const subCurrentInd = useSignal(0);
  const curWordInd = useSignal(-1);
  const playerState = useSignal<number>(PlayerState.ended);
  const isPaused = useSignal(false);

  const commentIdToReplyStore = useStore<CommentIdToReply>({
    commentId: "",
    name: "",
    userId: "",
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
  } = video.value;

  const mainSub = useSignal(parseVideoWords(chineseArr, tooltipSubs));

  useVisibleTask$(() => {
    if (!ytSig.player.playerInfo) {
      YTframeLoader.load((YT) => {
        const ytPlayer = new YT.Player(YtPlayerId, { videoId: source });
        ytSig.player = noSerialize(ytPlayer);
      });
    }

    setInterval(() => {
      const curTime = ytSig.player.playerInfo?.currentTime || 0;
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
  });

  return (
    <>
      <ContentPageHead title={title} hits={hits} path='/watch/unapproved-videos' />

      <FlexRow>
        <Sidebar>
          <ContentPageCard
            isApproved={false}
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

          <div class='aspect-w-16 aspect-h-9 mb-3'>
            <div class={"rounded-lg"} id={YtPlayerId}></div>
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

          <div class={"mt-2"}>
            <CommentsBlockTitle />
            <CommentForm
              contentId={videoId}
              where={WHERE.video}
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
