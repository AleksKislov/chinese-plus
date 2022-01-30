import React, { Fragment, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { loadLengths } from "../../actions/hskTable";
import { loadUserWordsLen } from "../../actions/userWords";
import { appVersion } from "../../constants/consts.json";
import { getMentionsLen } from "../../actions/comments";

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
  const [paths, setPaths] = useState({
    pinyin: "/pinyin",
    hsk: "/hsk-table",
    reading: "/texts",
    login: "/register",
    private: "/dashboard",
  });
  const privateLinks = ["/dashboard", "/hsk-words", "userwords"];
  const [totalWordsLen, setTotalWordsLen] = useState(0);
  const [mentions, setMentions] = useState(mentionsLen > 0);

  useEffect(() => {
    const url = window.location.pathname;
    if (url.includes("/books") || url.includes("/texts")) {
      setPaths({
        hsk: "/hsk-table",
        pinyin: "/pinyin",
        reading: url,
        login: "/register",
        private: "/dashboard",
      });
    } else if (url.includes("/pinyin")) {
      setPaths({
        hsk: "/hsk-table",
        pinyin: url,
        reading: "/texts",
        login: "/register",
        private: "/dashboard",
      });
    } else if (url.includes("/hsk")) {
      setPaths({
        hsk: url,
        pinyin: "/pinyin",
        reading: "/texts",
        login: "/register",
        private: "/dashboard",
      });
    } else if (url === "/register" || url === "/login") {
      setPaths({
        hsk: "/hsk-table",
        pinyin: "/pinyin",
        reading: "/texts",
        login: url,
        private: "/dashboard",
      });
    } else if (privateLinks.includes(url)) {
      setPaths({
        hsk: "/hsk-table",
        pinyin: "/pinyin",
        reading: "/texts",
        login: "/register",
        private: url,
      });
    }
    // eslint-disable-next-line
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

  const noAuthLinks = (
    <ul className='navbar-nav loginNavbar text-center'>
      <li className='nav-item dropdown'>
        <NavLink
          className='nav-link dropdown-toggle'
          data-toggle='dropdown'
          to={paths.login}
          activeStyle={activeNavLink}
        >
          <i className='fas fa-door-open'></i> Вход
        </NavLink>
        <div className='dropdown-menu dropdown-menu-right'>
          <NavLink
            className='dropdown-item'
            to='/register'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, login: "/register" })}
            exact={true}
          >
            Регистрация
          </NavLink>
          <NavLink
            className='dropdown-item'
            to='/login'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, login: "/login" })}
            exact={true}
          >
            Войти
          </NavLink>
        </div>
      </li>
    </ul>
  );

  const authLinks = (
    <ul className='navbar-nav loginNavbar text-center'>
      <li className='nav-item dropdown'>
        <NavLink
          className='nav-link dropdown-toggle my-auto'
          data-toggle='dropdown'
          to={paths.private}
          activeStyle={activeNavLink}
        >
          {user && (
            <div style={{ display: "inline", position: "relative" }}>
              <span className='badge badge-pill badge-warning'>{totalWordsLen}</span>{" "}
              <img className='' src={`https:${user.avatar}`} style={imgStyle} alt='Avatar' />
              {mentions && <div className='mentionsCircle'></div>}
            </div>
          )}
        </NavLink>
        <div className='dropdown-menu dropdown-menu-right'>
          <NavLink
            className='dropdown-item'
            to='/dashboard'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, private: "/dashboard" })}
          >
            ЛК
          </NavLink>

          <NavLink
            className='dropdown-item'
            to='/hsk-words'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, private: "/hsk-words" })}
          >
            Мой HSK <span className='badge badge-pill badge-warning'>{allWordsLen}</span>
          </NavLink>

          <NavLink
            className='dropdown-item'
            to='/userwords'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, private: "/userwords" })}
          >
            Мои Слова <span className='badge badge-pill badge-warning'>{userWordsLen}</span>
          </NavLink>

          {user && (
            <NavLink
              className='dropdown-item'
              to={"/user/" + user._id}
              activeStyle={activeNavLink}
              onClick={collapseIt}
            >
              Мои тексты
            </NavLink>
          )}

          <NavLink className='dropdown-item' to='/mentions' exact={true}>
            Упоминания и ответы {mentions && <div className='mentionsCircleLink'></div>}
          </NavLink>

          <NavLink className='dropdown-item font-weight-bold' to='/create-text' exact={true}>
            Поделиться текстом
          </NavLink>

          <NavLink onClick={logout} className='dropdown-item' to='/#' exact={true}>
            Выйти <i className='fas fa-sign-out-alt'></i>
          </NavLink>
        </div>
      </li>
    </ul>
  );

  const pinyinNav = (
    <li className='nav-item dropdown'>
      <NavLink
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        to={paths.pinyin}
        activeStyle={activeNavLink}
      >
        Пиньинь
      </NavLink>

      <div className='dropdown-menu'>
        <NavLink
          className='dropdown-item'
          to='/pinyin'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, pinyin: "/pinyin" })}
        >
          Таблица
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/pinyin-tests'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, pinyin: "/pinyin-tests" })}
        >
          Тесты
        </NavLink>
      </div>
    </li>
  );

  const readingNav = (
    <li className='nav-item dropdown'>
      <NavLink
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        to={paths.reading}
        activeStyle={activeNavLink}
      >
        Читалка
      </NavLink>

      <div className='dropdown-menu'>
        <NavLink
          className='dropdown-item'
          to='/texts'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/texts" })}
        >
          Тексты
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/books'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/books" })}
        >
          Книги
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/not_approved_texts'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/not_approved_texts" })}
        >
          На проверке
        </NavLink>
        <div className='dropdown-divider'></div>
        <NavLink
          className='dropdown-item'
          to='/statistics'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/statistics" })}
        >
          Герои Клуба
        </NavLink>
      </div>
    </li>
  );

  const hskNav = (
    <li className='nav-item dropdown'>
      <NavLink
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        to={paths.hsk}
        activeStyle={activeNavLink}
      >
        HSK
      </NavLink>

      <div className='dropdown-menu'>
        <em>
          <small className='nav-link disabled text-info pl-4'>HSK 2.0</small>
        </em>
        <NavLink
          className='dropdown-item'
          to='/hsk-table'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-table" })}
        >
          Все слова
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/hsk-tests'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-tests" })}
        >
          Тесты
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/hsk-search'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-search" })}
        >
          Поиск
        </NavLink>

        <div className='dropdown-divider'></div>
        <em>
          <small className='nav-link disabled pl-4 text-info'>HSK 3.0</small>
        </em>
        <NavLink
          className='dropdown-item'
          to='/hsk-new-search'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-new-search" })}
        >
          Поиск
        </NavLink>
      </div>
    </li>
  );

  const feedbackNav = (
    <li className='nav-item dropdown'>
      <NavLink
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        to='/donate'
        activeStyle={activeNavLink}
      >
        <i className='far fa-comment-alt'></i> Фидбэк
      </NavLink>

      <div className='dropdown-menu'>
        <NavLink
          onClick={collapseIt}
          className='dropdown-item'
          to='/posts'
          activeStyle={activeNavLink}
        >
          Гостевая
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/donate'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, donate: "/donate" })}
        >
          🙏🏻 Донат
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/kanban'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, donate: "/kanban" })}
        >
          Канбан
        </NavLink>
      </div>
    </li>
  );

  const translationNav = (
    <li className='nav-item dropdown'>
      <NavLink
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        to='/search'
        activeStyle={activeNavLink}
      >
        Словарь
      </NavLink>

      <div className='dropdown-menu'>
        <NavLink
          onClick={collapseIt}
          className='dropdown-item'
          to='/search'
          activeStyle={activeNavLink}
        >
          Словарь
        </NavLink>
        <NavLink
          onClick={collapseIt}
          className='dropdown-item'
          to='/translate'
          activeStyle={activeNavLink}
        >
          Pop-up перевод
        </NavLink>
      </div>
    </li>
  );

  const mainMenu = (
    <Fragment>
      <ul className='navbar-nav text-center mr-auto'>
        {readingNav}
        {pinyinNav}
        {hskNav}
        {translationNav}
        {feedbackNav}
      </ul>

      {isAuthenticated && authLinks}

      {!isAuthenticated && noAuthLinks}
    </Fragment>
  );

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary' id='topNavbar'>
      <NavLink className='navbar-brand' to='/' onClick={collapseIt}>
        <i className='fas fa-yin-yang'></i> Chinese+Club{" "}
        <span style={{ fontSize: "50%" }}>{appVersion}</span>
      </NavLink>
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
