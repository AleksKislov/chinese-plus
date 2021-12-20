import React, { useEffect, Fragment, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { clearText } from "../../actions/texts";
// import { getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import CommentsCard from "./CommentsCard";
// import DashboardActions from "./DashboardActions";
import ReadingCard from "./ReadingCard";
import { Helmet } from "react-helmet";
import Analytics from "./Analytics";
import Tippy from "@tippyjs/react";
import { NullUser, User } from "../../patterns/UserClass";

const Dashboard = ({
  clearText,
  // getCurrentProfile,
  auth: {
    user: userToCheck
    // loading: notLoaded
  },
  // profile: { loading, profile },
  allWordsLen,
  userWordsLen
  // dictStats,
  // getDictStats
}) => {
  const [user, setUser] = useState(new NullUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearText();
    if (userToCheck) {
      setUser(new User(userToCheck));
      setLoading(false);
    }
    // getCurrentProfile();
    // getDictStats();
  }, [userToCheck]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Личный кабинет | Chinese+</title>
      </Helmet>

      <div className='row'>
        <div className='col-sm-6'>
          <h1 className='text-primary'>Личный Кабинет</h1>
          <div className='row'>
            <div className='col-2'>
              <Tippy content='Поменять аватар' placement='bottom'>
                <Link to='/set_avatar'>
                  <img src={user.avatarPic} alt='avatar' style={imgStyle} />
                </Link>
              </Tippy>
            </div>
            <div className='col-10'>
              <p className=''>
                <i className='fas fa-user'></i> Привет, {user.name}
              </p>
              <p className=''>Роль: {user.role}</p>
            </div>
          </div>
        </div>

        <div className='col-sm-6'>
          <ReadingCard />
        </div>

        <div className='col-sm-12'>
          <Analytics />
        </div>
      </div>

      <div className='row'>
        <div className='col-sm-6'>
          <div className='card bg-light mb-3'>
            <div className='card-body'>
              <h4 className='card-title'>Мой HSK</h4>
              <h6 className='card-subtitle mb-2 text-muted'>Личный список слов HSK</h6>
              <p className='card-text'>
                Сейчас для повторения вы отобрали столько слов:{" "}
                <span className='badge badge-pill badge-warning'>{allWordsLen}</span>
              </p>
              <Link to='/hsk-table' className='card-link'>
                Весь HSK
              </Link>
              <Link to='/hsk-words' className='card-link'>
                Мой HSK
              </Link>
            </div>
          </div>

          <div className='card bg-light mb-3'>
            <div className='card-body'>
              <h4 className='card-title'>Мои Слова</h4>
              <h6 className='card-subtitle mb-2 text-muted'>Список слов из текстов</h6>
              <p className='card-text'>
                Сейчас для повторения вы отобрали столько слов:{" "}
                <span className='badge badge-pill badge-warning'>{userWordsLen}</span>
              </p>
              <Link to='/userwords' className='card-link'>
                Мои Слова
              </Link>
            </div>
          </div>
        </div>

        <div className='col-sm-6'>
          <CommentsCard />
        </div>

        {
          // {dictStats.all ? (
          //   <div className='card bg-light mb-3'>
          //     <div className='card-body'>
          //       <h4 className='card-title'>Статистика</h4>
          //       <h6 className='card-subtitle mb-2 text-muted'>словаря БКРС</h6>
          //       <p className='card-text'>
          //         Всего слов:{" "}
          //         <span className='badge badge-pill badge-warning'>
          //           {new Intl.NumberFormat("ru-RU").format(dictStats.all)}
          //         </span>
          //       </p>
          //       <p className='card-text'>
          //         Слов без пиньиня:{" "}
          //         <span className='badge badge-pill badge-warning'>
          //           {new Intl.NumberFormat("ru-RU").format(dictStats.pinyin)}
          //         </span>
          //       </p>
          //       <p className='card-text'>
          //         Слов, где вместо русского перевода указан английский:{" "}
          //         <span className='badge badge-pill badge-warning'>
          //           {new Intl.NumberFormat("ru-RU").format(dictStats.eng)}
          //         </span>
          //       </p>
          //       <p className='card-text'>
          //         Слов, где вместо перевода указана ссылка:{" "}
          //         <span className='badge badge-pill badge-warning'>
          //           {new Intl.NumberFormat("ru-RU").format(dictStats.ref)}
          //         </span>
          //       </p>
          //       <Link to='/search' className='card-link'>
          //         К словарю
          //       </Link>
          //     </div>
          //   </div>
          // ) : (
          //   <Spinner />
          // )}
        }
      </div>
    </Fragment>
  );
};

Dashboard.propTypes = {
  // getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
  // profile: PropTypes.object.isRequired
};

const imgStyle = {
  width: "60px",
  borderRadius: "8px"
};

const mapStateToProps = state => ({
  auth: state.auth,
  // profile: state.profile,
  allWordsLen: state.hskTable.allWordsLen,
  userWordsLen: state.userwords.userWordsLen
  // dictStats: state.profile.dictStats
});

export default connect(mapStateToProps, { clearText })(Dashboard);
