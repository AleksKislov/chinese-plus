import { component$, $, useSignal, useContext, type Signal } from "@builder.io/qwik";
import CONST_URLS from "~/misc/consts/urls";
import CONSTANTS from "~/misc/consts/consts";
import type { OldHskWordType } from "~/routes/hsk/2/table";
import Cookies from "js-cookie";
import { ApiService } from "~/misc/actions/request";
import { alertsContext } from "~/root";
import { minusSvg, plusSvg, playSvg } from "../common/media/svg";
import { HideBtnsEnum } from "./hide-buttons";

type TableRowType = {
  word: OldHskWordType;
  hideBtnsSig: Signal<string[]>;
  userSelected: boolean;
  userWordsLen: number;
  isPrivate?: boolean;
};

export const pronounce = (id: number, lvl: number) => {
  const o: { [key: number]: number } = {
    1: id - 1,
    2: id - 151,
    3: id - 301,
    4: id - 601,
    5: id - 1201,
    6: id - 2501,
  };
  const wordId = o[lvl];
  new Audio(`${CONST_URLS.myAudioURL}hsk${lvl}/${wordId}.mp3`).play();
};

export const addUserHskWord = async (word: OldHskWordType, token: string) => {
  await ApiService.post("/api/words/", word, token);
};

export const removeUserHskWord = async (wordId: number, token: string) => {
  await ApiService.delete("/api/words/" + wordId, token);
};

export const OldHskTableRow = component$(
  ({ word, hideBtnsSig, userSelected: clickedByUser, userWordsLen, isPrivate }: TableRowType) => {
    const userSelectedSignal = useSignal(clickedByUser);
    const userSelected = userSelectedSignal.value && !isPrivate;
    const userWordsLenSignal = useSignal(userWordsLen);

    const alertsState = useContext(alertsContext);

    const { chinese: cn, pinyin: py, translation: ru, word_id: id, level: lvl } = word;

    const addOrRemoveHskWord = $(async () => {
      const token = Cookies.get("token");

      // console.log(userWordsLenSignal.value);
      if (!token) {
        return alertsState.push({ bg: "alert-error", text: "Нужно войти" });
      }

      if (userSelectedSignal.value) {
        removeUserHskWord(word.word_id, token);
        userWordsLenSignal.value--;
        userSelectedSignal.value = !userSelectedSignal.value;
        return alertsState.push({ bg: "alert-info", text: "Слово удалено из вашего словарика" });
      }

      if (userWordsLenSignal.value >= CONSTANTS.users.vocabSize) {
        return alertsState.push({
          bg: "alert-error",
          text: `Лимит ${CONSTANTS.users.vocabSize} слов!`,
        });
      }

      addUserHskWord(word, token);
      userWordsLenSignal.value++;
      userSelectedSignal.value = !userSelectedSignal.value;
      return alertsState.push({ bg: "alert-success", text: "Слово добавлено в ваш словарик" });
    });

    return (
      <>
        <tr class={"hover"}>
          <td class={userSelected ? "bg-secondary" : ""}>{id}</td>
          {!hideBtnsSig.value.includes(HideBtnsEnum.cn) && (
            <td class={`prose ${userSelected ? "bg-secondary" : ""}`}>
              <h2>{cn}</h2>
            </td>
          )}
          {!hideBtnsSig.value.includes(HideBtnsEnum.py) && (
            <td class={userSelected ? "bg-secondary" : ""}>{py}</td>
          )}
          {!hideBtnsSig.value.includes(HideBtnsEnum.ru) && (
            <td class={userSelected ? "bg-secondary" : ""} style={{ maxWidth: "50%" }}>
              <div style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{ru}</div>
            </td>
          )}
          <td class={userSelected ? "bg-secondary" : ""}>
            <button class='btn btn-sm btn-info' onClick$={() => pronounce(id, lvl)}>
              {playSvg}
            </button>
          </td>
          <td class={userSelected ? "bg-secondary" : ""}>
            {userSelectedSignal.value ? (
              <button class='btn btn-sm btn-warning' onClick$={addOrRemoveHskWord}>
                {minusSvg}
              </button>
            ) : (
              <button class='btn btn-sm btn-info' onClick$={addOrRemoveHskWord}>
                {plusSvg}
              </button>
            )}
          </td>
        </tr>
      </>
    );
  }
);
