import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { CONTENT } from "../../constants/consts.json";

const CreateContent = ({ contentType }) => {
  return (
    <div className=''>
      <h2>
        Поделитесь текстом или видео <small class='text-muted'>и станьте героем 💪</small>
      </h2>

      <p>Каким именно материалом Вы хотели бы поделиться со всем светом?</p>

      <Link className='btn btn-sm btn-info mr-1' to='/create-video'>
        Видео
      </Link>

      <Link className='btn btn-sm btn-info' to='/create-text'>
        Текст
      </Link>
    </div>
  );
};

export default CreateContent;
