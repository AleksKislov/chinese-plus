import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { type BlogCarouselImage } from '~/misc/helpers/content';

type BlogCarouselProps = {
  images: BlogCarouselImage[];
  idPrefix: string;
};

// scrolls only the carousel track's own scrollLeft, so the page never scrolls
// vertically (scrollIntoView's block:'nearest' still occasionally jumped the page)
const scrollToSlide = $((carouselId: string, slideId: string) => {
  const carousel = document.getElementById(carouselId);
  const slide = document.getElementById(slideId);
  if (carousel && slide) {
    carousel.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
  }
});

export const BlogCarousel = component$(({ images, idPrefix }: BlogCarouselProps) => {
  if (!images.length) return null;

  // all slides sit in one flex row, so the row's own height is set by the
  // tallest photo even while a shorter one is showing - track the currently
  // visible slide's own height and apply it explicitly to avoid that gap
  const trackHeight = useSignal<number | null>(null);

  useVisibleTask$(({ cleanup }) => {
    const carousel = document.getElementById(idPrefix);
    if (!carousel) return;
    const imgEls = Array.from(carousel.querySelectorAll('img'));

    const sync = () => {
      const width = carousel.clientWidth || 1;
      const activeIndex = Math.round(carousel.scrollLeft / width);
      const activeImg = imgEls[activeIndex];
      if (activeImg?.offsetHeight) trackHeight.value = activeImg.offsetHeight;
    };

    sync();
    imgEls.forEach((el) => el.addEventListener('load', sync));
    carousel.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);

    cleanup(() => {
      imgEls.forEach((el) => el.removeEventListener('load', sync));
      carousel.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    });
  });

  return (
    <div
      id={idPrefix}
      class="carousel w-full not-prose relative overflow-y-hidden transition-[height] duration-300"
      style={trackHeight.value ? { height: `${trackHeight.value}px` } : {}}
    >
      {images.map((img, i) => {
        const id = `${idPrefix}-${i}`;
        const prevId = `${idPrefix}-${(i - 1 + images.length) % images.length}`;
        const nextId = `${idPrefix}-${(i + 1) % images.length}`;

        return (
          <div key={id} id={id} class="carousel-item w-full items-start">
            {/* sized to the image itself (not the row), so overlays center on this slide, not the tallest one */}
            <div class="relative w-full [container-type:inline-size]">
              {/* max-h caps portrait photos at a square (height <= width); wide photos are already shorter than that, so they're unaffected.
                  object-contain shows the whole photo uncropped, letterboxed with empty space left/right rather than cropped top/bottom */}
              <img
                src={img.url}
                alt={img.caption || ''}
                class="w-full max-h-[100cqw] object-contain rounded-md"
              />

              {images.length > 1 && (
                <div class="absolute flex justify-between transform -translate-y-1/2 left-3 right-3 top-1/2">
                  <button
                    type="button"
                    class="btn btn-circle btn-sm"
                    onClick$={() => scrollToSlide(idPrefix, prevId)}
                  >
                    ❮
                  </button>
                  <button
                    type="button"
                    class="btn btn-circle btn-sm"
                    onClick$={() => scrollToSlide(idPrefix, nextId)}
                  >
                    ❯
                  </button>
                </div>
              )}

              {img.caption && (
                <div class="absolute bottom-2 left-0 right-0 text-center text-sm">
                  <span class="bg-base-300/80 px-2 py-1 rounded">{img.caption}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
