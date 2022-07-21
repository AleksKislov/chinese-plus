// import Link from "next/Link";
import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import { loadLengths } from "../../actions/hskTable";
import { loadUserWordsLen } from "../../actions/userWords";
import { getMentionsLen } from "../../actions/comments";

import Tippy from "@tippyjs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faYinYang,
  faDoorOpen,
  faSignOutAlt,
  faComment,
  faDonate,
} from "@fortawesome/free-solid-svg-icons";

import constants from "../../constants/consts";
const { users, appVersion } = constants;

const changeTheme = () => {
  if (+localStorage.isDarkTheme) {
    localStorage.isDarkTheme = 0;
  } else {
    localStorage.isDarkTheme = 1;
  }
  window.location.reload();
};

const Paths: {
  [key: string]: {
    [key: string]: string;
  };
} = {
  start: {
    id: "start",
    pinyin: "pinyin",
    pinyin_tests: "pinyin_tests",
    radicals: "radicals",
  },

  reading: {
    texts: "texts",
    books: "books",
    not_approved_texts: "not_approved_texts",
    our_heroes: "our_heroes",
  },

  auth: {
    id: "auth",
    login: "login",
    register: "register",
  },
};

class PathService {
  static activeStyle = { color: "#18BC9C" };

  static getMainStyle(path: string, folder: string) {
    return path.includes(`/${Paths[folder].id}`) ? this.activeStyle : {};
  }

  static getStyle(path: string, folder: string, name?: string) {
    if (name) {
      return path === `/${Paths[folder].id}/${Paths[folder][name]}` ? this.activeStyle : {};
    }
    return path === `/${Paths[folder].id}` ? this.activeStyle : {};
  }

  static getClass(path: string, folder: string, name?: string) {
    if (name) return path === `/${Paths[folder].id}/${Paths[folder][name]}` ? " active" : "";
    return path === `/${Paths[folder].id}` ? " active" : "";
  }

  static getLink(folder: string, name?: string) {
    if (name) return `/${Paths[folder].id}/${Paths[folder][name]}`;
    return `/${Paths[folder].id}`;
  }
}

