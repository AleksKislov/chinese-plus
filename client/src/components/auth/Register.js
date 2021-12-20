import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import GoogleButton from "./GoogleButton";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const { name, email, password, password2 } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Пароли не совпадают", "danger");
    } else {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) return <Redirect to='/dashboard' />;

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Войти в Chinese+ Клуб</title>
      </Helmet>
      <div className='col-md-3'></div>
      <div className='col-md-6 text-center'>
        <h1 className='large text-primary'>Регистрация</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Создайте свой аккаунт
        </p>
        <GoogleButton />
        <p>или</p>

        <form className='form' onSubmit={e => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Имя / Ник'
              name='name'
              className='form-control'
              value={name}
              onChange={e => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Адрес Email'
              name='email'
              value={email}
              onChange={e => onChange(e)}
              className='form-control'
            />
            <small className='form-text'>
              Сайт также использует Gravatar: если хотите аватарку, то используйте Gravatar email
              (ну или google account)
            </small>
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Пароль'
              name='password'
              minLength='6'
              value={password}
              onChange={e => onChange(e)}
              className='form-control'
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Повторите Пароль'
              name='password2'
              value={password2}
              onChange={e => onChange(e)}
              minLength='6'
              className='form-control'
            />
          </div>
          <input type='submit' className='btn btn-primary' value='Регистрация' />
        </form>
        <p className='my-1'>
          Уже есть аккаунт? Просто <Link to='/login'>Войдите</Link>
        </p>
      </div>
      <div className='col-md-3'></div>
    </div>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
