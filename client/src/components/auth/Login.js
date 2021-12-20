import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import GoogleButton from "./GoogleButton";
import { Helmet } from "react-helmet";

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login(email, password);
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
        <h1 className='large text-primary'>Войти</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Залогиньтесь в свой аккаунт
        </p>

        <GoogleButton />
        <p>или</p>
        <form className='form' onSubmit={e => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Адрес Email'
              name='email'
              value={email}
              onChange={e => onChange(e)}
              className='form-control'
              required
            />
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

          <input type='submit' className='btn btn-primary' value='Войти' />
        </form>
        <p className='my-1'>
          Еще нет аккаунта? Самое время <Link to='/register'>зарегистрироваться</Link> :)
        </p>
      </div>
      <div className='col-md-3'></div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
