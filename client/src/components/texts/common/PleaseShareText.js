import React from "react";
import { Link } from "react-router-dom";

const PleaseShareText = () => {
  return (
    <div className='card bg-light border-primary mb-3'>
      <div className='card-body'>
        <h5 className='card-title'>Станьте героем 💪</h5>

        <p className='card-text'>
          <span>И поделитесь текстами для Читалки со всем светом</span>
        </p>
        <Link className='card-link' to='/create-text'>
          Добавить Текст
        </Link>
      </div>
    </div>
  );
};

export default PleaseShareText;
