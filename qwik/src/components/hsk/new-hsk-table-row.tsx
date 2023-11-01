import { component$, type Signal } from "@builder.io/qwik";
import CONST_URLS from "~/misc/consts/urls";
import { type NewHskWordType } from "~/routes/hsk/3/table";
import { parseRussian } from "~/misc/helpers/translation";
import { moreInfoSvg, playSvg } from "../common/media/svg";
import { HideBtnsEnum } from "./hide-buttons";
import { moreInfoModalId } from "../common/tooltips/word-tooltip";

type NewHskTableRowType = {
  word: NewHskWordType;
  hideBtnsSig: Signal<string[]>;
  currentWord: Signal<NewHskWordType | undefined>;
};

export const pronounce = (id: number, lvl: string) => {
  new Audio(`${CONST_URLS.myAudioURL}newhsk/band${lvl}/${id}.mp3`).play();
};

export const NewHskTableRow = component$(
  ({ word, hideBtnsSig, currentWord }: NewHskTableRowType) => {
    const { cn, py, ru, id, lvl } = word;

    return (
      <>
        <tr class={"hover"}>
          <td>{id}</td>
          {!hideBtnsSig.value.includes(HideBtnsEnum.cn) && (
            <td class={"prose"}>
              <h2>{cn}</h2>
            </td>
          )}
          {!hideBtnsSig.value.includes(HideBtnsEnum.py) && (
            <td class={"text-lg"}>
              <div style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{py}</div>
            </td>
          )}
          {!hideBtnsSig.value.includes(HideBtnsEnum.ru) && (
            <td>
              <div
                style={{ wordWrap: "break-word", whiteSpace: "normal" }}
                dangerouslySetInnerHTML={parseRussian(ru, false)}
              ></div>
            </td>
          )}
          <td>
            <button class='btn btn-sm btn-info' onClick$={() => pronounce(id, lvl)}>
              {playSvg}
            </button>
          </td>
          <td>
            <label
              for={moreInfoModalId}
              class={"btn btn-sm btn-info"}
              onClick$={() => (currentWord.value = word)}
            >
              {moreInfoSvg}
            </label>
          </td>
        </tr>
      </>
    );
  }
);
