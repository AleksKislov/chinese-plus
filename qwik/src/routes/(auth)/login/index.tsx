import {
  component$,
  $,
  useOnDocument,
  useSignal,
  useContext,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  routeAction$,
  type RequestEvent,
  Link,
  type DocumentHead,
  useNavigate,
} from "@builder.io/qwik-city";
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

export const useLogin = routeAction$(async (params): Promise<{ token: string } | null> => {
  return ApiService.post("/api/auth", params, undefined, null);
});

export const useSendResetPasswordEmail = routeAction$(
  async (params): Promise<{ token: string } | null> => {
    return ApiService.post("/api/auth/send_reset_pass_email", params, undefined, null);
  }
);

export default component$(() => {
  const nav = useNavigate();
  const email = useSignal("");
  const password = useSignal("");
  const login = useLogin();
  const sendEmail = useSendResetPasswordEmail();
  const alertsState = useContext(alertsContext);

  useVisibleTask$(({ track }) => {
    const res = track(() => login.value);
    if (res === undefined) return;

    if (!res?.token) {
      alertsState.push({
        bg: AlertColorEnum.error,
        text: `Ошибка! Проверьте имейл / пароль`,
      });
      return;
    }

    Cookies.set("token", res.token);
    setTimeout(() => nav("/me"), 500);
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => sendEmail.value);
    if (res === undefined) return;

    if (!res) {
      alertsState.push({
        bg: AlertColorEnum.error,
        text: `Ошибка при отправке письма, обратитесь к админу`,
      });
      return;
    }

    alertsState.push({
      bg: AlertColorEnum.success,
      text: `Отлично! Скоро вам на почту придет письмо.`,
    });
  });

  useOnDocument(
    "keydown",
    $(
      (e) =>
        (e as KeyboardEvent).key === "Enter" &&
        login.submit({ email: email.value, password: password.value })
    )
  );

  const ModalId = "reset-pass-modal";

  const validateEmail = (email: string) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <div class='text-center'>
      <article class={"prose max-w-none"}>
        <h1>Войти</h1>
        <Alerts />
        <div class='mb-3'>
          Нет аккаунта?{" "}
          <Link href='/register' class='link link-primary'>
            Зарегистрируйтесь
          </Link>
        </div>
        <div class='flex items-stretch'>
          <div class='form-control mx-auto w-96'>
            <label class='input-group input-group-vertical mb-4'>
              <span>Email</span>
              <input
                type={"email"}
                placeholder='example@site.com'
                class='input input-bordered'
                bind:value={email}
              />
            </label>

            <label class='input-group input-group-vertical mb-4'>
              <span>Пароль</span>
              <input
                minLength={6}
                type='password'
                placeholder='ваш pAs$w0rd'
                class='input input-bordered'
                bind:value={password}
              />
            </label>

            <div class='flex flex-col w-full border-opacity-50'>
              <button
                class='btn btn-info btn-sm mt-2'
                onClick$={() => {
                  login.submit({ email: email.value, password: password.value });
                }}
              >
                войти
              </button>
              <div class='divider'>или</div>
              <GoogleButton />
              <div class='divider'>или</div>
              <label
                for={ModalId}
                class={`btn btn-warning btn-sm ${validateEmail(email.value) ? "" : "btn-disabled"}`}
              >
                Забыли пароль?
              </label>
            </div>
          </div>
        </div>

        <input type='checkbox' id={ModalId} class='modal-toggle' />
        <div class='modal'>
          <div class='modal-box'>
            <h3 class='text-lg font-bold'>Забыли пароль?</h3>
            <p class='py-4'>
              Кнопка ниже отправит вам письмо на <kbd class='kbd kbd-xs'>{email.value}</kbd> со
              ссылкой для смены пароля.
            </p>
            <div class='modal-action'>
              <label
                for={ModalId}
                class='btn btn-info btn-sm'
                onClick$={() => {
                  if (email.value) {
                    sendEmail.submit({ email: email.value });
                  }
                }}
              >
                Получить письмо
              </label>
            </div>
          </div>
          <label class='modal-backdrop' for={ModalId}>
            Close
          </label>
        </div>
      </article>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Вход",
  meta: [
    {
      name: "description",
      content: "Залогиниться на сайте Chinese+",
    },
  ],
};
