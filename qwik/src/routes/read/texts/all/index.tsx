import { component$, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { LevelFilter } from "~/components/common/ui/level-filter";
import { UnsetFiltersBtn } from "~/components/common/ui/unset-filters-btn";
import { CategoryFilter } from "~/components/common/ui/category-filter";
import { WHERE } from "~/components/common/comments/comment-form";
import { type LevelUnion } from "~/routes/watch/videos";
import {
  AudioFilter,
  type AudioFilterUnion,
  HasAudioFilter,
} from "~/components/common/ui/has-audio-filter";
import { ReadResultCard } from "~/components/me/read-result-card";
import { CreateTextCard } from "~/components/read/create-text-card";
import { getTextsNumInfo } from "~/misc/actions/texts/get-texts-num-info";
import { TextsNumInfoCard } from "~/components/read/text-num-info-card";
import { AllContentTable } from "~/components/read/all-content-table";
import { Loader } from "~/components/common/ui/loader";
import { MarkedFilter } from "~/components/common/ui/marked-filter";
import { userContext } from "~/root";

export const useGetTextsNumInfo = routeLoader$(getTextsNumInfo);

export type TextTableRowInfo = {
  _id: ObjectId;
  hits: number;
  audioSrc?: 1 | 0;
  category: number;
  title: string;
  lvl: 1 | 2 | 3;
  comments: number;
  likes: number;
  date: ISODate;
  tags: string[];
  // user: ShortUserInfo;
};

export type SortByType = "date" | "likes" | "hits" | "comments";

export const useGetAllTexts = routeAction$(
  (): Promise<{ texts: TextTableRowInfo[]; allTags: string[] }> => {
    return ApiService.get(`/api/texts`, undefined, []);
  }
);

export type MarkedSignalUnion = "all" | "marked" | "not_marked";

export default component$(() => {
  const { loggedIn, finishedTexts } = useContext(userContext);
  const textsNumInfo = useGetTextsNumInfo();
  // const allTexts = useGetAllTexts().value;
  const getTexts = useGetAllTexts();
  const texts = useSignal<TextTableRowInfo[] | null>(null);

  const levelSignal = useSignal<LevelUnion>("0");
  const categorySignal = useSignal("");
  const audioSignal = useSignal<AudioFilterUnion>(AudioFilter.All);
  const markedSignal = useSignal<MarkedSignalUnion>("all");

  const sortSignal = useSignal(false);
  const sortBy = useSignal<SortByType>("date");

  const matchingTags = useSignal<string[]>([]);
  const tagInput = useSignal("");
  const chosenTag = useSignal("");

  useVisibleTask$(() => {
    getTexts.submit();
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => getTexts.value);
    if (!res) return;
    texts.value = res.texts;
  });

  useVisibleTask$(({ track }) => {
    const category = track(() => categorySignal.value);
    const marked = track(() => markedSignal.value);
    const audio = track(() => audioSignal.value);
    const lvl = track(() => levelSignal.value);
    const tag = track(() => chosenTag.value);
    texts.value = null;

    setTimeout(() => {
      let res = getTexts.value?.texts || [];
      if (category !== "") res = res.filter((txt) => txt.category === +category);
      if (lvl !== "0") res = res.filter((txt) => txt.lvl === +lvl);
      if (marked !== "all") {
        if (marked === "marked") {
          res = res.filter((txt) => finishedTexts.includes(txt._id));
        } else {
          res = res.filter((txt) => !finishedTexts.includes(txt._id));
        }
      }
      if (audio === AudioFilter.HasAudio) {
        res = res.filter((txt) => txt.audioSrc === +AudioFilter.HasAudio);
      }
      if (tag) res = res.filter((txt) => txt.tags.includes(tag));

      texts.value = res;
    });
  });

  useVisibleTask$(({ track }) => {
    const bool = track(() => sortSignal.value);
    const sortType = track(() => sortBy.value);
    const res = texts.value;
    texts.value = null;

    setTimeout(() => {
      texts.value =
        res?.sort((a, b) =>
          bool
            ? +new Date(a[sortType]) - +new Date(b[sortType])
            : +new Date(b[sortType]) - +new Date(a[sortType])
        ) || null;
    });
  });

  return (
    <>
      <PageTitle txt={"Тексты на китайском языке"} />
      <FlexRow>
        <Sidebar>
          <TextsNumInfoCard
            approved={textsNumInfo.value?.approved}
            // notApproved={textsNumInfo.value?.notApproved}
            withAudio={textsNumInfo.value?.withAudio}
          />

          <CreateTextCard />
          <ReadResultCard />
        </Sidebar>

        <MainContent>
          <div class='grid sm:grid-cols-3 grid-cols-2 gap-1 mb-3'>
            <HasAudioFilter audioSignal={audioSignal} num={textsNumInfo.value?.withAudio} />
            <LevelFilter levelSignal={levelSignal} />
            <CategoryFilter categorySignal={categorySignal} contentType={WHERE.text} />
            <MarkedFilter markedSignal={markedSignal} loggedIn={loggedIn} />
            <div class='form-control w-full relative'>
              <input
                type='text'
                placeholder='Поиск по тэгам'
                class='input input-bordered w-full'
                bind:value={tagInput}
                onInput$={(ev) => {
                  const input = (ev.target as HTMLInputElement).value.trim();
                  if (!input) {
                    chosenTag.value = "";
                    matchingTags.value = [];
                    return;
                  }
                  matchingTags.value =
                    getTexts.value?.allTags.filter((tag) => tag.includes(input.toLowerCase())) ||
                    [];
                }}
              />
              {matchingTags.value.length > 0 && (
                <ul class='overflow-hidden absolute w-full bg-base-200 rounded-md mt-12 z-10'>
                  {matchingTags.value.slice(0, 10).map((tag, ind) => (
                    <li
                      class='cursor-pointer p-2 px-4 hover:bg-base-300'
                      key={ind}
                      onClick$={() => {
                        tagInput.value = chosenTag.value = tag;
                        matchingTags.value = [];
                      }}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <UnsetFiltersBtn
              levelSignal={levelSignal}
              categorySignal={categorySignal}
              audioSignal={audioSignal}
              sortSignal={sortSignal}
              sortBy={sortBy}
              markedSignal={markedSignal}
              tagInput={tagInput}
              chosenTag={chosenTag}
            />
          </div>

          {texts.value ? (
            <AllContentTable
              content={texts.value}
              contentType={WHERE.text}
              sortSignal={sortSignal}
              sortBy={sortBy}
            />
          ) : (
            <Loader />
          )}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Тексты на китайском с переводом",
  meta: [
    {
      name: "description",
      content:
        "Тексты на китайском языке на разные темы разных уровней сложности. С переводом всего текста и каждого слово по отдельности по клику.",
    },
  ],
};
