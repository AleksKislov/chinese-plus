import { component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { userContext } from '~/root';
import { Link, useLocation } from '@builder.io/qwik-city';
import { MenuItem, type MenuItemProps } from './menu-item';
import { collapsedMenuSvg, enterSvg, logoSvg } from '../../media/svg';
import { getNewMentions } from '~/misc/loaders/layout-loaders';
import { AvatarImg } from '../../media/avatar-img';
import MenuLink from './menu-link';
import { MenuItemNew } from './menu-item-new';
import { MenuDropdownGroup } from './menu-dropdown-group';
import { ThemeChanger } from './theme-changer';
import { Brand } from './brand';
import { AuthMenu } from './auth-menu';
import { ACTIVE_MENU_CLASS, isGroupActive } from './menu-active';

export default component$(() => {
  const newMentions = getNewMentions();
  const userState = useContext(userContext);
  const isMobile = useSignal(false);
  const isDrawerOpen = useSignal(false);
  const userHskWordsTotal = userState.hsk2WordsTotal;
  const userHsk3WordsTotal = userState.hsk3WordsTotal;
  const userWordsTotal = userState.wordsCount;
  const pathname = useLocation().url.pathname;
  const isStartActive = isGroupActive(pathname, startGroupHrefs);
  const isHskActive = isGroupActive(pathname, hskGroupHrefs);
  const isReadActive = isGroupActive(pathname, readGroupHrefs);

  useVisibleTask$(() => {
    isMobile.value = window.innerWidth <= 768;
  });

  return (
    // relative z-30: header menus open above sticky page elements (e.g. the tutor toolbar, z-20)
    <header class="bg-base-300 mb-4 relative z-30">
      <div class="md:container md:mx-auto ">
        <div class="navbar h-12 flex justify-between">
          <div class="lg:w-full">
            {/* mobile menu */}
            <div class="drawer w-auto lg:hidden">
              <input
                id="mobile-menu-drawer"
                type="checkbox"
                class="drawer-toggle"
                checked={isDrawerOpen.value}
                onChange$={(_, target) => (isDrawerOpen.value = target.checked)}
              />
              <div class="drawer-content">
                <label for="mobile-menu-drawer" class="btn btn-ghost mt-2" aria-label="Меню">
                  {collapsedMenuSvg}
                </label>
              </div>
              <div class="drawer-side z-50">
                <label
                  for="mobile-menu-drawer"
                  aria-label="Закрыть меню"
                  class="drawer-overlay"
                ></label>
                <ul
                  class="menu bg-base-200 min-h-full w-72 text-base-content"
                  onClick$={(event) => {
                    const target = event.target as HTMLElement;
                    if (target.closest('a')) {
                      isDrawerOpen.value = false;
                    }
                  }}
                >
                  <li>
                    <details class="z-40">
                      <summary class={isStartActive ? ACTIVE_MENU_CLASS : ''}>Введение</summary>
                      <ul class="w-52 bg-base-200">
                        <MenuLink href={'/start/how-to-start'} text={'С чего начать'} />
                        <MenuItemNew name={startPhonetics.name} links={startPhonetics.links} />
                        <MenuItemNew name={startChars.name} links={startChars.links} />
                        <MenuItemNew name={startVocab.name} links={startVocab.links} />
                      </ul>
                    </details>
                  </li>
                  <li>
                    <details class="z-40">
                      <summary class={isHskActive ? ACTIVE_MENU_CLASS : ''}>HSK</summary>
                      <ul class="w-52 bg-base-200">
                        <MenuLink href="/hsk/exams/" text="Экзамены" />
                        <MenuLink href="/hsk/grammar/" text="Грамматика" />
                        <MenuItemNew name={hsk3.name} links={hsk3.links} />
                        <MenuItemNew name={hsk2.name} links={hsk2.links} />
                      </ul>
                    </details>
                  </li>
                  <li>
                    <details class="z-40">
                      <summary class={isReadActive ? ACTIVE_MENU_CLASS : ''}>{read.name}</summary>
                      <ul class="w-52 bg-base-200">
                        <MenuItemNew name={'Тексты'} links={read.links} />
                        <MenuLink href={'/read/books'} text={'Книги'} />
                        <MenuLink href={'/segment'} text={'Сегментатор'} />
                        <MenuLink href={'/extension'} text={'Расширение для браузера'} />
                      </ul>
                    </details>
                  </li>
                  <MenuItemNew name={watch.name} links={watch.links} />
                  <MenuLink href="/dictionary" text="Словарь" />
                  {userState.isAdmin && <MenuLink href="/tutor/" text="AI-учитель" />}
                  <MenuLink href="/read/blog/" text="Блог" />
                  {/* <MenuLink href="/heroes" text="Герои клуба" /> */}
                  {/* <MenuLink href="/donate" text="Донат и цели" /> */}
                  <ThemeChanger />
                </ul>
              </div>
            </div>

            {/* desctop menu */}
            <div class="hidden lg:flex">
              <Link prefetch="js" class="btn btn-ghost normal-case text-xl mt-2" href="/">
                <div>{logoSvg}</div>
                <Brand />
              </Link>
              <ul class="menu menu-horizontal mt-1">
                <MenuDropdownGroup name="Введение" isActive={isStartActive}>
                  <MenuLink href={'/start/how-to-start'} text={'С чего начать'} />
                  <MenuItemNew name={startPhonetics.name} links={startPhonetics.links} />
                  <MenuItemNew name={startChars.name} links={startChars.links} />
                  <MenuItemNew name={startVocab.name} links={startVocab.links} />
                </MenuDropdownGroup>

                <MenuDropdownGroup name="HSK" isActive={isHskActive}>
                  <MenuLink href="/hsk/exams/" text="Экзамены" />
                  <MenuLink href="/hsk/grammar/" text="Грамматика" />
                  <MenuItemNew name={hsk3.name} links={hsk3.links} />
                  <MenuItemNew name={hsk2.name} links={hsk2.links} />
                </MenuDropdownGroup>

                <MenuDropdownGroup name={read.name} isActive={isReadActive}>
                  <MenuItemNew name={'Тексты'} links={read.links} />
                  <MenuLink href={'/read/books'} text={'Книги'} />
                  <MenuLink href={'/segment'} text={'Сегментатор'} />
                  <MenuLink href={'/extension'} text={'Расширение для браузера'} />
                </MenuDropdownGroup>

                <MenuItem name={watch.name} links={watch.links} />

                <MenuLink href="/dictionary" text="Словарь" />

                {userState.isAdmin && <MenuLink href="/tutor/" text="AI-учитель" />}
                {/* <MenuItem name={ourClub.name} links={ourClub.links} /> */}
                <MenuLink href="/read/blog/" text="Блог" />

                <ThemeChanger />
              </ul>
            </div>
          </div>

          {/* brand for mobile */}
          <div class="navbar-center lg:hidden">
            <div class="flex">
              <Link prefetch="js" class="btn btn-ghost normal-case text-2xl" href="/">
                <div>{logoSvg}</div>
                <Brand isMobile={true} />
              </Link>
            </div>
          </div>

          <div>
            <div class="dropdown dropdown-hover dropdown-end mr-2">
              <label
                tabIndex={0}
                class={`btn btn-ghost btn-circle avatar ${
                  newMentions.value.length ? 'online' : ''
                } ${userState.name ? 'mt-2' : ''}`}
              >
                {userState.name ? (
                  <div class="rounded-full ">
                    <AvatarImg
                      userName={userState.name}
                      size={46}
                      newAvatar={userState.newAvatar}
                    />
                  </div>
                ) : (
                  <div>{enterSvg}</div>
                )}
              </label>
              <ul
                tabIndex={0}
                class="dropdown-content z-[3] menu p-2 shadow bg-base-200 rounded-box w-64 text-base-content"
              >
                {userState.name ? (
                  <AuthMenu
                    hskWordsTotal={userHskWordsTotal}
                    hsk3WordsTotal={userHsk3WordsTotal}
                    wordsTotal={userWordsTotal}
                  />
                ) : (
                  unAuthMenu
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export const unAuthMenu = (
  <>
    <MenuLink href="/register" text="Регистрация" />
    <MenuLink href="/login" text="Войти" />
  </>
);

export const startPhonetics: MenuItemProps = {
  name: 'Фонетика',
  links: [
    {
      href: '/start/pinyin-chart',
      text: 'Таблица пиньиня с озвучкой',
    },
    {
      href: '/start/pinyin-tests',
      text: 'Тесты на пиньинь',
    },
    {
      href: '/watch/phonetics-lessons',
      text: 'Уроки фонетики',
    },
    {
      href: '/start/tones-practice',
      text: 'Практика тонов',
    },
  ],
};

export const startChars: MenuItemProps = {
  name: 'Иероглифика',
  links: [
    {
      href: '/start/strokes',
      text: 'Черты',
    },
    {
      href: '/start/radicals',
      text: 'Таблица ключей',
    },
    {
      href: '/watch/characters-lessons',
      text: 'Уроки иероглифики',
    },
    {
      href: '/propisi/',
      text: 'Прописи иероглифов',
    },
  ],
};

export const startVocab: MenuItemProps = {
  name: 'Базовая лексика',
  links: [
    {
      href: '/start/top-characters',
      text: 'Основные иероглифы',
    },
    {
      href: '/na-kitayskom/',
      text: 'Лексика по темам',
    },
    {
      href: '/names/',
      text: 'Имя на китайском',
    },
  ],
};

export const watch: MenuItemProps = {
  name: 'Видео',
  links: [
    {
      href: '/watch/videos',
      text: 'Видео',
    },
    {
      href: '/watch/phonetics-lessons',
      text: 'Уроки фонетики',
    },
    {
      href: '/watch/characters-lessons',
      text: 'Уроки иероглифики',
    },
    {
      href: '/watch/unapproved-videos',
      text: 'На проверке',
    },
  ],
};

export const ourClub: MenuItemProps = {
  name: 'Донат 💰',
  links: [
    {
      href: '/heroes',
      text: 'Герои клуба',
    },
    // {
    //   href: '/donate',
    //   text: 'Донат и цели',
    // },
  ],
};

export const read: MenuItemProps = {
  name: 'Читалка',
  links: [
    {
      href: '/read/texts',
      text: 'Карточки',
    },
    {
      href: '/read/texts/all',
      text: 'Весь список',
    },
    {
      href: '/read/unapproved-texts',
      text: 'На проверке',
    },
  ],
};

export const hsk3: MenuItemProps = {
  name: 'Лексика HSK 3.0',
  links: [
    {
      href: '/hsk/3/table',
      text: 'Таблица',
    },
    {
      href: '/hsk/3/old-table',
      text: 'Старая таблица',
    },
    {
      href: '/hsk/3/tests',
      text: 'Тесты',
    },
    {
      href: '/hsk/3/search',
      text: 'Поиск',
    },
  ],
};

export const hsk2: MenuItemProps = {
  name: 'Лексика HSK 2.0',
  links: [
    {
      href: '/hsk/2/table',
      text: 'Таблица',
    },
    {
      href: '/hsk/2/tests',
      text: 'Тесты',
    },
    {
      href: '/hsk/2/search',
      text: 'Поиск',
    },
  ],
};

const hrefsOf = (item: MenuItemProps) => item.links.map((link) => link.href);

// Every link under the top-level dropdowns, so the dropdown is lit on any of their pages.
const startGroupHrefs = [
  '/start/how-to-start',
  ...hrefsOf(startPhonetics),
  ...hrefsOf(startChars),
  ...hrefsOf(startVocab),
];
const hskGroupHrefs = ['/hsk/exams/', '/hsk/grammar/', ...hrefsOf(hsk3), ...hrefsOf(hsk2)];
const readGroupHrefs = [...hrefsOf(read), '/read/books', '/segment', '/extension'];
