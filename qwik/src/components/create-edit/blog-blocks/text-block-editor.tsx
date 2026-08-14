import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { type BlogTextBlock } from '~/misc/helpers/content';

const autoGrow = $((el: HTMLTextAreaElement) => {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
});

export const TextBlockEditor = component$(({ block }: { block: BlogTextBlock }) => {
  const textareaRef = useSignal<HTMLTextAreaElement>();

  useVisibleTask$(({ track }) => {
    track(() => textareaRef.value);
    if (textareaRef.value) autoGrow(textareaRef.value);
  });

  return (
    <textarea
      ref={textareaRef}
      class="w-full resize-none border-none bg-transparent focus:outline-none px-0 py-1"
      placeholder="Текст..."
      value={block.text}
      onInput$={(e) => {
        const el = e.target as HTMLTextAreaElement;
        block.text = el.value;
        autoGrow(el);
      }}
    ></textarea>
  );
});
