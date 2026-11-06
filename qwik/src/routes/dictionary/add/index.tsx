import { $, component$, useContext, useStore } from '@builder.io/qwik';
import {
  type DocumentHead,
  type RequestEvent,
  routeAction$,
  useNavigate,
  z,
  zod$,
} from '@builder.io/qwik-city';
import { Alerts } from '~/components/common/alerts/alerts';
import { PageTitle } from '~/components/common/layout/title';
import { WordEditor } from '~/components/dictionary/editor/word-editor';
import {
  type EditorState,
  LANG_TITLES,
  emptyNode,
  fromEditorState,
} from '~/components/dictionary/editor/word-editor-state';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { ApiService } from '~/misc/actions/request';
import { alertsContext, userContext } from '~/root';

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  if (!getTokenFromCookie(cookie)) throw redirect(302, '/login');
};

export const useAddWord = routeAction$(
  async (body, ev) =>
    ApiService.send<DictWord>('POST', '/api/dictionary/word', body, getTokenFromCookie(ev.cookie)),
  zod$({
    chinese: z.string(),
    tradChinese: z.string(),
    pinyin: z.string(),
    translation: z.object({
      lang: z.enum(['ru', 'en', 'zh']),
      senses: z.array(z.any()),
      examples: z.array(z.any()),
    }),
  }),
);

export default component$(() => {
  const addAction = useAddWord();
  const alertsState = useContext(alertsContext);
  const { isAdmin, isModerator } = useContext(userContext);
  const nav = useNavigate();

  const state = useStore<EditorState>({
    chinese: '',
    tradChinese: '',
    pinyin: '',
    lang: 'ru',
    senses: [emptyNode()],
    examples: [],
  });

  const add = $(async () => {
    const { value } = await addAction.submit({
      chinese: state.chinese,
      tradChinese: state.tradChinese,
      pinyin: state.pinyin,
      translation: fromEditorState(state),
    });
    if (!value.data) return alertsState.push({ bg: 'alert-error', text: value.error || 'Ошибка' });
    nav('/dictionary/' + encodeURIComponent(value.data.chinese));
  });

  if (!isAdmin && !isModerator) {
    return (
      <>
        <PageTitle txt={'Добавить слово'} />
        <div>Нет доступа</div>
      </>
    );
  }

  return (
    <>
      <PageTitle txt={'Добавить слово в словарь'} />
      <Alerts />

      <div class="card bg-base-200 border border-base-300 mt-3">
        <div class="card-body p-4">
          <WordEditor state={state} isNew={true} />

          <div class="mt-4">
            <button
              type="button"
              class="btn btn-info btn-sm"
              disabled={addAction.isRunning}
              onClick$={add}
            >
              Добавить слово ({LANG_TITLES[state.lang]} перевод)
            </button>
            <div class="text-sm opacity-70 mt-2">
              Переводы на других языках можно добавить потом, на странице редактирования слова.
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Добавить слово',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
};
