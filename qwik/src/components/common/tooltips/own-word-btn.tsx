import { component$, useContext } from "@builder.io/qwik";

import { alertsContext, userContext } from "~/root";
import { minusSvg, plusSvg } from "../media/svg";
import { ApiService } from "~/misc/actions/request";
import { globalAction$, z, zod$ } from "@builder.io/qwik-city";

export const useAddUserWord = globalAction$(
  (body, ev) => {
    const token = ev.cookie.get("token")?.value || "";
    return ApiService.post("/api/userwords", body, token);
  },
  zod$({
    chinese: z.string(),
    translation: z.string(),
    pinyin: z.string(),
  })
);

export const useDelUserWord = globalAction$((w, ev) => {
  const token = ev.cookie.get("token")?.value || "";
  return ApiService.delete("/api/userwords/" + w.chinese, token);
}, zod$({ chinese: z.string() }));

export const OwnWordBtn = component$(({ word }: { word: DictWord }) => {
  const addUserWord = useAddUserWord();
  const delUserWord = useDelUserWord();
  const userState = useContext(userContext);
  const { loggedIn } = userState;
  const alertsState = useContext(alertsContext);

  let isUserWord = false;
  if (typeof word !== "string") {
    isUserWord = loggedIn && userState.words.some((w) => w.chinese === word.chinese);
  }
  return (
    <>
      {isUserWord ? (
        <div
          class='tooltip tooltip-info tooltip-bottom z-40'
          data-tip={"Удалить из своего словарика"}
        >
          <label
            class='btn btn-sm btn-warning'
            onClick$={() => {
              delUserWord.submit({ chinese: word.chinese });
              userState.words = userState.words.filter((w) => w.chinese !== word.chinese);
              alertsState.push({
                bg: "alert-info",
                text: "Слово удалено из вашего словарика",
              });
            }}
          >
            {minusSvg}
          </label>
        </div>
      ) : (
        <div class='tooltip tooltip-info tooltip-bottom z-10' data-tip={"Добавить в свой словарик"}>
          <button
            class='btn btn-sm btn-info'
            onClick$={() => {
              if (!loggedIn) {
                return alertsState.push({
                  bg: "alert-error",
                  text: "Авторизуйтесь для добавления слова в ваш словарик",
                });
              }
              addUserWord.submit({
                chinese: word.chinese,
                translation: word.russian,
                pinyin: word.pinyin,
              });
              userState.words = [
                ...userState.words,
                {
                  _id: "0",
                  date: "",
                  chinese: word.chinese,
                  translation: word.russian,
                  pinyin: word.pinyin,
                },
              ];
              alertsState.push({
                bg: "alert-success",
                text: "Слово добавлено в ваш словарик",
              });
            }}
          >
            {plusSvg}
          </button>
        </div>
      )}
    </>
  );
});
