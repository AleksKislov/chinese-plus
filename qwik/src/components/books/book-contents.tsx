import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { getBookUrl } from '~/misc/helpers/content/get-book-url';
import { type BookContents } from '~/routes/read/books/[id]/layout';

export const BookContentsComponent = component$(
  ({ bookContents }: { bookContents: BookContents }) => {
    const { book, contents } = bookContents;
    const loc = useLocation();
    const isCurrentPage = (pageInd: number) => Number(loc.url.searchParams.get('page')) === pageInd;
    const isCurrentChapter = (chapterId: ObjectId) => loc.params.chapter_id === chapterId;

    return (
      <div>
        <div class="prose my-1 ml-2">
          <h3>Содержание</h3>
        </div>

        <div class="join join-vertical bg-base-100 w-full">
          {Object.entries(contents).map(([key, value]) => (
            <div class="collapse collapse-arrow join-item border-base-300 border" key={key}>
              <input type="radio" name="my-accordion-4" checked={isCurrentChapter(value._id)} />
              <div class="collapse-title flex justify-between items-center">
                <div class="flex flex-col">
                  <span class="">{value.title.cn}</span>
                  <span class="text-xs">{value.title.ru}</span>
                </div>
                <span>
                  <span class="badge badge-accent badge-outline">{value.length}</span> 字
                </span>
              </div>
              <div class="collapse-content text-sm">
                <div>
                  {value.pages.map((page, i) => (
                    <Link
                      key={i}
                      href={`${getBookUrl(book)}/${value._id}?page=${page.ind}`}
                      class={`btn btn-sm btn-outline hover:btn-accent m-1 ${
                        isCurrentChapter(value._id) && isCurrentPage(page.ind) ? 'btn-accent' : ''
                      }`}
                    >
                      {page.ind + 1}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
