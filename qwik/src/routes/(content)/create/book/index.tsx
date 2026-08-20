import { $, component$, useContext, useStore } from '@builder.io/qwik';
import { type RequestEvent, routeAction$, routeLoader$, useNavigate } from '@builder.io/qwik-city';
import { PageTitle } from '~/components/common/layout/title';
import { Alerts } from '~/components/common/alerts/alerts';
import { FlexRow } from '~/components/common/layout/flex-row';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { ApiService } from '~/misc/actions/request';
import { parseTags } from '~/misc/helpers/content';
import { AlertColorEnum, alertsContext } from '~/root';

export type Bookauthor = {
  _id: ObjectId;
  name: { ru: string; cn: string };
  year: { born?: number; dead?: number };
  about?: string;
  country?: string;
};

export type NewBookStore = {
  titleRu: string;
  titleCn: string;
  year?: number;
  author: string;
  about: string;
  genres: string;
  picUrl: string;
  translationSrc: string;
};

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export const useGetAuthors = routeLoader$(async (): Promise<Bookauthor[]> => {
  return ApiService.get('/api/books/authors', undefined, []);
});

export const useCreateAuthor = routeAction$(async (params, ev): Promise<Bookauthor | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  return ApiService.post('/api/books/authors', params, token, null);
});

export const usePublishBook = routeAction$(async (params, ev): Promise<{ _id: ObjectId } | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  return ApiService.post('/api/books/create', params, token, null);
});

