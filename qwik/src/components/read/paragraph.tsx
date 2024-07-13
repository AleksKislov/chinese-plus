import { component$, type Signal } from "@builder.io/qwik";
import { type FontSizeBtnsUnion, FontSizeMap } from "../common/content-cards/content-page-card";
import { WordTooltip } from "../common/tooltips/word-tooltip";
import { ParagPlus } from "./parag-plus";
import { ParagNum } from "./parag-num";

type ParagraphProps = {
  translation: string;
  ind: number;
  tooltipedParag: (string | DictWord)[];
  fontSize: FontSizeBtnsUnion;
  currentWord: Signal<DictWord | null>;
  strLen: number;
  showTranslation: boolean;
  forEditing?: boolean;
};

export const Paragraph = component$(
  ({
    translation,
    ind,
    tooltipedParag,
    fontSize,
    currentWord,
    strLen,
    showTranslation,
    forEditing,
  }: ParagraphProps) => {
    const blockClass = "my-1 rounded-md p-2 relative bg-base-200";
    const paragNum = ind + 1;

    return (
      <div class={`grid ${showTranslation ? "lg:grid-cols-2" : ""} grid-cols-1 gap-2`}>
        <div class={`${blockClass} ${FontSizeMap[fontSize]}`}>
          <ParagNum num={paragNum} />
          {tooltipedParag.map((word, i) => (
            <WordTooltip key={i} word={word} currentWord={currentWord} hasReddened={undefined} />
          ))}
          {!forEditing && <ParagPlus strLen={strLen} ind={ind} />}
        </div>

        {showTranslation && (
          <div class={blockClass}>
            <ParagNum num={paragNum} />
            {translation}
          </div>
        )}
      </div>
    );
  }
);
