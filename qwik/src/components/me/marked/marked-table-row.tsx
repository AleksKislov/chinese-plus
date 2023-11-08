import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { AvatarImg } from "~/components/common/media/avatar-img";

type MarkedTableRowProps = {
  contentId: ObjectId;
  user: ShortUserInfo;
  title: string;
  category: string;
  commentsTotal: number;
  likesTotal: number;
  hitsTotal: number;
  isVideo: boolean;
};

export const MarkedTableRow = component$(
  ({
    contentId,
    user,
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
          <div
            class='tooltip tooltip-info before:z-50 before:content-[attr(data-tip)]'
            data-tip={user.name}
          >
            <Link href={"/users/" + user._id}>
              <div class='avatar'>
                <div class='mask mask-squircle w-12 h-12'>
                  <AvatarImg userName={user.name} newAvatar={user.newAvatar} size={48} />
                </div>
              </div>
            </Link>
          </div>
        </td>
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
