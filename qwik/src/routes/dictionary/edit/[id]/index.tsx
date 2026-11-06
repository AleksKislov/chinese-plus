import { $, component$, useContext, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import {
  type DocumentHead,
  Link,
  type RequestEvent,
  routeAction$,
  routeLoader$,
  z,
  zod$,
} from '@builder.io/qwik-city';
import { Alerts } from '~/components/common/alerts/alerts';
import { PageTitle } from '~/components/common/layout/title';
import { WordEditor } from '~/components/dictionary/editor/word-editor';
import {
  type EditorState,
  type TranslationLang,
  type WordForEdit,
  LANG_TITLES,
  TRANSLATION_LANGS,
  editorSnapshot,
  editorStateFor,
  fromEditorState,
  toEditorState,
} from '~/components/dictionary/editor/word-editor-state';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { ApiService } from '~/misc/actions/request';
import { alertsContext, userContext } from '~/root';

const OBJECT_ID = /^[a-f0-9]{24}$/;

const ACTION_TITLES = { create: 'добавлено', edit: 'изменено', rollback: 'откат' };

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  if (!getTokenFromCookie(cookie)) throw redirect(302, '/login');
};

// null: not an admin / moderator or no such word
export const useGetWordForEdit = routeLoader$(
  async ({ params, cookie }): Promise<WordForEdit | null> => {
    if (!OBJECT_ID.test(params.id)) return null;
    return ApiService.get(
      `/api/dictionary/word/${params.id}/edit`,
      getTokenFromCookie(cookie),
      null,
    );
  },
);

export const useSaveWord = routeAction$(
  async (body, ev) =>
    ApiService.send<DictWord>(
      'PUT',
      `/api/dictionary/word/${ev.params.id}`,
      body,
      getTokenFromCookie(ev.cookie),
    ),
  zod$({
    pinyin: z.string(),
    tradChinese: z.string(),
    updatedAt: z.string().nullable(),
    translation: z.object({
      lang: z.enum(['ru', 'en', 'zh']),
      senses: z.array(z.any()),
      examples: z.array(z.any()),
    }),
  }),
);

export const useRollbackWord = routeAction$(
  async ({ revisionId }, ev) =>
    ApiService.send<DictWord>(
      'PUT',
      `/api/dictionary/word/${ev.params.id}/rollback/${revisionId}`,
      null,
      getTokenFromCookie(ev.cookie),
    ),
  zod$({ revisionId: z.string().regex(OBJECT_ID) }),
);

export const useDeleteTranslation = routeAction$(
  async ({ lang, updatedAt }, ev) =>
    ApiService.send<DictWord>(
      'DELETE',
      `/api/dictionary/word/${ev.params.id}/translation/${lang}?updatedAt=${encodeURIComponent(
        updatedAt || '',
      )}`,
      null,
      getTokenFromCookie(ev.cookie),
    ),
  zod$({ lang: z.enum(['ru', 'en', 'zh']), updatedAt: z.string().nullable() }),
);

