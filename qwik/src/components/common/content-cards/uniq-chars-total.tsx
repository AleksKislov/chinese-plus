import { component$ } from '@builder.io/qwik';

export const UniqCharsTotal = component$(({ num }: { num?: number }) => {
  return (
    <>
      {num && num > 0 ? (
        <div>
          <span class="font-bold">Уникальных: </span>
          <div class="badge badge-accent badge-outline">{num}</div> 字
        </div>
      ) : (
        <></>
      )}
    </>
  );
});
