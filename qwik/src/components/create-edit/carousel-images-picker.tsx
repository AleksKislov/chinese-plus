import { $, component$, useSignal } from '@builder.io/qwik';
import { xMarkSvg } from '../common/media/svg';
import { BlogImagePicker } from './blog-image-uploader';
import { type BlogCarouselImage } from '~/misc/helpers/content';

type CarouselImagesPickerProps = {
  images: BlogCarouselImage[];
};

// instagram/twitter-style: a row of small square thumbnails, always ending in
// one "+" square to add the next picture (browse or paste a link)
export const CarouselImagesPicker = component$(({ images }: CarouselImagesPickerProps) => {
  const isAdding = useSignal(false);

  const removeImage = $((ind: number) => {
    images.splice(ind, 1);
  });

  const onPicked = $((url: string) => {
    images.push({ url });
    isAdding.value = false;
  });

  return (
    <div class="flex flex-wrap items-start gap-2">
      {images.map((img, ind) => (
        <div key={ind} class="relative w-20 h-20 shrink-0">
          <img src={img.url} alt="" class="w-20 h-20 object-cover rounded-md" />
          <button
            type="button"
            class="btn btn-xs btn-circle btn-error absolute -top-2 -right-2"
            onClick$={() => removeImage(ind)}
          >
            {xMarkSvg}
          </button>
        </div>
      ))}

      {isAdding.value ? (
        <div class="w-56 shrink-0">
          <BlogImagePicker onChange$={onPicked} />
        </div>
      ) : (
        <button
          type="button"
          class="w-20 h-20 shrink-0 flex items-center justify-center border-2 border-dashed border-base-content/30 rounded-md text-3xl text-base-content/50 hover:border-base-content/60 hover:text-base-content/80"
          onClick$={() => (isAdding.value = true)}
        >
          +
        </button>
      )}
    </div>
  );
});
