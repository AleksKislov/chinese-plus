import React, { useState, useEffect } from "react";
import { hskInfo, maxWordsPerPage } from "../../constants/consts.json";

const Pagination = ({ level, setLimit, curPage, isOldHsk }) => {
  const maxPerRow = 10;
  const [numOfPages, setNumOfPages] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [rowsNum, setRowsNum] = useState(1);

  useEffect(() => {
    setActivePage(curPage);
  }, [curPage]);

  useEffect(() => {
    const infoToUse = isOldHsk ? hskInfo.oldLevelSize : hskInfo.bandSize;
    const num = Math.ceil(infoToUse[level] / maxWordsPerPage);
    setNumOfPages(num);
    setRowsNum(Math.ceil(num / maxPerRow));
  }, [level]);

  const choosePage = (e) => {
    const pageInd = +e.target.innerHTML - 1;
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
                <a className='page-link' href='#'>
                  {ind + 1 + maxPerRow * rowNum}
                </a>
              </li>
            ))}
        </ul>
      ))}
    </div>
  );
};

export default Pagination;
