import React from "react";

const BooksNotification = () => {
  return (
    <div className='card text-white bg-warning mb-3'>
      <div className='card-body'>
        <h4 className='card-title'>Внимание!</h4>
        <p className='card-text'>
          Тексты в разделе с книгами еще не обработаны, поэтому могут встречаться неверные
          выделенные слова или слова без перевода. Мы в курсе, просто еще руки не дошли. Следите за
          обновлениями на сайте
        </p>
      </div>
    </div>
  );
};

export default BooksNotification;
