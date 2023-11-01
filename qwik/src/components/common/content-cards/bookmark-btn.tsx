import { component$, useContext } from "@builder.io/qwik";
import { globalAction$, z, zod$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import { userContext } from "~/root";
import { WHERE, type WhereType } from "../comments/comment-form";
import { bookMarkSvg } from "../media/svg";

export const useMarkContent = globalAction$(
  (params, ev) => {
    const token = ev.cookie.get("token")?.value;
    const { contentId, contentType, bookMarked } = params;
    const method = contentType === WHERE.text ? "mark_finished_texts" : "mark_as_seen";
    const path = bookMarked ? `un${method}` : method;
    return ApiService.post(`/api/${contentType}s/${path}/${contentId}`, {}, token, {});
  },
  zod$({
    contentId: z.string(), // currently only texts
    contentType: z.string(),
    bookMarked: z.boolean(),
  })
);

type BookmarkBtnProps = {
  contentId: string;
  contentType: WhereType;
};

export const BookmarkBtn = component$(({ contentId, contentType }: BookmarkBtnProps) => {
  const markContent = useMarkContent();
  const userState = useContext(userContext);
  const { loggedIn, finishedTexts, seenVideos } = userState;
  const bookMarked =
    loggedIn && contentType === WHERE.text
      ? finishedTexts.includes(contentId)
      : seenVideos.includes(contentId);

  return (
    <div class='tooltip tooltip-info' data-tip={"В закладки"}>
      <button
        class={`btn btn-sm ${bookMarked ? "btn-error" : "btn-outline btn-info"} ml-1`}
        type='button'
        onClick$={() => {
          if (!loggedIn) return;
          markContent.submit({
            contentId,
            contentType,
            bookMarked: bookMarked,
          });

          if (bookMarked) {
            if (contentType === WHERE.text) {
              userState.finishedTexts = userState.finishedTexts.filter((x) => x !== contentId);
            } else {
              userState.seenVideos = userState.seenVideos.filter((x) => x !== contentId);
            }
          } else {
            if (contentType === WHERE.text) {
              userState.finishedTexts = [...userState.finishedTexts, contentId];
            } else {
              userState.seenVideos = [...userState.seenVideos, contentId];
            }
          }
        }}
      >
        {bookMarkSvg}
      </button>
    </div>
  );
});
