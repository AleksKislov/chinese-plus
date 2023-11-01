import { component$, useContext, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { userContext } from "~/root";
import { logout } from "~/misc/actions/auth";
import { Link } from "@builder.io/qwik-city";
import { MenuItem, type MenuItemProps } from "./menu-item";
import { dropdownArrowBottom, enterSvg, exitSvg, logoSvg } from "../../media/svg";
import { getNewMentions } from "~/routes/layout";
import { AvatarImg } from "../../media/avatar-img";
import MenuLink from "./menu-link";
import { MenuItemNew } from "./menu-item-new";
import { ThemeChanger } from "./theme-changer";
import { Brand } from "./brand";

export default component$(() => {
  const newMentions = getNewMentions();
  const userState = useContext(userContext);
  const isMobile = useSignal(false);

  useTask$(() => {
    userState.newMentions = newMentions.value;
  });

  useVisibleTask$(() => {
    isMobile.value = window.innerWidth <= 768;
  });

  return (
    <header class='bg-neutral mb-4'>
      <div class='md:container md:mx-auto'>
        <div class='navbar h-12'>
          <div class='navbar-start lg:w-full'>
            {/* mobile menu */}
            <div class='dropdown'>
              <label tabIndex={0} class='btn btn-ghost lg:hidden'>
                {logoSvg}
              </label>
              <ul
                tabIndex={0}
                class='dropdown-content z-[1] menu bg-base-200 w-64 rounded-box text-base-content'
              >
                <MenuItemNew name={read.name} links={read.links} />
                <MenuItemNew name={watch.name} links={watch.links} />
                <MenuItemNew name={start.name} links={start.links} />
                <li>
                  <details class='z-40'>
                    <summary>HSK</summary>
                    <ul class='w-52 bg-base-200'>
                      <MenuItemNew name={hsk2.name} links={hsk2.links} />
                      <MenuItemNew name={hsk3.name} links={hsk3.links} />
                    </ul>
                  </details>
                </li>
                <MenuLink href='/search' text='Словарь' />
                <MenuLink href='/feedback' text='Фидбэк' />
                <ThemeChanger />
              </ul>
            </div>

            {/* desctop menu */}
            <div class='hidden lg:flex'>
              <Link class='btn btn-ghost normal-case text-xl mt-2' href='/'>
                <div>{logoSvg}</div>
                <Brand />
              </Link>
              <ul class='menu menu-horizontal mt-1'>
                <MenuItem name={read.name} links={read.links} />
                <MenuItem name={watch.name} links={watch.links} />
                <MenuItem name={start.name} links={start.links} />

                <li tabIndex={0} class='dropdown dropdown-hover hover:text-success'>
                  <label class='my-1 hover:text-success'>
                    HSK
                    {dropdownArrowBottom}
                  </label>
                  <ul class='dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-64 text-base-content'>
                    <MenuItemNew name={hsk2.name} links={hsk2.links} />
                    <MenuItemNew name={hsk3.name} links={hsk3.links} />
                  </ul>
                </li>

                <MenuLink href='/search' text='Словарь' />
                <MenuLink href='/feedback' text='Фидбэк' />
                <ThemeChanger />
              </ul>
            </div>
          </div>

          {/* brand for mobile */}
          <div class='navbar-center lg:hidden'>
            <Link class='btn btn-ghost normal-case text-2xl' href='/'>
              <Brand isMobile={true} />
            </Link>
          </div>

          <div class='navbar-end'>
            <div class='dropdown dropdown-hover dropdown-end mr-2'>
              <label
                tabIndex={0}
                class={`btn btn-ghost btn-circle avatar ${
                  newMentions.value.length ? "online" : ""
                } ${userState.name ? "mt-2" : ""}`}
              >
                {userState.name ? (
                  <div class='rounded-full '>
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
                class='dropdown-content z-[3] menu p-2 shadow bg-base-200 rounded-box w-64 text-base-content'
              >
                {userState.name ? authMenu : unAuthMenu}
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
    <MenuLink href='/register' text='Регистрация' />
    <MenuLink href='/login' text='Войти' />
  </>
);

export const authMenu = (
  <>
    <MenuLink href='/me' text='Личный кабинет' />
    <MenuLink href='/me/hsk/2' text='Мой словарик HSK' />
    <MenuLink href='/me/words' text='Мой словарик' />
    <MenuLink href='/create' text='Поделиться контентом' />
    <hr class='h-px my-1 bg-primary border-0' />

    <li>
      <a onClick$={() => logout()}>Выйти {exitSvg}</a>
    </li>
  </>
);

export const start: MenuItemProps = {
  name: "Новичкам",
  links: [
    {
      href: "/start/pinyin-chart",
      text: "Таблица пиньиня с озвучкой",
    },
    {
      href: "/start/pinyin-tests",
      text: "Тесты на пиньинь",
    },
    {
      href: "/start/radicals",
      text: "Таблица ключей иероглифов",
    },
  ],
};

export const watch: MenuItemProps = {
  name: "Видео",
  links: [
    {
      href: "/watch/videos",
      text: "Видео",
    },
    {
      href: "/watch/unapproved-videos",
      text: "На проверке",
    },
  ],
};

export const read: MenuItemProps = {
  name: "Читалка",
  links: [
    {
      href: "/read/texts",
      text: "Тексты",
    },
    {
      href: "/read/unapproved-texts",
      text: "На проверке",
    },
  ],
};

export const hsk3: MenuItemProps = {
  name: "HSK 3.0",
  links: [
    {
      href: "/hsk/3/table",
      text: "Таблица",
    },
    {
      href: "/hsk/3/tests",
      text: "Тесты",
    },
    {
      href: "/hsk/3/search",
      text: "Поиск",
    },
  ],
};

export const hsk2: MenuItemProps = {
  name: "HSK 2.0",
  links: [
    {
      href: "/hsk/2/table",
      text: "Таблица",
    },
    {
      href: "/hsk/2/tests",
      text: "Тесты",
    },
    {
      href: "/hsk/2/search",
      text: "Поиск",
    },
  ],
};
