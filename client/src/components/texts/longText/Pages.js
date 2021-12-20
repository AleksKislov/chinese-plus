import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { clearText, loadText, loadLongText } from "../../../actions/texts";

const Pages = ({ pages, longTextId, currentPageId, clearText, loadText, loadLongText }) => {
  return (
    <div className=''>
      <span className='text-muted'>Страницы: </span>
      <div className='ml-1 my-1'>
        {pages.map((p, ind) => (
          <Link to={`/texts/${p.page}/${longTextId}`} key={ind}>
            <button
              onClick={() => {
                clearText();
                loadText(p.page);
                loadLongText(longTextId);
              }}
              type='button'
              className={`btn btn-sm mx-1 my-1 btn-success ${
                currentPageId === p.page ? "active" : ""
              }`}
            >
              {ind + 1}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default connect(null, {
  clearText,
  loadText,
  loadLongText
})(Pages);
