import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { CONTENT } from "../../constants/consts.json";

const PleaseShare = ({ contentType }) => {
  return (
    <div className='card border-primary mb-3'>
      <div className='card-body'>
        <h5 className='card-title'>Станьте героем 💪</h5>

        {contentType === CONTENT.video ? (
          <Fragment>
            <p className='card-text'>
              <span>И поделитесь видео на китайском со всем светом</span>
            </p>
            <Link className='btn btn-sm btn-info' to='/create-video'>
              Добавить Видео
            </Link>
          </Fragment>
        ) : (
          <Fragment>
            <p className='card-text'>
              <span>И поделитесь текстами для Читалки со всем светом</span>
            </p>
            <Link className='btn btn-sm btn-info' to='/create-text'>
              Добавить Текст
            </Link>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default PleaseShare;
