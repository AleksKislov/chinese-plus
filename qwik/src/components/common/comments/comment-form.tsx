import { component$, useContext, $, useSignal, useTask$, type Signal } from '@builder.io/qwik';
import { globalAction$, zod$, z } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import CONSTANTS from '~/misc/consts/consts';
import { userContext } from '~/root';
import { xMarkSvg } from '../media/svg';
import { EmojiSelect } from './emoji-select';

export enum WHERE {
  video = 'video',
  text = 'text',
  book = 'book_page',
  phoneticsLesson = 'phoneticsLesson',
  charactersLesson = 'charactersLesson',
  blog = 'blog',
}

export type WhereType =
  | 'video'
  | 'text'
  | 'book_page'
  | 'phoneticsLesson'
  | 'charactersLesson'
  | 'blog';

export const useAddComment = globalAction$(
  (params, ev) => {
    const token = ev.cookie.get('token')?.value;
    const { path, addressees, commentIdToReply, text } = params;

    return ApiService.post(
      `/api/comments?where=${params.where}&id=${encodeURIComponent(params.id)}`,
      {
        text,
        path,
        addressees,
        commentIdToReply,
      },
      token,
      {},
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
      }),
    ),
  }),
);

type CommentFormProps = {
  contentId: string; // postId | textId | bookId | videoId
  where: WhereType;
  path?: string; // only for texts and books
  commentIdToReply: CommentIdToReply;
  addressees: Signal<Addressee[]>;
  mentionCandidates?: Addressee[];
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
  return `@[${add.id}]{${add.name}}@`;
};

// accepts both the current single-@ token (@[id]{name}@) and the old
// double-@ one (@@[id]{name}@@) so previously-typed drafts/links still work
export const ADDRESSEE_TOKEN_REGEX = /@@\[([^\]]+)\]\{([^}]+)\}@@|@\[([^\]]+)\]\{([^}]+)\}@/g;

export const AddresseeTag = {
  start: `<strong class='text-info'>`,
  end: '</strong>',
};

export const CommentForm = component$(
  ({
    contentId,
    where,
    path,
    commentIdToReply,
    addressees,
    mentionCandidates = [],
  }: CommentFormProps) => {
    const userState = useContext(userContext);
    const addComment = useAddComment();
    const emoji = useSignal('');
    const { loggedIn } = userState;
    const newText = useSignal('');
    const alreadySubmitted = useSignal(false);

    const unsetCommentToReply = $(() => {
      commentIdToReply.commentId = '';
      commentIdToReply.name = '';
      commentIdToReply.userId = '';
    });

    const submitPost = $(async () => {
      alreadySubmitted.value = true;

      // replaces every mention token (old @@..@@ or new @..@ form) with its
      // display HTML in one pass, so repeated mentions of the same person
      // and mixed old/new tokens in the same draft both resolve correctly
      const text = newText.value.replace(ADDRESSEE_TOKEN_REGEX, (_match, _id1, name1, _id2, name2) => {
        const name = name1 ?? name2;
        return `${AddresseeTag.start}${name}${AddresseeTag.end}`;
      });

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
      newText.value = '';
      emoji.value = '';

      setTimeout(() => {
        alreadySubmitted.value = false;
      }, 1000);
    });

    return (
      <>
        <div class="card w-full bg-base-300 mb-3">
          <div class="card-body">
            <div class={'flex justify-between mb-2'}>
              <h2 class="card-title pt-1">Ваш комментарий</h2>
              <div class="card-actions">
                <button
                  class="btn btn-info btn-sm"
                  disabled={!loggedIn || alreadySubmitted.value}
                  onClick$={submitPost}
                >
                  Опубликовать
                </button>
              </div>
            </div>

            <div
              class={loggedIn ? '' : 'tooltip tooltip-info'}
              data-tip={loggedIn ? '' : 'Авторизуйтесь'}
            >
              <CommentTextArea
                addressees={addressees}
                commentIdToReply={commentIdToReply}
                newText={newText}
                loggedIn={loggedIn}
                emoji={emoji}
                mentionCandidates={mentionCandidates}
              />
            </div>
          </div>
        </div>
      </>
    );
  },
);

