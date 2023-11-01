import { component$, type Signal } from "@builder.io/qwik";
import { parseRussian } from "~/misc/helpers/translation";
import { moreInfoSvg } from "../common/media/svg";
import { moreInfoModalId } from "../common/tooltips/word-tooltip";
import { HideBtnsEnum } from "../hsk/hide-buttons";
import { useNavigate } from "@builder.io/qwik-city";
import { OwnWordBtn } from "../common/tooltips/own-word-btn";

type SearchResultRowType = {
  word: string | DictWord;
  hideBtnsSig: Signal<string[]>;
  currentWord: Signal<DictWord | undefined>;
};

export const SearchResultRow = component$(
  ({ word, hideBtnsSig, currentWord }: SearchResultRowType) => {
    const nav = useNavigate();

    return (
      <>
        <tr class={"hover"}>
          {!hideBtnsSig.value.includes(HideBtnsEnum.cn) && (
            <td
              class={"prose cursor-pointer"}
              onClick$={() => {
                nav("/search?q=" + (typeof word === "string" ? word : word.chinese));
              }}
            >
              <h2>{typeof word === "string" ? word : word.chinese}</h2>
            </td>
          )}
          {!hideBtnsSig.value.includes(HideBtnsEnum.py) && (
            <td class={"text-lg"}>
              <div style={{ wordWrap: "break-word", whiteSpace: "normal" }}>
                {typeof word === "string" ? "?" : word.pinyin}
              </div>
            </td>
          )}
          {!hideBtnsSig.value.includes(HideBtnsEnum.ru) && (
            <td>
              <div
                style={{ wordWrap: "break-word", whiteSpace: "normal" }}
                dangerouslySetInnerHTML={parseRussian(
                  typeof word === "string" ? "нет перевода" : word.russian,
                  false
                )}
              ></div>
            </td>
          )}
          <td>
            {typeof word === "string" ? null : (
              <label
                for={moreInfoModalId}
                class={"btn btn-sm btn-info"}
                onClick$={() => {
                  currentWord.value = word;
                }}
              >
                {moreInfoSvg}
              </label>
            )}
          </td>
          <td>
            {/* {typeof word === "string" ? (
              ""
            ) : userWords.some((x) => x.chinese === word.chinese) ? (
              <button class='btn btn-sm btn-warning' onClick$={() => {}}>
                {minusSvg}
              </button>
            ) : (
              <button class='btn btn-sm btn-info' onClick$={() => {}}>
                {plusSvg}
              </button>
            )} */}
            <OwnWordBtn word={word as DictWord} />
          </td>
        </tr>
      </>
    );
  }
);
