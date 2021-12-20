import React, { useState } from "react";
import { connect } from "react-redux";
import Tippy from "@tippyjs/react";
import { setReadGoal } from "../../actions/auth";
import { setAlert } from "../../actions/alert";
import { Link } from "react-router-dom";

const ReadingCard = ({ user, setReadGoal, setAlert }) => {
  const [change, setChange] = useState(false);

  const setGoal = async () => {
    const input = parseInt(document.getElementById("readingGoal").value);

    if (input) {
      await setReadGoal(input);
      setChange(false);
      setAlert("Новая цель задана!", "success");
    } else {
      setAlert("Введите только цифры", "danger");
    }
  };

  const textAboutGoal = (
    <p className='card-text mt-1'>
      <Tippy content='Прочитать иероглифов в день'>
        <span>
          <span className='text-muted'>Дневная цель:</span>{" "}
          {(user && user.daily_reading_goal) || "0"} 字
        </span>
      </Tippy>
    </p>
  );

  const changeGoalButton = (
    <Tippy content='Поменять дневную цель'>
      <button
        type='button'
        className={`btn btn-${change ? "warning" : "info"} btn-sm`}
        id='changeGoalButton'
        onClick={() => setChange(!change)}
      >
        {change ? <i className='fas fa-edit'></i> : <i className='fas fa-sync-alt'></i>}
      </button>
    </Tippy>
  );

  const goalForm = (
    <div className='form-group'>
      <label className='col-form-label col-form-label-sm'>
        Установить кол-во иероглифов, которые желательно прочитать за день
      </label>
      <div className='input-group mb-3'>
        <div className='input-group-prepend'>
          <button className='btn btn-secondary' type='button' onClick={setGoal}>
            Отправить
          </button>
        </div>
        <input type='text' className='form-control' placeholder='Цифры' id='readingGoal' />
      </div>
    </div>
  );

  const progressBarDiv = (
    <div>
      <small>Прочитано {user && `${user.read_today_num} из ${user.daily_reading_goal} 字`}</small>
      <div className='progress'>
        <div
          className='progress-bar bg-success'
          role='progressbar'
          aria-valuenow='1'
          aria-valuemin='0'
          aria-valuemax='100'
          style={{
            width: `${user && `${(user.read_today_num / user.daily_reading_goal) * 100}%`}`
          }}
        ></div>
      </div>
      <small className='float-right'>cброс в 00:00 по МСК</small>
    </div>
  );

  return user ? (
    <div className='card bg-light border-primary mb-3'>
      <div className='card-body'>
        <h4 className='card-title'>Дневник Чтения 📚</h4>
        <div className='textGoal'>
          {textAboutGoal}
          {user.daily_reading_goal ? changeGoalButton : ""}
        </div>

        {(!user.daily_reading_goal || change) && goalForm}
        {user.daily_reading_goal && progressBarDiv}
      </div>
    </div>
  ) : (
    <div className='card bg-light border-primary mb-3'>
      <div className='card-body'>
        <h5 className='card-title'>Дневник чтения 📚</h5>
        <p className='card-text'>Войдите, чтобы вести учет прочитанных иероглифов</p>
        <Link to='/login' className='card-link'>
          Вход
        </Link>
        <Link to='/register' className='card-link'>
          Регистрация
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { setReadGoal, setAlert })(ReadingCard);
