import { component$ } from '@builder.io/qwik';

type PaginationProps = {
  numOfPages: number;
  curPage: number;
};

export const LongTxtPagination = component$(({ numOfPages, curPage }: PaginationProps) => {
  return (
    <div class={'flex justify-between mb-3'}>
      <div></div>
      <div>
        <ul class="btn-group">
          {Array.from(Array(numOfPages)).map((_el, ind) => (
            <a
              class={`btn btn-sm ${curPage === ind ? 'btn-active' : ''}`}
              key={ind}
              href={`?pg=${ind + 1}`}
            >
              {ind + 1}
            </a>
          ))}
        </ul>
      </div>
      <div></div>
    </div>
  );
});
