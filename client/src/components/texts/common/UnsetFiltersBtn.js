import React from "react";

const UnsetFiltersBtn = ({ onClick }) => {
  return (
    <div className='col-sm-3 d-flex align-self-end mb-2'>
      <div
        className='btn btn-outline-primary mt-2 w-100'
        onClick={onClick}
        style={{ minHeight: "36.5px" }}
      >
        Сброс фильтра
      </div>
    </div>
  );
};

export default UnsetFiltersBtn;
