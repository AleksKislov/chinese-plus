import { $, component$, useContext, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { AlertColorEnum, alertsContext } from '~/root';
import { FlexRow } from '../common/layout/flex-row';
import { CarouselImagesPicker } from './carousel-images-picker';
import { usePublishBlogPost, type NewBlogStore } from '~/routes/(content)/create/blog';
import { type BlogBlock, type BlogCarouselImage } from '~/misc/helpers/content';

type SimplePostEditorProps = {
  store: NewBlogStore;
};

// best-effort: lets toggling simple<->article keep whatever was already entered
// (returns plain copies, never a live reference into store.content's own proxy)
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

export const SimplePostEditor = component$(({ store }: SimplePostEditorProps) => {
  const publishAction = usePublishBlogPost();
  const alertsState = useContext(alertsContext);
  const nav = useNavigate();

  const images = useStore<BlogCarouselImage[]>(extractImages(store.content));
  const text = useSignal(extractText(store.content));

  useTask$(({ track }) => {
    const res = track(() => publishAction.value);
    if (res?._id) nav('/read/blog/' + res._id);
  });

  const publish = $(() => {
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

    publishAction.submit({ postType: 'simple', title: store.title, content });
  });

  return (
    <div class="text-base-content">
      <FlexRow>
        <div class="w-full">
          <div class="form-control w-full mb-3">
            <label class="label">
              <span class="label-text">Заголовок</span>
            </label>
            <input
              type="text"
              placeholder="Заголовок"
              class="input input-bordered w-full"
              value={store.title}
              onChange$={(e) => (store.title = (e.target as HTMLInputElement).value)}
            />
          </div>

          <div class="form-control w-full mb-3">
            <label class="label">
              <span class="label-text">Фото (не обязательно)</span>
            </label>
            <CarouselImagesPicker images={images} />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Текст (не обязательно)</span>
            </label>
            <textarea
              class="textarea textarea-bordered w-full"
              placeholder="Текст (не обязательно)"
              value={text.value}
              onChange$={(e) => (text.value = (e.target as HTMLTextAreaElement).value)}
            ></textarea>
          </div>
        </div>
      </FlexRow>

      <FlexRow>
        <div class="mt-3">
          <button
            class="btn btn-primary w-48"
            disabled={publishAction.isRunning}
            onClick$={publish}
          >
            Опубликовать
          </button>
        </div>
      </FlexRow>
    </div>
  );
});
