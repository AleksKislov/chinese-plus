import React, { Fragment } from "react";

const Pagination = ({ pagesNumber }) => {
  const arr = [];
  for (let i = 2; i <= pagesNumber; i++) {
    arr.push(i);
  }
  return (
    <Fragment>
      {arr.map(el => (
        <li className='page-item' key={el}>
          <a className='page-link' href='#!'>
            {el}
          </a>
        </li>
      ))}
    </Fragment>
  );
};

export default Pagination;
