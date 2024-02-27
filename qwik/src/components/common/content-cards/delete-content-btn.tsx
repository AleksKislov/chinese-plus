import { component$, useContext } from "@builder.io/qwik";
import { userContext } from "~/root";
import { type WhereType } from "../comments/comment-form";
import { globalAction$, z, zod$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";

type EditBtnProps = {
  contentType: WhereType;
  contentId: ObjectId;
};

export const useDeleteContent = globalAction$((params, ev): Promise<ContentLike[]> => {
  const token = ev.cookie.get("token")?.value;
  const { contentId, contentType } = params;
  return ApiService.delete(`/api/${contentType}s/delete/${contentId}`, token);
}, zod$({ contentType: z.string(), contentId: z.string() }));

export const DeleteContentBtn = component$(({ contentType, contentId }: EditBtnProps) => {
  const userState = useContext(userContext);
  const { isAdmin } = userState;
  const deleteContent = useDeleteContent();

  return isAdmin ? (
    <div class='dropdown'>
      <div tabIndex={0} role='button' class='btn btn-sm btn-outline btn-error'>
        DEL
      </div>
      <div tabIndex={0} class='dropdown-content z-[1] card card-compact w-24 bg-base-100 '>
        <div class='card-body'>
          <button
            class='btn btn-sm btn-outline btn-error mt-2'
            type='button'
            onClick$={() => {
              deleteContent.submit({ contentType, contentId });
              // nav("/");
            }}
          >
            DEL
          </button>
        </div>
      </div>
    </div>
  ) : null;
});
