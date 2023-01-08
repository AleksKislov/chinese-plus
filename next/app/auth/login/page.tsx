"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSmile } from "@fortawesome/free-solid-svg-icons";
import GoogleButton from "../../../src/components/auth/google-button";
import UndecLink from "../../../src/components/layout/undec-link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const onChange = (e: ChangeEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // login(email, password);
  };

  // if (isAuthenticated) return <Redirect to='/dashboard' />;

  return (
    <div className='row'>
      <div className='col-3'></div>
      <div className='col-6 text-center'>
        <h1>Войти</h1>
        <p className='lead'>
          <FontAwesomeIcon icon={faUser} /> Залогиньтесь в свой аккаунт
        </p>

        <GoogleButton />
        <p>или с помощью</p>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className='mb-3'>
            <input
              type='email'
              placeholder='Email'
              name='email'
              value={email}
              onChange={(e) => onChange(e)}
              className='form-control'
              required
            />
          </div>
          <div className='mb-3'>
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

          <input type='submit' className='btn btn-primary mb-2' value='Войти' />
        </form>
        <p className='my-1'>
          Еще нет аккаунта? Самое время <UndecLink href='/auth/register' txt='зарегистрироваться' />{" "}
          <FontAwesomeIcon icon={faSmile} />
        </p>
      </div>
      <div className='col-md-3'></div>
    </div>
  );
}
