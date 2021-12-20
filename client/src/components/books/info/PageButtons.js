import React from "react";
import { Link } from "react-router-dom";
import { clearPage } from "../../../actions/books";
import { connect } from "react-redux";

const PageButtons = ({ pages, bookId, chapterId }) => {
  return pages.map((page, pageInd) => (
    <Link to={`/books/${bookId}/${chapterId}/${pageInd}`} key={pageInd}>
      <button type='button' className='btn btn-info btn-sm mx-1'>
        {pageInd + 1}
      </button>
    </Link>
  ));
};

export default connect(null, { clearPage })(PageButtons);
