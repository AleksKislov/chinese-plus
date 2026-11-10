// Browser extension (extension/ in the repo root): the pages about it are /extension and
// /extension/privacy (the privacy policy linked from the Chrome Web Store / AMO listings).

export const extensionUrl = '/extension';
export const extensionPrivacyUrl = '/extension/privacy';
export const extensionOgImage = '/img/extension/og-2.jpg';

// null until the store listing is published: the button shows "скоро"
export const EXTENSION_STORES: { name: string; note: string; url: string | null }[] = [
  {
    name: 'Chrome',
    note: 'а также Яндекс Браузер, Edge, Opera, Brave',
    url: null,
  },
  {
    name: 'Firefox',
    note: 'на компьютере и на Android',
    url: 'https://addons.mozilla.org/ru/firefox/addon/chineseplus-reader/',
  },
];

// date of the current privacy policy text, shown on /extension/privacy
export const PRIVACY_UPDATED = '11 ноября 2026';
export const PRIVACY_UPDATED_EN = 'November 11, 2026';
