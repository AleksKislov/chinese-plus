import { $, component$, useContext, useTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { AlertColorEnum, alertsContext } from '~/root';
import { parseTags } from '~/misc/helpers/content';
import { FlexRow } from '../common/layout/flex-row';
import { BlogBlocksEditor } from './blog-blocks-editor';
import { useEditBlogPost, type EditBlogStore } from '~/routes/(content)/edit/blog/[id]';

type EditBlogTextEditorProps = {
  store: EditBlogStore;
};

export const EditBlogTextEditor = component$(({ store }: EditBlogTextEditorProps) => {
  const editAction = useEditBlogPost();
  const alertsState = useContext(alertsContext);
  const nav = useNavigate();

  useTask$(({ track }) => {
    const res = track(() => editAction.value);
    if (res?._id) nav('/read/blog/' + res._id);
  });

  const save = $(() => {
    const { postId, title, content, tags, category, isApproved } = store;
    const hasContent = content.some(
      (block) => (block.type === 'text' && block.text.trim()) || block.type !== 'text',
    );

    if (!title.trim() || !hasContent) {
      alertsState.push({ bg: AlertColorEnum.error, text: 'Нужны заголовок и текст поста' });
      return;
    }

    editAction.submit({
      postId,
      title,
      content,
      category,
      isApproved,
      tags: parseTags(tags),
    });
  });

  return (
    <div class="text-base-content">
      <FlexRow>
        <div class="w-full mx-3">
          <div class="label">
            <span class="label-text">Текст поста</span>
          </div>
          <BlogBlocksEditor content={store.content} />
        </div>
      </FlexRow>

      <FlexRow>
        <div class="mt-3 ml-3">
          <button class="btn btn-primary w-48" disabled={editAction.isRunning} onClick$={save}>
            Сохранить
          </button>
        </div>
      </FlexRow>
    </div>
  );
});
