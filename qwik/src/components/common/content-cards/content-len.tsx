import { component$ } from '@builder.io/qwik';

export const ContentLen = component$(({ len, isBook }: { len: number; isBook?: boolean }) => {
  return (
    <>
      {len > 0 ? (
        <div>
          <span class="font-bold">Длина{isBook ? ' книги' : ''}: </span>
          <div class="badge badge-accent badge-outline">{len}</div> 字
        </div>
      ) : (
        <></>
      )}
    </>
  );
});
