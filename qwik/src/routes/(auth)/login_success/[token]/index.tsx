import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, type RequestEvent } from '@builder.io/qwik-city';
import Cookies from 'js-cookie';
import { FlexRow } from '~/components/common/layout/flex-row';
import { PageTitle } from '~/components/common/layout/title';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { takeLoginNext } from '~/misc/helpers/login-next';

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  // the page reloads itself once the token is saved: then on to the saved `next` page or /me
  if (token) throw redirect(302, takeLoginNext(cookie));
};

export default component$(() => {
  const loc = useLocation();
  useVisibleTask$(() => {
    const token = loc.params.token;
    Cookies.set('token', token, { expires: 27 });
    location.reload();
  });

  return (
    <>
      <PageTitle txt={'Google OAuth: Успешный Логин'} />
      <FlexRow>
        <p>Вы должны быть перенаправлены в личный кабинет.</p>
      </FlexRow>
    </>
  );
});
