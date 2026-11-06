import { type JSXOutput, component$ } from '@builder.io/qwik';
import { FeatureCard } from './feature-card';
import { academicCapExtraBigSvg, bookExtraBigSvg, graphExtraBigSvg } from '../common/media/svg';
import { WordTooltip, moreInfoModalId } from '../common/tooltips/word-tooltip';
import { MoreInfoModal } from '../common/modals/more-info-modal';
import { type TranslationNode } from '../common/translation/types';

// parsed translation of 我 (dictionarytranslations), for the demo tooltip
const WO_SENSES: TranslationNode[] = [
  { marker: '1', text: 'я; мой' },
  {
    marker: '2',
    text: 'мы; наш (о коллективе, стране)',
    content: [
      { type: 'text', value: 'мы; наш (' },
      { type: 'comment', value: 'о коллективе, стране' },
      { type: 'text', value: ')' },
    ],
  },
  { marker: '3', text: 'сам; самоличный, частный, личный' },
];

type FeatureLink = { href: string; text: string };

export type Feature = {
  title: string;
  pic: JSXOutput;
  desc: string;
  links: FeatureLink[];
  animatedChar?: boolean; // pic is the stroke animation container
};

export const featuresArr: Feature[] = [
  {
    title: 'Читаем и смотрим',
    pic: (
      <span class="text-4xl">
        <WordTooltip
          currentWord={{ value: null }}
          word={{
            chinese: '我',
            _id: '5f04819868566a15a9ff0227',
            pinyin: ' wǒ',
            senses: WO_SENSES,
          }}
        />
      </span>
    ),
    desc: 'Тексты, книги и видео с параллельным переводом. Кликните на любое слово — например, на 我 — и увидите перевод.',
    links: [
      { href: '/read/texts', text: 'Тексты с переводом' },
      { href: '/read/books', text: 'Книги' },
      { href: '/watch/videos', text: 'Видео с субтитрами' },
      { href: '/segment', text: 'Сегментатор текста' },
    ],
  },
  {
    title: 'Подготовка к HSK',
    pic: academicCapExtraBigSvg,
    desc: 'Слова HSK 3.0 и HSK 2.0 с озвучкой и тестами, грамматика по уровням и экзамены HSK онлайн.',
    links: [
      { href: '/hsk/3/table', text: 'Слова HSK 3.0' },
      { href: '/hsk/2/table', text: 'Слова HSK 2.0' },
      { href: '/hsk/3/tests', text: 'Тесты на слова' },
      { href: '/hsk/grammar/', text: 'Грамматика HSK' },
      { href: '/hsk/exams/', text: 'Экзамены HSK' },
    ],
  },
  {
    title: 'Словарь с анимацией',
    pic: <div id="showCharDiv"></div>,
    animatedChar: true,
    desc: 'Поиск по иероглифам, пиньиню, русским словам и шаблону со *, рукописный ввод. У каждого иероглифа — порядок черт, у слов HSK — уровень.',
    links: [
      { href: '/dictionary', text: 'Китайско-русский словарь' },
      { href: '/hsk/3/search', text: 'Поиск по словам HSK' },
    ],
  },
  {
    title: 'С чего начать',
    pic: bookExtraBigSvg,
    desc: 'Пошаговый план для начинающих, произношение и тоны с озвучкой носителем и тестами.',
    links: [
      { href: '/start/how-to-start', text: 'С чего начать' },
      { href: '/start/pinyin-chart', text: 'Таблица пиньиня' },
      { href: '/start/pinyin-tests', text: 'Тесты на пиньинь' },
      { href: '/start/tones-practice', text: 'Практика тонов' },
      { href: '/watch/phonetics-lessons', text: 'Уроки фонетики' },
    ],
  },
  {
    title: 'Иероглифы',
    pic: <span class="text-5xl leading-none">写</span>,
    desc: 'Черты и ключи, уроки иероглифики, прописи с сеткой 田字格 для печати и русские имена по-китайски.',
    links: [
      { href: '/start/strokes', text: 'Черты' },
      { href: '/start/radicals', text: 'Таблица ключей' },
      { href: '/watch/characters-lessons', text: 'Уроки иероглифики' },
      { href: '/propisi/', text: 'Прописи иероглифов' },
      { href: '/names/', text: 'Имя на китайском' },
    ],
  },
  {
    title: 'Личный кабинет',
    pic: graphExtraBigSvg,
    desc: 'После регистрации: личный словарик для повторения слов, дневник чтения с суточной целью и свои тексты и видео для других учеников.',
    links: [
      { href: '/me/words', text: 'Мой словарик' },
      { href: '/me', text: 'Дневник чтения' },
      { href: '/create', text: 'Добавить текст или видео' },
    ],
  },
];

export const Features = component$(() => {
  return (
    <>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuresArr.map((_, ind) => (
          <FeatureCard key={ind} ind={ind} />
        ))}
      </div>
      <MoreInfoModal
        word={{
          cn: '我',
          id: 0,
          lvl: '1',
          _id: '5f04819868566a15a9ff0227',
          dictId: '5f04819868566a15a9ff0227',
          py: ' wǒ',
          senses: WO_SENSES,
        }}
        modalId={moreInfoModalId}
      />
    </>
  );
});
