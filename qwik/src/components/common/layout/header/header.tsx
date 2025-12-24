import { component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { userContext } from '~/root';
import { Link } from '@builder.io/qwik-city';
import { MenuItem, type MenuItemProps } from './menu-item';
import { dropdownArrowBottom, enterSvg, logoSvg } from '../../media/svg';
import { type PulseData, getNewMentions } from '~/routes/layout';
import { AvatarImg } from '../../media/avatar-img';
import MenuLink from './menu-link';
import { MenuItemNew } from './menu-item-new';
import { ThemeChanger } from './theme-changer';
import { Brand } from './brand';
import { ClubPulse } from './club-pulse';
import { AuthMenu } from './auth-menu';

export default component$(({ pulse }: { pulse: PulseData }) => {
  const newMentions = getNewMentions();
  const userState = useContext(userContext);
  const isMobile = useSignal(false);
  const userHskWordsTotal = userState.hsk2WordsTotal;
  const userWordsTotal = userState.words.length;

  useVisibleTask$(() => {
    isMobile.value = window.innerWidth <= 768;
  });

  return (
    <header class="bg-base-300 mb-4">
      <div class="md:container md:mx-auto ">
        <div class="navbar h-12 flex justify-between">
          <div class="lg:w-full">
            {/* mobile menu */}
            <div class="dropdown">
              <label tabIndex={0} class="btn btn-ghost mt-2 lg:hidden">
                {logoSvg}
              </label>
              <ul
                tabIndex={0}
                class="dropdown-content z-[1] menu bg-base-200 w-64 rounded-box text-base-content"
              >
                <li>
                  <details class="z-40">
                    <summary>{read.name}</summary>
                    <ul class="w-52 bg-base-200">
                      <MenuItemNew name={'Тексты'} links={read.links} />
                      <MenuLink href={'/read/books'} text={'Книги'} />
                      <MenuLink href={'/segment'} text={'Сегментатор'} />
                    </ul>
                  </details>
                </li>
                <MenuItemNew name={watch.name} links={watch.links} />
                <li>
                  <details class="z-40">
                    <summary>Начинающим</summary>
                    <ul class="w-52 bg-base-200">
                      <MenuLink href={'/start/how-to-start'} text={'С чего начать'} />
                      <MenuItemNew name={startPhonetics.name} links={startPhonetics.links} />
                      <MenuItemNew name={startChars.name} links={startChars.links} />
                    </ul>
                  </details>
                </li>
                <li>
                  <details class="z-40">
                    <summary>HSK</summary>
                    <ul class="w-52 bg-base-200">
                      <MenuItemNew name={hsk2.name} links={hsk2.links} />
                      <MenuItemNew name={hsk3.name} links={hsk3.links} />
                    </ul>
                  </details>
                </li>
                <MenuLink href="/search" text="Словарь" />
                <MenuLink href="/feedback" text="Форум" />
                {/* <MenuLink href="/heroes" text="Герои клуба" /> */}
                {/* <MenuLink href="/donate" text="Донат и цели" /> */}
                <ThemeChanger />
              </ul>
            </div>

            {/* desctop menu */}
            <div class="hidden lg:flex">
              <Link class="btn btn-ghost normal-case text-xl mt-2" href="/">
                <div>{logoSvg}</div>
                <Brand />
              </Link>
              <ul class="menu menu-horizontal mt-1">
                <li tabIndex={0} class="dropdown dropdown-hover hover:text-success">
                  <label class="my-1 hover:text-secondary">
                    {read.name}
                    {dropdownArrowBottom}
                  </label>
                  <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-64 text-base-content">
                    <MenuItemNew name={'Тексты'} links={read.links} />
                    <MenuLink href={'/read/books'} text={'Книги'} />
                    <MenuLink href={'/segment'} text={'Сегментатор'} />
                  </ul>
                </li>

                <MenuItem name={watch.name} links={watch.links} />

                <li tabIndex={0} class="dropdown dropdown-hover hover:text-success">
                  <label class="my-1 hover:text-secondary">
                    Начинающим
                    {dropdownArrowBottom}
                  </label>
                  <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-64 text-base-content">
                    <MenuLink href={'/start/how-to-start'} text={'С чего начать'} />
                    <MenuItemNew name={startPhonetics.name} links={startPhonetics.links} />
                    <MenuItemNew name={startChars.name} links={startChars.links} />
                  </ul>
                </li>

                <li tabIndex={0} class="dropdown dropdown-hover hover:text-success">
                  <label class="my-1 hover:text-secondary">
                    HSK
                    {dropdownArrowBottom}
                  </label>
                  <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-64 text-base-content">
                    <MenuItemNew name={hsk2.name} links={hsk2.links} />
                    <MenuItemNew name={hsk3.name} links={hsk3.links} />
                  </ul>
                </li>

                <MenuLink href="/search" text="Словарь" />
                {/* <MenuItem name={ourClub.name} links={ourClub.links} /> */}
                <MenuLink href="/feedback" text="Форум" />

                <ThemeChanger />
                <ClubPulse data={pulse} />
              </ul>
            </div>
          </div>

          {/* brand for mobile */}
          <div class="navbar-center lg:hidden">
            <div class="flex">
              <ClubPulse data={pulse} />
              <Link class="btn btn-ghost normal-case text-2xl" href="/">
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
                  <AuthMenu hskWordsTotal={userHskWordsTotal} wordsTotal={userWordsTotal} />
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
    {
      href: '/donate',
      text: 'Донат и цели',
    },
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
  name: 'HSK 3.0',
  links: [
    {
      href: '/hsk/3/table',
      text: 'Таблица',
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
  name: 'HSK 2.0',
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
