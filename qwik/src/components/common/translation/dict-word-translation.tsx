import { component$ } from "@builder.io/qwik";
import { markUpRuText } from "~/misc/helpers/translation";

export const DictWordTranslation = component$(
  ({ ru, showExamples, py }: { ru: string; showExamples: boolean; py: string }) => {
    return (
      <>
        <div class='font-bold text-xl text-success'>{py}</div>
        <div dangerouslySetInnerHTML={markUpRuText(ru, showExamples)}></div>
      </>
    );
  }
);
