import { component$, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { moonSvg, sunSvg } from "../../media/svg";
import { isDarkThemeContext } from "~/root";

export const ThemeChanger = component$(() => {
  const isDarkTheme = useContext(isDarkThemeContext);
  const themeChanged = useSignal(true);

  useVisibleTask$(({ track }) => {
    track(() => themeChanged.value);
    isDarkTheme.bool = themeChanged.value;
  });

  return (
    <li tabIndex={0} class='my-1'>
      <label class='swap swap-rotate'>
        <input type='checkbox' bind:checked={themeChanged} />
        <div class='swap-on'>{moonSvg}</div>
        <div class='swap-off'>{sunSvg}</div>
      </label>
    </li>
  );
});
