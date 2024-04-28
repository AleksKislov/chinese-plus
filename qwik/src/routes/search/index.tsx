import {
  $,
  component$,
  useContext,
  useOnDocument,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  type DocumentHead,
  Link,
  routeLoader$,
  useLocation,
  useNavigate,
} from "@builder.io/qwik-city";
import { Alerts } from "~/components/common/alerts/alerts";
import { FlexRow } from "~/components/common/layout/flex-row";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { searchSvg } from "~/components/common/media/svg";
import { EditWordModal } from "~/components/common/modals/edit-word-modal";
import { ShowHideBtn } from "~/components/common/modals/show-hide-btn";
import { EditWordBtn } from "~/components/common/tooltips/edit-word-btn";
import { OwnWordBtn } from "~/components/common/tooltips/own-word-btn";
import { editWordModalId } from "~/components/common/tooltips/word-tooltip";
import { DictWordTranslation } from "~/components/common/translation/dict-word-translation";
import { SearchResutlTable } from "~/components/search/search-result-table";
import { ApiService } from "~/misc/actions/request";
import { alertsContext } from "~/root";
import { getWordsForTooltips } from "~/routes/read/texts/[id]";
import HanziWriter from "hanzi-writer";
import { markUpRuText } from "~/misc/helpers/translation";
import { Sidebar } from "~/components/common/layout/sidebar";

export const HanziWriterSettings = {
  width: 60,
  height: 60,
  padding: 0,
  showOutline: true,
  radicalColor: "#168F16",
  delayBetweenLoops: 3000,
};

export const delay = (time: number) => new Promise((res) => setTimeout(res, time));

export const segmenter = async (text: string): Promise<string[]> => {
  return ApiService.post("/api/dictionary/segmenter", { text }, undefined, []);
};

export const getChineseWordsArr = async (input: string): Promise<string[]> => {
  const arr = await segmenter(input);
  return arr.filter((word) => /\p{Script=Han}/u.test(word));
};

export const useLoadTranslation = routeLoader$(async (ev): Promise<(string | DictWord)[]> => {
  const q = ev.query.get("q") || "";
  const segmentedWords = await getChineseWordsArr(q);
  const wordsWithInfo = await getWordsForTooltips(segmentedWords);

  return segmentedWords.map((word) => {
    for (let i = 0; i < wordsWithInfo.length; i++) {
      if ((wordsWithInfo[i] as DictWord).chinese === word) {
        return wordsWithInfo[i];
      }
    }
    return word;
  });
});

export default component$(() => {
  const CHAR_SVG_DIV_ID = "showCharDiv";
  const loc = useLocation();
  const nav = useNavigate();
  const loadTranslation = useLoadTranslation();
  const words = useSignal<(string | DictWord)[] | null>(null);
  const input = useSignal(loc.url.searchParams.get("q") || "");
  const alertsState = useContext(alertsContext);
  const showExamples = useSignal(true);

  useTask$(({ track }) => {
    track(() => loc.url.searchParams.get("q"));
    input.value = loc.url.searchParams.get("q") || "";
    words.value = loadTranslation.value;
  });

  const clearCharDiv = $(() => {
    const charDiv = document.getElementById(CHAR_SVG_DIV_ID);
    if (charDiv) charDiv!.innerHTML = "";
  });

  useVisibleTask$(({ track }) => {
    track(() => words.value);

    const chars = (words.value || [])
      .map((word) => {
        if (typeof word === "string") return word;
        return [...word.chinese];
      })
      .flat();

    clearCharDiv();
    setTimeout(() => {
      chars.forEach((char) => {
        const writer = HanziWriter.create(CHAR_SVG_DIV_ID, char, HanziWriterSettings);
        writer.loopCharacterAnimation();
      });
    }, 100);
  });

  const getTranslation = $(() => {
    clearCharDiv();

    const chineseStr = input.value.trim();
    if (!chineseStr) return (input.value = "");

    const isChinese = /\p{Script=Han}/u.test(chineseStr);
    if (!isChinese) {
      return alertsState.push({ bg: "alert-error", text: "Введенный текст не является китайским" });
    }

    nav("/search?q=" + chineseStr);
  });

  useOnDocument(
    "keydown",
    $((e) => {
      if ((e as KeyboardEvent).key === "Enter") getTranslation();
    })
  );

  return (
    <>
      <PageTitle txt={"Китайско-русский словарь"} />

      <FlexRow>
        <Sidebar>
          <div class='card bg-base-200 mt-3'>
            <div class='card-body'>
              <span>
                База слов взята с{" "}
                <Link
                  class='link link-hover link-secondary font-bold'
                  href={"https://bkrs.info/"}
                  target='_blank'
                >
                  БКРС
                </Link>
              </span>
            </div>
          </div>
        </Sidebar>
        <Alerts />
        <MainContent>
          <div class='prose'>
            <div class='form-control'>
              <div class='input-group w-full'>
                <input
                  type='text'
                  placeholder='汉字…'
                  class='input input-bordered w-full'
                  value={input.value}
                  onInput$={(e) => (input.value = (e.target as HTMLInputElement)?.value || "")}
                />
                <button class='btn btn-square' onClick$={getTranslation}>
                  {searchSvg}
                </button>
              </div>
            </div>

            <div id={CHAR_SVG_DIV_ID} class='flex mt-3'></div>
            <div>
              {words.value && words.value.length === 1 && (
                <>
                  <div class={"mt-3 flex justify-between"}>
                    <div class={"flex"}>
                      <OwnWordBtn word={words.value[0] as DictWord} />
                      <div class={"mx-1"}></div>
                      <EditWordBtn />
                    </div>

                    <ShowHideBtn showExamples={showExamples} />
                  </div>
                  <DictWordTranslation
                    ru={
                      typeof words.value[0] === "string"
                        ? "перевод отсутствует или не найден :("
                        : words.value[0].russian
                    }
                    py={(words.value[0] as DictWord).pinyin}
                    showExamples={showExamples.value}
                  />

                  <EditWordModal word={words.value[0] as DictWord} modalId={editWordModalId} />
                </>
              )}

              {words.value && words.value.length > 1 && (
                <SearchResutlTable words={words.value || []} />
              )}
            </div>
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const translation = resolveValue(useLoadTranslation);

  if (translation.length === 1 && typeof translation[0] !== "string") {
    const wordObj = translation[0];

    return {
      title: `Chinese+ ${wordObj.chinese} перевод c китайского на русский`,
      meta: [
        {
          name: "description",
          content: `Значение китайского слова ${markUpRuText(wordObj.russian, false)}`,
        },
      ],
    };
  }
  return {
    title: `Chinese+ Онлайн-словарь китайского языка`,
    meta: [
      {
        name: "description",
        content: `Перевод китайских слов и иероглифов на русский язык`,
      },
    ],
  };
};
