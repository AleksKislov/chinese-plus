import { component$ } from '@builder.io/qwik';

export const CategoryBadge = component$(({ txt, size }: { txt: string; size?: string }) => {
  return <span class={`badge badge-accent badge-outline ${size ? size : ''}`}>{txt}</span>;
});
