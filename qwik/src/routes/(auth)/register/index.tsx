import { component$, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { routeAction$, type RequestEvent, Link, type DocumentHead } from "@builder.io/qwik-city";
import Cookies from "js-cookie";
import { GoogleButton } from "~/components/auth/google-btn";
import { Alerts } from "~/components/common/alerts/alerts";
import { getTokenFromCookie } from "~/misc/actions/auth";
import { ApiService } from "~/misc/actions/request";
import { AlertColorEnum, alertsContext } from "~/root";

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (token) throw redirect(302, "/me");
};

export const useRegisterUser = routeAction$(async (params): Promise<{ token: string } | null> => {
  return ApiService.post("/api/users", params, undefined, null);
});

export default component$(() => {
  const email = useSignal("");
  const password = useSignal("");
  const secondPassword = useSignal("");
  const name = useSignal("");

  const registerUser = useRegisterUser();
  const alertsState = useContext(alertsContext);

  useVisibleTask$(({ track }) => {
    const res = track(() => registerUser.value);
    if (res === undefined) return;

    if (!res?.token) {
      alertsState.push({
        bg: AlertColorEnum.error,
        text: `Ошибка регистрации!`,
      });
      return;
    }

    Cookies.set("token", res.token);
    location.reload();
  });

  return (
    <div class='text-center'>
      <article class={"prose max-w-none"}>
        <h1>Регистрация</h1>
        <Alerts />
        <div class='mb-3'>
          Есть аккаунт?{" "}
          <Link href='/login' class='link link-primary'>
            Залогиньтесь
          </Link>
        </div>
        <div class='flex items-stretch'>
          <div class='form-control mx-auto w-96'>
            <label class='input-group input-group-vertical mb-4'>
              <span>Ваш никнейм</span>
              <input
                minLength={6}
                maxLength={32}
                type='text'
                placeholder='Имя на сайте'
                class='input input-bordered'
                bind:value={name}
              />
            </label>
            <label class='input-group input-group-vertical mb-4'>
              <span>Email</span>
              <input
                type='email'
                placeholder='example@site.com'
                class='input input-bordered'
                bind:value={email}
              />
            </label>

            <label class='input-group input-group-vertical mb-4'>
              <span>Пароль</span>
              <input
                type='password'
                minLength={6}
                maxLength={32}
                placeholder='ваш pAs$w0rd'
                class='input input-bordered'
                bind:value={password}
              />
            </label>
            <label class='input-group input-group-vertical mb-4'>
              <span>Повторите пароль</span>
              <input
                type='password'
                placeholder='pAs$w0rd еще раз'
                class='input input-bordered'
                minLength={6}
                maxLength={32}
                bind:value={secondPassword}
              />
            </label>

            <div class='flex flex-col w-full border-opacity-50'>
              <button
                class='btn btn-info btn-sm mt-2'
                onClick$={() => {
                  if (!name.value || !email.value || !password.value) {
                    return alertsState.push({
                      bg: AlertColorEnum.error,
                      text: "Не все поля заполнены",
                    });
                  }
                  if (password.value !== secondPassword.value) {
                    return alertsState.push({
                      bg: AlertColorEnum.error,
                      text: `Пароли не совпадают`,
                    });
                  }
                  registerUser.submit({
                    email: email.value,
                    password: password.value,
                    name: name.value,
                  });
                }}
              >
                регистрация
              </button>
              <div class='divider'>или</div>
              <GoogleButton />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Регистрация",
  meta: [
    {
      name: "description",
      content: "Зарегистрироваться на сайте Chinese+",
    },
  ],
};
