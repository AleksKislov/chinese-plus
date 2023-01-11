"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSmile } from "@fortawesome/free-solid-svg-icons";
import GoogleButton from "../../../src/components/auth/google-button";
import UndecLink from "../../../src/components/layout/undec-link";

import { loadUser, login } from "../../../src/context/auth/actions";
import { saveTokenLocally } from "../../../src/context/auth/save-tok-locally";
import { useAuthCtx } from "../../../src/context/auth/store";

export default function LoginPage() {
  const router = useRouter();
  const { setLoggedIn, setUser, loggedIn } = useAuthCtx();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const onChange = (e: ChangeEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await login(email, password);
      const user = await loadUser(token);
      userLoggedEvent(user, token);
    } catch (err) {
      console.log("упс, не смогли залогиниться");
    }
  };

  const userLoggedEvent = (user: UserType, token: string) => {
    setLoggedIn(true);
    setUser(user);
    saveTokenLocally(token);
  };

  if (loggedIn) router.push("/newbie/pinyin-chart");

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
