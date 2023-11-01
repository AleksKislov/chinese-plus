import { component$ } from "@builder.io/qwik";
import { solidStarSvg } from "../media/svg";

type LevelStarsProps = { lvl: number };

export const LevelStars = component$(({ lvl }: LevelStarsProps) => {
  const STARS_NUM = 3;
  return (
    <>
      <div class={"flex pt-1"}>
        {[...new Array(STARS_NUM)].map((_, ind) => (
          <span key={ind} class={lvl > ind ? "text-warning" : ""}>
            {solidStarSvg}
          </span>
        ))}
      </div>
    </>
  );
});
