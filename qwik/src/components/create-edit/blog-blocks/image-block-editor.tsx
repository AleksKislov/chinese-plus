import { component$ } from '@builder.io/qwik';
import { type BlogImageBlock } from '~/misc/helpers/content';
import { BlogImagePicker } from '../blog-image-uploader';

export const ImageBlockEditor = component$(({ block }: { block: BlogImageBlock }) => {
  return (
    <div>
      <BlogImagePicker initialUrl={block.url} onChange$={(url) => (block.url = url)} />
      {block.url && <img src={block.url} alt="" class="max-h-64 rounded-md mt-2" />}
      <input
        type="text"
        placeholder="Подпись к картинке (не обязательно)"
        class="input input-bordered input-sm w-full mt-2"
        value={block.caption}
        onChange$={(e) => (block.caption = (e.target as HTMLInputElement).value)}
      />
    </div>
  );
});
