import { type RequestEvent, routeLoader$, routeAction$ } from '@builder.io/qwik-city';
import { component$, useStore } from '@builder.io/qwik';
import { PageTitle } from '~/components/common/layout/title';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { Alerts } from '~/components/common/alerts/alerts';
import { getWordsForTooltips } from '~/routes/read/texts/[id]';
import { ApiService } from '~/misc/actions/request';
import { parseTextWords } from '~/misc/helpers/content';
import { type BookPageContent, type BookPage } from '~/routes/read/books/[id]/[chapter_id]';
import { EditBookPagePreprocessForm } from '~/components/create-edit/edit-book-page-preprocess-form';

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export const useGetBookPage = routeLoader$(async ({ params }): Promise<BookPage> => {
  const page = await ApiService.get('/api/books/page/' + params.id);
  const dbWords = await getWordsForTooltips(page.chinese_arr, true);
  const tooltipTxt = parseTextWords(page.chinese_arr, dbWords);
  return { page, tooltipTxt };
});

export const useEditPageText = routeAction$(
  async (params, ev): Promise<{ status: 'done' } | null> => {
    const token = getTokenFromCookie(ev.cookie);
    if (!token) return null;
    return ApiService.put('/api/books/page/' + params.pageId, params, token, null);
  },
);

export default component$(() => {
  const {
    page: { translation, chinese_arr, origintext, _id },
    // tooltipTxt,
  } = useGetBookPage().value;

  const store: Partial<BookPageContent> = useStore({
    translation,
    chinese_arr,
    origintext,
    _id,
  });

  return (
    <>
      <PageTitle txt={'Редактировать текст'} />
      <Alerts />

      <EditBookPagePreprocessForm store={store} />
    </>
  );
});
