import Link from "next/link";
// import { useUser } from "../lib/hooks";

import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { loadLengths } from "../../actions/hskTable";
import { loadUserWordsLen } from "../../actions/userWords";
import { appVersion } from "../../constants/consts";
import { getMentionsLen } from "../../actions/comments";
import { users } from "../../constants/consts";
import Tippy from "@tippyjs/react";

const changeTheme = () => {
  if (+localStorage.isDarkTheme) {
    localStorage.isDarkTheme = 0;
  } else {
    localStorage.isDarkTheme = 1;
  }
  window.location.reload();
};

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
  const privateLinks = ["/dashboard", "/hsk-words", "userwords"];
  const [totalWordsLen, setTotalWordsLen] = useState(0);
  const [mentions, setMentions] = useState(mentionsLen > 0);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    const url = window.location.pathname;
    if (url.includes("/books") || url.includes("/texts")) {
      setPaths({
        ...initialPaths,
        reading: url,
      });
    } else if (url.includes("/videos")) {
      setPaths({
        ...initialPaths,
        videos: url,
      });
    } else if (url.includes("/pinyin")) {
      setPaths({
        ...initialPaths,
        pinyin: url,
      });
    } else if (url.includes("/hsk")) {
      setPaths({
        ...initialPaths,
        hsk: url,
      });
    } else if (url === "/register" || url === "/login") {
      setPaths({
        ...initialPaths,
        login: url,
      });
    } else if (privateLinks.includes(url)) {
      setPaths({
        ...initialPaths,
        private: url,
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (+localStorage.isDarkTheme) {
      return setIsDarkTheme(true);
    }

    return setIsDarkTheme(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (isAuthenticated) {
        getMentionsLen();
        setMentions(mentionsLen > 0);
        // console.log(mentionsLen);
        loadLengths();
        loadUserWordsLen();
        if ((userWordsLen && allWordsLen) || userWordsLen === 0 || allWordsLen === 0)
          setTotalWordsLen(userWordsLen + allWordsLen);
      }
    }, 500);
  }, [isAuthenticated, allWordsLen, userWordsLen, mentionsLen]);

  const navbarId = document.getElementById("navbarId");
  const collapseIt = () => {
    if (navbarId.classList.contains("show")) {
      navbarId.classList.remove("show");
    } else {
      navbarId.classList.add("show");
    }
  };

  // for main menu and dropdown
  const setPathsAndCollapse = (obj) => {
    collapseIt();
    setPaths(obj);
  };

  const themeButton = (
    <li className='nav-item'>
      <Tippy content={`${isDarkTheme ? "Светл" : "Темн"}ую тему`} placement='bottom'>
        <button className='btn' onClick={changeTheme}>
          {isDarkTheme ? (
            <i className='fa-solid fa-sun text-warning'></i>
          ) : (
            <i className='fa-solid fa-moon text-info'></i>
          )}
        </button>
      </Tippy>
    </li>
  );

  const noAuthLinks = (
    <ul className='navbar-nav loginNavbar text-center'>
      <li className='nav-item dropdown'>
        <Link
          className='nav-link dropdown-toggle'
          data-toggle='dropdown'
          href={paths.login}
          activeStyle={activeNavLink}
        >
          <i className='fas fa-door-open'></i> Вход
        </Link>
        <div className='dropdown-menu dropdown-menu-right'>
          <Link
            className='dropdown-item'
            href='/register'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, login: "/register" })}
            exact={true}
          >
            Регистрация
          </Link>
          <Link
            className='dropdown-item'
            href='/login'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, login: "/login" })}
            exact={true}
          >
            Войти
          </Link>
        </div>
      </li>
    </ul>
  );

  const authLinks = (
    <ul className='navbar-nav loginNavbar text-center'>
      <li className='nav-item dropdown'>
        <Link
          className='nav-link dropdown-toggle my-auto'
          data-toggle='dropdown'
          href={paths.private}
          activeStyle={activeNavLink}
        >
          {user && (
            <div style={{ display: "inline", position: "relative" }}>
              <span className='badge badge-pill badge-warning'>{totalWordsLen}</span>{" "}
              <img className='' src={`https:${user.avatar}`} style={imgStyle} alt='Avatar' />
              {mentions && <div className='mentionsCircle'></div>}
            </div>
          )}
        </Link>
        <div className='dropdown-menu dropdown-menu-right'>
          <Link
            className='dropdown-item'
            href='/dashboard'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, private: "/dashboard" })}
          >
            ЛК
          </Link>

          <Link
            className='dropdown-item'
            href='/hsk-words'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, private: "/hsk-words" })}
          >
            Мой HSK{" "}
            <span className='badge badge-pill badge-warning'>
              {allWordsLen} / {users.vocabSize}
            </span>
          </Link>

          <Link
            className='dropdown-item'
            href='/userwords'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, private: "/userwords" })}
          >
            Мои Слова{" "}
            <span className='badge badge-pill badge-warning'>
              {userWordsLen} / {users.vocabSize}
            </span>
          </Link>

          {user && (
            <Link
              className='dropdown-item'
              href={"/user/" + user._id}
              activeStyle={activeNavLink}
              onClick={collapseIt}
            >
              Мои тексты
            </Link>
          )}

          <Link className='dropdown-item' href='/mentions' exact={true}>
            Упоминания и ответы {mentions && <div className='mentionsCircleLink'></div>}
          </Link>

          <Link className='dropdown-item font-weight-bold' href='/create-content' exact={true}>
            Поделиться контентом
          </Link>

          <Link onClick={logout} className='dropdown-item' href='/#' exact={true}>
            Выйти <i className='fas fa-sign-out-alt'></i>
          </Link>
        </div>
      </li>
    </ul>
  );

  const pinyinNav = (
    <li className='nav-item dropdown'>
      <Link
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        href={paths.pinyin}
        activeStyle={activeNavLink}
      >
        Пиньинь
      </Link>

      <div className='dropdown-menu'>
        <Link
          className='dropdown-item'
          href='/pinyin'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, pinyin: "/pinyin" })}
        >
          Таблица
        </Link>
        <Link
          className='dropdown-item'
          href='/pinyin-tests'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, pinyin: "/pinyin-tests" })}
        >
          Тесты
        </Link>
      </div>
    </li>
  );

  const readingNav = (
    <li className='nav-item dropdown'>
      <Link
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        href={paths.reading}
        activeStyle={activeNavLink}
      >
        Читалка
      </Link>

      <div className='dropdown-menu'>
        <Link
          className='dropdown-item'
          href='/texts'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/texts" })}
        >
          Тексты
        </Link>
        <Link
          className='dropdown-item'
          href='/books'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/books" })}
        >
          Книги
        </Link>
        <Link
          className='dropdown-item'
          href='/not_approved_texts'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/not_approved_texts" })}
        >
          На проверке
        </Link>
        <div className='dropdown-divider'></div>
        <Link
          className='dropdown-item'
          href='/statistics'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/statistics" })}
        >
          Герои Клуба
        </Link>
      </div>
    </li>
  );

  const videosNav = (
    <li className='nav-item dropdown'>
      <Link
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        href={paths.videos}
        activeStyle={activeNavLink}
      >
        Видео
      </Link>

      <div className='dropdown-menu'>
        <Link
          className='dropdown-item'
          href='/videos'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, videos: "/videos" })}
        >
          Видео
        </Link>
        <Link
          className='dropdown-item'
          href='/not_approved_videos'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, videos: "/not_approved_videos" })}
        >
          На проверке
        </Link>
      </div>
    </li>
  );

  const hskNav = (
    <li className='nav-item dropdown'>
      <Link
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        href={paths.hsk}
        activeStyle={activeNavLink}
      >
        HSK
      </Link>

      <div className='dropdown-menu'>
        <em>
          <small className='nav-link disabled text-info pl-4'>HSK 2.0</small>
        </em>
        <Link
          className='dropdown-item'
          href='/hsk-table'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-table" })}
        >
          Все слова
        </Link>
        <Link
          className='dropdown-item'
          href='/hsk-tests'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-tests" })}
        >
          Тесты
        </Link>
        <Link
          className='dropdown-item'
          href='/hsk-search'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-search" })}
        >
          Поиск
        </Link>

        <div className='dropdown-divider'></div>
        <em>
          <small className='nav-link disabled pl-4 text-info'>HSK 3.0</small>
        </em>
        <Link
          className='dropdown-item'
          href='/hsk-new-table'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-new-table" })}
        >
          Все слова
        </Link>
        <Link
          className='dropdown-item'
          href='/hsk-new-tests'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-new-tests" })}
        >
          Тесты
        </Link>
        <Link
          className='dropdown-item'
          href='/hsk-new-search'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-new-search" })}
        >
          Поиск
        </Link>
      </div>
    </li>
  );

  const feedbackNav = (
    <li className='nav-item dropdown'>
      <Link
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        href='/donate'
        activeStyle={activeNavLink}
      >
        <i className='far fa-comment-alt'></i> Фидбэк
      </Link>

      <div className='dropdown-menu'>
        <Link
          onClick={collapseIt}
          className='dropdown-item'
          href='/posts'
          activeStyle={activeNavLink}
        >
          Гостевая
        </Link>
        <Link
          className='dropdown-item'
          href='/donate'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, donate: "/donate" })}
        >
          🙏🏻 Донат
        </Link>
        {
          // <Link
          //   className='dropdown-item'
          //   href='/kanban'
          //   activeStyle={activeNavLink}
          //   onClick={() => setPathsAndCollapse({ ...paths, donate: "/kanban" })}
          // >
          //   Канбан
          // </Link>
        }
      </div>
    </li>
  );

  const translationNav = (
    <li className='nav-item dropdown'>
      <Link
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        href='/search'
        activeStyle={activeNavLink}
      >
        Словарь
      </Link>

      <div className='dropdown-menu'>
        <Link
          onClick={collapseIt}
          className='dropdown-item'
          href='/search'
          activeStyle={activeNavLink}
        >
          Словарь
        </Link>
        <Link
          onClick={collapseIt}
          className='dropdown-item'
          href='/translate'
          activeStyle={activeNavLink}
        >
          Pop-up перевод
        </Link>
      </div>
    </li>
  );

  const mainMenu = (
    <Fragment>
      <ul className='navbar-nav text-center mr-auto'>
        {readingNav}
        {videosNav}
        {pinyinNav}
        {hskNav}
        {translationNav}
        {feedbackNav}
        {themeButton}
      </ul>

      {isAuthenticated && authLinks}

      {!isAuthenticated && noAuthLinks}
    </Fragment>
  );

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary' id='topNavbar'>
      <Link className='navbar-brand' href='/' onClick={collapseIt}>
        <i className='fas fa-yin-yang'></i> Chinese+Club{" "}
        <span style={{ fontSize: "50%" }}>{appVersion}</span>
      </Link>
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

const activeNavLink = {
  color: "#18BC9C",
};

const imgStyle = {
  width: "3.5vh",
  borderRadius: "50%",
  border: "1px solid #18BC9C",
  marginLeft: "0.3rem",
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
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
