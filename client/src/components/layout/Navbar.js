import React, { Fragment, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { loadLengths } from "../../actions/hskTable";
import { loadUserWordsLen } from "../../actions/userWords";
import { appVersion } from "../../constants/consts.json";
import { getMentionsLen } from "../../actions/comments";
import { users } from "../../constants/consts.json";
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
      <Tippy content={`${isDarkTheme ? "??????????" : "????????"}???? ????????`} placement='bottom'>
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
        <NavLink
          className='nav-link dropdown-toggle'
          data-toggle='dropdown'
          to={paths.login}
          activeStyle={activeNavLink}
        >
          <i className='fas fa-door-open'></i> ????????
        </NavLink>
        <div className='dropdown-menu dropdown-menu-right'>
          <NavLink
            className='dropdown-item'
            to='/register'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, login: "/register" })}
            exact={true}
          >
            ??????????????????????
          </NavLink>
          <NavLink
            className='dropdown-item'
            to='/login'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, login: "/login" })}
            exact={true}
          >
            ??????????
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
            ????
          </NavLink>

          <NavLink
            className='dropdown-item'
            to='/hsk-words'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, private: "/hsk-words" })}
          >
            ?????? HSK{" "}
            <span className='badge badge-pill badge-warning'>
              {allWordsLen} / {users.vocabSize}
            </span>
          </NavLink>

          <NavLink
            className='dropdown-item'
            to='/userwords'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, private: "/userwords" })}
          >
            ?????? ??????????{" "}
            <span className='badge badge-pill badge-warning'>
              {userWordsLen} / {users.vocabSize}
            </span>
          </NavLink>

          {user && (
            <NavLink
              className='dropdown-item'
              to={"/user/" + user._id}
              activeStyle={activeNavLink}
              onClick={collapseIt}
            >
              ?????? ????????????
            </NavLink>
          )}

          <NavLink className='dropdown-item' to='/mentions' exact={true}>
            ???????????????????? ?? ???????????? {mentions && <div className='mentionsCircleLink'></div>}
          </NavLink>

          <NavLink className='dropdown-item font-weight-bold' to='/create-content' exact={true}>
            ???????????????????? ??????????????????
          </NavLink>

          <NavLink onClick={logout} className='dropdown-item' to='/#' exact={true}>
            ?????????? <i className='fas fa-sign-out-alt'></i>
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
        ??????????????
      </NavLink>

      <div className='dropdown-menu'>
        <NavLink
          className='dropdown-item'
          to='/pinyin'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, pinyin: "/pinyin" })}
        >
          ??????????????
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/pinyin-tests'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, pinyin: "/pinyin-tests" })}
        >
          ??????????
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
        ??????????????
      </NavLink>

      <div className='dropdown-menu'>
        <NavLink
          className='dropdown-item'
          to='/texts'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/texts" })}
        >
          ????????????
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/books'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/books" })}
        >
          ??????????
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/not_approved_texts'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/not_approved_texts" })}
        >
          ???? ????????????????
        </NavLink>
        <div className='dropdown-divider'></div>
        <NavLink
          className='dropdown-item'
          to='/statistics'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, reading: "/statistics" })}
        >
          ?????????? ??????????
        </NavLink>
      </div>
    </li>
  );

  const videosNav = (
    <li className='nav-item dropdown'>
      <NavLink
        className='nav-link dropdown-toggle'
        data-toggle='dropdown'
        to={paths.videos}
        activeStyle={activeNavLink}
      >
        ??????????
      </NavLink>

      <div className='dropdown-menu'>
        <NavLink
          className='dropdown-item'
          to='/videos'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, videos: "/videos" })}
        >
          ??????????
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/not_approved_videos'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, videos: "/not_approved_videos" })}
        >
          ???? ????????????????
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
          ?????? ??????????
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/hsk-tests'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-tests" })}
        >
          ??????????
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/hsk-search'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-search" })}
        >
          ??????????
        </NavLink>

        <div className='dropdown-divider'></div>
        <em>
          <small className='nav-link disabled pl-4 text-info'>HSK 3.0</small>
        </em>
        <NavLink
          className='dropdown-item'
          to='/hsk-new-table'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-new-table" })}
        >
          ?????? ??????????
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/hsk-new-tests'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-new-tests" })}
        >
          ??????????
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/hsk-new-search'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, hsk: "/hsk-new-search" })}
        >
          ??????????
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
        <i className='far fa-comment-alt'></i> ????????????
      </NavLink>

      <div className='dropdown-menu'>
        <NavLink
          onClick={collapseIt}
          className='dropdown-item'
          to='/posts'
          activeStyle={activeNavLink}
        >
          ????????????????
        </NavLink>
        <NavLink
          className='dropdown-item'
          to='/donate'
          activeStyle={activeNavLink}
          onClick={() => setPathsAndCollapse({ ...paths, donate: "/donate" })}
        >
          ???????? ??????????
        </NavLink>
        {
          // <NavLink
          //   className='dropdown-item'
          //   to='/kanban'
          //   activeStyle={activeNavLink}
          //   onClick={() => setPathsAndCollapse({ ...paths, donate: "/kanban" })}
          // >
          //   ????????????
          // </NavLink>
        }
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
        ??????????????
      </NavLink>

      <div className='dropdown-menu'>
        <NavLink
          onClick={collapseIt}
          className='dropdown-item'
          to='/search'
          activeStyle={activeNavLink}
        >
          ??????????????
        </NavLink>
        <NavLink
          onClick={collapseIt}
          className='dropdown-item'
          to='/translate'
          activeStyle={activeNavLink}
        >
          Pop-up ??????????????
        </NavLink>
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
