import { $, component$, useContext, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { AlertColorEnum, alertsContext } from '~/root';
import { FlexRow } from '../common/layout/flex-row';
import { CarouselImagesPicker } from './carousel-images-picker';
import { useEditBlogPost, type EditBlogStore } from '~/routes/(content)/edit/blog/[id]';
import { type BlogBlock, type BlogCarouselImage } from '~/misc/helpers/content';

type EditSimplePostEditorProps = {
  store: EditBlogStore;
};

// returns plain copies, never a live reference into store.content's own proxy
function extractImages(content: BlogBlock[]): BlogCarouselImage[] {
  for (const block of content) {
    if (block.type === 'image' && block.url) return [{ url: block.url }];
    if (block.type === 'carousel') return block.images.map((img) => ({ ...img }));
  }
  return [];
}

function extractText(content: BlogBlock[]): string {
  const textBlock = content.find((block) => block.type === 'text');
  return textBlock && textBlock.type === 'text' ? textBlock.text : '';
}

export const EditSimplePostEditor = component$(({ store }: EditSimplePostEditorProps) => {
  const editAction = useEditBlogPost();
  const alertsState = useContext(alertsContext);
  const nav = useNavigate();

  const images = useStore<BlogCarouselImage[]>(extractImages(store.content));
  const text = useSignal(extractText(store.content));

  useTask$(({ track }) => {
    const res = track(() => editAction.value);
    if (res?._id) nav('/read/blog/' + res._id);
  });

  const save = $(() => {
    if (!store.title.trim()) {
      alertsState.push({ bg: AlertColorEnum.error, text: 'Нужен заголовок' });
      return;
    }

    const content: BlogBlock[] = [];
    if (images.length) content.push({ type: 'carousel', images: [...images] });
    if (text.value.trim()) content.push({ type: 'text', text: text.value.trim() });

    if (!content.length) {
      alertsState.push({ bg: AlertColorEnum.error, text: 'Добавьте картинку или текст' });
      return;
    }

    editAction.submit({
      postId: store.postId,
      title: store.title,
      content,
      isApproved: store.isApproved,
    });
  });

  return (
    <div class="text-base-content">
      <FlexRow>
        <div class="w-full mx-3">
          <input
            type="text"
            placeholder="Заголовок"
            class="input input-bordered w-full mb-3"
            value={store.title}
            onChange$={(e) => (store.title = (e.target as HTMLInputElement).value)}
          />

          <CarouselImagesPicker images={images} />

          <textarea
            class="textarea textarea-bordered w-full mt-3"
            placeholder="Текст (не обязательно)"
            value={text.value}
            onChange$={(e) => (text.value = (e.target as HTMLTextAreaElement).value)}
          ></textarea>
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
