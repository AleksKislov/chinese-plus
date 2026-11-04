import { component$ } from '@builder.io/qwik';
import { type BlogCarouselBlock } from '~/misc/helpers/content';
import { CarouselImagesPicker } from '../carousel-images-picker';

export const CarouselBlockEditor = component$(({ block }: { block: BlogCarouselBlock }) => {
  return <CarouselImagesPicker images={block.images} />;
});
