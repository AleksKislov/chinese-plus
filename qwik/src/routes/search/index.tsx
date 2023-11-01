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

export const useLoadTranslation = routeLoader$(async (ev): Promise<(string | DictWord)[]> => {
  const q = ev.query.get("q") || "";
  return getWordsForTooltips(await getChineseWordsArr(q));
});

export const getChineseWordsArr = async (input: string): Promise<string[]> => {
  const arr = await segmenter(input);
  return arr.filter((word) => /\p{Script=Han}/u.test(word));
};

export default component$(() => {
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

  useVisibleTask$(({ track }) => {
    track(() => words.value);

    if (
      words.value &&
      words.value.length === 1 &&
      typeof words.value[0] !== "string" &&
      words.value[0].chinese.length === 1
    ) {
      const writer = HanziWriter.create("showCharDiv", words.value[0].chinese, HanziWriterSettings);
      writer.loopCharacterAnimation();
    }
  });

  const getTranslation = $(async () => {
    const charDiv = document.getElementById("showCharDiv");
    if (charDiv) charDiv!.innerHTML = "";

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
        <Alerts />
        <MainContent>
          <div class='prose'>
            <div class='form-control'>
              <label class='label'>
                <span class='label-text'>
                  База слов взята с{" "}
                  <Link href={"https://bkrs.info/"} target='_blank'>
                    БКРС
                  </Link>
                </span>
              </label>
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

            <div>
              {words.value && words.value.length === 1 && (
                <>
                  {/* <div>{words.value[0].chinese}</div> */}
                  <div id='showCharDiv' class={"mt-3"}></div>
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
