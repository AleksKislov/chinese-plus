import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import GoogleButton from "../../components/auth/google-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../components/layout/layout";

const Login = ({ login, isAuthenticated }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) router.push("/me");

  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <title>Войти в Chinese+ Клуб</title>
      </Head>
      <Layout>
        <div className='row'>
          <div className='col-md-3'></div>
          <div className='col-md-6 text-center'>
            {isAuthenticated ? (
              <p>Загрузка...</p>
            ) : (
              <>
                <h1 className='large'>Войти</h1>
                <p className='lead'>
                  <FontAwesomeIcon icon={faUser} /> Залогиньтесь в свой аккаунт
                </p>

                <GoogleButton />
                <p>или</p>
                <form className='form' onSubmit={(e) => onSubmit(e)}>
                  <div className='form-group'>
                    <input
                      type='email'
                      placeholder='Адрес Email'
                      name='email'
                      value={email}
                      onChange={(e) => onChange(e)}
                      className='form-control'
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <input
                      type='password'
                      placeholder='Пароль'
                      name='password'
                      minLength={6}
                      value={password}
                      onChange={(e) => onChange(e)}
                      className='form-control'
                    />
                  </div>

                  <input type='submit' className='btn btn-primary' value='Войти' />
                </form>
                <p className='my-1'>
                  Еще нет аккаунта? Самое время <Link href='/register'>зарегистрироваться</Link> :)
                </p>
              </>
            )}
          </div>
          <div className='col-md-3'></div>
        </div>
      </Layout>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