export const parseForAddressees = (txt: string): Addressee[] => {
  const found: Addressee[] = [];
  const seen = new Set<string>();

  let match: RegExpExecArray | null;
  ADDRESSEE_TOKEN_REGEX.lastIndex = 0;
  while ((match = ADDRESSEE_TOKEN_REGEX.exec(txt))) {
    const id = match[1] ?? match[3];
    const name = match[2] ?? match[4];
    const key = `${id}:${name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    found.push({ id, name });
  }

  return found;
};

type CommentTextAreaProps = {
  commentIdToReply: CommentIdToReply | null;
  addressees: Signal<Addressee[]>;
  loggedIn: boolean;
  newText: Signal<string>;
  emoji: Signal<string>;
  mentionCandidates?: Addressee[];
};

// an "@" preceded by start-of-text/whitespace (not another "@", so it doesn't
// re-trigger inside an already-inserted @[id]{name}@ token), followed by the query
const MENTION_TRIGGER_REGEX = /(?:^|\s)@([^\s@]{0,30})$/;

export const CommentTextArea = component$(
  ({
    addressees,
    commentIdToReply,
    newText,
    loggedIn,
    emoji,
    mentionCandidates = [],
  }: CommentTextAreaProps) => {
    const userState = useContext(userContext);
    const textareaRef = useSignal<HTMLTextAreaElement>();
    const mentionQuery = useSignal<string | null>(null);

    const mentionOptions =
      mentionQuery.value === null
        ? []
        : mentionCandidates
            .filter(
              (c) =>
                c.id !== userState._id &&
                c.name.toLowerCase().includes(mentionQuery.value!.toLowerCase()),
            )
            .slice(0, 5);

    const selectMention = $((candidate: Addressee) => {
      const caret = textareaRef.value?.selectionStart ?? newText.value.length;
      const before = newText.value.slice(0, caret);
      const after = newText.value.slice(caret);

      const replacedBefore = before.replace(MENTION_TRIGGER_REGEX, (match) => {
        const leadingChar = match.startsWith('@') ? '' : match[0];
        return `${leadingChar}${getAddresseeStr(candidate)} `;
      });

      newText.value = replacedBefore + after;
      mentionQuery.value = null;
    });

    const unsetAddressee = $((add: Addressee) => {
      addressees.value = addressees.value.filter((x) => x.id !== add.id);
      newText.value = newText.value.replace(getAddresseeStr(add), '');
    });

    const unsetCommentToReply = $(() => {
      if (!commentIdToReply) return;
      commentIdToReply.commentId = '';
      commentIdToReply.name = '';
      commentIdToReply.userId = '';
    });

    useTask$(({ track }) => {
      track(() => addressees.value.length);
      const addressee = addressees.value[addressees.value.length - 1];

      if (!addressee) return;
      const str = getAddresseeStr(addressee);
      if (newText.value.includes(str)) return;
      newText.value += ` ${str}, `;
    });

    useTask$(({ track }) => {
      track(() => newText.value);
      if (!newText.value.includes('@[')) return;
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
      emoji.value = '';
    });

    return (
      <>
        {addressees.value.length > 0 && (
          <label class={'label'}>
            <span class={'label-text-alt'}>
              Вы обращаетесь к{' '}
              {addressees.value.map((x, ind) => (
                <div
                  key={ind}
                  class="badge badge-primary cursor-pointer pl-3 mr-1"
                  onClick$={() => unsetAddressee(x)}
                >
                  {x.name} {xMarkSvg}
                </div>
              ))}
            </span>
          </label>
        )}
        <div class="form-control relative">
          {commentIdToReply?.commentId && (
            <label class={'label'}>
              <span class={'label-text-alt'}>
                Вы отвечаете <div class="badge badge-primary">{commentIdToReply.name}</div> на
                комментарий{' '}
                <div class="badge badge-primary cursor-pointer pl-3" onClick$={unsetCommentToReply}>
                  {`#${commentIdToReply.commentId.slice(-3)}`} {xMarkSvg}
                </div>
              </span>
            </label>
          )}

          <textarea
            ref={textareaRef}
            class={`textarea textarea-bordered`}
            placeholder="Ваше сообщение, @ чтобы обратиться к кому-то"
            disabled={!loggedIn}
            value={newText.value}
            onKeyUp$={(e) => {
              const el = e.target as HTMLTextAreaElement;
              newText.value = el.value;

              const beforeCaret = el.value.slice(0, el.selectionStart);
              const match = beforeCaret.match(MENTION_TRIGGER_REGEX);
              mentionQuery.value = match ? match[1] : null;
            }}
            onBlur$={() => {
              // delay so a click on a dropdown option still registers before it closes
              setTimeout(() => (mentionQuery.value = null), 150);
            }}
          ></textarea>

          {mentionQuery.value !== null && mentionOptions.length > 0 && (
            <ul class="menu bg-neutral text-neutral-content rounded-box shadow-lg border border-base-content/10 absolute z-10 top-full mt-1 w-56 p-1">
              {mentionOptions.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onMouseDown$={(e) => e.preventDefault()}
                    onClick$={() => selectMention(c)}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div class="flex justify-between">
            <label class="label">
              <span
                class={`label-text-alt ${
                  newText.value.length > CONSTANTS.commentLength ? 'text-error' : ''
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
  },
);
