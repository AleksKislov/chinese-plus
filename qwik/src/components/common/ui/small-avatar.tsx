import { component$ } from "@builder.io/qwik";
import { AvatarImg } from "../media/avatar-img";

type SmallAvatarProps = {
  userName: string;
  newAvatar?: NewAvatar;
};

export const SmallAvatar = component$(({ userName, newAvatar }: SmallAvatarProps) => {
  return (
    <div class='w-12 h-12 rounded-full ring-1 ring-neutral ring-offset-base-100 ring-offset-1'>
      {userName && <AvatarImg userName={userName} newAvatar={newAvatar} size={48} />}
    </div>
  );
});
