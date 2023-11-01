import {
  routeAction$,
  type RequestEvent,
  type JSONObject,
  type RequestEventAction,
  type DocumentHead,
} from "@builder.io/qwik-city";
import {
  $,
  type QwikKeyboardEvent,
  component$,
  useContext,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { PageTitle } from "~/components/common/layout/title";
import { getTokenFromCookie } from "~/misc/actions/auth";
import { ApiService } from "~/misc/actions/request";
import { Alerts } from "~/components/common/alerts/alerts";
import { AlertColorEnum, alertsContext } from "~/root";
import { type VideoFromDB } from "~/routes/watch/videos/[id]";
import CONSTANTS from "~/misc/consts/consts";
import { OtherVideoFields } from "~/components/create-edit/other-video-fields";
import { VideoPreprocessForm } from "~/components/create-edit/video-preprocess-form";
import { arrorUturnDown } from "~/components/common/media/svg";
import { YoutubeService } from "~/misc/actions/youtube-service";

export type NewVideoStore = {
  title: string;
  desc: string;
  lvl: number;
  tags: string;
  cnSubs: string[];
  pySubs: string[];
  ruSubs: string[];
  length: number;
  chineseArr: string[];
  source: string;
  category: string; // eng word
};

type YTVideoInfo = {
  title: string;
  description: string;
  tags: string[];
  captionLangs: string[];
};

export type VideoSub = {
  start: string;
  dur: string;
  text: string;
};

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, "/login");
};

export const usePublishVideo = routeAction$(async (params, ev): Promise<VideoFromDB | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  return ApiService.post("/api/videos/create", params, token, null);
});

export const useGetVideoInfo = routeAction$(async (params, ev): Promise<YTVideoInfo | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  return YoutubeService.getVideoInfo(params.id as string, token);
});

const getVideoCaptions = async (
  params: JSONObject,
  ev: RequestEventAction
): Promise<VideoSub[] | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  const { id, lang } = params;
  return YoutubeService.getVideoCaption(id as string, lang as string, token);
};

export const useGetCnCaptions = routeAction$(async (params, ev): Promise<VideoSub[] | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  const { id, lang } = params;
  return YoutubeService.getVideoCaption(id as string, lang as string, token);
});
export const useGetRuCaptions = routeAction$(getVideoCaptions);
export const useGetPyCaptions = routeAction$(getVideoCaptions);

export default component$(() => {
  const alertsState = useContext(alertsContext);
  const youtubeLink = useSignal("");
  const getVideoInfo = useGetVideoInfo();

  const store: NewVideoStore = useStore({
    lvl: 1,
    title: "",
    desc: "",
    length: 0,
    tags: "",
    source: "",
    cnSubs: [],
    pySubs: [],
    ruSubs: [],
    chineseArr: [],
    category: Object.keys(CONSTANTS.videoCategories)[0],
  });

  const getVideo = $(async () => {
    const videoUrl = new URL(youtubeLink.value);
    const videoId = videoUrl.searchParams.get("v");
    if (!videoId) return;

    await getVideoInfo.submit({ id: videoId });

    if (!getVideoInfo.value) {
      return alertsState.push({
        bg: AlertColorEnum.error,
        text: `Не удалось получить информацию о видео. Проверьте ссылку и попробуйте еще раз`,
      });
    }

    store.title = getVideoInfo.value.title || "";
    store.desc = getVideoInfo.value.description || "";
    store.tags = getVideoInfo.value.tags?.join(", ") || "";
    store.source = videoId;
  });

  return (
    <>
      <PageTitle txt={"Поделиться видео с субтитрами"} />
      <Alerts />

      <div class='w-full mb-4'>
        <div class='form-control px-6'>
          <label class='label'>
            <span class='label-text'>Ссылка на видео с китайскими субтитрами</span>
            <span class='label-text-alt'>Видео с youtube</span>
          </label>
          <div class='join'>
            <input
              type='text'
              placeholder='например, https://www.youtube.com/watch?v=dQw4w9WgXcQ'
              class='input input-bordered w-full join-item'
              bind:value={youtubeLink}
              onKeyDown$={(e: QwikKeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") getVideo();
              }}
            />
            <button class='btn join-item btn-primary rounded-r' onClick$={getVideo}>
              {arrorUturnDown}
            </button>
          </div>
          <p class=''>https://www.youtube.com/watch?v=o4SE2oG75S8</p>
        </div>
      </div>

      {getVideoInfo.isRunning && <span class='loading loading-spinner loading-lg mx-6 my-3'></span>}

      {getVideoInfo.value && (
        <>
          <OtherVideoFields store={store} />
          <VideoPreprocessForm
            store={store}
            captionLangs={getVideoInfo.value?.captionLangs || []}
          />
        </>
      )}
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
