import { component$, type Signal } from "@builder.io/qwik";
import CONSTANTS from "~/misc/consts/consts";
import { type VideoCategory } from "~/routes/watch/videos";
import { WHERE, type WhereType } from "../comments/comment-form";

type CategoryFilterProps = {
  categorySignal: Signal<string>;
  contentType: WhereType; // only text or video here
};

export const CategoryFilter = component$(({ categorySignal, contentType }: CategoryFilterProps) => {
  return (
    <div class='form-control'>
      <select
        class='select select-bordered'
        value={categorySignal.value}
        onChange$={(e) => {
          categorySignal.value = e.target.value;
        }}
      >
        <option selected value={""}>
          {categorySignal.value === "" ? "Все Категории" : "Все Категории"}
        </option>
        {contentType === WHERE.video
          ? (Object.keys(CONSTANTS.videoCategories) as VideoCategory[]).map((x, ind) => (
              <option value={x} key={ind}>
                {CONSTANTS.videoCategories[x]}
              </option>
            ))
          : CONSTANTS.textCategories.map((ruCategory, ind) => (
              <option value={ind} key={ind}>
                {ruCategory}
              </option>
            ))}
      </select>
    </div>
  );
});
