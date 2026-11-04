import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import CONST_URLS from '~/misc/consts/urls';
import { PropisiPage } from '~/components/propisi/propisi-page';
import {
  type FaqItem,
  MAX_CHARS,
  PART_SIZE,
  hubSeo,
  propisiOgImage,
  propisiUrl,
} from '~/components/propisi/types';

export { useSheetData } from '~/misc/loaders/propisi-loaders';

const FAQ: FaqItem[] = [
  {
    q: 'Что такое 田字格 и 米字格?',
    a: '田字格 (тяньцзыгэ) — клетка, разделённая пунктиром на четыре части, как иероглиф 田. Линии помогают соблюдать пропорции: где центр знака, где его половины. В 米字格 добавлены диагонали — удобно для иероглифов с наклонными чертами.',
  },
  {
    q: 'Как распечатать прописи или сохранить их в PDF?',
    a: 'Нажмите «Скачать PDF / Распечатать». В окне печати выберите принтер или пункт «Сохранить как PDF», формат A4, масштаб 100%. Шапка сайта и настройки на листе не печатаются.',
  },
  {
    q: 'Как правильно заполнять прописи?',
    a: 'Сначала изучите порядок черт в верхней строке: каждая клетка добавляет одну черту. Затем обведите серые иероглифы, соблюдая порядок, и пишите самостоятельно в пустых клетках, ориентируясь на образец в первой клетке.',
  },
  {
    q: 'Можно ли сделать прописи для своих иероглифов?',
    a: `Да. Вставьте любые иероглифы (до ${MAX_CHARS} за раз): слова из урока, имя, текст песни. Пиньинь и перевод подставятся автоматически.`,
  },
  {
    q: 'Какие иероглифы входят в прописи HSK?',
    a: `Для каждого уровня HSK 3.0 и HSK 2.0 — иероглифы, которые впервые встречаются в словах этого уровня, в порядке официального списка. Они разбиты на листы по ${PART_SIZE} иероглифов.`,
  },
  {
    q: 'Можно ли поделиться прописями с учениками?',
    a: 'Да. Все настройки сохраняются в адресе страницы: нажмите «Скопировать ссылку» и отправьте её ученикам или родителям — у них откроется точно такой же лист.',
  },
];

export default component$(() => <PropisiPage seo={hubSeo} faq={FAQ} />);

export const head: DocumentHead = () => {
  const url = `${CONST_URLS.siteUrl}${propisiUrl}`;
  return {
    title: hubSeo.title,
    meta: [
      { name: 'description', content: hubSeo.description },
      { property: 'og:title', content: hubSeo.title },
      { property: 'og:description', content: hubSeo.description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: `${CONST_URLS.siteUrl}${propisiOgImage}` },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
};
