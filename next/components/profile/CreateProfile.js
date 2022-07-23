import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createProfile } from "../../actions/profile";

const CreateProfile = ({ createProfile, history }) => {
  const [formData, setFormData] = useState({
    website: "",
    hsk_level: 0,
    location: "",
    fav_char: "",
    bio: "",
    why_learn: "",
    wechat: ""
  });

  const { website, hsk_level, location, fav_char, bio, why_learn, wechat } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    createProfile(formData, history);
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Информация о вас</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Добавлять информацию сугубо личное дело :)
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <select
            name='hsk_level'
            className='form-control'
            onChange={e => onChange(e)}
            value={hsk_level}
          >
            <option value='00'>Выберите уровень</option>
            <option value='Ноль'>Ноль</option>
            <option value='HSK 1'>HSK 1</option>
            <option value='HSK 2'>HSK 2</option>
            <option value='HSK 3'>HSK 3</option>
            <option value='HSK 4'>HSK 4</option>
            <option value='HSK 5'>HSK 5</option>
            <option value='HSK 6'>HSK 6</option>
            <option value='Свободный'>Свободный</option>
            <option value='Носитель'>Носитель</option>
          </select>
          <small className='form-text'>Какой у вас уровень владения китайским языком?</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            className='form-control'
            placeholder='字'
            name='fav_char'
            onChange={e => onChange(e)}
            value={fav_char}
          />
          <small className='form-text'>Любимый иероглиф, одна штука</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            className='form-control'
            placeholder='Сайт'
            name='website'
            onChange={e => onChange(e)}
            value={website}
          />
          <small className='form-text'>Свой сайт или блог</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            className='form-control'
            placeholder='Местонахождение'
            name='location'
            onChange={e => onChange(e)}
            value={location}
          />
          <small className='form-text'>Где вы сейчас?</small>
        </div>
        <div className='form-group'>
          <select
            name='why_learn'
            className='form-control'
            value={why_learn}
            onChange={e => onChange(e)}
          >
            <option value='0'>Цель изучения</option>
            <option value='Работа'>Работа</option>
            <option value='Хобби'>Хобби</option>
          </select>
          <small className='form-text'>Работа или хобби?</small>
        </div>
        <div className='form-group'>
          <textarea
            className='form-control'
            placeholder='Пару слов о себе'
            name='bio'
            value={bio}
            onChange={e => onChange(e)}
          ></textarea>
          <small className='form-text'>Расскажите немного о себе</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            className='form-control'
            placeholder='Wechat ID'
            name='wechat'
            onChange={e => onChange(e)}
            value={wechat}
          />
          <small className='form-text'>Ваш Wechat ID</small>
        </div>

        <input type='submit' className='btn btn-primary my-1' value='Отправить' />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Назад
        </Link>
      </form>
    </Fragment>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired
};

export default connect(null, { createProfile })(withRouter(CreateProfile));
