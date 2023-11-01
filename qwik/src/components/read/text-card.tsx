import { component$, useSignal } from "@builder.io/qwik";
import CONSTANTS from "~/misc/consts/consts";
import { type TextCardInfo } from "~/routes/read/texts";
// import { type LevelUnion } from "~/routes/watch/videos";
import { WHERE } from "../common/comments/comment-form";
import { UserDateDiv } from "../common/comments/user-with-date";
import { TagsLine } from "../common/content-cards/tags-line";
import { TextDesc } from "../common/content-cards/text-desc";
import { CardTitle } from "../common/content-cards/card-title";
import { CardImg } from "../common/content-cards/card-img";
import { ContentLen } from "../common/content-cards/content-len";
import { ContentCat } from "../common/content-cards/content-cat";
import { ContentLvl } from "../common/content-cards/content-lvl";
import { CardBtns } from "../common/content-cards/card-btns";
import { TextSource } from "../common/content-cards/text-source";

type TextCardProps = {
  text: TextCardInfo;
  isUnapproved?: boolean;
};

export const TextCard = component$(({ text, isUnapproved }: TextCardProps) => {
  const {
    _id: textId,
    title,
    source,
    date,
    hits,
    tags,
    pic_url: picUrl,
    user: { _id: userId, name: userName },
    categoryInd: category,
    level: lvl,
    length,
    description: desc,
    comments_id: commentIds,
    audioSrc,
    likes,
  } = text;

  const likesSignal = useSignal(likes);

  return (
    <div class='card lg:card-side w-full bg-neutral mb-3 lg:max-h-96'>
      <CardImg
        contentId={textId}
        contentType={WHERE.text}
        picUrl={picUrl}
        isUnapproved={isUnapproved}
      />

      <div class='card-body lg:w-2/3'>
        <CardTitle
          contentId={textId}
          contentType={WHERE.text}
          hits={hits}
          title={title}
          isUnapproved={isUnapproved}
        />
        <TagsLine tags={tags} />
        <UserDateDiv userId={userId} userName={userName} date={date} ptNum={0} />

        <div class='grid lg:grid-cols-2 grid-cols-1 gap-2'>
          <ContentLvl lvl={lvl} />
          <ContentCat txt={CONSTANTS.textCategories[category]} />
          <ContentLen len={length} />
          <TextSource source={source} />
        </div>

        <div class='flex h-full flex-col justify-between '>
          <TextDesc desc={desc} />

          <CardBtns
            userId={userId}
            contentId={textId}
            contentType={WHERE.text}
            likes={likesSignal}
            commentIdsLen={commentIds.length}
            withAudio={Boolean(audioSrc)}
            isUnapproved={isUnapproved}
          />
        </div>
      </div>
    </div>
  );
});
