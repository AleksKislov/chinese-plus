import React from "react";

const TitleChinese = ({ chineseTitle }) => {
  return (
    <h6 className='card-subtitle mb-2'>
      <span className='text-muted'>Название: </span>
      {chineseTitle}
    </h6>
  );
};

export default TitleChinese;