export default component$(() => {
  const authors = useGetAuthors();
  const createAuthorAction = useCreateAuthor();
  const publishBookAction = usePublishBook();
  const alertsState = useContext(alertsContext);
  const nav = useNavigate();

  const store: NewBookStore = useStore({
    titleRu: '',
    titleCn: '',
    year: undefined,
    author: '',
    about: '',
    genres: '',
    picUrl: '',
    translationSrc: '',
  });

  const newAuthorStore = useStore({
    nameRu: '',
    nameCn: '',
    born: undefined as number | undefined,
    country: '',
  });

  const createAuthor = $(async () => {
    if (!newAuthorStore.nameRu && !newAuthorStore.nameCn) return;

    await createAuthorAction.submit({
      name: { ru: newAuthorStore.nameRu, cn: newAuthorStore.nameCn },
      year: { born: newAuthorStore.born },
      country: newAuthorStore.country,
    });

    if (createAuthorAction.value?._id) {
      store.author = createAuthorAction.value._id;
      newAuthorStore.nameRu = '';
      newAuthorStore.nameCn = '';
      newAuthorStore.born = undefined;
      newAuthorStore.country = '';
    }
  });

  const publishBook = $(async () => {
    if (!store.titleRu && !store.titleCn) {
      alertsState.push({ bg: AlertColorEnum.error, text: 'Введите название книги' });
      return;
    }
    if (!store.about) {
      alertsState.push({ bg: AlertColorEnum.error, text: 'Заполните краткое описание' });
      return;
    }
    if (!store.author) {
      alertsState.push({ bg: AlertColorEnum.error, text: 'Выберите автора' });
      return;
    }

    await publishBookAction.submit({
      title: { ru: store.titleRu, cn: store.titleCn },
      year: store.year,
      author: store.author,
      about: store.about,
      genres: parseTags(store.genres),
      picUrl: store.picUrl,
      translationSrc: store.translationSrc,
    });

    if (publishBookAction.value?._id) {
      nav(`/edit/book/${publishBookAction.value._id}`);
    }
  });

  return (
    <>
      <PageTitle txt={'Новая книга'} />
      <Alerts />

      <FlexRow>
        <div class="w-full basis-1/2 mx-3">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Название (рус.)</span>
            </label>
            <input
              type="text"
              class="input input-bordered w-full"
              value={store.titleRu}
              onChange$={(e) => (store.titleRu = e.target.value)}
            />
          </div>
        </div>
        <div class="w-full basis-1/2 mx-3">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Название (кит.)</span>
            </label>
            <input
              type="text"
              class="input input-bordered w-full"
              value={store.titleCn}
              onChange$={(e) => (store.titleCn = e.target.value)}
            />
          </div>
        </div>
      </FlexRow>

      <FlexRow>
        <div class="w-full basis-1/4 mx-3">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Год</span>
            </label>
            <input
              type="number"
              class="input input-bordered w-full"
              value={store.year}
              onChange$={(e) => (store.year = +e.target.value)}
            />
          </div>
        </div>
        <div class="w-full basis-3/4 mx-3">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Автор</span>
            </label>
            <select
              class="select select-bordered w-full"
              onChange$={(e) => (store.author = e.target.value)}
            >
              <option value="">Выберите автора</option>
              {authors.value.map((a) => (
                <option key={a._id} value={a._id} selected={store.author === a._id}>
                  {`${a.name.ru} / ${a.name.cn}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FlexRow>

      <div
        tabIndex={0}
        class="collapse collapse-arrow border border-base-300 bg-base-200 text-base-content mb-3"
      >
        <input type="checkbox" />
        <div class="collapse-title px-7">+ новый автор</div>
        <div class="collapse-content">
          <FlexRow>
            <div class="w-full basis-1/3 mx-3">
              <input
                type="text"
                placeholder="Имя (рус.)"
                class="input input-bordered w-full"
                value={newAuthorStore.nameRu}
                onChange$={(e) => (newAuthorStore.nameRu = e.target.value)}
              />
            </div>
            <div class="w-full basis-1/3 mx-3">
              <input
                type="text"
                placeholder="Имя (кит.)"
                class="input input-bordered w-full"
                value={newAuthorStore.nameCn}
                onChange$={(e) => (newAuthorStore.nameCn = e.target.value)}
              />
            </div>
            <div class="w-full basis-1/6 mx-3">
              <input
                type="number"
                placeholder="Год рожд."
                class="input input-bordered w-full"
                value={newAuthorStore.born}
                onChange$={(e) => (newAuthorStore.born = +e.target.value)}
              />
            </div>
            <div class="w-full basis-1/6 mx-3">
              <input
                type="text"
                placeholder="Страна"
                class="input input-bordered w-full"
                value={newAuthorStore.country}
                onChange$={(e) => (newAuthorStore.country = e.target.value)}
              />
            </div>
          </FlexRow>
          <FlexRow>
            <div class="mx-3">
              <button class="btn btn-secondary" onClick$={createAuthor}>
                Добавить автора
              </button>
            </div>
          </FlexRow>
        </div>
      </div>

      <FlexRow>
        <div class="w-full mx-3">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Краткое описание</span>
            </label>
            <textarea
              class="textarea textarea-bordered h-24"
              value={store.about}
              onChange$={(e) => (store.about = e.target.value)}
            ></textarea>
          </div>
        </div>
      </FlexRow>

      <FlexRow>
        <div class="w-full basis-1/2 mx-3">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Жанры через запятую</span>
            </label>
            <input
              type="text"
              class="input input-bordered w-full"
              value={store.genres}
              onChange$={(e) => (store.genres = e.target.value)}
            />
          </div>
        </div>
        <div class="w-full basis-1/2 mx-3">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Источник перевода</span>
            </label>
            <input
              type="text"
              class="input input-bordered w-full"
              value={store.translationSrc}
              onChange$={(e) => (store.translationSrc = e.target.value)}
            />
          </div>
        </div>
      </FlexRow>

      <FlexRow>
        <div class="w-full mx-3">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Обложка (URL картинки)</span>
            </label>
            <input
              type="text"
              class="input input-bordered w-full"
              value={store.picUrl}
              onChange$={(e) => (store.picUrl = e.target.value)}
            />
          </div>
        </div>
      </FlexRow>

      <FlexRow>
        <div class="mt-3 ml-3">
          <button
            class="btn btn-primary w-48"
            disabled={publishBookAction.isRunning}
            onClick$={publishBook}
          >
            Создать книгу
          </button>
        </div>
      </FlexRow>
    </>
  );
});
