import React from "react";
import { Link } from "react-router-dom";

const NoticeWell = ({ notice }) => {
  const { text, color, display, link } = notice || {};

  return (
    display && (
      <div className='row'>
        <div className='col-md-12'>
          <div className={`alert alert-dismissible text-center alert-${color}`}>
            <button type='button' className='close' data-dismiss='alert'>
              &times;
            </button>
            <span>{text}</span> {link && <Link to={link}>Обсуждение</Link>}
          </div>
        </div>
      </div>
    )
  );
};

export default NoticeWell;
