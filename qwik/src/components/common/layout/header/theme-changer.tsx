import { component$, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { moonSvg, sunSvg } from "../../media/svg";
import { IsLightThemeCookieName, isDarkThemeContext } from "~/root";
import Cookies from "js-cookie";
import { useCheckTheme } from "~/routes/layout";

export const ThemeChanger = component$(() => {
  const checkTheme = useCheckTheme();
  const isDarkTheme = useContext(isDarkThemeContext);
  const themeChangedToDark = useSignal(true);
  useVisibleTask$(() => {
    isDarkTheme.bool = checkTheme.value;
    themeChangedToDark.value = checkTheme.value;
  });

  useVisibleTask$(({ track }) => {
    const isDark = track(() => themeChangedToDark.value);
    isDarkTheme.bool = isDark;
    Cookies.set(IsLightThemeCookieName, isDark ? "0" : "1", { expires: 600 });
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
