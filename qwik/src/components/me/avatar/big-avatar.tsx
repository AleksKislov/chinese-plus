import { component$ } from "@builder.io/qwik";
import { AvatarImg } from "~/components/common/media/avatar-img";

type BigAvatarProps = {
  userName: string;
  newAvatar?: NewAvatar;
};

export const BigAvatar = component$(({ userName, newAvatar }: BigAvatarProps) => {
  return (
    <div class='h-25 w-25 rounded-full ring-1 ring-neutral ring-offset-base-100 ring-offset-2'>
      <AvatarImg userName={userName} newAvatar={newAvatar} size={96} />
    </div>
  );
});
