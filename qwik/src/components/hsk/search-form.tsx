import { $, component$, useOnDocument, useSignal, type Signal } from "@builder.io/qwik";
import { ApiService } from "~/misc/actions/request";
import { type OldHskWordType } from "~/routes/hsk/2/table";
import { type NewHskWordType } from "~/routes/hsk/3/table";
import { searchSvg } from "../common/media/svg";

type HskSearchFormProps = {
  hskWords: Signal<OldHskWordType[] | NewHskWordType[]>;
  isOldHsk: boolean;
};

export const HskSearchForm = component$(({ hskWords, isOldHsk }: HskSearchFormProps) => {
  const chineseWord = useSignal("");

  const getInput = $((e: InputEvent) => {
    const trgt = e.target as HTMLInputElement;
    chineseWord.value = trgt.value;
  });

  const path = `/api/${isOldHsk ? "lexicon" : "newhskwords"}/search`;

  const getHskWords = $(async () => {
    const chinese = chineseWord.value;
    if (!chinese) return (hskWords.value = []);
    hskWords.value = await ApiService.post(path, { chinese }, undefined, []);
  });

  useOnDocument(
    "keydown",
    $((e) => {
      if ((e as KeyboardEvent).key === "Enter") getHskWords();
    })
  );

  return (
    <div class='form-control'>
      <div class='input-group'>
        <input
          type='text'
          placeholder='汉字...'
          class='input input-bordered input input-primary w-full'
          onInput$={getInput}
        />
        <button class='btn btn-square' onClick$={getHskWords}>
          {searchSvg}
        </button>
      </div>
    </div>
  );
});
