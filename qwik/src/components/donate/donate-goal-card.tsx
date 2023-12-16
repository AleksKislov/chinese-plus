import { component$ } from "@builder.io/qwik";
import { type DonateGoal } from "~/routes/(club)/donate";
import { SmallDate } from "../common/ui/small-date";
import { LevelStars } from "../common/content-cards/level-stars";
import { checkBadgeSvg } from "../common/media/svg";

type DonateCardProps = {
  goal: DonateGoal;
};

export const DonateGoalCard = component$(({ goal }: DonateCardProps) => {
  const { amountCollected, amountNeeded, desc, createdAt, currency, priority, title, isFinished } =
    goal;

  const collectedPercent = (amountCollected / amountNeeded) * 100;
  return (
    <div class='card w-full bg-base-200 mb-3'>
      <div class='card-body'>
        <div class='flex justify-between'>
          <h3 class='card-title'>{title}</h3>
          {isFinished && <div class='text-success'>{checkBadgeSvg}</div>}
        </div>

        <div class='flex'>
          <span class={"mr-1 font-bold"}>Приоритет: </span>
          <LevelStars lvl={priority} />
        </div>
        <p>{desc}</p>
        <div>
          <div class='label'>
            <span class='label-text'>
              Собрано: {amountCollected} {currency}
            </span>
            <span class='label-text-alt'>
              Нужно: {amountNeeded} {currency}
            </span>
          </div>
          <progress
            class={`progress w-full ${isFinished ? "progress-success" : "progress-warning"}`}
            value={collectedPercent || 1}
            max='100'
          ></progress>
        </div>

        <SmallDate onlyDate={false} date={createdAt} />
      </div>
    </div>
  );
});
