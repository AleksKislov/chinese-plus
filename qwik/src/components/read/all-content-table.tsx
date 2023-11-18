import { type Signal, component$, $ } from "@builder.io/qwik";
import { WHERE } from "~/components/common/comments/comment-form";
import {
  bookMarkSvg,
  chevronDown,
  chevronSvg,
  chevronUp,
  commentSvg,
  eyeSvg,
  heartSvg,
} from "~/components/common/media/svg";
import CONSTANTS from "~/misc/consts/consts";
import { AllContentTableRow } from "./all-content-table-row";
import type { SortByType, TextTableRowInfo } from "~/routes/read/texts/all";

type AllContentTableProps = {
  content: TextTableRowInfo[];
  contentType: WHERE.text | WHERE.video;
  sortSignal: Signal<boolean>;
  sortBy: Signal<SortByType>;
};

export const AllContentTable = component$(
  ({ content, contentType, sortSignal, sortBy }: AllContentTableProps) => {
    const isVideo = contentType === WHERE.video;

    const getSvg = $((str: SortByType) => {
      return sortBy.value !== str ? chevronSvg : sortSignal.value ? chevronUp : chevronDown;
    });
    const changeSort = $((str: SortByType) => {
      if (sortBy.value !== str) {
        sortBy.value = str;
        sortSignal.value = false;
        return;
      }
      sortSignal.value = !sortSignal.value;
    });

    return (
      <div class='overflow-x-auto'>
        <table class='table text-base-content'>
          <thead>
            <tr>
              <th>
                <div
                  class='flex cursor-pointer hover:text-secondary'
                  onClick$={() => changeSort("date")}
                >
                  <span>Дата</span>
                  {getSvg("date")}
                </div>
              </th>
              {/* <th>Автор</th> */}
              <th>Название</th>
              <th>
                <div
                  class='flex cursor-pointer hover:text-secondary'
                  onClick$={() => changeSort("likes")}
                >
                  {heartSvg}
                  {getSvg("likes")}
                </div>
              </th>
              <th>
                <div
                  class='flex cursor-pointer hover:text-secondary'
                  onClick$={() => changeSort("comments")}
                >
                  {commentSvg}
                  {getSvg("comments")}
                </div>
              </th>
              <th>
                <div
                  class='flex cursor-pointer hover:text-secondary'
                  onClick$={() => changeSort("hits")}
                >
                  {eyeSvg}
                  {getSvg("hits")}
                </div>
              </th>
              <th>
                <div class='pl-4'>{bookMarkSvg}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {content.map((cnt) => (
              <AllContentTableRow
                lvl={cnt.lvl}
                contentId={cnt._id}
                // user={cnt.user}
                title={cnt.title}
                category={CONSTANTS.textCategories[(cnt as TextTableRowInfo).category]}
                commentsTotal={cnt.comments}
                likesTotal={cnt.likes}
                hitsTotal={cnt.hits}
                isVideo={isVideo}
                date={cnt.date}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);
