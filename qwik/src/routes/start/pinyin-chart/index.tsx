import { Fragment, component$, useContext, useStyles$, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { tableMap, pinyinMap } from '~/misc/consts/pinyin';
import pinyinChars from '~/misc/consts/pinyin-chars';
import styles from './table.css?inline';
import CONST_URLS from '~/misc/consts/urls';
import { PageTitle } from '~/components/common/layout/title';
import { infoAlertSvg } from '~/components/common/media/svg';
import { PhoneticsLinkCard } from '~/components/common/content-cards/phonetics-link-card';
import { NextStepsCards } from '~/components/start/next-steps-cards';
import { configContext } from '~/root';
import YANDEX_ADS from '~/misc/consts/ads';
import { LentaAds } from '~/components/common/ads/lenta-ads';
import { BannerAds } from '~/components/common/ads/sidebar-ads';
import OUR_ADS from '~/misc/consts/our-ads';
import { OurAds } from '~/components/common/ads/our-ads';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { JsonLd } from '~/components/common/seo/json-ld';

export const initHiglights = () => {
  const tbody = document.querySelector('tbody') as HTMLTableSectionElement;
  const tableHead = document.querySelector('#tableHead2') as Element;
  const tds = tbody.getElementsByTagName('td');
  const ths = tableHead.getElementsByTagName('th');

  const tdsArr = Array.from(tds);
  const thsArr = Array.from(ths);

  function higlightEvent(i: number, action: string) {
    const cols = i % 36;

    for (let index = 0; index < 22; index++) {
      const el = tdsArr[cols + index * 36];
      action === 'set'
        ? el.setAttribute('class', 'bg-base-300')
        : el.classList.remove('bg-base-300');
    }
    action === 'set'
      ? thsArr[cols + 1].setAttribute('class', 'bg-base-300')
      : thsArr[cols + 1].classList.remove('bg-base-300');
  }

  tdsArr.forEach((td, ind) => {
    td.addEventListener('mouseover', () => higlightEvent(ind, 'set'));
    td.addEventListener('mouseout', () => higlightEvent(ind, 'remove'));
  });
};

// Audio elements per sound file, created on first use (browser only).
// Reusing them lets a preloaded file play without another download.
const audioBySound = new Map<string, HTMLAudioElement>();

const getAudio = (sound: string) => {
  let audio = audioBySound.get(sound);
  if (!audio) {
    audio = new Audio(`${CONST_URLS.myAudioURL}pinyin/${sound}.mp3`);
    audio.preload = 'auto';
    audio.load();
    audioBySound.set(sound, audio);
  }
  return audio;
};

// Whether any tone of a syllable has an example character (pinyinChars).
const hasChars = (pySound: string) =>
  Object.keys(pinyinMap[pySound] || {}).some((tone) => pinyinChars[tone]);

// Characters toggle: hides them with a CSS class (table.css), so the table is not re-rendered;
// the choice is kept in localStorage.
const CHARS_STORAGE_KEY = 'pinyinChartShowChars';

const applyCharsShown = (shown: boolean) => {
  document.getElementById('pinyinTableWrap')?.classList.toggle('hide-chars', !shown);
};

export const setCharsShown = (shown: boolean) => {
  applyCharsShown(shown);
  try {
    localStorage.setItem(CHARS_STORAGE_KEY, shown ? '1' : '0');
  } catch {
    // storage blocked: the choice lasts until the page is closed
  }
};

const restoreCharsShown = () => {
  let shown = false;
  try {
    shown = localStorage.getItem(CHARS_STORAGE_KEY) === '1';
  } catch {
    // storage blocked: hidden by default
  }
  const toggle = document.getElementById('pinyinCharsToggle') as HTMLInputElement | null;
  if (toggle) toggle.checked = shown;
  applyCharsShown(shown);
};

// Starts downloading a syllable's tones when its menu opens, so they are ready by the click.
export const preloadSounds = (sounds: string[]) => {
  sounds.forEach((sound) => sound && getAudio(sound));
};

export const playAudioFromBtn = (sound: string) => {
  if (!sound) return;
  const audio = getAudio(sound);
  audio.currentTime = 0;
  audio.play();
};

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Что такое пиньинь?',
    a: 'Пиньинь — официальная система записи китайских слогов латиницей. По нему учат произношение, ищут слова в словарях и набирают иероглифы на клавиатуре.',
  },
  {
    q: 'Как устроен слог в пиньине?',
    a: 'Слог состоит из инициали (начального согласного), финали (остальной части слога) и тона. В таблице строки — это инициали, столбцы — финали, а на пересечении — слог.',
  },
  {
    q: 'Сколько тонов в китайском языке?',
    a: 'Четыре тона и нейтральный. Тон обозначается знаком над гласной: mā (1-й), má (2-й), mǎ (3-й), mà (4-й), ma (нейтральный).',
  },
];

