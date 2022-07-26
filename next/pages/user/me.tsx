import { useEffect, useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { clearText } from "../../actions/texts";
import Spinner from "../../components/layout/Spinner";
import CommentsCard from "../../components/dashboard/CommentsCard";
import ReadingCard from "../../components/dashboard/ReadingCard";
import Head from "next/head";
import Analytics from "../../components/dashboard/Analytics";
import Tippy from "@tippyjs/react";
import { NullUser, User } from "../../patterns/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import constants from "../../constants/consts";
const { users } = constants;

const Dashboard = ({ clearText, auth: { user: userToCheck }, allWordsLen, userWordsLen }) => {
  const [user, setUser] = useState(new NullUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearText();
    if (userToCheck) {
      setUser(new User(userToCheck));
      setLoading(false);
    }
  }, [userToCheck]);

  const myLoader = ({ src }: { src: string }): string => src;

  return loading ? (
    <Spinner />
  ) : (
    <>
      <Head>
        <meta charSet='utf-8' />
        <title>Личный кабинет | Chinese+</title>
      </Head>

      <div className='row'>
        <div className='col-sm-6'>
          <h1 className=''>Личный Кабинет</h1>
          <div className='row'>
            <div className='col-2'>
              <Tippy content='Поменять аватар' placement='bottom'>
                <a href='/user/set_avatar'>
                  <Image
                    loader={myLoader}
                    src={`https:${user.avatarPic}`}
                    layout='fill'
                    alt='avatar'
                    style={imgStyle}
                  />
                </a>
              </Tippy>
            </div>
            <div className='col-10'>
              <p className=''>
                <FontAwesomeIcon icon={faUser} /> Привет, {user.name}
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
          <div className='card border-primary mb-3'>
            <div className='card-body'>
              <h4 className='card-title'>Мой HSK</h4>
              <h6 className='card-subtitle mb-2 text-muted'>Личный список слов HSK</h6>
              <p className='card-text'>
                Сейчас для повторения вы отобрали столько слов:{" "}
                <span className='badge badge-pill badge-warning'>
                  {allWordsLen} / {users.vocabSize}
                </span>
              </p>
              <a href='/hsk/table' className='card-link'>
                Весь HSK
              </a>
              <a href='/user/hsk_words' className='card-link'>
                Мой HSK
              </a>
            </div>
          </div>

          <div className='card border-primary mb-3'>
            <div className='card-body'>
              <h4 className='card-title'>Мои Слова</h4>
              <h6 className='card-subtitle mb-2 text-muted'>Список слов из текстов</h6>
              <p className='card-text'>
                Сейчас для повторения вы отобрали столько слов:{" "}
                <span className='badge badge-pill badge-warning'>
                  {userWordsLen} / {users.vocabSize}
                </span>
              </p>
              <a href='/userwords' className='card-link'>
                Мои Слова
              </a>
            </div>
          </div>
        </div>

        <div className='col-sm-6'>
          <CommentsCard />
        </div>
      </div>
    </>
  );
};

Dashboard.propTypes = {
  // getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  // profile: PropTypes.object.isRequired
};

const imgStyle = {
  width: "60px",
  borderRadius: "8px",
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  // profile: state.profile,
  allWordsLen: state.hskTable.allWordsLen,
  userWordsLen: state.userwords.userWordsLen,
  // dictStats: state.profile.dictStats
});

export default connect(mapStateToProps, { clearText })(Dashboard);
