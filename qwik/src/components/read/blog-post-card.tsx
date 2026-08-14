import { component$, useSignal } from '@builder.io/qwik';
import { UserDateDiv } from '../common/comments/user-with-date';
import { ContentCat } from '../common/content-cards/content-cat';
import { LikeBtn } from '../common/content-cards/like-btn';
import { TagsLine } from '../common/content-cards/tags-line';
import { WHERE } from '../common/comments/comment-form';
import { EditBtn } from '../common/content-cards/edit-btn';
import { DeleteContentBtn } from '../common/content-cards/delete-content-btn';

type BlogPostCardProps = {
  postId: ObjectId;
  tags: string[];
  userId: ObjectId;
  userName: string;
  date: ISODate;
  category: string;
  likes: ContentLike[];
  isApproved: boolean;
};

export const BlogPostCard = component$(
  ({ postId, tags, userId, userName, date, category, likes, isApproved }: BlogPostCardProps) => {
    const likesSignal = useSignal(likes);

    return (
      <div class="card w-full bg-base-300 mb-3">
        <div class="card-body">
          <TagsLine tags={tags} />
          <UserDateDiv userId={userId} userName={userName} date={date} ptNum={0} />

          <div class="flex flex-wrap items-center gap-x-6 gap-y-1">
            <div>
              <span class={'font-bold'}>Благодарности: </span>
              <LikeBtn
                likes={likesSignal}
                contentType={WHERE.blog}
                contentId={postId}
                creatorId={userId}
              />
            </div>
            <ContentCat txt={category} />
          </div>

          <EditBtn
            contentType={WHERE.blog}
            contentId={postId}
            creatorId={userId}
            isApproved={isApproved}
          />
          <DeleteContentBtn contentType={WHERE.blog} contentId={postId} />
        </div>
      </div>
    );
  },
);
