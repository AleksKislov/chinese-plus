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
  type DocumentHead,
  useLocation,
  useNavigate,
} from "@builder.io/qwik-city";
import { Alerts } from "~/components/common/alerts/alerts";
import { getTokenFromCookie } from "~/misc/actions/auth";
import { ApiService } from "~/misc/actions/request";
import { AlertColorEnum, alertsContext } from "~/root";

export const onGet = async ({ params, cookie, redirect, send }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (token) throw redirect(302, "/me");

  const resetPassToken = params.token;
  const res = await ApiService.post(
    "/api/auth/verify_reset_pass_token",
    { token: resetPassToken },
    undefined,
    null
  );
  if (!res) send(200, "Link is not valid");
};

export const useResetPassword = routeAction$(async (params): Promise<{ token: string } | null> => {
  return ApiService.post("/api/auth/reset_password", params, undefined, null);
});

export default component$(() => {
  const loc = useLocation();
  const token = loc.params.token;
  const nav = useNavigate();
  const newPassword = useSignal("");
  const password = useSignal("");
  const resetPassword = useResetPassword();
  const alertsState = useContext(alertsContext);

  useVisibleTask$(({ track }) => {
    const res = track(() => resetPassword.value);
    if (res === undefined) return;

    if (!res) {
      alertsState.push({
        bg: AlertColorEnum.error,
        text: `Ошибка! Попробуйте снова или свяжитесь с админом!`,
      });
      return;
    }

    alertsState.push({
      bg: AlertColorEnum.success,
      text: `Пароль изменен! Перенаправляем вас на страницу входа.`,
    });

    setTimeout(() => nav("/login"), 3000);
  });

  const submit = $(() => {
    if (password.value.length < 6) {
      return alertsState.push({
        bg: AlertColorEnum.error,
        text: `Минимум 6 символов в пароле!`,
      });
    }

    if (password.value !== newPassword.value) {
      return alertsState.push({
        bg: AlertColorEnum.error,
        text: `Пароли не совпадают!`,
      });
    }

    resetPassword.submit({ token, password: password.value });
  });

  useOnDocument(
    "keydown",
    $((e) => (e as KeyboardEvent).key === "Enter" && submit())
  );

  return (
    <div class='text-center'>
      <article class={"prose max-w-none"}>
        <h1>Смена пароля</h1>
        <Alerts />

        <div class='flex items-stretch'>
          <div class='form-control mx-auto w-96'>
            <label class='input-group input-group-vertical mb-4'>
              <span>Новый пароль</span>
              <input
                type='password'
                placeholder='ваш новый pAs$w0rd'
                class='input input-bordered'
                bind:value={newPassword}
              />
            </label>

            <label class='input-group input-group-vertical mb-4'>
              <span>Повторите пароль</span>
              <input
                minLength={6}
                type='password'
                placeholder='ваш новый pAs$w0rd'
                class='input input-bordered'
                bind:value={password}
              />
            </label>

            <div class='flex flex-col w-full border-opacity-50'>
              <button class='btn btn-info btn-sm mt-2' onClick$={submit}>
                Сменить
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Смена пароля",
  meta: [
    {
      name: "description",
      content: "Сменить пароль для Chinese+",
    },
  ],
};
