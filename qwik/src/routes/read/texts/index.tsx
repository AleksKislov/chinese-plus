import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { LevelFilter } from "~/components/common/ui/level-filter";
import { UnsetFiltersBtn } from "~/components/common/ui/unset-filters-btn";
import { CategoryFilter } from "~/components/common/ui/category-filter";
import { WHERE } from "~/components/common/comments/comment-form";
import { TextCard } from "~/components/read/text-card";
import { type LevelUnion } from "~/routes/watch/videos";
import {
  AudioFilter,
  type AudioFilterUnion,
  HasAudioFilter,
} from "~/components/common/ui/has-audio-filter";
import { ReadResultCard } from "~/components/me/read-result-card";

export type TextCardInfo = {
  _id: ObjectId;
  categoryInd: number;
  tags: string[];
  hits: number;
  title: string;
  description: string;
  level: 1 | 2 | 3;
  length: number;
  user: ShortUserInfo; // user id
  pic_url: string;
  isApproved: 1 | 0 | undefined;
  source: string;
  comments_id: CommentId[];
  audioSrc: 1 | 0 | undefined;
  likes: ContentLike[];
  date: ISODate;
};

export type TextsNumInfo = {
  total: number;
  approved: number;
  notApproved: number;
  withAudio: number;
};

export const getInitTexts = routeLoader$((): Promise<[TextCardInfo[], TextsNumInfo]> => {
  return Promise.all([
    ApiService.get(`/api/texts/infinite`, undefined, []),
    ApiService.get(`/api/texts/texts_num`, undefined, {}),
  ]);
});

export default component$(() => {
  const initTexts = getInitTexts();
  const texts = useSignal<TextCardInfo[]>(initTexts.value[0]);
  const levelSignal = useSignal<LevelUnion>("0");
  const categorySignal = useSignal("");
  const skip = useSignal(0);
  const audioSignal = useSignal<AudioFilterUnion>(AudioFilter.All);
  // console.log(initTexts.value[1]);
  const getTexts = $((): Promise<TextCardInfo[]> => {
    const cat = categorySignal.value;
    const catParam = cat && `&categoryInd=${cat}`;
    const lvlParam = !+levelSignal.value ? "" : `&level=${levelSignal.value}`;
    const audioParam = audioSignal.value === AudioFilter.HasAudio ? "&audioSrc=1" : "";
    return ApiService.get(
      `/api/texts/infinite?skip=${skip.value}${catParam}${lvlParam}${audioParam}`,
      undefined,
      []
    );
  });

  useTask$(async ({ track }) => {
    track(() => categorySignal.value);
    track(() => audioSignal.value);
    track(() => levelSignal.value);
    texts.value = await getTexts();
  });

  return (
    <>
      <PageTitle txt={"Китайские тексты с озвучкой"} />
      <FlexRow>
        <Sidebar>
          <div class='card bg-primary text-primary-content'>
            <div class='card-body'>
              <h2 class='card-title'>Читай и учись</h2>
              <p>Чтение китайских текстов с умным переводом.</p>
              <p>
                Проверенные: <span class='badge badge-accent'>{initTexts.value[1]?.approved}</span>
              </p>
              <p>
                На проверке:{" "}
                <span class='badge badge-accent'>{initTexts.value[1]?.notApproved}</span>
              </p>
            </div>
          </div>

          <ReadResultCard />
        </Sidebar>

        <MainContent>
          <div class='grid sm:grid-cols-4 grid-cols-2 gap-1 mb-3'>
            <HasAudioFilter audioSignal={audioSignal} num={initTexts.value[1]?.withAudio} />
            <LevelFilter levelSignal={levelSignal} />
            <CategoryFilter categorySignal={categorySignal} contentType={WHERE.text} />
            <UnsetFiltersBtn
              levelSignal={levelSignal}
              categorySignal={categorySignal}
              skipSignal={skip}
              audioSignal={audioSignal}
            />
          </div>

          {texts.value.map((text, ind) => (
            <TextCard key={ind} text={text} />
          ))}

          <div class={"flex flex-col items-center mt-1"}>
            <button
              type='button'
              class={`btn btn-sm btn-info btn-outline`}
              onClick$={async () => {
                skip.value += 10;
                texts.value = [...texts.value, ...(await getTexts())];
              }}
            >
              Еще
            </button>
          </div>
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
