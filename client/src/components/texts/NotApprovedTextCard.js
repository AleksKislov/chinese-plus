import React, { useState } from "react";
import { Link } from "react-router-dom";
import { levelStars } from "../../actions/helpers";
import { dateToStr } from "../../actions/helpers";
import Tippy from "@tippyjs/react";
import { connect } from "react-redux";

const NotApprovedTextCard = ({ text, user, hide, category }) => {
  const {
    belongsToLongText,
    title,
    pic_url,
    tags,
    length,
    description,
    level,
    date,
    name,
    comments_id,
    _id,
    theme_word,
    hits,
    categoryInd,
    pages
  } = text;

  const [textLink, setTextLink] = useState(!pages ? _id : `${pages[0].page}/${_id}`);

  const dateAndTime = dateToStr(date);
  return (
    !belongsToLongText && (
      <div className={`card my-2`}>
        <div className='card-body row'>
          <div style={{ position: "relative" }} className='col-md-3'>
            <Link to={`/texts/${textLink}`}>
              <img className='mr-3 textCardImg' src={`${pic_url}`} alt='text pic' />
              <div style={imgText}>{theme_word}</div>
            </Link>
          </div>
          <div className='col-md-9'>
            <h4 className='card-title'>
              <Link to={`/texts/${textLink}`}>{title}</Link>{" "}
              <Tippy content={`просмотров: ${hits}`}>
                <small className='text-muted extra-smtext'>
                  <i className='fas fa-eye'></i> {hits}
                </small>
              </Tippy>
            </h4>
            <h6 className='card-subtitle mb-1 text-muted'>
              <em>{dateAndTime}</em>
            </h6>
            <div className='mb-2'>
              <h6 className='text-muted'>
                Тэги:
                {tags.map((tag, ind) => (
                  <span key={ind} className='badge badge-pill badge-info ml-1'>
                    {tag}
                  </span>
                ))}
              </h6>
            </div>
            <h6 className='card-subtitle mb-2'>
              <span className='text-muted'>Опубликовал: </span>
              {name}
            </h6>
            <h6 className='card-subtitle mb-2'>
              <span className='text-muted'>Уровень: </span>
              {levelStars(level)}
            </h6>
            <h6 className='card-subtitle mb-2'>
              <span className='text-muted'>Кол-во знаков: </span>
              {length}
            </h6>
            <p className='card-text'>{description}</p>

            <div className=''>
              <Link to={`/texts/${textLink}`}>
                <button className='btn btn-sm btn-outline-info'>
                  Комментарии {comments_id.length > 0 && <span>{comments_id.length}</span>}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

const imgText = {
  fontSize: "2rem",
  color: "black",
  fontWeight: "bold",
  textShadow: "1px 1px 1px white, 2px 2px 1px white",
  position: "absolute",
  width: "5rem",
  // top: "85%",
  // left: "25%",
  // transform: "translate(-50%, -50%)"
  marginTop: "-3.5rem",
  marginLeft: "1rem"
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {})(NotApprovedTextCard);
