"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import GoogleButton from "../../../src/components/auth/google-button";
import UndecLink from "../../../src/components/layout/undec-link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e: ChangeEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // if (password !== password2) {
    //   setAlert("Пароли не совпадают", "danger");
    // } else {
    //   register({ name, email, password });
    // }
  };

  // if (isAuthenticated) return <Redirect to='/dashboard' />;

  return (
    <div className='row'>
      <div className='col-md-3'></div>
      <div className='col-md-6 text-center'>
        <h1 className='large'>Регистрация</h1>
        <p className='lead'>
          <FontAwesomeIcon icon={faUser} /> Создайте свой аккаунт
        </p>
        <GoogleButton />
        <p>или заполнив поля ниже</p>

        <form onSubmit={(e) => onSubmit(e)}>
          <div className='mb-3'>
            <input
              type='text'
              placeholder='Имя / Ник'
              name='name'
              className='form-control'
              value={name}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className='mb-3'>
            <input
              type='email'
              placeholder='Email'
              name='email'
              value={email}
              onChange={(e) => onChange(e)}
              className='form-control'
            />
            <div className='form-text'>
              Сайт также использует Gravatar: если хотите аватарку, то используйте Gravatar email
              (ну или google account)
            </div>
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
          <div className='mb-3'>
            <input
              type='password'
              placeholder='Повторите Пароль'
              name='password2'
              value={password2}
              onChange={(e) => onChange(e)}
              minLength={6}
              className='form-control'
            />
          </div>
          <input type='submit' className='btn btn-primary mb-2' value='Регистрация' />
        </form>
        <p className='my-1'>
          Уже есть аккаунт? Просто <UndecLink href='/auth/login' txt='Войдите' />
        </p>
      </div>
      <div className='col-md-3'></div>
    </div>
  );
}
