import { $, component$, useContext, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { Alerts } from '~/components/common/alerts/alerts';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { Loader } from '~/components/common/ui/loader';
import { translationToText } from '~/components/common/translation/types';
import { extensionUrl } from '~/components/extension/types';
import { pluralRu } from '~/components/hsk/exams/levels';
import CONSTANTS from '~/misc/consts/consts';
import {
  addImportWords,
  getImportWords,
  IMPORT_MAX_WORDS,
  isImportWord,
} from '~/misc/actions/dictionary/extension-import';
import { loginUrl } from '~/misc/helpers/login-next';
import { AlertColorEnum, alertsContext, userContext } from '~/root';

/**
 * Words looked up in the browser extension, to add to the user's words. extension/popup.js opens
 * /dictionary/import#w=<word:times,…>: the list is in the fragment, so it never reaches the server
 * in the URL. It is kept in sessionStorage for the way through /login and back (same tab).
 */
const PAGE_URL = '/dictionary/import';
const STORAGE_KEY = 'extensionImportWords';
const TRANSLATION_MAX = 140;

type ImportEntry = { word: string; times: number };

/** "中国:3,你好:1" -> entries, the most looked up first (then the most recent, as listed). */
const parseWords = (raw: string): ImportEntry[] => {
  const seen = new Set<string>();
  const entries: ImportEntry[] = [];
  for (const part of raw.split(',')) {
    const [word, times] = part.split(':');
    if (!isImportWord(word) || seen.has(word)) continue;
    seen.add(word);
    entries.push({ word, times: Math.max(1, parseInt(times, 10) || 1) });
  }
  return entries.slice(0, IMPORT_MAX_WORDS).sort((a, b) => b.times - a.times);
};

/** The list from the URL fragment (saved for after a login), else the saved one. */
const readWords = (): ImportEntry[] => {
  let raw = new URLSearchParams(location.hash.slice(1)).get('w');
  try {
    if (raw !== null) sessionStorage.setItem(STORAGE_KEY, raw);
    else raw = sessionStorage.getItem(STORAGE_KEY);
  } catch {
    // storage blocked: the list still works on this page view
  }
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
  return raw ? parseWords(raw) : [];
};

const shortTranslation = (word: DictWord) => {
  const text = word.senses ? translationToText(word.senses) : '';
  return text.length > TRANSLATION_MAX ? `${text.slice(0, TRANSLATION_MAX)}…` : text;
};

export default component$(() => {
  const userState = useContext(userContext);
  const alertsState = useContext(alertsContext);
  const entries = useSignal<ImportEntry[] | null>(null); // null: not read yet
  const found = useSignal<DictWord[] | null>(null); // null: loading
  const selected = useStore<Record<string, boolean>>({}); // dictionary word id -> checked
  const adding = useSignal(false);
  const addedCount = useSignal(0);

  // the list exists only in the browser (fragment, sessionStorage); the lookup runs on the FE
  // server (server$)
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    const list = readWords();
    entries.value = list;
    if (!list.length) {
      found.value = [];
      return;
    }
    const words = await getImportWords(list.map(({ word }) => word));
    found.value = words;
    // preselected: the first entry of every word not in the user's words yet, the most looked
    // up first, as many as there are free places in the list
    let free = CONSTANTS.users.vocabSize - userState.wordsCount;
    for (const { word } of list) {
      const first = words.find((w) => w.chinese === word);
      if (!first || userState.wordsMap[word] || free <= 0) continue;
      selected[first._id] = true;
      free--;
    }
  });

  const entriesOf = (word: string) => (found.value || []).filter((w) => w.chinese === word);
  const selectedIds = Object.keys(selected).filter((id) => selected[id]);
  // the user's words are limited (the backend refuses more)
  const freePlaces = Math.max(0, CONSTANTS.users.vocabSize - userState.wordsCount);
  const overLimit = selectedIds.length > freePlaces;

  const setAll = $((checked: boolean) => {
    for (const word of found.value || []) {
      if (!userState.wordsMap[word.chinese]) selected[word._id] = checked;
    }
  });

  const addSelected = $(async () => {
    const byId = new Map((found.value || []).map((w) => [w._id, w.chinese]));
    const items = Object.keys(selected)
      .filter((id) => selected[id] && byId.has(id))
      .map((id) => ({ id, chinese: byId.get(id)! }));
    if (!items.length) return;
    adding.value = true;
    const result = await addImportWords(items);
    adding.value = false;
    if ('error' in result) {
      alertsState.push({ bg: AlertColorEnum.error, text: result.error });
      return;
    }
    for (const id of result.added) {
      userState.wordsMap[byId.get(id)!] = true;
      selected[id] = false;
    }
    userState.wordsCount += result.added.length;
    addedCount.value += result.added.length;
    alertsState.push({
      bg: AlertColorEnum.success,
      text: result.added.length
        ? `Добавлено в словарик: ${result.added.length} ${pluralRu(result.added.length, [
            'слово',
            'слова',
            'слов',
          ])}`
        : 'Эти слова уже есть в вашем словарике',
    });
  });

  const list = entries.value;
  const total = list?.length || 0;

  return (
    <>
      <Breadcrumbs
        items={[{ name: 'Словарь', href: '/dictionary/' }, { name: 'Слова из расширения' }]}
      />
      <PageTitle txt="Слова из расширения" />

      <FlexRow>
        <Alerts />
        <MainContent>
          <div class="prose max-w-none mb-4">
            <p>
              Слова, которые вы смотрели в подсказках{' '}
              <Link prefetch="js" href={extensionUrl}>
                расширения ChinesePlus
              </Link>
              . Отметьте нужные и добавьте их в свой словарик.
            </p>
          </div>

          {(list === null || (total > 0 && found.value === null)) && <Loader />}

          {list !== null && total === 0 && (
            <div class="alert">
              <span>
                Список пуст. Откройте меню расширения ChinesePlus (значок на панели браузера) и
                нажмите «Добавить в мои слова».
              </span>
            </div>
          )}

          {list && total > 0 && found.value !== null && (
            <>
              {!userState.loggedIn && (
                <div class="alert alert-info mb-4">
                  <span>Чтобы добавить слова в словарик, войдите на сайт — список сохранится.</span>
                  <Link href={loginUrl(PAGE_URL)} class="btn btn-sm btn-primary">
                    Войти
                  </Link>
                </div>
              )}

              {addedCount.value > 0 && (
                <div class="alert alert-success mb-4">
                  <span>
                    Готово! Добавленные слова — в{' '}
                    <Link prefetch="js" href="/me/words" class="link">
                      вашем словарике
                    </Link>
                    . Список в расширении можно очистить: меню расширения → «Очистить».
                  </span>
                </div>
              )}

              <div class="flex flex-wrap items-center gap-2 mb-3">
                {userState.loggedIn && (
                  <button
                    type="button"
                    class="btn btn-info btn-sm"
                    disabled={!selectedIds.length || overLimit || adding.value}
                    onClick$={addSelected}
                  >
                    {adding.value ? <Loader size="sm" /> : null}
                    Добавить выбранные ({selectedIds.length})
                  </button>
                )}
                <button type="button" class="btn btn-ghost btn-sm" onClick$={() => setAll(true)}>
                  Выбрать все
                </button>
                <button type="button" class="btn btn-ghost btn-sm" onClick$={() => setAll(false)}>
                  Снять все
                </button>
                <span class="text-sm opacity-60 ml-auto">
                  {total} {pluralRu(total, ['слово', 'слова', 'слов'])}, сначала самые частые
                </span>
              </div>

              {userState.loggedIn && (
                <p class={`text-sm mb-3 ${overLimit ? 'text-error' : 'opacity-70'}`}>
                  Свободно в словарике: {freePlaces} из {CONSTANTS.users.vocabSize}.
                  {overLimit && (
                    <>
                      {' '}
                      Выбрано больше — снимите {selectedIds.length - freePlaces} или удалите старые
                      слова в{' '}
                      <Link prefetch="js" href="/me/words" class="link">
                        «Мой словарик»
                      </Link>
                      .
                    </>
                  )}
                </p>
              )}

              <div class="overflow-x-auto">
                <table class="table table-compact w-full">
                  <tbody>
                    {list.map(({ word, times }) => {
                      const words = entriesOf(word);
                      const own = Boolean(userState.wordsMap[word]);
                      if (!words.length) {
                        return (
                          <tr key={word} class="opacity-60">
                            <td></td>
                            <td class="text-xl">{word}</td>
                            <td colSpan={2}>нет в словаре сайта</td>
                            <td class="text-right text-sm">×{times}</td>
                          </tr>
                        );
                      }
                      return words.map((entry, n) => (
                        <tr key={entry._id}>
                          <td>
                            <input
                              type="checkbox"
                              class="checkbox checkbox-info checkbox-sm"
                              aria-label={`Добавить ${entry.chinese}`}
                              checked={own ? false : Boolean(selected[entry._id])}
                              disabled={own}
                              onChange$={(_, el) => (selected[entry._id] = el.checked)}
                            />
                          </td>
                          <td class="text-xl whitespace-nowrap">
                            <Link
                              prefetch="js"
                              href={`/dictionary/${encodeURIComponent(entry.chinese)}`}
                              class="link link-hover"
                            >
                              {entry.chinese}
                            </Link>
                          </td>
                          <td class="whitespace-nowrap text-info">{entry.pinyin}</td>
                          <td class="whitespace-normal text-sm">
                            {own ? (
                              <span class="badge badge-success badge-sm mr-1">в словарике</span>
                            ) : null}
                            {shortTranslation(entry)}
                          </td>
                          <td class="text-right text-sm opacity-60">
                            {n === 0 ? `×${times}` : ''}
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Слова из расширения ChinesePlus — добавить в словарик | Chinese+',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
};
