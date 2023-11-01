import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

type UserLinkProps = { userId: string; userName: string };

export const UserLink = component$(({ userId, userName }: UserLinkProps) => {
  return (
    <Link href={`/users/${userId}`} class='cursor-pointer'>
      <small class={`${userName === "admin" ? "text-error" : "text-info"} hover:text-success`}>
        {userName}
      </small>
    </Link>
  );
});
