import { component$ } from '@builder.io/qwik';

export const Loader = component$(({ size }: { size?: string }) => {
  const loaderSize = size ? 'loading-' + size : 'loading-lg';
  return <span class={`loading loading-spinner ${loaderSize}`}></span>;
});
