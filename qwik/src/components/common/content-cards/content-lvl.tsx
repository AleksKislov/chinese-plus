import { component$ } from "@builder.io/qwik";
import { LevelStars } from "./level-stars";

export const ContentLvl = component$(({ lvl }: { lvl: number }) => {
  return (
    <div class='flex'>
      <span class={"mr-1 font-bold"}>Уровень: </span>
      <LevelStars lvl={lvl} />
    </div>
  );
});
