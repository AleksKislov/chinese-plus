import React, { Fragment } from "react";

const NotFound = () => {
  return (
    <Fragment>
      <h1 className='text-primary'>
        <i className='fas fa-exclamation-triangle'></i> Страница Не Найдена
      </h1>
      <p className='mb-0'>Упс, такой страницы нет.</p>
    </Fragment>
  );
};

export default NotFound;
