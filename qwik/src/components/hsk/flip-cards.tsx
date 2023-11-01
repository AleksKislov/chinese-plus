import { component$ } from "@builder.io/qwik";
import { type OldHskWordType } from "~/routes/hsk/2/table";
import { FlipCard } from "./flip-card";
import { type PinyinAboveStore } from "./hsk-table";

export const FlipCards = component$(
  ({ words, pinyinAbove }: { words: OldHskWordType[]; pinyinAbove: PinyinAboveStore }) => {
    return (
      <>
        <div class=' grid grid-cols-2 md:grid-cols-4 gap-4'>
          {words &&
            words.map((word) => (
              <FlipCard word={word} key={word._id} pinyinAbove={pinyinAbove.bool} />
            ))}
        </div>
      </>
    );
  }
);
