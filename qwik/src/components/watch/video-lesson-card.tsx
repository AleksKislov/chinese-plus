import { component$, useSignal } from "@builder.io/qwik";
import { YoutubeService } from "~/misc/actions/youtube-service";
import { type WhereType } from "../common/comments/comment-form";
import { UserDateDiv } from "../common/comments/user-with-date";
import { TagsLine } from "../common/content-cards/tags-line";
import { TextDesc } from "../common/content-cards/text-desc";
import { VideoSrc } from "./video-src";
import { CardTitle } from "../common/content-cards/card-title";
import { CardImg } from "../common/content-cards/card-img";
import { ContentCat } from "../common/content-cards/content-cat";
import { ContentLvl } from "../common/content-cards/content-lvl";
import { CardBtns } from "../common/content-cards/card-btns";
import { type VideoLessonInfo } from "~/routes/watch/phonetics-lessons";

type VideoCardProps = {
  video: VideoLessonInfo;
  contentType: WhereType;
};

export const VideoLessonCategory = {
  phonetics: "Фонетика",
  characters: "Иероглифы",
};

export const VideoLessonCard = component$(({ video, contentType }: VideoCardProps) => {
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
    desc,
    comments_id: commentIds,
    likes,
  } = video;

  const likesSignal = useSignal(likes);
  return (
    <div class='card lg:card-side w-full bg-base-300 mb-3'>
      <CardImg
        contentId={videoId}
        contentType={contentType}
        picUrl={YoutubeService.getVideoPicUrl(source)}
      />

      <div class='card-body lg:w-2/3'>
        <CardTitle contentId={videoId} contentType={contentType} hits={hits} title={title} />
        <TagsLine tags={tags} />
        <UserDateDiv userId={userId} userName={userName} date={date} ptNum={0} />

        <div class='grid lg:grid-cols-2 grid-cols-1 gap-2'>
          <ContentLvl lvl={lvl} />
          <ContentCat txt={VideoLessonCategory[category]} />
          <VideoSrc src={source} />
        </div>

        <TextDesc desc={desc} />

        <CardBtns
          userId={userId}
          contentId={videoId}
          contentType={contentType}
          likes={likesSignal}
          commentIdsLen={commentIds.length}
          withAudio={false}
        />
      </div>
    </div>
  );
});
