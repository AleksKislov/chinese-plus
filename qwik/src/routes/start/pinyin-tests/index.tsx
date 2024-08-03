import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { Sidebar } from '~/components/common/layout/sidebar';
import { PageTitle } from '~/components/common/layout/title';
import CONST_URLS from '~/misc/consts/urls';
import { PinyinTests } from '../../../components/start/pinyin-tests/pinyin-tests';
import { PhoneticsLinkCard } from '~/components/common/content-cards/phonetics-link-card';

export const playAudioFromBtn = (sound: string) => {
  if (!sound) return;
  new Audio(`${CONST_URLS.myAudioURL}pinyin/${sound}.mp3`).play();
};

export default component$(() => {
  return (
    <>
      <PageTitle txt={'Тест на знание пиньиня'} />

      <FlexRow>
        <Sidebar>
          <div class="card bg-primary text-primary-content">
            <div class="card-body">
              <h2 class="card-title">Пиньинь</h2>
              <p>Это первое, чем нужно овладеть изучающим китайский язык.</p>
              <p>Проверьте насколько хорошо вы понимаете на слух звуки и тоны китайского языка.</p>
            </div>
          </div>
          <PhoneticsLinkCard />
        </Sidebar>
        <MainContent>
          <small class="text-base-content">
            Введите соответствующий пиньинь для аудио в виде{' '}
            <code class="text-primary">[латынь][цифра]</code>, например,{' '}
            <span class="text-secondary">huang2</span> или <span class="text-secondary">lv4</span>
          </small>
          <PinyinTests />
          <PinyinTests tones={['1', '4']} />
          <PinyinTests tones={['2', '3']} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Тест на знание пиньиня',
  meta: [
    {
      name: 'description',
      content:
        'Тест на владение пиньинем. Проверьте понимание на слух тонов и слогов китайского языка.',
    },
  ],
};
