import { component$ } from "@builder.io/qwik";
import { DonateGoalsCard } from "./donate-goals-card";
import { type DonateGoal } from "~/routes/(club)/donate";
import { DonateGoalCard } from "./donate-goal-card";

export const DonateGoals = component$(({ goals }: { goals: DonateGoal[] }) => {
  return (
    <>
      <DonateGoalsCard />
      {goals.map((goal, ind) => (
        <DonateGoalCard goal={goal} key={ind} />
      ))}
    </>
  );
});
