import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export const GoogleButton = component$(() => {
  return (
    <Link class="btn btn-success btn-sm" href={`https://www.chineseplus.club/api/auth/google`}>
      войти via google
    </Link>
  );
});
