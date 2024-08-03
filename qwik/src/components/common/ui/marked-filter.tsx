import { component$, type Signal } from '@builder.io/qwik';
import { type MarkedSignalUnion } from '~/routes/read/texts/all';

type MarkedFilterProps = {
  markedSignal: Signal<MarkedSignalUnion>;
  loggedIn: boolean;
};
export const MarkedFilter = component$(({ markedSignal, loggedIn }: MarkedFilterProps) => {
  return (
    <div class="form-control text-base-content">
      <select
        disabled={!loggedIn}
        class="select select-bordered"
        value={markedSignal.value}
        onChange$={(e) => (markedSignal.value = e.target.value as MarkedSignalUnion)}
      >
        <option selected value={'all'}>
          В закладках и нет
        </option>
        <option value={'marked'}>В закладках</option>
        <option value={'not_marked'}>Вне закладок</option>
      </select>
    </div>
  );
});