const Navbar = ({
  logout,
  auth: { isAuthenticated, loading },
  loadLengths,
  allWordsLen,
  loadUserWordsLen,
  userWordsLen,
  user,
  getMentionsLen,
  mentionsLen,
}) => {
  const router = useRouter();

  const initialPaths = {
    pinyin: "/pinyin",
    hsk: "/hsk-table",
    reading: "/texts",
    login: "/register",
    private: "/dashboard",
    videos: "/videos",
  };
  Object.freeze(initialPaths);

  const [paths, setPaths] = useState(initialPaths);
  const privateas = ["/dashboard", "/hsk-words", "userwords"];
  const [totalWordsLen, setTotalWordsLen] = useState(0);
  const [mentions, setMentions] = useState(mentionsLen > 0);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    if (+localStorage.isDarkTheme) {
      return setIsDarkTheme(true);
    }

    return setIsDarkTheme(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!isAuthenticated) return;
      getMentionsLen();
      setMentions(mentionsLen > 0);
      loadLengths();
      loadUserWordsLen();
      if ((userWordsLen && allWordsLen) || userWordsLen === 0 || allWordsLen === 0)
        setTotalWordsLen(userWordsLen + allWordsLen);
    }, 500);
  }, [isAuthenticated, allWordsLen, userWordsLen, mentionsLen]);

  const navbarId = document.getElementById("navbarId");
  const collapseIt = () => {
    if (navbarId.classList.contains("show")) {
      return navbarId.classList.remove("show");
    }

    navbarId.classList.add("show");
  };

  // for main menu and dropdown
  const setPathsAndCollapse = (obj) => {
    collapseIt();
  };

  const themeButton = (
    <li className='nav-item'>
      <Tippy content={`${isDarkTheme ? "Светл" : "Темн"}ую тему`} placement='bottom'>
        <button className='btn' onClick={changeTheme}>
          {isDarkTheme ? (
            <FontAwesomeIcon icon={faSun} className='text-warning' />
          ) : (
            <FontAwesomeIcon icon={faMoon} className='text-info' />
          )}
        </button>
      </Tippy>
    </li>
  );

  const noAuthas = (
    <ul className='navbar-nav loginNavbar text-center'>
      <li className='nav-item dropdown'>
        <a
          className='nav-link dropdown-toggle'
          data-toggle='dropdown'
          style={PathService.getMainStyle(router.pathname, Paths.auth.id)}
        >
          <FontAwesomeIcon icon={faDoorOpen} /> Вход
        </a>
        <div className='dropdown-menu dropdown-menu-right'>
          <a
            className={`dropdown-item${PathService.getClass(
              router.pathname,
              Paths.auth.id,
              Paths.auth.register
            )}`}
            style={PathService.getStyle(router.pathname, Paths.auth.id, Paths.auth.register)}
            href={PathService.getLink(Paths.auth.id, Paths.auth.register)}
          >
            Регистрация
          </a>
          <a
            className={`dropdown-item${PathService.getClass(
              router.pathname,
              Paths.auth.id,
              Paths.auth.login
            )}`}
            style={PathService.getStyle(router.pathname, Paths.auth.id, Paths.auth.login)}
            href={PathService.getLink(Paths.auth.id, Paths.auth.login)}
          >
            Войти
          </a>
        </div>
      </li>
    </ul>
  );

  const authas = (
    <ul className='navbar-nav loginNavbar text-center'>
      <li className='nav-item dropdown'>
        <a className='nav-link dropdown-toggle my-auto' data-toggle='dropdown' href={paths.private}>
          {user && (
            <div style={{ display: "inline", position: "relative" }}>
              <span className='badge badge-pill badge-warning'>{totalWordsLen}</span>{" "}
              <img className='' src={`https:${user.avatar}`} style={imgStyle} alt='Avatar' />
              {mentions && <div className='mentionsCircle'></div>}
            </div>
          )}
        </a>
        <div className='dropdown-menu dropdown-menu-right'>
          <a className='dropdown-item' href='/dashboard'>
            ЛК
          </a>

          <a className='dropdown-item' href='/hsk-words'>
            Мой HSK{" "}
            <span className='badge badge-pill badge-warning'>
              {allWordsLen} / {users.vocabSize}
            </span>
          </a>

          <a className='dropdown-item' href='/userwords'>
            Мои Слова{" "}
            <span className='badge badge-pill badge-warning'>
              {userWordsLen} / {users.vocabSize}
            </span>
          </a>

          {user && (
            <a className='dropdown-item' href={"/user/" + user._id} onClick={collapseIt}>
              Мои тексты
            </a>
          )}

          <a className='dropdown-item' href='/mentions'>
            Упоминания и ответы {mentions && <div className='mentionsCirclea'></div>}
          </a>

          <a className='dropdown-item font-weight-bold' href='/create-content'>
            Поделиться контентом
          </a>

          <a onClick={logout} className='dropdown-item' href='/#'>
            Выйти <FontAwesomeIcon icon={faSignOutAlt} />
          </a>
        </div>
      </li>
    </ul>
  );

  const pinyinNav = (
    <li className='nav-item dropdown'>
      <a
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        style={PathService.getMainStyle(router.pathname, Paths.start.id)}
      >
        Начинающим
      </a>

      <div className='dropdown-menu'>
        <a
          className={`dropdown-item${PathService.getClass(router.pathname, Paths.start.id)}`}
          style={PathService.getStyle(router.pathname, Paths.start.id)}
          href={PathService.getLink(Paths.start.id)}
        >
          С чего начать
        </a>
        <a
          className={`dropdown-item${PathService.getClass(
            router.pathname,
            Paths.start.id,
            Paths.start.pinyin
          )}`}
          href={PathService.getLink(Paths.start.id, Paths.start.pinyin)}
          style={PathService.getStyle(router.pathname, Paths.start.id, Paths.start.pinyin)}
        >
          Таблица Пиньиня
        </a>

        <a
          className={`dropdown-item${PathService.getClass(
            router.pathname,
            Paths.start.id,
            Paths.start.pinyin_tests
          )}`}
          href={PathService.getLink(Paths.start.id, Paths.start.pinyin_tests)}
          style={PathService.getStyle(router.pathname, Paths.start.id, Paths.start.pinyin_tests)}
        >
          Тесты на пиньинь
        </a>

        <a
          className={`dropdown-item${PathService.getClass(
            router.pathname,
            Paths.start.id,
            Paths.start.radicals
          )}`}
          href={PathService.getLink(Paths.start.id, Paths.start.radicals)}
          style={PathService.getStyle(router.pathname, Paths.start.id, Paths.start.radicals)}
        >
          Ключи иероглифов
        </a>
      </div>
    </li>
  );

  const readingNav = (
    <li className='nav-item dropdown'>
      <a
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        href={paths.reading}
        style={router.pathname.includes(paths.reading) ? activeNav : {}}
      >
        Читалка
      </a>

      <div className='dropdown-menu'>
        <a
          className={`dropdown-item${router.pathname == "/texts" ? " active" : ""}`}
          href='/texts'
          style={router.pathname == "/texts" ? activeNav : {}}
        >
          Тексты
        </a>
        <a
          className={`dropdown-item${router.pathname == "/books" ? " active" : ""}`}
          href='/books'
          style={router.pathname == "/books" ? activeNav : {}}
        >
          Книги
        </a>
        <a
          className={`dropdown-item${router.pathname == "/not_approved_texts" ? " active" : ""}`}
          href='/not_approved_texts'
          style={router.pathname == "/not_approved_texts" ? activeNav : {}}
        >
          На проверке
        </a>
        <div className='dropdown-divider'></div>
        <a
          className={`dropdown-item${router.pathname == "/statistics" ? " active" : ""}`}
          href='/statistics'
          style={router.pathname == "/statistics" ? activeNav : {}}
        >
          Герои Клуба
        </a>
      </div>
    </li>
  );

  const videosNav = (
    <li className='nav-item dropdown'>
      <a className='nav-link dropdown-toggle' data-toggle='dropdown' href={paths.videos}>
        Видео
      </a>

      <div className='dropdown-menu'>
        <a className='dropdown-item' href='/videos'>
          Видео
        </a>
        <a className='dropdown-item' href='/not_approved_videos'>
          На проверке
        </a>
      </div>
    </li>
  );

  const hskNav = (
    <li className='nav-item dropdown'>
      <a className='nav-link dropdown-toggle' data-toggle='dropdown' href={paths.hsk}>
        HSK
      </a>

      <div className='dropdown-menu'>
        <em>
          <small className='nav-link disabled text-info pl-4'>HSK 2.0</small>
        </em>
        <a className='dropdown-item' href='/hsk-table'>
          Все слова
        </a>
        <a className='dropdown-item' href='/hsk-tests'>
          Тесты
        </a>
        <a className='dropdown-item' href='/hsk-search'>
          Поиск
        </a>

        <div className='dropdown-divider'></div>
        <em>
          <small className='nav-link disabled pl-4 text-info'>HSK 3.0</small>
        </em>
        <a className='dropdown-item' href='/hsk-new-table'>
          Все слова
        </a>
        <a className='dropdown-item' href='/hsk-new-tests'>
          Тесты
        </a>
        <a className='dropdown-item' href='/hsk-new-search'>
          Поиск
        </a>
      </div>
    </li>
  );

  const feedbackNav = (
    <li className='nav-item dropdown'>
      <a className='nav-link dropdown-toggle' data-toggle='dropdown' href='/donate'>
        <FontAwesomeIcon icon={faComment} /> Фидбэк
      </a>

      <div className='dropdown-menu'>
        <a onClick={collapseIt} className='dropdown-item' href='/posts'>
          Гостевая
        </a>
        <a className='dropdown-item' href='/donate'>
          <FontAwesomeIcon icon={faDonate} /> Донат
        </a>
      </div>
    </li>
  );

  const translationNav = (
    <li className='nav-item dropdown'>
      <a className='nav-link dropdown-toggle' data-toggle='dropdown' href='/search'>
        Словарь
      </a>

      <div className='dropdown-menu'>
        <a onClick={collapseIt} className='dropdown-item' href='/search'>
          Словарь
        </a>
        <a onClick={collapseIt} className='dropdown-item' href='/translate'>
          Pop-up перевод
        </a>
      </div>
    </li>
  );

  const mainMenu = (
    <Fragment>
      <ul className='navbar-nav text-center mr-auto'>
        {pinyinNav}
        {readingNav}
        {videosNav}
        {hskNav}
        {translationNav}
        {feedbackNav}
        {themeButton}
      </ul>

      {isAuthenticated && authas}

      {!isAuthenticated && noAuthas}
    </Fragment>
  );

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary' id='topNavbar'>
      <a className='navbar-brand' href='/' onClick={collapseIt}>
        <FontAwesomeIcon icon={faYinYang} /> Chinese+Club{" "}
        <span style={{ fontSize: "50%" }}>{appVersion}</span>
      </a>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarId'
        aria-controls='navbarId'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>

      <div className='collapse navbar-collapse' id='navbarId'>
        {!loading && <Fragment>{mainMenu}</Fragment>}
      </div>
    </nav>
  );
};

const imgStyle = {
  width: "3.5vh",
  borderRadius: "50%",
  border: "1px solid #18BC9C",
  marginLeft: "0.3rem",
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.auth.user,
  allWordsLen: state.hskTable.allWordsLen,
  userWordsLen: state.userwords.userWordsLen,
  mentionsLen: state.comments.mentionsLen,
});

export default connect(mapStateToProps, { logout, loadLengths, loadUserWordsLen, getMentionsLen })(
  Navbar
);
