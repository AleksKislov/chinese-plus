import { component$, useContext, $, useSignal, useTask$, type Signal } from "@builder.io/qwik";
import { globalAction$, zod$, z } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import CONSTANTS from "~/misc/consts/consts";
import { userContext } from "~/root";
import { xMarkSvg } from "../media/svg";
import { EmojiSelect } from "./emoji-select";

export enum WHERE {
  post = "post",
  video = "video",
  text = "text",
  book = "book",
}

export type WhereType = "post" | "video" | "text" | "book";

export const useAddComment = globalAction$(
  (params, ev) => {
    const token = ev.cookie.get("token")?.value;
    const { path, addressees, commentIdToReply, text } = params;

    return ApiService.post(
      `/api/comments?where=${params.where}&id=${params.id}`,
      {
        text,
        path,
        addressees,
        commentIdToReply,
      },
      token,
      {}
    );
  },
  zod$({
    text: z.string(),
    id: z.string(),
    where: z.string(),
    path: z.string().optional(),
    commentIdToReply: z
      .object({
        commentId: z.string(),
        userId: z.string(),
        name: z.string(),
      })
      .optional(),
    addressees: z.array(
      z.object({
        id: z.string(),
      })
    ),
  })
);

type CommentFormProps = {
  contentId: string; // postId | textId | bookId | videoId
  where: WhereType;
  path?: string; // only for texts and books
  commentIdToReply: CommentIdToReply;
  addressees: Signal<Addressee[]>;
};

export type CommentIdToReply = {
  commentId: string;
  userId: string;
  name: string; // user name
};

export type Addressee = {
  id: string;
  name: string;
};

export const getAddresseeStr = (add: Addressee): string => {
  return `@@[${add.id}]{${add.name}}@@`;
};

export const CommentForm = component$(
  ({ contentId, where, path, commentIdToReply, addressees }: CommentFormProps) => {
    const userState = useContext(userContext);
    const addComment = useAddComment();
    const emoji = useSignal("");
    const { loggedIn } = userState;
    const newText = useSignal("");

    const unsetCommentToReply = $(() => {
      commentIdToReply.commentId = "";
      commentIdToReply.name = "";
      commentIdToReply.userId = "";
    });

    const submitPost = $(async () => {
      let text = newText.value.replace(/\n/g, "<br />");

      const foundUsers = parseForAddressees(newText.value);
      if (foundUsers.length) {
        foundUsers.forEach((user) => {
          text = text.replace(
            getAddresseeStr(user),
            `<strong class='text-info'>${user.name}</strong>`
          );
        });
      }

      await addComment.submit({
        id: contentId,
        text,
        where,
        path,
        addressees: addressees.value,
        commentIdToReply: commentIdToReply.commentId ? commentIdToReply : undefined,
      });

      unsetCommentToReply();
      addressees.value = [];
      newText.value = "";
      emoji.value = "";
    });

    return (
      <>
        <div class='card w-full bg-neutral mb-3 text-base-content'>
          <div class='card-body'>
            <div class={"flex justify-between mb-2"}>
              <h2 class='card-title pt-1 text-neutral-content'>Ваш комментарий</h2>
              <div class='card-actions'>
                <button class='btn btn-info btn-sm' disabled={!loggedIn} onClick$={submitPost}>
                  Опубликовать
                </button>
              </div>
            </div>

            <div
              class={loggedIn ? "" : "tooltip tooltip-info"}
              data-tip={loggedIn ? "" : "Авторизуйтесь"}
            >
              <CommentTextArea
                addressees={addressees}
                commentIdToReply={commentIdToReply}
                newText={newText}
                loggedIn={loggedIn}
                emoji={emoji}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
);

export const parseForAddressees = (txt: string): Addressee[] => {
  const resArr = txt.split("@@");
  const onlyNames = resArr.filter((x) => x[0] === "[" && x[x.length - 1] === "}");
  const userSet = Array.from(new Set(onlyNames));
  return userSet.map((x) => {
    const id = x.slice(1, x.indexOf("]"));
    const name = x.slice(x.indexOf("{") + 1, x.length - 1);
    return { id, name };
  });
};

type CommentTextAreaProps = {
  commentIdToReply: CommentIdToReply | null;
  addressees: Signal<Addressee[]>;
  loggedIn: boolean;
  newText: Signal<string>;
  emoji: Signal<string>;
};

export const CommentTextArea = component$(
  ({ addressees, commentIdToReply, newText, loggedIn, emoji }: CommentTextAreaProps) => {
    const unsetAddressee = $((add: Addressee) => {
      addressees.value = addressees.value.filter((x) => x.id !== add.id);
      newText.value = newText.value.replace(getAddresseeStr(add), "");
    });

    const unsetCommentToReply = $(() => {
      if (!commentIdToReply) return;
      commentIdToReply.commentId = "";
      commentIdToReply.name = "";
      commentIdToReply.userId = "";
    });

    useTask$(({ track }) => {
      track(() => addressees.value.length);
      const addressee = addressees.value.at(-1);

      if (!addressee) return;
      const str = getAddresseeStr(addressee);
      if (newText.value.includes(str)) return;
      newText.value += ` ${str}, `;
    });

    useTask$(({ track }) => {
      track(() => newText.value);
      if (!newText.value.includes("@@")) return;
      const found = parseForAddressees(newText.value);
      if (!found.length) return;

      found.forEach((x) => {
        if (addressees.value.find((adr) => adr.id === x.id)) return;
        addressees.value = [...addressees.value, x];
      });
    });

    useTask$(({ track }) => {
      track(() => emoji.value);
      newText.value += emoji.value;
      emoji.value = "";
    });

    return (
      <>
        {addressees.value.length > 0 && (
          <label class={"label"}>
            <span class={"label-text-alt"}>
              Вы обращаетесь к{" "}
              {addressees.value.map((x) => (
                <div
                  class='badge badge-primary cursor-pointer pl-3 mr-1'
                  onClick$={() => unsetAddressee(x)}
                >
                  {x.name} {xMarkSvg}
                </div>
              ))}
            </span>
          </label>
        )}
        <div class='form-control'>
          {commentIdToReply?.commentId && (
            <label class={"label"}>
              <span class={"label-text-alt"}>
                Вы отвечаете <div class='badge badge-primary'>{commentIdToReply.name}</div> на
                комментарий{" "}
                <div class='badge badge-primary cursor-pointer pl-3' onClick$={unsetCommentToReply}>
                  {`#${commentIdToReply.commentId.slice(-3)}`} {xMarkSvg}
                </div>
              </span>
            </label>
          )}

          <textarea
            class='textarea textarea-bordered'
            placeholder='Ваше сообщение'
            disabled={!loggedIn}
            value={newText.value}
            onKeyUp$={(e) => {
              newText.value = (e.target as HTMLInputElement).value;
            }}
          ></textarea>
          <div class='flex justify-between'>
            <label class='label'>
              <span
                class={`label-text-alt ${
                  newText.value.length > CONSTANTS.commentLength ? "text-error" : ""
                }`}
              >
                {newText.value.length} / {CONSTANTS.commentLength}
              </span>
            </label>
            {emoji && <EmojiSelect emoji={emoji} />}
          </div>
        </div>
      </>
    );
  }
);
