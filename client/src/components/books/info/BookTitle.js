import React, { Fragment } from "react";

const BookTitle = ({ chineseTitle, russianTitle }) => {
  return (
    <Fragment>
      {chineseTitle} | {russianTitle}
    </Fragment>
  );
};

export default BookTitle;
