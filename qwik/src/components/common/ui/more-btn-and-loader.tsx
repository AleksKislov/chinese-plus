import { type Signal, component$ } from '@builder.io/qwik';
import { Loader } from './loader';

type MoreBtnProps = {
  isLoading: boolean;
  skipSignal: Signal<number>;
};

export const MoreBtnAndLoader = component$(({ isLoading, skipSignal }: MoreBtnProps) => {
  return (
    <div class={'flex flex-col items-center mt-1'}>
      <span class="mb-3">{isLoading && <Loader />}</span>

      <button
        type="button"
        class={`btn btn-sm btn-info btn-outline`}
        onClick$={() => (skipSignal.value += 10)}
      >
        Еще
      </button>
    </div>
  );
});
