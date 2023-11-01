import { component$, useSignal } from "@builder.io/qwik";
import { type NewHskWordType } from "~/routes/hsk/3/table";
import { DictWordTranslation } from "../translation/dict-word-translation";
import { ShowHideBtn } from "./show-hide-btn";

export const MoreInfoModal = component$(
  ({ word, modalId }: { word: NewHskWordType; modalId: string }) => {
    const { cn, py, ru } = word;
    const showExamples = useSignal(true);

    return (
      <div class='text-base-content'>
        <input type='checkbox' id={modalId} class='modal-toggle' />
        <label class='modal text-left' for={modalId}>
          <label class='modal-box relative' for=''>
            <label for={modalId} class='btn btn-sm btn-circle absolute right-2 top-2'>
              ✕
            </label>

            <div class={"flex flex-row mb-2"}>
              <div class={"text-2xl mr-2"}>{cn}</div>
              <div class={"text-lg"}>{py}</div>
            </div>

            <ShowHideBtn showExamples={showExamples} />
            <DictWordTranslation ru={ru} showExamples={showExamples.value} />
          </label>
        </label>
      </div>
    );
  }
);
