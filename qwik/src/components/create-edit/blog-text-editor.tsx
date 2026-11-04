import { $, component$, useContext, useTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { AlertColorEnum, alertsContext } from '~/root';
import { parseTags } from '~/misc/helpers/content';
import { FlexRow } from '../common/layout/flex-row';
import { BlogBlocksEditor } from './blog-blocks-editor';
import { usePublishBlogPost, type NewBlogStore } from '~/routes/(content)/create/blog';

type BlogTextEditorProps = {
  store: NewBlogStore;
};

export const BlogTextEditor = component$(({ store }: BlogTextEditorProps) => {
  const publishAction = usePublishBlogPost();
  const alertsState = useContext(alertsContext);
  const nav = useNavigate();

  useTask$(({ track }) => {
    const res = track(() => publishAction.value);
    if (res?._id) nav('/read/blog/' + res._id);
  });

  const publish = $(() => {
    const { title, content, tags, category } = store;
    const hasContent = content.some(
      (block) => (block.type === 'text' && block.text.trim()) || block.type !== 'text',
    );

    if (!title.trim() || !hasContent) {
      alertsState.push({ bg: AlertColorEnum.error, text: 'Нужны заголовок и текст поста' });
      return;
    }

    publishAction.submit({
      title,
      content,
      category,
      tags: parseTags(tags),
    });
  });

  return (
    <div class="text-base-content">
      <FlexRow>
        <div class="w-full">
          <div class="label">
            <span class="label-text">Текст поста</span>
          </div>
          <BlogBlocksEditor content={store.content} />
        </div>
      </FlexRow>

      <FlexRow>
        <div class="mt-3">
          <button class="btn btn-primary w-48" disabled={publishAction.isRunning} onClick$={publish}>
            Опубликовать
          </button>
        </div>
      </FlexRow>
    </div>
  );
});
