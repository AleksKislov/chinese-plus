import React, { useEffect, useState } from "react";
import NumOfTexts from "../texts/common/NumOfTexts";
import { Link } from "react-router-dom";
import { CONTENT } from "../../constants/consts.json";
import { Fragment } from "react";

const TextsInfoCard = ({ text, contentType }) => {
  useEffect(() => {
    if (window.location.pathname.includes("/texts")) {
      setIsCards(true);
      setIsTable(false);
    } else {
      setIsCards(false);
      setIsTable(true);
    }
  }, []);

  const [isCards, setIsCards] = useState(true);
  const [isTable, setIsTable] = useState(true);

  const cardTitle = <h6 className='card-title'>Отображение текстов:</h6>;

  return (
    <div className='card bg-light mb-3'>
      <div className='card-body'>
        {contentType !== CONTENT.video ? (
          <Fragment>
            {cardTitle}
            <div className='btn-group w-100 mb-1' role='group'>
              <Link
                to='/texts'
                className={`btn btn-secondary btn-sm ${isCards ? "active" : ""}`}
                type='button'
              >
                Карточки
              </Link>
              <Link
                to='/all_texts'
                type='button'
                className={`btn btn-secondary btn-sm ${isTable ? "active" : ""}`}
              >
                Весь список
              </Link>
            </div>
            <p className='card-text'>{text}</p>
            <NumOfTexts />
          </Fragment>
        ) : (
          <p className='card-text'>{text}</p>
        )}
      </div>
    </div>
  );
};

export default TextsInfoCard;
