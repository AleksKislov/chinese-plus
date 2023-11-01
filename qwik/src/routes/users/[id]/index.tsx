import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { ApiService } from "~/misc/actions/request";
import { UserMainInfo } from "~/components/me/user-main-info";

type UserInfo = {
  _id: string;
  name: string;
  role?: "moderator" | "admin";
  newAvatar?: NewAvatar;
};

export const getUserInfo = routeLoader$(async ({ params }): Promise<UserInfo> => {
  return ApiService.get("/api/users/" + params.id, undefined, {
    _id: params.id,
    name: "unknown",
    role: undefined,
    newAvatar: undefined,
  });
});

// api/texts/user/5f301a8f0aa547478da68c18 getTexts

export default component$(() => {
  const userInfo = getUserInfo();
  const { _id: userId, newAvatar, role, name } = userInfo.value;

  return (
    <>
      <PageTitle txt={"О пользователе"} />

      <FlexRow>
        <div class='w-full basis-1/2  mt-3'>
          <UserMainInfo
            id={userId}
            newAvatar={newAvatar}
            role={role}
            name={name}
            isPrivate={false}
          />
        </div>

        <div class='w-full basis-1/2'></div>
      </FlexRow>

      <FlexRow>тут будет список текстов и видео пользователя</FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ страница пользователя",
};
