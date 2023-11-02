import { $, component$, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead, routeAction$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { TextCard } from "~/components/read/text-card";
import { type TextCardInfo } from "../texts";
import { MoreBtnAndLoader } from "~/components/common/ui/more-btn-and-loader";

export const getTextsWithSkip = routeAction$((params): Promise<TextCardInfo[]> => {
  return ApiService.get(`/api/texts/not_approved?skip=${params.skip}`, undefined, []);
});

export default component$(() => {
  const getTexts = getTextsWithSkip();
  const texts = useSignal<TextCardInfo[]>([]);
  const skipSignal = useSignal(0);

  useVisibleTask$(({ track }) => {
    const skip = track(() => skipSignal.value);
    getTexts.submit({ skip });
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => getTexts.value);
    if (!res) return;
    texts.value = [...texts.value, ...res];
  });

  return (
    <>
      <PageTitle txt={"Тексты на проверке"} />
      <FlexRow>
        <Sidebar>
          <div class='card bg-primary text-primary-content'>
            <div class='card-body'>
              <h2 class='card-title'>Нужно проверить</h2>
              <p>Тексты, которые ожидают проверки модератором или админом.</p>
            </div>
          </div>
        </Sidebar>

        <MainContent>
          {texts.value.map((text, ind) => (
            <TextCard key={ind} text={text} isUnapproved={true} />
          ))}

          <MoreBtnAndLoader skipSignal={skipSignal} isLoading={getTexts.isRunning} />
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
