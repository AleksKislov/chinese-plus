import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { BASE_URL } from "~/misc/actions/request";

export const GoogleButton = component$(() => {
  return (
    <Link class='btn btn-success btn-sm' href={`${BASE_URL}/api/auth/google`}>
      войти via google
    </Link>
  );
});
