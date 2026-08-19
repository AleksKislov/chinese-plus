import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { WHERE } from '~/components/common/comments/comment-form';

type MarkedTableRowProps = {
  contentId: ObjectId;
  title: string;
  category: string;
  commentsTotal: number;
  likesTotal: number;
  hitsTotal: number;
  contentType: WHERE.text | WHERE.video | WHERE.blog;
};

const CONTENT_PATH: Record<MarkedTableRowProps['contentType'], string> = {
  [WHERE.video]: '/watch/videos/',
  [WHERE.text]: '/read/texts/',
  [WHERE.blog]: '/read/blog/',
};

export const UserTableTableRow = component$(
  ({
    contentId,
    title,
    category,
    commentsTotal,
    likesTotal,
    hitsTotal,
    contentType,
  }: MarkedTableRowProps) => {
    const contentHref = CONTENT_PATH[contentType] + contentId;

    return (
      <tr>
        <td>
          <Link href={contentHref}>{title}</Link>
          <br />
          <span class="badge badge-ghost badge-sm">{category}</span>
        </td>
        <td>{likesTotal}</td>
        <td>{commentsTotal}</td>
        <td>{hitsTotal}</td>
      </tr>
    );
  },
);
