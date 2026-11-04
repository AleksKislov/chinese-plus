import { component$ } from '@builder.io/qwik';
import { WHERE } from '~/components/common/comments/comment-form';
import { commentSvg, eyeSvg, heartSvg } from '~/components/common/media/svg';
import CONSTANTS from '~/misc/consts/consts';
import {
  type UserPublishedBlogPost,
  type UserPublishedText,
  type UserPublishedVideo,
} from '~/routes/users/[id]';
import { UserTableTableRow } from './user-content-table-row';

type ContentType = WHERE.text | WHERE.video | WHERE.blog;

type MarkedTableProps = {
  content: UserPublishedText[] | UserPublishedVideo[] | UserPublishedBlogPost[];
  contentType: ContentType;
};

function getCategoryLabel(
  cnt: UserPublishedText | UserPublishedVideo | UserPublishedBlogPost,
  contentType: ContentType,
): string {
  if (contentType === WHERE.video) {
    return CONSTANTS.videoCategories[(cnt as UserPublishedVideo).category];
  }
  if (contentType === WHERE.blog) {
    const category = (cnt as UserPublishedBlogPost).category;
    return CONSTANTS.blogCategories[category as keyof typeof CONSTANTS.blogCategories];
  }
  return CONSTANTS.textCategories[(cnt as UserPublishedText).categoryInd];
}

export const UserContentTable = component$(({ content, contentType }: MarkedTableProps) => {
  return (
    <table class="table text-base-content">
      <thead>
        <tr>
          <th>Название</th>
          <th>{heartSvg}</th>
          <th>{commentSvg}</th>
          <th>{eyeSvg}</th>
        </tr>
      </thead>
      <tbody>
        {content.map((cnt) => (
          <UserTableTableRow
            key={cnt._id}
            contentId={cnt._id}
            title={cnt.title}
            category={getCategoryLabel(cnt, contentType)}
            commentsTotal={cnt.comments_id?.length || 0}
            likesTotal={cnt.likes?.length || 0}
            hitsTotal={cnt.hits}
            contentType={contentType}
          />
        ))}
      </tbody>
    </table>
  );
});
