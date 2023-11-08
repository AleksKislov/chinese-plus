import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

type MarkedTableRowProps = {
  contentId: ObjectId;
  title: string;
  category: string;
  commentsTotal: number;
  likesTotal: number;
  hitsTotal: number;
  isVideo: boolean;
};

export const UserTableTableRow = component$(
  ({
    contentId,
    title,
    category,
    commentsTotal,
    likesTotal,
    hitsTotal,
    isVideo,
  }: MarkedTableRowProps) => {
    const contentHref = (isVideo ? "/watch/videos/" : "/read/texts/") + contentId;

    return (
      <tr>
        <td>
          <Link href={contentHref}>{title}</Link>
          <br />
          <span class='badge badge-ghost badge-sm'>{category}</span>
        </td>
        <td>{likesTotal}</td>
        <td>{commentsTotal}</td>
        <td>{hitsTotal}</td>
      </tr>
    );
  }
);
