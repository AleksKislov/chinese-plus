"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSmile } from "@fortawesome/free-solid-svg-icons";
import GoogleButton from "../../../src/components/auth/google-button";
import UndecLink from "../../../src/components/layout/undec-link";

import { loadUser, login } from "../../../src/context/auth/actions";
import { saveCookie, getCookie } from "../../../src/context/auth/cookie-manager";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
    const token = getCookie("token");
    if (!token) return;
    loadUser(token).then((user) => user && router.push("/me"));
  }, []);

  const { email, password } = formData;
  const onChange = (e: ChangeEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const onSubmit = async () => {
    try {
      const { token } = await login(email, password);
      saveCookie("token", token);
      router.push("/me");
      setTimeout(router.refresh);
    } catch (err) {
      console.log("упс, не смогли залогиниться");
    }
  };

  if (!domLoaded) return null;

  return (
    <div className='row'>
      {/* <div className='col-3'></div>
      <div className='col-6 text-center'>
        <h1>Войти</h1>
        <p className='lead'>
          <FontAwesomeIcon icon={faUser} /> Залогиньтесь в свой аккаунт
        </p>

        <GoogleButton />
        <p>или с помощью</p>
        <form>
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

          <input type='button' className='btn btn-primary mb-2' value='Войти' onClick={onSubmit} />
        </form>
        <p className='my-1'>
          Еще нет аккаунта? Самое время <UndecLink href='/auth/register' txt='зарегистрироваться' />{" "}
          <FontAwesomeIcon icon={faSmile} />
        </p>
      </div>
      <div className='col-md-3'></div> */}
    </div>
  );
}
