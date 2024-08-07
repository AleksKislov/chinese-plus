import { routeAction$, type RequestEvent, routeLoader$ } from '@builder.io/qwik-city';
import { component$, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { PageTitle } from '~/components/common/layout/title';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { ApiService } from '~/misc/actions/request';
import { Alerts } from '~/components/common/alerts/alerts';
import { userContext } from '~/root';
import { OtherVideoFields } from '~/components/create-edit/other-video-fields';
import { YoutubeService } from '~/misc/actions/youtube-service';
import { Loader } from '~/components/common/ui/loader';
import type { ChineseSub, VideoFromDB } from '~/routes/watch/videos/[id]';
import type { YTVideoInfo } from '~/routes/(content)/create/video';
import { VideoPreprocessFormForEdit } from '~/components/create-edit/video-preprocess-form-for-edit';

export type EditVideoStore = {
  title: string;
  desc: string;
  lvl: number;
  tags: string;
  cnSubs: ChineseSub[];
  pySubs: string[];
  ruSubs: string[];
  length: number;
  chineseArr: string[];
  source: string;
  category: string; // eng word
  isApproved: 1 | 0;
  _id: ObjectId;
};

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export const useEditVideo = routeAction$(async (params, ev): Promise<VideoFromDB | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  return ApiService.post('/api/videos/update', params, token, null);
});

export const getVideoFromDB = (id: ObjectId): Promise<VideoFromDB> => {
  return ApiService.get(`/api/videos/${id}`, undefined, null);
};

export const getWordsForTooltips = (wordsArr: string[][]) => {
  return ApiService.post('/api/dictionary/allWordsForVideo', wordsArr, undefined, []);
};

export const useGetVideo = routeLoader$(async ({ params }): Promise<VideoFromDB> => {
  return getVideoFromDB(params.id);
});

export const useGetVideoInfo = routeAction$(async (params, ev): Promise<YTVideoInfo | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  return YoutubeService.getVideoInfo(params.id as string, token);
});

export default component$(() => {
  const getVideoInfo = useGetVideoInfo();
  const { isAdmin } = useContext(userContext);

  const {
    _id,
    lvl,
    desc,
    title,
    tags,
    category,
    length,
    cnSubs,
    pySubs,
    ruSubs,
    source,
    chineseArr,
    isApproved,
  } = useGetVideo().value;

  const shallowChineseArr: string[] = [];

  chineseArr.forEach((parag, i) => {
    parag.forEach((x) => shallowChineseArr.push(x));
    if (i < chineseArr.length) shallowChineseArr.push('\n');
  });

  const store: EditVideoStore = useStore({
    _id,
    lvl,
    desc,
    title,
    length,
    pySubs,
    ruSubs,
    source,
    category,
    tags: tags.join(),
    cnSubs,
    chineseArr: shallowChineseArr,
    isApproved: isApproved || 0,
  });

  useVisibleTask$(() => {
    getVideoInfo.submit({ id: source });
  });

  return (
    <>
      <PageTitle txt={'Отредактировать видео'} />
      <Alerts />

      <OtherVideoFields store={store} isAdmin={isAdmin} />

      {getVideoInfo.isRunning && (
        <span class="mx-6 my-3">
          <Loader />
        </span>
      )}

      {getVideoInfo.value && (
        <VideoPreprocessFormForEdit
          store={store}
          captionLangs={getVideoInfo.value.captionLangs || []}
        />
      )}
    </>
  );
});
