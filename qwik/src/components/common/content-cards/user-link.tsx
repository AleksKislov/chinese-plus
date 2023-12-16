import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

type UserLinkProps = { userId: string; userName: string; isAnon?: boolean };

export const UserLink = component$(({ userId, userName, isAnon }: UserLinkProps) => {
  return (
    <>
      {isAnon ? (
        <small>{userName}</small>
      ) : (
        <Link href={`/users/${userId}`} class='cursor-pointer'>
          <small
            class={`${userName === "admin" ? "text-error" : "text-secondary"} hover:text-success`}
          >
            {userName}
          </small>
        </Link>
      )}
    </>
  );
});
