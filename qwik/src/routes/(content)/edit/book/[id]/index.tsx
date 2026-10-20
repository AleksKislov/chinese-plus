import { $, component$, useSignal, useStore } from '@builder.io/qwik';
import { type RequestEvent, Link, routeAction$, routeLoader$ } from '@builder.io/qwik-city';
import { PageTitle } from '~/components/common/layout/title';
import { Alerts } from '~/components/common/alerts/alerts';
import { FlexRow } from '~/components/common/layout/flex-row';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { ApiService } from '~/misc/actions/request';
import { countZnChars } from '~/misc/helpers/content';
import {
  type BookChapter,
  type BookContents,
  type BookPart,
} from '~/routes/read/books/[id]/layout';
import {
  type PartChoice,
  getBookParts,
  getPartName,
  groupByPart,
  resolvePart,
} from '~/misc/helpers/content/book-parts';

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
      {
        bookId: params.bookId,
        chapters: [
          { ind: params.ind, title: params.title, ...(params.part && { part: params.part }) },
        ],
      },
      token,
      null,
    );
    return { status: 'done' };
  },
);

export const useSetChapterPart = routeAction$(
  async (params, ev): Promise<{ status: 'done' } | null> => {
    const token = getTokenFromCookie(ev.cookie);
    if (!token) return null;
    await ApiService.put(
      `/api/books/chapter/${params.chapterId}`,
      { part: params.part },
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
            prefetch="js"
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

// volume select; "new" shows title inputs for a volume after the last one
const PartSelect = component$(({ parts, state }: { parts: BookPart[]; state: PartChoice }) => (
  <FlexRow>
    <div class="w-full basis-1/3 mx-3">
      <select
        class="select select-bordered w-full"
        value={state.choice}
        onChange$={(e) => (state.choice = (e.target as HTMLSelectElement).value)}
      >
        <option value="">Без тома</option>
        {parts.map((part) => (
          <option key={part.ind} value={String(part.ind)}>
            {getPartName(part)}
          </option>
        ))}
        <option value="new">Новый том…</option>
      </select>
    </div>
    {state.choice === 'new' && (
      <>
        <div class="w-full basis-1/3 mx-3">
          <input
            type="text"
            placeholder={`Название тома (рус.), напр. Том ${(parts.at(-1)?.ind ?? 0) + 1}`}
            class="input input-bordered w-full"
            bind:value={state.titleRu}
          />
        </div>
        <div class="w-full basis-1/3 mx-3">
          <input
            type="text"
            placeholder="Название тома (кит.)"
            class="input input-bordered w-full"
            bind:value={state.titleCn}
          />
        </div>
      </>
    )}
  </FlexRow>
));

const ChapterPartForm = component$(
  ({ chapter, parts }: { chapter: BookChapter; parts: BookPart[] }) => {
    const setPartAction = useSetChapterPart();
    const state = useStore<PartChoice>({
      choice: chapter.part?.ind != null ? String(chapter.part.ind) : '',
      titleRu: '',
      titleCn: '',
    });

    const save = $(async () => {
      const part = resolvePart(state, parts);
      await setPartAction.submit({ chapterId: chapter._id, part });
      state.choice = part ? String(part.ind) : '';
      state.titleRu = '';
      state.titleCn = '';
    });

    return (
      <div class="mb-3">
        <div class="label-text mx-3 mb-1">Том главы</div>
        <PartSelect parts={parts} state={state} />
        <button
          class="btn btn-sm btn-outline mx-3 mt-2"
          disabled={setPartAction.isRunning}
          onClick$={save}
        >
          Сохранить том
        </button>
      </div>
    );
  },
);

export default component$(() => {
  const { book, contents } = useGetBookContents().value;
  const addChapterAction = useAddChapter();
  const parts = getBookParts(contents);

  const newChapter = useStore({ titleRu: '', titleCn: '' });
  // new chapters go to the last chapter's volume by default
  const lastPartInd = contents.at(-1)?.part?.ind;
  const newChapterPart = useStore<PartChoice>({
    choice: lastPartInd != null ? String(lastPartInd) : '',
    titleRu: '',
    titleCn: '',
  });

  const addChapter = $(async () => {
    if (!newChapter.titleRu && !newChapter.titleCn) return;

    const part = resolvePart(newChapterPart, parts);
    await addChapterAction.submit({
      bookId: book._id,
      // chapter ind runs through the whole book, volumes included
      ind: contents.length,
      title: { ru: newChapter.titleRu, cn: newChapter.titleCn },
      part,
    });

    newChapter.titleRu = '';
    newChapter.titleCn = '';
    newChapterPart.choice = part ? String(part.ind) : '';
    newChapterPart.titleRu = '';
    newChapterPart.titleCn = '';
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
          <div class="mt-3">
            <PartSelect parts={parts} state={newChapterPart} />
          </div>
          <FlexRow>
            <div class="mx-3 mt-3">
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

      {groupByPart(contents).map((group, groupInd) => (
        <div key={groupInd} class="mb-3">
          {group.part && <h3 class="text-lg font-bold mx-2 mb-1">{getPartName(group.part)}</h3>}

          <div class="join join-vertical bg-base-100 w-full">
            {group.chapters.map((chapter) => (
              <div
                class="collapse collapse-arrow join-item border-base-300 border"
                key={chapter._id}
              >
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
                  <ChapterPartForm chapter={chapter} parts={parts} />
                  <AddPagesForm bookId={book._id} chapter={chapter} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
});
