import { component$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import CONST_URLS from '~/misc/consts/urls';
import {
  PRIVACY_UPDATED,
  PRIVACY_UPDATED_EN,
  extensionPrivacyUrl,
  extensionUrl,
} from '~/components/extension/types';

// The privacy policy of the browser extension, linked from the store listings: keep it in line
// with what the extension really does (extension/README.md). Russian, then English for reviewers.
export default component$(() => {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Расширение для браузера', href: extensionUrl },
          { name: 'Конфиденциальность' },
        ]}
      />
      <PageTitle txt={'Политика конфиденциальности расширения ChinesePlus'} />

      <FlexRow>
        <MainContent>
          <div class="prose max-w-none">
            <p>
              <a href="#en">English version below</a>
            </p>
            <p class="text-sm opacity-70">Обновлено: {PRIVACY_UPDATED}</p>

            <p>
              Эта политика относится к браузерному расширению «ChinesePlus: читай по-китайски с
              подсказками» для Chrome, Firefox и других браузеров (далее — расширение).
            </p>

            <h2>Коротко</h2>
            <p>
              <b>
                Расширение не собирает, не хранит и не передаёт никаких персональных данных и данных
                о страницах, которые вы посещаете.
              </b>
            </p>

            <h2>Как работает расширение</h2>
            <ul>
              <li>
                Когда вы наводите курсор на китайский текст (или нажимаете на него), расширение
                читает несколько иероглифов под курсором и ищет их во встроенном словаре.
              </li>
              <li>
                Словарь входит в состав расширения. Поиск слов происходит внутри вашего браузера,
                без запросов в интернет.
              </li>
              <li>
                Текст страниц, адреса сайтов и история просмотра никуда не отправляются и не
                сохраняются.
              </li>
              <li>
                Кнопки копирования кладут слово (или слово с переводом) в буфер обмена — только
                когда вы на них нажимаете.
              </li>
              <li>
                Кнопка произношения озвучивает слово голосом, встроенным в браузер или систему (Web
                Speech API). Само расширение ничего не отправляет. Некоторые браузеры (например,
                Chrome, если в системе нет китайского голоса) озвучивают текст онлайн-голосом
                производителя браузера — тогда браузер передаёт ему это слово по его собственным
                правилам.
              </li>
            </ul>

            <h2>Что хранится</h2>
            <p>
              Только ваши настройки расширения: включено ли оно, тема подсказок, показ слов внутри
              слова, цвет пиньиня по тонам и режим «Только с зажатым Shift». Они хранятся в памяти
              браузера на вашем устройстве и удаляются вместе с расширением.
            </p>

            <h2>Разрешения</h2>
            <ul>
              <li>
                <b>Доступ к данным на всех сайтах</b> — чтобы показывать подсказки на любой странице
                с китайским текстом. Расширение только читает текст под курсором и не изменяет
                страницы.
              </li>
              <li>
                <b>Хранилище (storage)</b> — для настроек, описанных выше.
              </li>
            </ul>

            <h2>Ссылки на сайт Chinese+</h2>
            <p>
              Кнопка «Подробнее» в подсказке открывает страницу слова на{' '}
              <Link prefetch="js" href="/">
                chineseplus.club
              </Link>{' '}
              — только когда вы сами на неё нажимаете. Кнопка «+» открывает ту же страницу, где сайт
              предложит добавить слово в ваш список слов (если вы не вошли на сайт — сначала войти).
              Расширение не хранит ни вход, ни данные аккаунта. В ссылках есть пометка, что переход
              сделан из расширения (utm_source=browser_extension). На сайте действуют его обычные
              правила.
            </p>

            <h2>Передача третьим лицам</h2>
            <p>
              Расширение не продаёт и не передаёт данные третьим лицам, не использует аналитику,
              рекламу и сторонние сервисы.
            </p>

            <h2>Изменения и контакты</h2>
            <p>
              Если работа расширения изменится, мы обновим эту страницу и дату вверху. Вопросы — на
              странице{' '}
              <Link prefetch="js" href="/contacts">
                контактов
              </Link>
              .
            </p>

            <hr />

            <div lang="en">
              <h2 id="en">Privacy Policy (English)</h2>
              <p class="text-sm opacity-70">Last updated: {PRIVACY_UPDATED_EN}</p>
              <p>
                This policy applies to the browser extension “ChinesePlus: читай по-китайски с
                подсказками” for Chrome, Firefox and other browsers (the “extension”).
              </p>

              <h3>Summary</h3>
              <p>
                <b>
                  The extension does not collect, store or transmit any personal data or any data
                  about the pages you visit.
                </b>
              </p>

              <h3>How it works</h3>
              <ul>
                <li>
                  When you hover over (or tap) Chinese text, the extension reads a few characters
                  under the cursor and looks them up in a dictionary bundled with the extension.
                </li>
                <li>
                  The lookup happens locally in your browser. The extension makes no network
                  requests.
                </li>
                <li>Page content, URLs and browsing history are never sent anywhere or saved.</li>
                <li>
                  The copy buttons put the word (or the word with its translation) on the clipboard,
                  only when you click them.
                </li>
                <li>
                  The pronunciation button speaks the word with a voice built into the browser or
                  the operating system (Web Speech API). The extension itself sends nothing. Some
                  browsers (e.g. Chrome without a Chinese system voice) speak through the browser
                  vendor's online voice; the browser then sends that word to it under its own terms.
                </li>
              </ul>

              <h3>What is stored</h3>
              <p>
                Only your extension settings (on/off, tooltip theme, showing shorter words inside
                the hovered word, pinyin tone colors, Shift-only mode), kept in the browser's local
                extension storage on your device. They are removed when you uninstall the extension.
              </p>

              <h3>Permissions</h3>
              <ul>
                <li>
                  <b>Access to all websites</b>: to show translations on any page with Chinese text.
                  The extension only reads the text under the cursor and does not modify pages.
                </li>
                <li>
                  <b>Storage</b>: for the settings described above.
                </li>
              </ul>

              <h3>Links to chineseplus.club</h3>
              <p>
                The “Подробнее” (“More”) button opens the word's page on chineseplus.club only when
                you click it. The “+” button opens the same page, where the website offers to add
                the word to your word list (after a login on the website if needed). The extension
                keeps no login or account data. The links carry a marker that the visit came from
                the extension (utm_source=browser_extension). The website's own terms apply there.
              </p>

              <h3>Third parties</h3>
              <p>
                The extension does not sell or share any data with third parties and uses no
                analytics, advertising or third-party services.
              </p>

              <h3>Changes and contact</h3>
              <p>
                If the extension's behaviour changes, we will update this page and the date above.
                Contact:{' '}
                <a href={`${CONST_URLS.siteUrl}/contacts`}>{`${CONST_URLS.siteUrl}/contacts`}</a>.
              </p>
            </div>
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = () => {
  const url = `${CONST_URLS.siteUrl}${extensionPrivacyUrl}`;
  const title = 'Политика конфиденциальности расширения ChinesePlus | Chinese+';
  const description =
    'Расширение ChinesePlus для браузера не собирает и не передаёт данные: словарь работает офлайн внутри браузера. Privacy policy in English included.';
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
};
