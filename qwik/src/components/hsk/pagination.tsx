import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import CONSTANTS from "~/misc/consts/consts";
export const hskInfo = CONSTANTS.hskInfo;
export const maxWordsPerPage = CONSTANTS.maxWordsPerPage;
import type { HskLvlSizeMap } from "~/misc/consts/consts";

type PaginationProps = {
  level: string;
  curPage: number;
  isOldHsk: boolean;
};

export const Pagination = component$(({ level, curPage, isOldHsk }: PaginationProps) => {
  const infoToUse: HskLvlSizeMap = isOldHsk ? hskInfo.oldLevelSize : hskInfo.bandSize;
  const maxPerRow = 10;
  const lvl = level === "789" ? "7-8-9" : level;
  const numOfPages = Math.ceil(infoToUse[lvl] / maxWordsPerPage);
  const rowsNum = Math.ceil(numOfPages / maxPerRow);

  return (
    <div class={"flex justify-between mb-3"}>
      <div></div>
      <div>
        {Array.from(Array(rowsNum)).map((x, rowNum) => (
          <ul class='btn-group' key={rowNum + 1000}>
            {Array.from(Array(numOfPages))
              .slice(maxPerRow * (rowNum + 1) - maxPerRow, maxPerRow * (rowNum + 1))
              .map((el, ind) => (
                <Link
                  class={`btn btn-sm ${curPage === ind + maxPerRow * rowNum ? "btn-active" : ""}`}
                  key={ind}
                  href={`?lvl=${level}&pg=${ind + maxPerRow * rowNum}`}
                >
                  {ind + 1 + maxPerRow * rowNum}
                </Link>
              ))}
          </ul>
        ))}
      </div>
      <div></div>
    </div>
  );
});
