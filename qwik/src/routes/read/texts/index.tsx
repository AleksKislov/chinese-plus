import { component$, useSignal, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$, routeAction$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';

import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { LevelFilter } from '~/components/common/ui/level-filter';
import { UnsetFiltersBtn } from '~/components/common/ui/unset-filters-btn';
import { CategoryFilter } from '~/components/common/ui/category-filter';
import { WHERE } from '~/components/common/comments/comment-form';
import { TextCard } from '~/components/read/text-card';
import { type LevelUnion } from '~/routes/watch/videos';
import {
  AudioFilter,
  type AudioFilterUnion,
  HasAudioFilter,
} from '~/components/common/ui/has-audio-filter';
import { ReadResultCard } from '~/components/me/read-result-card';
import { MoreBtnAndLoader } from '~/components/common/ui/more-btn-and-loader';
import { CreateTextCard } from '~/components/read/create-text-card';
import { getTextsNumInfo } from '~/misc/actions/texts/get-texts-num-info';
import { TextsNumInfoCard } from '~/components/read/text-num-info-card';

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

export const useGetTextsNumInfo = routeLoader$(getTextsNumInfo);

export const getTextsWithParams = routeAction$((params): Promise<TextCardInfo[]> => {
  const { category, lvl, audio } = params;
  const catParam = category && `&categoryInd=${category}`;
  const lvlParam = !lvl ? '' : `&level=${lvl}`;
  const audioParam = audio === AudioFilter.HasAudio ? '&audioSrc=1' : '';
  return ApiService.get(
    `/api/texts/infinite?skip=0${catParam}${lvlParam}${audioParam}`,
    undefined,
    [],
  );
});

export const getTextsWithSkip = routeAction$((params): Promise<TextCardInfo[]> => {
  const { skip, category, lvl, audio } = params;
  const catParam = category && `&categoryInd=${category}`;
  const lvlParam = !lvl ? '' : `&level=${lvl}`;
  const audioParam = audio === AudioFilter.HasAudio ? '&audioSrc=1' : '';
  return ApiService.get(
    `/api/texts/infinite?skip=${skip}${catParam}${lvlParam}${audioParam}`,
    undefined,
    [],
  );
});

export default component$(() => {
  const textsNumInfo = useGetTextsNumInfo();
  const texts = useSignal<TextCardInfo[]>([]);
  const getTexts = getTextsWithParams();
  const getSkipTexts = getTextsWithSkip();
  const levelSignal = useSignal<LevelUnion>('0');
  const categorySignal = useSignal('');
  const skipSignal = useSignal(0);
  const audioSignal = useSignal<AudioFilterUnion>(AudioFilter.All);

  useVisibleTask$(({ track }) => {
    const category = track(() => categorySignal.value);
    const audio = track(() => audioSignal.value);
    const lvl = track(() => +levelSignal.value);
    texts.value = [];
    getTexts.submit({
      category,
      lvl,
      audio,
    });
  });

  useVisibleTask$(({ track }) => {
    const skip = track(() => skipSignal.value);
    if (skip === 0) return;
    getSkipTexts.submit({
      skip,
      category: categorySignal.value,
      audio: audioSignal.value,
      lvl: +levelSignal.value,
    });
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => getTexts.value);
    if (!res) return;
    texts.value = res;
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => getSkipTexts.value);
    if (!res) return;
    texts.value = [...texts.value, ...res];
  });

  return (
    <>
      <PageTitle txt={'Китайские тексты с озвучкой'} />
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
          <div class="grid sm:grid-cols-4 grid-cols-2 gap-1 mb-3">
            <HasAudioFilter audioSignal={audioSignal} num={textsNumInfo.value?.withAudio} />
            <LevelFilter levelSignal={levelSignal} />
            <CategoryFilter categorySignal={categorySignal} contentType={WHERE.text} />
            <UnsetFiltersBtn
              levelSignal={levelSignal}
              categorySignal={categorySignal}
              skipSignal={skipSignal}
              audioSignal={audioSignal}
            />
          </div>

          {texts.value.map((text, ind) => (
            <TextCard key={ind} text={text} />
          ))}

          <MoreBtnAndLoader
            skipSignal={skipSignal}
            isLoading={getTexts.isRunning || getSkipTexts.isRunning}
          />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Тексты на китайском с переводом',
  meta: [
    {
      name: 'description',
      content:
        'Учебные тексты на китайском языке на разные темы разных уровней сложности. С переводом всего текста и каждого слова по отдельности по клику.',
    },
  ],
};
