import { component$, useSignal } from '@builder.io/qwik';
import CONSTANTS from '~/misc/consts/consts';
import { type BlogCardInfo } from '~/routes/read/blog';
import { WHERE } from '../common/comments/comment-form';
import { UserDateDiv } from '../common/comments/user-with-date';
import { TagsLine } from '../common/content-cards/tags-line';
import { CardTitle } from '../common/content-cards/card-title';
import { CardImg } from '../common/content-cards/card-img';
import { ContentCat } from '../common/content-cards/content-cat';
import { CardBtns } from '../common/content-cards/card-btns';
import { TextDesc } from '../common/content-cards/text-desc';
import { getCoverImage, getPreviewText } from '~/misc/helpers/content';
import CONST_URLS from '~/misc/consts/urls';

type BlogCardProps = {
  post: BlogCardInfo;
  isUnapproved?: boolean;
};

export const BlogCard = component$(({ post, isUnapproved }: BlogCardProps) => {
  const {
    _id: postId,
    title,
    date,
    hits,
    tags,
    content,
    user: { _id: userId, name: userName },
    category,
    comments_id: commentIds,
    likes,
  } = post;

  const likesSignal = useSignal(likes);
  const picUrl = getCoverImage(content) || CONST_URLS.defaultTextPic;
  const desc = getPreviewText(content);

  return (
    <div class="card w-full bg-base-300 mb-3 break-inside-avoid">
      <CardImg
        contentId={postId}
        contentType={WHERE.blog}
        picUrl={picUrl}
        title={title}
        isUnapproved={isUnapproved}
        variant="top"
      />

      <div class="card-body">
        <CardTitle
          contentId={postId}
          contentType={WHERE.blog}
          hits={hits}
          title={title}
          isUnapproved={isUnapproved}
        />
        <TagsLine tags={tags} />
        <UserDateDiv userId={userId} userName={userName} date={date} ptNum={0} />

        <ContentCat
          txt={CONSTANTS.blogCategories[category as keyof typeof CONSTANTS.blogCategories]}
        />

        {desc && <TextDesc desc={desc} />}

        <div class="card-actions justify-end">
          <CardBtns
            userId={userId}
            contentId={postId}
            contentType={WHERE.blog}
            likes={likesSignal}
            commentIdsLen={commentIds.length}
            withAudio={false}
            isUnapproved={isUnapproved}
          />
        </div>
      </div>
    </div>
  );
});
