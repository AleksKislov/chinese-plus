import { component$, type Signal, useContext } from "@builder.io/qwik";
import { globalAction$, z, zod$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import { userContext } from "~/root";
import { type WhereType } from "../comments/comment-form";
import { heartSvg } from "../media/svg";

type LikeBtnProps = {
  likes: Signal<ContentLike[]>;
  contentType: WhereType;
  contentId: string;
  creatorId: string;
};

export const getLikeBtnTooltipTxt = (likes: ContentLike[], noLikesYetTxt: string): string => {
  return likes.length > 0
    ? likes.reduce((acc, x) => (acc += `${x.name}, `), "").slice(0, -2)
    : noLikesYetTxt;
};

export const useContentLike = globalAction$((params, ev) => {
  const token = ev.cookie.get("token")?.value;
  const { contentId, contentType } = params; // contentType currently = video | text
  return ApiService.put(`/api/${contentType}s/like/${contentId}`, null, token, {});
}, zod$({ contentId: z.string(), contentType: z.string() }));

export const LikeBtn = component$(({ likes, contentType, contentId, creatorId }: LikeBtnProps) => {
  const addDelLike = useContentLike();
  const userState = useContext(userContext);
  const { loggedIn } = userState;
  const ownsContent = userState._id === creatorId;
  const isRead = loggedIn && likes.value.some((like) => like.user === userState._id);

  return (
    <div
      class='tooltip tooltip-info'
      data-tip={getLikeBtnTooltipTxt(likes.value, "Сказать спасибо")}
    >
      <button
        class={`btn btn-sm ${isRead ? "btn-error" : "btn-outline btn-info"} ml-1`}
        type='button'
        onClick$={() => {
          if (!loggedIn || ownsContent) return;
          addDelLike.submit({ contentId, contentType });
          if (isRead) {
            likes.value = likes.value.filter((x) => x.user !== userState._id);
          } else {
            likes.value = [
              ...likes.value,
              { _id: "new", user: userState._id, name: userState.name },
            ];
          }
        }}
      >
        {heartSvg} {likes.value.length > 0 && <span>{likes.value.length}</span>}
      </button>
    </div>
  );
});
