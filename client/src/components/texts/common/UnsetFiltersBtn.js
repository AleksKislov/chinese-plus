import React from "react";

const UnsetFiltersBtn = ({ onClick }) => {
  return (
    <div className='col-sm-3'>
      <div
        className='btn btn-outline-primary w-100'
        onClick={onClick}
        style={{ minHeight: "36.5px" }}
      >
        Сброс фильтра
      </div>
    </div>
  );
};

export default UnsetFiltersBtn;
