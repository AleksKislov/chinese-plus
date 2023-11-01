import { component$, useSignal } from "@builder.io/qwik";
import { YoutubeService } from "~/misc/actions/youtube-service";
import CONSTANTS from "~/misc/consts/consts";
import { type VideoCardInfo } from "~/routes/watch/videos";
import { WHERE } from "../common/comments/comment-form";
import { UserDateDiv } from "../common/comments/user-with-date";
import { TagsLine } from "../common/content-cards/tags-line";
import { TextDesc } from "../common/content-cards/text-desc";
import { VideoSrc } from "./video-src";
import { CardTitle } from "../common/content-cards/card-title";
import { CardImg } from "../common/content-cards/card-img";
import { ContentLen } from "../common/content-cards/content-len";
import { ContentCat } from "../common/content-cards/content-cat";
import { ContentLvl } from "../common/content-cards/content-lvl";
import { CardBtns } from "../common/content-cards/card-btns";

type VideoCardProps = {
  video: VideoCardInfo;
  isUnapproved?: boolean;
};

export const VideoCard = component$(({ video, isUnapproved }: VideoCardProps) => {
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
    comments_id: commentIds,
    likes,
  } = video;

  const likesSignal = useSignal(likes);
  return (
    <div class='card lg:card-side w-full bg-neutral mb-3'>
      <CardImg
        contentId={videoId}
        contentType={WHERE.video}
        picUrl={YoutubeService.getVideoPicUrl(source)}
        isUnapproved={isUnapproved}
      />

      <div class='card-body lg:w-2/3'>
        <CardTitle
          contentId={videoId}
          contentType={WHERE.video}
          hits={hits}
          title={title}
          isUnapproved={isUnapproved}
        />
        <TagsLine tags={tags} />
        <UserDateDiv userId={userId} userName={userName} date={date} ptNum={0} />

        <div class='grid lg:grid-cols-2 grid-cols-1 gap-2'>
          <ContentLvl lvl={lvl} />
          <ContentCat txt={CONSTANTS.videoCategories[category]} />
          <VideoSrc src={source} />
          <ContentLen len={length} />
        </div>

        <TextDesc desc={desc} />

        <CardBtns
          userId={userId}
          contentId={videoId}
          contentType={WHERE.video}
          likes={likesSignal}
          commentIdsLen={commentIds.length}
          withAudio={false}
          isUnapproved={isUnapproved}
        />
      </div>
    </div>
  );
});
