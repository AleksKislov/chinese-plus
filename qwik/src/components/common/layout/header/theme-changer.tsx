import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { moonSvg, sunSvg } from '../../media/svg';
import { IsLightThemeCookieName } from '~/root';
import Cookies from 'js-cookie';
import { useCheckTheme } from '~/routes/layout';

export const ThemeTypes = {
  dark: 'night',
  light: 'emerald',
};

export const ThemeChanger = component$(() => {
  const checkTheme = useCheckTheme();
  const themeChangedToDark = useSignal(true);

  useTask$(() => {
    themeChangedToDark.value = checkTheme.value;
  });

  return (
    <li tabIndex={0} class="my-1">
      <label class="swap swap-rotate">
        <input
          type="checkbox"
          checked={themeChangedToDark.value}
          onChange$={(_, target) => {
            const isDark = target.checked;
            Cookies.set(IsLightThemeCookieName, isDark ? '0' : '1', { expires: 600 });
            location.reload();
          }}
        />
        <div class="swap-on">{moonSvg}</div>
        <div class="swap-off">{sunSvg}</div>
      </label>
    </li>
  );
});
