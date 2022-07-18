// import Link from "next/Link";
import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import { loadLengths } from "../../actions/hskTable";
import { loadUserWordsLen } from "../../actions/userWords";
import { getMentionsLen } from "../../actions/comments";
import Tippy from "@tippyjs/react";
import { useRouter } from "next/router";

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
    } else if (privateas.includes(url)) {
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

  const noAuthas = (
    <ul className='navbar-nav loginNavbar text-center'>
      <li className='nav-item dropdown'>
        <a
          className='nav-link dropdown-toggle'
          data-toggle='dropdown'
          href={paths.login}
          activeClassName='activeNavLink'
        >
          <i className='fas fa-door-open'></i> Вход
        </a>
        <div className='dropdown-menu dropdown-menu-right'>
          <a
            className='dropdown-item'
            href='/register'
            activeClassName='activeNavLink'
            onClick={() => setPathsAndCollapse({ ...paths, login: "/register" })}
            exact={true}
          >
            Регистрация
          </a>
          <a
            className='dropdown-item'
            href='/login'
            activeClassName='activeNavLink'
            onClick={() => setPathsAndCollapse({ ...paths, login: "/login" })}
            exact={true}
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
        <a
          className='nav-link dropdown-toggle my-auto'
          data-toggle='dropdown'
          href={paths.private}
          activeClassName='activeNavLink'
        >
          {user && (
            <div style={{ display: "inline", position: "relative" }}>
              <span className='badge badge-pill badge-warning'>{totalWordsLen}</span>{" "}
              <img className='' src={`https:${user.avatar}`} style={imgStyle} alt='Avatar' />
              {mentions && <div className='mentionsCircle'></div>}
            </div>
          )}
        </a>
        <div className='dropdown-menu dropdown-menu-right'>
          <a
            className='dropdown-item'
            href='/dashboard'
            activeClassName='activeNavLink'
            onClick={() => setPathsAndCollapse({ ...paths, private: "/dashboard" })}
          >
            ЛК
          </a>

          <a
            className='dropdown-item'
            href='/hsk-words'
            activeClassName='activeNavLink'
            onClick={() => setPathsAndCollapse({ ...paths, private: "/hsk-words" })}
          >
            Мой HSK{" "}
            <span className='badge badge-pill badge-warning'>
              {allWordsLen} / {users.vocabSize}
            </span>
          </a>

          <a
            className='dropdown-item'
            href='/userwords'
            activeClassName='activeNavLink'
            onClick={() => setPathsAndCollapse({ ...paths, private: "/userwords" })}
          >
            Мои Слова{" "}
            <span className='badge badge-pill badge-warning'>
              {userWordsLen} / {users.vocabSize}
            </span>
          </a>

          {user && (
            <a
              className='dropdown-item'
              href={"/user/" + user._id}
              activeClassName='activeNavLink'
              onClick={collapseIt}
            >
              Мои тексты
            </a>
          )}

          <a className='dropdown-item' href='/mentions' exact={true}>
            Упоминания и ответы {mentions && <div className='mentionsCirclea'></div>}
          </a>

          <a className='dropdown-item font-weight-bold' href='/create-content' exact={true}>
            Поделиться контентом
          </a>

          <a onClick={logout} className='dropdown-item' href='/#' exact={true}>
            Выйти <i className='fas fa-sign-out-alt'></i>
          </a>
        </div>
      </li>
    </ul>
  );

  const pinyinNav = (
    <li className='nav-item dropdown'>
      <a className='nav-link dropdown-toggle' data-toggle='dropdown' href={paths.pinyin}>
        Пиньинь
      </a>

      <div className='dropdown-menu'>
        <a
          className={`dropdown-item${router.pathname == "/pinyin" ? " active" : ""}`}
          onClick={() => {
            setPathsAndCollapse({ ...paths, pinyin: "/pinyin" });
          }}
        >
          Таблица
        </a>

        <a
          className='dropdown-item'
          href='/pinyin-tests'
          onClick={() => setPathsAndCollapse({ ...paths, pinyin: "/pinyin-tests" })}
        >
          Тесты
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
        activeClassName='activeNavLink'
      >
        Читалка
      </a>

      <div className='dropdown-menu'>
        <a
          className='dropdown-item'
          href='/texts'
          activeClassName='activeNavLink'
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/texts" })}
        >
          Тексты
        </a>
        <a
          className='dropdown-item'
          href='/books'
          activeClassName='activeNavLink'
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/books" })}
        >
          Книги
        </a>
        <a
          className='dropdown-item'
          href='/not_approved_texts'
          activeClassName='activeNavLink'
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/not_approved_texts" })}
        >
          На проверке
        </a>
        <div className='dropdown-divider'></div>
        <a
          className='dropdown-item'
          href='/statistics'
          activeClassName='activeNavLink'
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/statistics" })}
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
        <a
          className='dropdown-item'
          href='/videos'
          onClick={() => setPathsAndCollapse({ ...paths, videos: "/videos" })}
        >
          Видео
        </a>
        <a
          className='dropdown-item'
          href='/not_approved_videos'
          onClick={() => setPathsAndCollapse({ ...paths, videos: "/not_approved_videos" })}
        >
          На проверке
        </a>
      </div>
    </li>
  );

  const hskNav = (
    <li className='nav-item dropdown'>
      <a
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        href={paths.hsk}
        activeClassName='activeNavLink'
      >
        HSK
      </a>

      <div className='dropdown-menu'>
        <em>
          <small className='nav-link disabled text-info pl-4'>HSK 2.0</small>
        </em>
        <a
          className='dropdown-item'
          href='/hsk-table'
          activeClassName='activeNavLink'
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-table" })}
        >
          Все слова
        </a>
        <a
          className='dropdown-item'
          href='/hsk-tests'
          activeClassName='activeNavLink'
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-tests" })}
        >
          Тесты
        </a>
        <a
          className='dropdown-item'
          href='/hsk-search'
          activeClassName='activeNavLink'
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-search" })}
        >
          Поиск
        </a>

        <div className='dropdown-divider'></div>
        <em>
          <small className='nav-link disabled pl-4 text-info'>HSK 3.0</small>
        </em>
        <a
          className='dropdown-item'
          href='/hsk-new-table'
          activeClassName='activeNavLink'
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-new-table" })}
        >
          Все слова
        </a>
        <a
          className='dropdown-item'
          href='/hsk-new-tests'
          activeClassName='activeNavLink'
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-new-tests" })}
        >
          Тесты
        </a>
        <a
          className='dropdown-item'
          href='/hsk-new-search'
          activeClassName='activeNavLink'
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-new-search" })}
        >
          Поиск
        </a>
      </div>
    </li>
  );

  const feedbackNav = (
    <li className='nav-item dropdown'>
      <a
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        href='/donate'
        activeClassName='activeNavLink'
      >
        <i className='far fa-comment-alt'></i> Фидбэк
      </a>

      <div className='dropdown-menu'>
        <a
          onClick={collapseIt}
          className='dropdown-item'
          href='/posts'
          activeClassName='activeNavLink'
        >
          Гостевая
        </a>
        <a
          className='dropdown-item'
          href='/donate'
          activeClassName='activeNavLink'
          onClick={() => setPathsAndCollapse({ ...paths, donate: "/donate" })}
        >
          🙏🏻 Донат
        </a>
        {
          // <a
          //   className='dropdown-item'
          //   href='/kanban'
          //   activeClassName ='activeNavLink'
          //   onClick={() => setPathsAndCollapse({ ...paths, donate: "/kanban" })}
          // >
          //   Канбан
          // </a>
        }
      </div>
    </li>
  );

  const translationNav = (
    <li className='nav-item dropdown'>
      <a
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        href='/search'
        activeClassName='activeNavLink'
      >
        Словарь
      </a>

      <div className='dropdown-menu'>
        <a
          onClick={collapseIt}
          className='dropdown-item'
          href='/search'
          activeClassName='activeNavLink'
        >
          Словарь
        </a>
        <a
          onClick={collapseIt}
          className='dropdown-item'
          href='/translate'
          activeClassName='activeNavLink'
        >
          Pop-up перевод
        </a>
      </div>
    </li>
  );

  const mainMenu = (
    <Fragment>
      <ul className='navbar-nav text-center mr-auto'>
        {/* {readingNav} */}
        {videosNav}
        {pinyinNav}
        {/* {hskNav}
        {translationNav}
        {feedbackNav}
        {themeButton} */}
      </ul>

      {isAuthenticated && authas}

      {!isAuthenticated && noAuthas}
    </Fragment>
  );

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary' id='topNavbar'>
      <a className='navbar-brand' href='/' onClick={collapseIt}>
        <i className='fas fa-yin-yang'></i> Chinese+Club{" "}
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

// const activeNavLink = {
//   color: "#18BC9C",
// };

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
