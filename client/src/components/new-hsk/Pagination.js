import React, { useState, useEffect } from "react";
import { hskInfo, maxWordsPerPage } from "../../constants/consts.json";

const Pagination = ({ level, setLimit, curPage, isOldHsk }) => {
  const [numOfPages, setNumOfPages] = useState(0);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    setActivePage(curPage);
  }, [curPage]);

  useEffect(() => {
    const infoToUse = isOldHsk ? hskInfo.oldLevelSize : hskInfo.bandSize;
    const num = Math.ceil(infoToUse[level] / maxWordsPerPage);
    setNumOfPages(num);
  }, [level]);

  const choosePage = (e) => {
    const pageInd = +e.target.innerHTML - 1;
    if (activePage === pageInd) return;
    setActivePage(pageInd);
    setLimit(pageInd);
  };

  return (
    <div>
      <ul className='pagination justify-content-center pagination-sm'>
        {numOfPages &&
          Array.from(Array(numOfPages)).map((el, ind) => (
            <li
              className={`page-item ${activePage === ind ? "active" : ""}`}
              key={ind}
              onClick={choosePage}
            >
              <a className='page-link' href='#'>
                {ind + 1}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Pagination;
