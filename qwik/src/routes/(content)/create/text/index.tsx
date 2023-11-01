import {
  routeAction$,
  type RequestEvent,
  globalAction$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { component$, useStore } from "@builder.io/qwik";
import { PageTitle } from "~/components/common/layout/title";
import { getTokenFromCookie } from "~/misc/actions/auth";
import { ApiService } from "~/misc/actions/request";
import CONST_URLS from "~/misc/consts/urls";
import { OtherTextFields } from "~/components/create-edit/other-text-fields";
import { TextPreprocessForm } from "~/components/create-edit/text-preprocess-form";
import { Alerts } from "~/components/common/alerts/alerts";
import { type TextFromDB } from "~/routes/read/texts/[id]";

export type ThemePicType = {
  full: string;
  raw: string;
  regular: string;
  small: string;
  small_s3: string;
  thumb: string;
};

export type NewTextStore = {
  lvl: number;
  title: string;
  description: string;
  length: number;
  tags: string;
  source: string;
  categoryInd: number;
  picUrl: string;
  chineseTextParagraphs: string[];
  translationParagraphs: string[];
  allwords: string[];
  isLongText: boolean;
};

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, "/login");
};

export const useGetPics = globalAction$(async (param, ev): Promise<ThemePicType[]> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return [];
  return ApiService.get("/api/translation/unsplash/" + param.picTheme, token, []);
});

export const usePublishText = routeAction$(async (params, ev): Promise<TextFromDB | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  return ApiService.post("/api/texts/create", params, token, null);
});

export default component$(() => {
  const store: NewTextStore = useStore({
    lvl: 1,
    title: "",
    description: "",
    length: 0,
    tags: "",
    source: "",
    categoryInd: 0,
    picUrl: CONST_URLS.defaultTextPic,
    chineseTextParagraphs: [],
    translationParagraphs: [],
    allwords: [],
    isLongText: false,
  });

  return (
    <>
      <PageTitle txt={"Поделиться новым текстом"} />
      <Alerts />

      <OtherTextFields store={store} />

      <TextPreprocessForm store={store} />
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Поделиться контентом",
  meta: [
    {
      name: "description",
      content: "Поделитесь обучающим контентом с остальными посетителями Chinese+",
    },
  ],
};