export default component$(() => {
  useStyles$(styles);
  const configState = useContext(configContext);

  const lentaAds = configState.find((x) => x.type === YANDEX_ADS.lenta);
  const bannerAds = configState.find((x) => x.type === YANDEX_ADS.banner);
  const wideBannerAds = configState.filter((x) => x.type === OUR_ADS.wide_banner)[0];

  const consonansts = Object.keys(tableMap);

  useVisibleTask$(() => {
    initHiglights();
    restoreCharsShown();
  });

  return (
    <>
      <Breadcrumbs items={[{ name: 'Таблица пиньиня с озвучкой' }]} />
      <PageTitle txt={'Таблица пиньиня с озвучкой'} />
      <div class="prose max-w-none">
        <p>
          Все слоги китайского языка в одной таблице: строки — инициали, столбцы — финали. Каждый
          слог озвучен носителем языка во всех тонах.
        </p>
      </div>

      <div class="alert mt-3 flex">
        {infoAlertSvg}
        <span>
          Таблица озвучена носителем языка. Кликайте на слог, чтобы прослушать его. Частые иероглифы
          с таким чтением можно включить переключателем над таблицей
        </span>
      </div>

      <PhoneticsLinkCard />
      <NextStepsCards />

      {wideBannerAds?.isActive && <OurAds adsInfo={wideBannerAds} />}
      {bannerAds?.isActive && <BannerAds />}

      <label class="label cursor-pointer justify-start gap-3 mt-3">
        <input
          id="pinyinCharsToggle"
          type="checkbox"
          class="toggle toggle-info"
          onChange$={(_, el) => setCharsShown(el.checked)}
        />
        <span class="label-text">
          <span class="opacity-70">Показать распространенный иероглиф под слогом</span>
        </span>
      </label>

      <div id="pinyinTableWrap" class="hide-chars overflow-x-auto">
        <table class="table table-compact text-base-content">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th colSpan={5}>a</th>
              <th colSpan={3}>o</th>
              <th colSpan={5}>e</th>
              <th colSpan={10}>i</th>
              <th colSpan={9}>u</th>
              <th colSpan={4}>ü</th>
            </tr>
            <tr id="tableHead2">
              <th>&nbsp;</th>
              <th>a</th>
              <th>ai</th>
              <th>ao</th>
              <th>an</th>
              <th>ang</th>
              <th>o</th>
              <th>ong</th>
              <th>ou</th>
              <th>e</th>
              <th>ei</th>
              <th>en</th>
              <th>eng</th>
              <th>er</th>
              <th>i</th>
              <th>ia</th>
              <th>iao</th>
              <th>ie</th>
              <th>iou</th>
              <th>ian</th>
              <th>iang</th>
              <th>in</th>
              <th>ing</th>
              <th>iong</th>
              <th>u</th>
              <th>ua</th>
              <th>uo</th>
              <th>ui</th>
              <th>uai</th>
              <th>uan</th>
              <th>un</th>
              <th>uang</th>
              <th>ueng</th>
              <th>ü</th>
              <th>üe</th>
              <th>üan</th>
              <th>ün</th>
            </tr>
          </thead>
          <tbody id="pinyinTable">
            {consonansts.map((conson, k) => (
              <tr key={k} class="hover">
                <th scope="row">{conson}</th>
                {tableMap[conson].map((pySound, ind) => (
                  <td key={ind}>
                    {pySound ? (
                      <div class={'dropdown dropdown-bottom'}>
                        <label
                          tabIndex={0}
                          class="cursor-pointer"
                          onFocus$={() => preloadSounds(Object.values(pinyinMap[pySound] || {}))}
                        >
                          {pySound}
                        </label>
                        <div
                          tabIndex={0}
                          class="card compact dropdown-content bg-neutral text-neutral-content rounded-box z-[1] w-max"
                        >
                          <div class="card-body">
                            {/* a column per tone: the audio button, the character under it;
                                no character row when no tone has a character */}
                            <div
                              class={`tone-grid grid grid-flow-col ${
                                hasChars(pySound) ? 'grid-rows-2 gap-y-1' : ''
                              }`}
                            >
                              {pinyinMap[pySound] &&
                                Object.keys(pinyinMap[pySound]).map((x, ind, tones) => (
                                  <Fragment key={ind}>
                                    <button
                                      class={`lowercase btn btn-sm w-full rounded-none ${
                                        ind === 0 ? 'rounded-l-[var(--rounded-btn,0.5rem)]' : ''
                                      } ${
                                        ind === tones.length - 1
                                          ? 'rounded-r-[var(--rounded-btn,0.5rem)]'
                                          : ''
                                      } ${pinyinMap[pySound][x] ? 'btn-info' : 'btn-error'}`}
                                      onClick$={() => {
                                        playAudioFromBtn(pinyinMap[pySound][x]);
                                      }}
                                    >
                                      {x}
                                    </button>
                                    {/* meaning in a CSS tooltip: no extra elements or scripts;
                                        cursor-pointer makes iOS show it on tap */}
                                    {hasChars(pySound) && (
                                      <span
                                        class={`tone-char text-2xl text-center ${
                                          pinyinChars[x]?.[1]
                                            ? 'tooltip tooltip-bottom tooltip-info cursor-pointer'
                                            : ''
                                        }`}
                                        data-tip={pinyinChars[x]?.[1] || undefined}
                                      >
                                        {pinyinChars[x]?.[0]}
                                      </span>
                                    )}
                                  </Fragment>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span></span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="prose max-w-none mt-6">
        <h2>Как пользоваться таблицей</h2>
        {FAQ.map(({ q, a }) => (
          <div key={q}>
            <h3>{q}</h3>
            <p>{a}</p>
          </div>
        ))}
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        }}
      />

      {lentaAds?.isActive && <LentaAds />}
    </>
  );
});

export const head: DocumentHead = {
  title: 'Таблица пиньиня с озвучкой — все слоги китайского языка | Chinese+',
  // Opens the connection to the audio storage early, so the first click doesn't wait for it.
  links: [{ rel: 'preconnect', href: new URL(CONST_URLS.myAudioURL).origin }],
  meta: [
    {
      name: 'description',
      content:
        'Таблица пиньиня с озвучкой носителем: все слоги китайского языка с инициалями, финалями и тонами. Нажмите на слог, чтобы услышать произношение.',
    },
  ],
};
