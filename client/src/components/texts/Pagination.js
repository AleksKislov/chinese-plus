import React, { useState, useEffect } from "react";

const Pagination = ({ setCurPage, curPage, pagesNum, textId }) => {
  // const maxPerRow = 10;
  const [activePage, setActivePage] = useState(0);
  // const [rowsNum, setRowsNum] = useState(1);

  useEffect(() => {
    setActivePage(curPage);
  }, [curPage]);

  const choosePage = (e) => {
    const pageInd = +e.target.innerHTML - 1;
    if (activePage === pageInd) return;
    setActivePage(pageInd);
    setCurPage(pageInd);
  };

  return (
    pagesNum > 0 && (
      <ul className='pagination justify-content-center pagination-sm'>
        {Array.from(Array(pagesNum)).map((_el, ind) => (
          <li
            className={`page-item ${activePage === ind ? "active" : ""}`}
            key={ind}
            onClick={choosePage}
          >
            <a className='page-link' href={`/texts/${textId}/${ind}`}>
              {ind + 1}
            </a>
          </li>
        ))}
      </ul>
    )
  );
};

export default Pagination;
