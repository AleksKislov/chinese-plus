import { component$, type Signal, useContext } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { userContext } from "~/root";
import { msgTypes, type Post } from "~/routes/feedback";
import { WHERE, type Addressee } from "../common/comments/comment-form";
import { UserDateDiv } from "../common/comments/user-with-date";
import { CommentsBtn } from "../common/content-cards/comments-btn";
import { SmallAvatar } from "../common/ui/small-avatar";

type PostCardProps = {
  post: Post;
  isPostPage: boolean;
  addressees: Signal<Addressee[]> | null;
};

export const PostCard = component$(({ post, isPostPage, addressees }: PostCardProps) => {
  const { _id, title, tag, user: userInfo, date, comments_id: commentIds, text } = post;
  const userState = useContext(userContext);
  const ownsPost = userState._id === userInfo._id;

  return (
    <div class='card w-full bg-neutral mb-3'>
      <div class='card-body'>
        <div class='flex'>
          <div
            class='tooltip tooltip-info mr-4'
            data-tip={ownsPost ? "Это вы" : "Обратиться к пользователю"}
          >
            <div
              class='avatar'
              onClick$={() => {
                if (
                  !addressees ||
                  ownsPost ||
                  addressees.value.some((x) => x.id === userInfo._id)
                ) {
                  return;
                }
                addressees.value = [...addressees.value, { id: userInfo._id, name: userInfo.name }];
              }}
            >
              <SmallAvatar newAvatar={userInfo.newAvatar} userName={userInfo.name} />
            </div>
          </div>
          <div>
            <h2 class='card-title mb-1 hover:text-accent'>
              {isPostPage ? title : <Link href={`/feedback/${_id}`}>{title}</Link>}
            </h2>
            <span class='badge badge-info mr-1 badge-outline ml-2'>{msgTypes[tag]}</span>
          </div>
        </div>
        <p class={"mt-2"} dangerouslySetInnerHTML={text}></p>

        <div class={"flex justify-between"}>
          <UserDateDiv userId={userInfo._id} userName={userInfo.name} date={date} ptNum={2} />

          {!isPostPage && (
            <CommentsBtn
              contentId={post._id}
              contentType={WHERE.post}
              commentIdsLen={commentIds.length}
            />
          )}
        </div>
      </div>
    </div>
  );
});
