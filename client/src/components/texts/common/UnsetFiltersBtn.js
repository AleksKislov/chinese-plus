import React from "react";

const UnsetFiltersBtn = ({ onClick }) => {
  return (
    <div className='col-sm-3 d-flex align-items-end flex-column '>
      <div
        className='btn btn-outline-primary w-100 mt-auto mb-2'
        onClick={onClick}
        style={{ minHeight: "36.5px" }}
      >
        Сброс фильтра
      </div>
    </div>
  );
};

export default UnsetFiltersBtn;
