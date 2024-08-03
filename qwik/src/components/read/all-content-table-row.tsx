import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { WHERE } from '~/components/common/comments/comment-form';
import { BookmarkBtn } from '~/components/common/content-cards/bookmark-btn';
import { CategoryBadge } from '../common/content-cards/category-badge';
import { LevelStars } from '../common/content-cards/level-stars';
// import { AvatarImg } from "~/components/common/media/avatar-img";

type AllContentTableRowProps = {
  // user: ShortUserInfo;
  contentId: ObjectId;
  title: string;
  category: string;
  commentsTotal: number;
  likesTotal: number;
  hitsTotal: number;
  isVideo: boolean;
  date: ISODate;
  lvl: 1 | 2 | 3;
};

export const AllContentTableRow = component$(
  ({
    // user,
    date,
    contentId,
    title,
    category,
    commentsTotal,
    likesTotal,
    hitsTotal,
    isVideo,
    lvl,
  }: AllContentTableRowProps) => {
    const contentHref = (isVideo ? '/watch/videos/' : '/read/texts/') + contentId;

    return (
      <tr>
        <td class="text-xs">{date}</td>
        {/* <td>
          <div
            class='tooltip tooltip-info before:z-50 before:content-[attr(data-tip)]'
            data-tip={user.name}
          >
            <Link href={"/users/" + user._id}>
              <div class='avatar'>
                <div class='mask mask-squircle w-10 h-10'>
                  <AvatarImg userName={user.name} newAvatar={user.newAvatar} size={48} />
                </div>
              </div>
            </Link>
          </div>
        </td> */}
        <td>
          <Link href={contentHref} class="text-lg link link-hover">
            {title}
          </Link>
          <br />
          <div class="flex">
            <LevelStars lvl={lvl} />
            <div class="ml-1">
              <CategoryBadge txt={category} size="badge-xs" />
            </div>
          </div>
        </td>
        <td>{likesTotal}</td>
        <td>{commentsTotal}</td>
        <td>{hitsTotal}</td>
        <td>
          <BookmarkBtn contentType={isVideo ? WHERE.video : WHERE.text} contentId={contentId} />
        </td>
      </tr>
    );
  },
);
