import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { moonSvg, sunSvg } from "../../media/svg";

export const ThemeTypes = {
  dark: "night",
  light: "emerald",
};

export const ThemeChanger = component$(() => {
  const themeChangedToDark = useSignal(true);
  const checkBox = useSignal(true);

  useVisibleTask$(({ track }) => {
    track(() => themeChangedToDark.value);

    if (!localStorage.theme || localStorage.theme === ThemeTypes.dark) {
      localStorage.theme = ThemeTypes.light;
      checkBox.value = false;
    } else {
      localStorage.theme = ThemeTypes.dark;
      checkBox.value = true;
    }
  });

  return (
    <li tabIndex={0} class='my-1'>
      <label class='swap swap-rotate'>
        <input
          type='checkbox'
          checked={checkBox.value}
          onClick$={() => {
            themeChangedToDark.value = !themeChangedToDark.value;
            setTimeout(() => {
              location.reload();
            }, 30);
          }}
        />
        <div class='swap-on'>{moonSvg}</div>
        <div class='swap-off'>{sunSvg}</div>
      </label>
    </li>
  );
});
