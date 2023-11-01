import { component$, type Signal } from "@builder.io/qwik";

type LvlFilterProps = {
  levelSignal: Signal<string>;
};
export const LevelFilter = component$(({ levelSignal }: LvlFilterProps) => {
  return (
    <div class='form-control'>
      <select
        class='select select-bordered'
        value={levelSignal.value}
        onChange$={(e) => {
          levelSignal.value = e.target.value;
        }}
      >
        <option selected value={"0"}>
          Все уровни
        </option>
        <option value={1}>1 Простой ⭐</option>
        <option value={2}>2 Средний ⭐⭐</option>
        <option value={3}>3 Сложный ⭐⭐⭐</option>
      </select>
    </div>
  );
});
