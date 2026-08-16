import { $, component$, useSignal } from '@builder.io/qwik';
import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { type CommentType } from './comment-card';
import {
  type Addressee,
  CommentTextArea,
  WHERE,
  type WhereType,
  ADDRESSEE_TOKEN_REGEX,
  AddresseeTag,
} from './comment-form';

type EditCommentProps = {
  modalId: string;
  comment: CommentType;
};

export const pathWhereMap: { [key: string]: WhereType } = {
  feedback: WHERE.post,
  texts: WHERE.text,
  books: WHERE.book,
  videos: WHERE.video,
};

export const useDelComment = globalAction$((params, ev) => {
  const token = ev.cookie.get('token')?.value;
  const { commentId, contentId, destination } = params;
  return ApiService.delete(`/api/${destination}s/comment/${contentId}/${commentId}`, token, {});
}, zod$({ commentId: z.string(), contentId: z.string(), destination: z.string() }));

export const useEditComment = globalAction$((body, ev) => {
  const token = ev.cookie.get('token')?.value;
  return ApiService.post(`/api/comments/edit`, body, token, {});
}, zod$({ id: z.string(), text: z.string() }));

export const EditCommentModal = component$(({ modalId, comment }: EditCommentProps) => {
  const delComment = useDelComment();
  const editComment = useEditComment();
  const { _id: commentId, post_id: contentId, text, destination } = comment;
  const emoji = useSignal('');
  const newText = useSignal(text);
  const addressees = useSignal<Addressee[]>([]);

  const submitPost = $(async () => {
    const text = newText.value.replace(ADDRESSEE_TOKEN_REGEX, (_match, _id1, name1, _id2, name2) => {
      const name = name1 ?? name2;
      return `${AddresseeTag.start}${name}${AddresseeTag.end}`;
    });

    await editComment.submit({ id: commentId, text });

    addressees.value = [];
    newText.value = '';
    emoji.value = '';
  });

  return (
    <>
      <input type="checkbox" id={modalId} class="modal-toggle" />
      <div class="modal">
        <div class="modal-box relative">
          <label for={modalId} class="btn btn-sm btn-circle absolute right-2 top-2">
            ✕
          </label>

          <h2 class="text-lg font-bold mb-2">Редактировать / удалить</h2>

          <CommentTextArea
            loggedIn={true}
            newText={newText}
            addressees={addressees}
            emoji={emoji}
            commentIdToReply={null}
          />

          <div class="modal-action">
            <label
              for={modalId}
              class="btn btn-error btn-outline btn-sm"
              onClick$={() => delComment.submit({ commentId, contentId, destination })}
            >
              Удалить
            </label>
            <label for={modalId} class="btn btn-info btn-outline btn-sm" onClick$={submitPost}>
              Отредактировать
            </label>
          </div>
        </div>
      </div>
    </>
  );
});
