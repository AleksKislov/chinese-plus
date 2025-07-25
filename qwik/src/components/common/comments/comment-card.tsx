import { component$, type Signal, useContext, $ } from '@builder.io/qwik';
import { arrorUturnDown, editSvg, thumbUpSvg } from '../media/svg';
import { UserDateDiv } from './user-with-date';
import { userContext } from '~/root';
import { type Addressee, type CommentIdToReply } from './comment-form';
import { ApiService } from '~/misc/actions/request';
import { Link, globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { EditCommentModal } from './edit-comment-modal';
import { getLikeBtnTooltipTxt } from '../content-cards/like-btn';
import { SmallAvatar } from '../ui/small-avatar';
import { getContentPath } from '~/misc/helpers/content';
import { SafeText } from './safe-text';

export type CommentType = {
  addressees: string[];
  _id: ObjectId;
  text: string;
  user: ShortUserInfo;
  post_id: ObjectId;
  likes: ContentLike[];
  commentIdToReply?: {
    commentId: ObjectId;
    userId: ObjectId;
    name: string;
  };
  path?: string; // only for books, not in quick yet:
  destination: 'book_page' | 'text' | 'video' | 'post';
  date: ISODate;
  pageInfo?: CommentPageInfo; // for book_page comments
};

// for book_page comments
export type CommentPageInfo = {
  book: {
    title: {
      ru: string;
      cn: string;
    };
    _id: ObjectId; // book_id
  };
  belongsTo: ObjectId; // chapter_id
  ind: number; // page index
};

type CommentCardProps = {
  comment: CommentType;
  commentIdToReply: CommentIdToReply;
  addressees: Signal<Addressee[]>;
  notForReply?: boolean;
};

export const useCommentLike = globalAction$((params, ev): Promise<ContentLike[]> => {
  const token = ev.cookie.get('token')?.value;
  return ApiService.put(`/api/comments/like/${params._id}`, null, token, []);
}, zod$({ _id: z.string() }));

export const CommentCard = component$(
  ({ comment, commentIdToReply, addressees, notForReply }: CommentCardProps) => {
    const addDelLike = useCommentLike();
    const userState = useContext(userContext);
    const { loggedIn, isAdmin } = userState;
    const {
      _id,
      date,
      text,
      likes,
      user: { _id: userId, name: userName, newAvatar },
      destination: contentType,
      post_id: contentId,
      commentIdToReply: replyInfo,
    } = comment;
    const ownsComment = userState._id === userId;
    const canEdit = ownsComment || isAdmin;
    const isLiked = loggedIn && likes.some((like) => like.user === userState._id);

    const modalId = `edit-modal-${_id}`;
    const href = getContentPath(contentType, contentId, false, comment.pageInfo);
    const getAnchor = (id: string): string => `${id.slice(-3)}`;
    const anchor = getAnchor(_id);

    const writeToUser = $(() => {
      if (ownsComment || addressees.value.some((x) => x.id === userId)) return;
      addressees.value = [
        ...addressees.value,
        {
          id: userId,
          name: userName,
        },
      ];
    });
    return (
      <>
        <div class="card w-full bg-base-200 mb-3" id={anchor}>
          {replyInfo && (
            <div class="text-neutral-500 absolute left-0 top-0">
              <span class="ml-2 mt-1 text-xs">
                ответ <span class="badge badge-xs hover:badge-info">{replyInfo.name}</span> на
              </span>
              <Link
                href={`${href}#${getAnchor(replyInfo.commentId)}`}
                scroll={true}
                class="ml-1 mt-1 badge badge-xs hover:badge-info"
              >
                {`#${getAnchor(replyInfo.commentId)}`}
              </Link>
            </div>
          )}
          <div class="text-neutral-500 absolute right-0 top-0">
            <Link
              href={`${href}#${anchor}`}
              scroll={true}
              class="float-right mr-2 mt-1 badge badge-xs hover:badge-info"
            >
              {`#${anchor}`}
            </Link>
          </div>
          <div class="card-body">
            <div class="flex">
              <div
                class="tooltip tooltip-info mr-4"
                data-tip={ownsComment ? 'Это вы' : 'Обратиться к пользователю'}
              >
                <div class="avatar cursor-pointer" onClick$={writeToUser}>
                  <SmallAvatar newAvatar={newAvatar} userName={userName} />
                </div>
              </div>
              <div>
                <SafeText text={text} />
              </div>
            </div>

            <div class={'mt-2 flex justify-between'}>
              <UserDateDiv
                userId={userId}
                userName={userName}
                date={date}
                ptNum={2}
                isComment={true}
              />

              <div>
                {canEdit && (
                  <div class="tooltip tooltip-info" data-tip="Редактировать / удалить">
                    <label for={modalId} class={`btn btn-sm btn-info lowercase btn-outline`}>
                      {editSvg}
                    </label>
                  </div>
                )}
                <div
                  class="tooltip tooltip-info"
                  data-tip={getLikeBtnTooltipTxt(likes, 'Никто не лайкал')}
                >
                  <button
                    class={`btn btn-sm lowercase btn-info ${isLiked ? '' : 'btn-outline'} mx-1`}
                    type="button"
                    onClick$={() => {
                      if (!loggedIn || ownsComment) return;
                      addDelLike.submit({ _id });
                    }}
                  >
                    {thumbUpSvg} {likes.length > 0 && <span>{likes.length}</span>}
                  </button>
                </div>
                {!ownsComment && !notForReply && (
                  <div
                    class="tooltip tooltip-info"
                    data-tip={loggedIn ? 'Ответить' : 'Авторизуйтесь для ответа'}
                  >
                    <button
                      class={`btn btn-sm btn-info lowercase btn-outline`}
                      type="button"
                      disabled={!loggedIn}
                      onClick$={() => {
                        if (!commentIdToReply) return;
                        commentIdToReply.commentId = _id;
                        commentIdToReply.name = userName;
                        commentIdToReply.userId = userId;
                      }}
                    >
                      {arrorUturnDown}
                    </button>
                  </div>
                )}
              </div>

              <EditCommentModal modalId={modalId} comment={comment} />
            </div>
          </div>
        </div>
      </>
    );
  },
);
