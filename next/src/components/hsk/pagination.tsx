import { useState, useEffect, MouseEvent } from "react";
import myConsts from "../../helpers/constants/consts";
const hskInfo = myConsts.hskInfo;
const maxWordsPerPage = myConsts.maxWordsPerPage;

type PaginationProps = {
  level: string;
  setLimit: Function;
  curPage: number;
  isOldHsk: boolean;
};

export default function Pagination({ level, setLimit, curPage, isOldHsk }: PaginationProps) {
  const infoToUse: HskLvlSizeMap = isOldHsk ? hskInfo.oldLevelSize : hskInfo.bandSize;
  const maxPerRow = 10;
  const [numOfPages, setNumOfPages] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [rowsNum, setRowsNum] = useState(1);

  useEffect(() => {
    setActivePage(curPage);
  }, [curPage]);

  useEffect(() => {
    const lvl = level === "789" ? "7-8-9" : level;
    const num = Math.ceil(infoToUse[lvl] / maxWordsPerPage);
    setNumOfPages(num);
    setRowsNum(Math.ceil(num / maxPerRow));
  }, [level]);

  const choosePage = (e: MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLLIElement;
    const pageInd = +target.innerHTML - 1;
    if (activePage === pageInd) return;
    setActivePage(pageInd);
    setLimit(pageInd);
  };

  return (
    <div>
      {Array.from(Array(rowsNum)).map((x, rowNum) => (
        <ul className='pagination justify-content-center pagination-sm' key={rowNum + 1000}>
          {Array.from(Array(numOfPages))
            .slice(maxPerRow * (rowNum + 1) - maxPerRow, maxPerRow * (rowNum + 1))
            .map((el, ind) => (
              <li
                className={`page-item ${activePage === ind + maxPerRow * rowNum ? "active" : ""}`}
                key={ind}
                onClick={choosePage}
              >
                <a className='page-link' href={`?lvl=${level}&pg=${activePage}`}>
                  {ind + 1 + maxPerRow * rowNum}
                </a>
              </li>
            ))}
        </ul>
      ))}
    </div>
  );
}
