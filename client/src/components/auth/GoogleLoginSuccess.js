import React, { Fragment, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { googleLogin } from "../../actions/auth";
import { Helmet } from "react-helmet";

const GoogleLoginSuccess = ({ googleLogin, isAuthenticated, match }) => {
  useEffect(() => {
    googleLogin(match.params.id);
    // eslint-disable-next-line
  }, []);

  if (isAuthenticated) return <Redirect to='/dashboard' />;

  return (
    <Fragment>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Войти в Chinese+ Клуб</title>
      </Helmet>
      <h1 className='large text-primary'>Google OAuth: Успешный Логин</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Сейчас Вас переправим в личный кабинет.
      </p>
    </Fragment>
  );
};

GoogleLoginSuccess.propTypes = {
  googleLogin: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { googleLogin })(GoogleLoginSuccess);