export default component$(() => {
  const loader = useGetWordForEdit();
  const saveAction = useSaveWord();
  const rollbackAction = useRollbackWord();
  const alertsState = useContext(alertsContext);
  const { isAdmin, isModerator } = useContext(userContext);

  const deleteAction = useDeleteTranslation();

  // the language being edited: the word has at most one translation per language
  const editLang = useSignal<TranslationLang>(loader.value?.shownLang || 'ru');
  const state = useStore<EditorState>(
    loader.value
      ? editorStateFor(loader.value, editLang.value)
      : toEditorState({ chinese: '', tradChinese: '', pinyin: '' }, { senses: [], examples: [] }),
  );
  // the version and language the editor shows: actions re-run the loader, and the store is reset
  // only when the word really changed or another language is picked, so a refused save keeps
  // the unsaved edits
  const shown = useSignal({ version: loader.value?.word.updatedAt ?? null, lang: editLang.value });
  // what the editor showed right after a reset, to tell whether there are unsaved changes
  const baseline = useSignal(editorSnapshot(state));

  useTask$(({ track }) => {
    const data = track(() => loader.value);
    const lang = track(() => editLang.value);
    if (!data || (data.word.updatedAt === shown.value.version && lang === shown.value.lang)) return;
    shown.value = { version: data.word.updatedAt, lang };
    Object.assign(state, editorStateFor(data, lang));
    baseline.value = editorSnapshot(state);
  });

  const pickLang = $((lang: TranslationLang) => {
    if (lang === editLang.value) return;
    const unsaved = editorSnapshot(state) !== baseline.value;
    if (unsaved && !confirm('Несохранённые изменения пропадут. Перейти к другому языку?')) return;
    editLang.value = lang;
  });

  const save = $(async () => {
    const { value } = await saveAction.submit({
      pinyin: state.pinyin,
      tradChinese: state.tradChinese,
      updatedAt: shown.value.version,
      translation: fromEditorState(state),
    });
    if (value.error) alertsState.push({ bg: 'alert-error', text: value.error });
    else alertsState.push({ bg: 'alert-success', text: 'Сохранено' });
  });

  const deleteTranslation = $(async () => {
    const lang = editLang.value;
    if (!confirm(`Удалить ${LANG_TITLES[lang]} перевод слова со всеми примерами?`)) return;
    const { value } = await deleteAction.submit({ lang, updatedAt: shown.value.version });
    if (value.error) return alertsState.push({ bg: 'alert-error', text: value.error });
    alertsState.push({ bg: 'alert-success', text: 'Перевод удалён' });
    editLang.value = loader.value?.shownLang || 'ru';
  });

  const rollback = $(async (revisionId: string) => {
    if (!confirm('Вернуть слово к состоянию до этой правки?')) return;
    const { value } = await rollbackAction.submit({ revisionId });
    if (value.error) alertsState.push({ bg: 'alert-error', text: value.error });
    else alertsState.push({ bg: 'alert-success', text: 'Откат выполнен' });
  });

  if ((!isAdmin && !isModerator) || !loader.value) {
    return (
      <>
        <PageTitle txt={'Редактирование слова'} />
        <div>Нет доступа или слово не найдено</div>
      </>
    );
  }

  const { word, translations, shownLang, revisions } = loader.value;
  const lang = editLang.value;
  const current = translations[lang];
  const langCount = TRANSLATION_LANGS.filter((l) => translations[l]).length;

  return (
    <>
      <PageTitle txt={'Редактирование слова: ' + word.chinese} />
      <Alerts />

      <Link
        prefetch="js"
        href={'/dictionary/' + encodeURIComponent(word.chinese)}
        class="link link-hover link-secondary text-sm"
      >
        ← К слову в словаре
      </Link>

      <div role="tablist" class="tabs tabs-boxed mt-3 w-fit">
        {TRANSLATION_LANGS.map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            class={['tab', l === lang && 'tab-active']}
            onClick$={() => pickLang(l)}
          >
            {LANG_TITLES[l]}
            {l === shownLang && ' ✓'}
            {!translations[l] && ' +'}
          </button>
        ))}
      </div>

      <div class="alert text-sm mt-2 block">
        <div>
          Редактируется <b>{LANG_TITLES[lang]}</b> перевод.{' '}
          {!current
            ? 'Его у слова ещё нет: сохранение добавит его.'
            : lang === shownLang
            ? 'Он показывается на сайте.'
            : `На сайте сейчас показывается ${LANG_TITLES[shownLang!]} перевод, этот — нет.`}
        </div>
        <div class="opacity-70">
          На сайте показывается русский перевод, если он есть, иначе английский, иначе китайский. ✓
          — показывается сейчас, + — перевода нет.
        </div>
      </div>

      {current && current.parseWarnings.length > 0 && (
        <div class="alert alert-warning text-sm mt-2 block">
          При переводе из старой разметки были замечания: {current.parseWarnings.join('; ')}
        </div>
      )}

      <div class="card bg-base-200 border border-base-300 mt-3">
        <div class="card-body p-4">
          <WordEditor state={state} />

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              class="btn btn-info btn-sm"
              disabled={saveAction.isRunning}
              onClick$={save}
            >
              {current
                ? `Сохранить (${LANG_TITLES[lang]})`
                : `Добавить ${LANG_TITLES[lang]} перевод`}
            </button>
            {current && langCount > 1 && (
              <button
                type="button"
                class="btn btn-error btn-outline btn-sm"
                disabled={deleteAction.isRunning}
                onClick$={deleteTranslation}
              >
                Удалить {LANG_TITLES[lang]} перевод
              </button>
            )}
          </div>
        </div>
      </div>

      <h3 class="text-lg font-bold mt-6">История правок</h3>
      {revisions.length === 0 && <div class="text-sm opacity-70">Правок ещё не было</div>}
      <div class="overflow-x-auto">
        <table class="table table-xs">
          <tbody>
            {revisions.map((revision) => (
              <tr key={revision._id}>
                <td>{new Date(revision.date).toLocaleString('ru-RU')}</td>
                <td>{ACTION_TITLES[revision.action]}</td>
                <td>{revision.lang ? LANG_TITLES[revision.lang] : 'пиньинь'}</td>
                <td>{revision.editor}</td>
                <td>{revision.pinyin}</td>
                <td class="max-w-xs truncate">{revision.summary}</td>
                <td>
                  {revision.action !== 'create' && (
                    <button
                      type="button"
                      class="btn btn-xs btn-outline"
                      title="Вернуть слово к состоянию до этой правки"
                      disabled={rollbackAction.isRunning}
                      onClick$={() => rollback(revision._id)}
                    >
                      Откатить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Редактирование слова',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
};
