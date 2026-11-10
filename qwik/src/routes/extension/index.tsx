import { component$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';
import {
  EXTENSION_STORES,
  extensionOgImage,
  extensionPrivacyUrl,
  extensionUrl,
} from '~/components/extension/types';

const TITLE = 'Переводчик с китайского на русский при наведении курсора — расширение для браузера';
const DESCRIPTION =
  'Бесплатное расширение для Chrome, Яндекс Браузера и Firefox: наведите курсор на китайское слово — и увидите пиньинь, перевод на русский и уровень HSK. Произношение, добавление в свои слова, работает офлайн.';

const FAQ = [
  {
    q: 'Это бесплатно?',
    a: 'Да, расширение полностью бесплатное, без рекламы и регистрации.',
  },
  {
    q: 'Нужен ли интернет?',
    a: 'Нет. Словарь встроен в расширение, поэтому подсказки работают без интернета. Сеть нужна только чтобы открыть слово на сайте кнопками «Подробнее» и «+». Произношение работает офлайн, если в системе есть китайский голос.',
  },
  {
    q: 'Как добавить слово в свой список слов?',
    a: 'Нажмите «+» в подсказке: слово откроется на сайте, и останется подтвердить добавление. Входить в аккаунт в расширении не нужно — достаточно быть залогиненным на chineseplus.club. Если вы не вошли, сайт сначала попросит войти, а потом вернёт вас к слову.',
  },
  {
    q: 'Подсказки мешают читать. Можно показывать их только по запросу?',
    a: 'Да: включите в меню расширения «Только с зажатым Shift». Тогда подсказка появляется, только когда вы наводите курсор на слово и нажимаете Shift.',
  },
  {
    q: 'Какие слова есть в словаре?',
    a: 'Около 130 000 слов и выражений из китайско-русского словаря Chinese+: все иероглифы, употребительные слова до четырёх иероглифов, все слова HSK и чэнъюи. Традиционные иероглифы тоже распознаются.',
  },
  {
    q: 'Как установить расширение в Яндекс Браузер?',
    a: 'Яндекс Браузер ставит расширения из Chrome Web Store: откройте страницу расширения в Chrome Web Store по кнопке «Установить в Chrome» и нажмите «Установить». Расширение появится в меню «Дополнения».',
  },
  {
    q: 'Работает ли расширение на телефоне?',
    a: 'Да, в Firefox для Android: нажмите на китайское слово, и появится подсказка. Chrome для Android расширения не поддерживает — там можно вставить текст в наш сегментатор.',
  },
  {
    q: 'Как выключить подсказки?',
    a: 'Нажмите на значок расширения в панели браузера и снимите галочку «Вкл / выкл». На компьютере можно нажать Alt+Shift+Y (на macOS — Option+Shift+Y).',
  },
  {
    q: 'Собирает ли расширение мои данные?',
    a: 'Нет. Расширение ничего не собирает и никуда не отправляет: всё работает внутри вашего браузера.',
  },
];

export default component$(() => {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Расширение для браузера' }]} />
      <PageTitle
        txt={
          'Перевод китайского при наведении курсора — расширение для Chrome, Яндекс Браузера и Firefox'
        }
      />

      <FlexRow>
        <MainContent>
          <div class="prose max-w-none">
            <p class="text-lg">
              Читайте китайские тексты на любом сайте: наведите курсор на слово (на телефоне —
              нажмите на него), и рядом появится подсказка с пиньинем и переводом. Как подсказки в
              наших текстах и книгах, только везде.
            </p>

            <div class="not-prose flex flex-wrap gap-4 my-6">
              {EXTENSION_STORES.map((store) =>
                store.url ? (
                  <a
                    key={store.name}
                    href={store.url}
                    target="_blank"
                    rel="noopener"
                    class="btn btn-info"
                  >
                    Установить в {store.name}
                    <span class="text-xs font-normal normal-case opacity-80">{store.note}</span>
                  </a>
                ) : (
                  <div key={store.name} class="btn btn-disabled">
                    {store.name} — скоро
                    <span class="text-xs font-normal normal-case">{store.note}</span>
                  </div>
                ),
              )}
            </div>

            <img
              src="/img/extension/popup-hsk.jpg"
              width={1280}
              height={800}
              alt="Подсказка расширения над словом 没关系: пиньинь méiguānxi, раскрашенный по тонам, уровень HSK 1 и перевод"
              class="rounded-box shadow"
              loading="lazy"
            />

            <h2>Что умеет расширение</h2>
            <ul>
              <li>
                <b>Пиньинь и перевод при наведении курсора</b> — на любом сайте: новости, соцсети,
                Википедия, онлайн-книги.
              </li>
              <li>
                <b>Само находит границы слов.</b> Для 中国人 вы увидите «中国人», а ниже — «中国» и
                «中» (это можно выключить).
              </li>
              <li>
                <b>Около 130 000 слов</b>: все иероглифы, употребительные слова, слова HSK и чэнъюи.
                Традиционные иероглифы тоже распознаются.
              </li>
              <li>
                <b>Уровень HSK 3.0</b> у слов из{' '}
                <Link prefetch="js" href="/hsk">
                  списков HSK
                </Link>
                .
              </li>
              <li>
                <b>Кнопка «+»</b> добавляет слово в ваш список слов на сайте — без входа в аккаунт в
                расширении.
              </li>
              <li>
                <b>Произношение</b> голосом браузера и <b>копирование</b> слова или слова вместе с
                переводом — одной кнопкой.
              </li>
              <li>
                <b>Кнопка «Подробнее»</b> открывает слово в{' '}
                <Link prefetch="js" href="/dictionary">
                  словаре Chinese+
                </Link>
                : примеры, анимированный порядок черт.
              </li>
              <li>
                <b>Цвет пиньиня по тонам</b> — по желанию.
              </li>
              <li>
                <b>Режим «Только с зажатым Shift»</b> — если постоянные подсказки мешают: подсказка
                появляется, только когда вы нажимаете Shift.
              </li>
              <li>
                <b>Работает без интернета</b> — словарь встроен в расширение.
              </li>
              <li>
                <b>Светлая и тёмная тема</b>, включение и выключение одним нажатием.
              </li>
            </ul>

            <img
              src="/img/extension/popup-parts-dark.jpg"
              width={1280}
              height={800}
              alt="Подсказка в тёмной теме для 森林 и 森: слово целиком и иероглиф, из которого оно состоит"
              class="rounded-box shadow"
              loading="lazy"
            />

            <h2>Как пользоваться</h2>
            <ol>
              <li>Установите расширение по кнопке выше.</li>
              <li>
                Откройте любую страницу с китайским текстом и наведите курсор на иероглиф. На
                телефоне в Firefox — нажмите на слово.
              </li>
              <li>
                Чтобы открыть слово на сайте, нажмите «Подробнее» в подсказке, чтобы добавить его в
                свой список слов — «+». Подсказка не пропадёт, пока вы ведёте к ней курсор.
              </li>
              <li>
                Настройки — в меню расширения (значок на панели браузера): включение, тема, показ
                слов внутри слова, цвет пиньиня по тонам, режим «Только с зажатым Shift». Быстро
                включить или выключить: Alt+Shift+Y (на macOS — Option+Shift+Y).
              </li>
            </ol>

            <img
              src="/img/extension/popup-add.jpg"
              width={1280}
              height={800}
              alt="Подсказка для 今天 и кнопка «+» с подсказкой «Добавить в мои слова на сайте»"
              class="rounded-box shadow"
              loading="lazy"
            />

            <img
              src="/img/extension/mobile.jpg"
              width={1280}
              height={800}
              alt="Расширение в Firefox для Android: подсказка для слова 最后 после нажатия на него"
              class="rounded-box shadow"
              loading="lazy"
            />
            <p>
              Нет возможности поставить расширение (например, Chrome на Android)? Вставьте текст в{' '}
              <Link prefetch="js" href="/segment">
                сегментатор
              </Link>{' '}
              — он разобьёт его на слова с такими же подсказками.
            </p>

            <h2>Конфиденциальность</h2>
            <p>
              Расширение не собирает, не хранит и не передаёт никаких данных о вас и о страницах,
              которые вы читаете. Подробнее —{' '}
              <Link prefetch="js" href={extensionPrivacyUrl}>
                политика конфиденциальности
              </Link>
              .
            </p>

            <h2>Частые вопросы</h2>
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </MainContent>
      </FlexRow>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'ChinesePlus: читай по-китайски с подсказками',
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'Chrome, Firefox, Firefox для Android',
          softwareVersion: '1.1.0',
          description: DESCRIPTION,
          url: `${CONST_URLS.siteUrl}${extensionUrl}`,
          image: `${CONST_URLS.siteUrl}${extensionOgImage}`,
          inLanguage: 'ru',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' },
        }}
      />
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
    </>
  );
});

export const head: DocumentHead = () => {
  const url = `${CONST_URLS.siteUrl}${extensionUrl}`;
  return {
    title: TITLE,
    meta: [
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: url },
      { property: 'og:image', content: `${CONST_URLS.siteUrl}${extensionOgImage}` },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
};
