import React from "react";

const AuthorRus = ({ authorName }) => {
  const { nameRus, nameChinese } = authorName;
  return (
    <h6 className='card-subtitle mb-2'>
      <span className='text-muted'>Автор: </span>
      {nameRus} | {nameChinese}
    </h6>
  );
};

export default AuthorRus;
