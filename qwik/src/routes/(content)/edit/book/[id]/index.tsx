import { $, component$, useSignal, useStore } from '@builder.io/qwik';
import { type RequestEvent, Link, routeAction$, routeLoader$ } from '@builder.io/qwik-city';
import { PageTitle } from '~/components/common/layout/title';
import { Alerts } from '~/components/common/alerts/alerts';
import { FlexRow } from '~/components/common/layout/flex-row';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { ApiService } from '~/misc/actions/request';
import { countZnChars } from '~/misc/helpers/content';
import { type BookChapter, type BookContents } from '~/routes/read/books/[id]/layout';

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export const useGetBookContents = routeLoader$(({ params }): Promise<BookContents> => {
  return ApiService.get(`/api/books/${params.id}`);
});

export const useAddChapter = routeAction$(
  async (params, ev): Promise<{ status: 'done' } | null> => {
    const token = getTokenFromCookie(ev.cookie);
    if (!token) return null;
    await ApiService.post(
      '/api/books/chapter',
      { bookId: params.bookId, chapters: [{ ind: params.ind, title: params.title }] },
      token,
      null,
    );
    return { status: 'done' };
  },
);

export const useAddPages = routeAction$(async (params, ev): Promise<{ status: 'done' } | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  await ApiService.post(
    '/api/books/page',
    { bookId: params.bookId, belongsTo: params.belongsTo, origintext: params.origintext },
    token,
    null,
  );
  return { status: 'done' };
});

type AddPagesFormProps = {
  bookId: ObjectId;
  chapter: BookChapter;
};

const AddPagesForm = component$(({ bookId, chapter }: AddPagesFormProps) => {
  const addPagesAction = useAddPages();
  const chineseText = useSignal('');

  const addPages = $(async () => {
    const trimmed = chineseText.value.trim().replace(/\n\s*\n/g, '\n');
    const origintext = trimmed
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    if (!origintext.length) return;

    await addPagesAction.submit({ bookId, belongsTo: chapter._id, origintext });
    chineseText.value = '';
  });

  return (
    <>
      <div class="mb-3">
        {chapter.pages.map((page) => (
          <Link
            key={page._id}
            href={`/edit/book-page/${page._id}`}
            class="btn btn-sm btn-outline hover:btn-accent m-1"
          >
            Стр. {page.ind + 1} ({page.length}字)
          </Link>
        ))}
        {!chapter.pages.length && <span class="text-xs opacity-70">Пока нет страниц</span>}
      </div>

      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">
            Добавить страницу(ы): китайский текст (по абзацу на строку)
          </span>
        </label>
        <textarea
          class="textarea textarea-bordered h-24"
          placeholder="汉字..."
          bind:value={chineseText}
        ></textarea>
        <label class="label">
          <span class="label-text-alt">{countZnChars(chineseText.value)} 字</span>
        </label>
      </div>
      <button
        class="btn btn-sm btn-primary mt-1"
        disabled={addPagesAction.isRunning}
        onClick$={addPages}
      >
        Добавить страницу(ы)
      </button>
    </>
  );
});

export default component$(() => {
  const { book, contents } = useGetBookContents().value;
  const addChapterAction = useAddChapter();

  const newChapter = useStore({ titleRu: '', titleCn: '' });

  const addChapter = $(async () => {
    if (!newChapter.titleRu && !newChapter.titleCn) return;

    await addChapterAction.submit({
      bookId: book._id,
      ind: contents.length,
      title: { ru: newChapter.titleRu, cn: newChapter.titleCn },
    });

    newChapter.titleRu = '';
    newChapter.titleCn = '';
  });

  return (
    <>
      <PageTitle txt={`Управление книгой: ${book.title.ru} / ${book.title.cn}`} />
      <Alerts />

      <div class="collapse collapse-arrow border border-base-300 bg-base-200 text-base-content mb-3">
        <input type="checkbox" checked />
        <div class="collapse-title text-xl px-7">Добавить главу</div>
        <div class="collapse-content">
          <FlexRow>
            <div class="w-full basis-1/2 mx-3">
              <input
                type="text"
                placeholder="Название главы (рус.)"
                class="input input-bordered w-full"
                value={newChapter.titleRu}
                onChange$={(e) => (newChapter.titleRu = e.target.value)}
              />
            </div>
            <div class="w-full basis-1/2 mx-3">
              <input
                type="text"
                placeholder="Название главы (кит.)"
                class="input input-bordered w-full"
                value={newChapter.titleCn}
                onChange$={(e) => (newChapter.titleCn = e.target.value)}
              />
            </div>
          </FlexRow>
          <FlexRow>
            <div class="mx-3">
              <button
                class="btn btn-primary"
                disabled={addChapterAction.isRunning}
                onClick$={addChapter}
              >
                Добавить главу
              </button>
            </div>
          </FlexRow>
        </div>
      </div>

      <div class="join join-vertical bg-base-100 w-full">
        {contents.map((chapter) => (
          <div class="collapse collapse-arrow join-item border-base-300 border" key={chapter._id}>
            <input type="radio" name="chapters-accordion" />
            <div class="collapse-title flex justify-between items-center">
              <div class="flex flex-col">
                <span>{chapter.title.cn}</span>
                <span class="text-xs">{chapter.title.ru}</span>
              </div>
              <span>
                <span class="badge badge-accent badge-outline">{chapter.length}</span> 字
              </span>
            </div>
            <div class="collapse-content text-sm">
              <AddPagesForm bookId={book._id} chapter={chapter} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
});
