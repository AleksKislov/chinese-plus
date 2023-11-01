import { component$ } from "@builder.io/qwik";
import { markUpRuText } from "~/misc/helpers/translation";

export const DictWordTranslation = component$(
  ({ ru, showExamples }: { ru: string; showExamples: boolean }) => {
    return <p dangerouslySetInnerHTML={markUpRuText(ru, showExamples)}></p>;
  }
);
