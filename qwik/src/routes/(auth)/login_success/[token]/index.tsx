import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation, type RequestEvent } from "@builder.io/qwik-city";
import Cookies from "js-cookie";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { getTokenFromCookie } from "~/misc/actions/auth";

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (token) throw redirect(302, "/me");
  // throw redirect(302, "/login");
};

export default component$(() => {
  const loc = useLocation();
  useVisibleTask$(() => {
    const token = loc.params.token;
    Cookies.set("token", token);
    location.reload();
  });

  return (
    <>
      <PageTitle txt={"Google OAuth: Успешный Логин"} />
      <FlexRow>
        <p>Вы должны быть перенаправлены в личный кабинет.</p>
      </FlexRow>
    </>
  );
});
