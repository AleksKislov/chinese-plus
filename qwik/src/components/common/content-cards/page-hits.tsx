import { component$ } from "@builder.io/qwik";
import { eyeSvg } from "../media/svg";

type PageHitsProps = {
  hits?: number;
};
export const PageHits = component$(({ hits }: PageHitsProps) => {
  return (
    <div class='tooltip tooltip-info tooltip-bottom' data-tip={"Просмотров: " + (hits || 0)}>
      <div class='badge badge-secondary'>
        {eyeSvg} <span class={"pl-1"}>{hits || 0}</span>
      </div>
    </div>
  );
});
