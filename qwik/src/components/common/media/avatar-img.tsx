import { component$ } from "@builder.io/qwik";
import { createAvatar } from "@dicebear/core";
import { AvatarTypes } from "~/routes/me/avatar";

type AvatarImgProps = {
  userName: string;
  newAvatar?: NewAvatar;
  size: number;
};

/* make avatar using api from https://www.dicebear.com/ */
export const AvatarImg = component$(({ userName, newAvatar, size }: AvatarImgProps) => {
  const seed = newAvatar?.seed || userName;
  const backgroundColor = [newAvatar?.background || "transparent"];
  // @ts-ignore
  const type = AvatarTypes[newAvatar?.type] || AvatarTypes.adventurer;
  const newAva = createAvatar(type, {
    seed,
    size,
    backgroundColor,
  }).toDataUriSync();

  return <img src={newAva} width={size} height={size} />;
});
