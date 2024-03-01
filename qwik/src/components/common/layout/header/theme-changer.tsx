import { component$, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { moonSvg, sunSvg } from "../../media/svg";
import { isDarkThemeContext } from "~/root";

export const ThemeTypes = {
  dark: "night",
  light: "emerald",
};

export const ThemeChanger = component$(() => {
  const isDarkTheme = useContext(isDarkThemeContext);
  const themeChangedToDark = useSignal(true);

  useVisibleTask$(() => {
    const isDark = !localStorage.theme || localStorage.theme === ThemeTypes.dark;
    isDarkTheme.bool = isDark;
    themeChangedToDark.value = isDark;
  });

  useVisibleTask$(({ track }) => {
    const isDark = track(() => themeChangedToDark.value);
    isDarkTheme.bool = isDark;

    if (!localStorage.theme || localStorage.theme === ThemeTypes.dark) {
      localStorage.theme = ThemeTypes.light;
    } else {
      localStorage.theme = ThemeTypes.dark;
    }
  });

  return (
    <li tabIndex={0} class='my-1'>
      <label class='swap swap-rotate'>
        <input type='checkbox' bind:checked={themeChangedToDark} />
        <div class='swap-on'>{moonSvg}</div>
        <div class='swap-off'>{sunSvg}</div>
      </label>
    </li>
  );
});
