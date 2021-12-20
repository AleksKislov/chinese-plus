import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { parseChineseWords } from "../../actions/helpers";
import TippyTooltip from "../translation/TippyTooltip";
import WordModal from "../translation/WordModal";
import HanziWriter from "hanzi-writer";
import CommentsCard from "../dashboard/CommentsCard";
import { loadPosts } from "../../actions/posts";
import Post from "../posts/Post";

const Landing = ({ isAuthenticated, loadPosts, posts }) => {
  const [word, setWord] = useState(null);

  useEffect(() => {
    if (posts.length === 0) loadPosts(0);
  }, []);

  const setTooltip = () => {
    // const res = await parseChineseWords({ chinese_arr: ["我"] });
    // console.log(JSON.stringify(res[0][0]));
    // setWord(res[0][0]);

    // just hard coded it
    setWord({
      chinese: "我",
      _id: "5f04819868566a15a9ff0227",
      pinyin: " wǒ",
      russian:
        " [m1]1) я; мой[/m][m2][*][ex]我是学生 я ― учащийся[/ex][/*][/m][m2][*][ex]我父亲 мой отец[/ex][/*][/m][m1]2) мы; наш ([i]о коллективе, стране[/i])[/m][m2][*][ex]我方 наша сторона, наши[/ex][/*][/m][m2][*][ex]我军 наша армия[/ex][/*][/m][m2][*][ex]敌我 противник и мы[/ex][/*][/m][m1]3) сам; самоличный, частный, личный[/m][m2][*][ex]自我 сам; собственный[/ex][/*][/m][m2][*][ex]大公无我 всё общественное, нет ничего личного (собственного)[/ex][/*][/m]"
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setTooltip();

      const writer = HanziWriter.create("showCharDiv", "字", {
        width: 40,
        height: 40,
        padding: 0,
        showOutline: true,
        radicalColor: "#168F16",
        delayBetweenLoops: 3000
      });
      writer.loopCharacterAnimation();
    }
  }, []);

  if (isAuthenticated) return <Redirect to='/dashboard' />;

  return (
    <section className='landing' style={{ marginRight: "0", marginLeft: "0" }}>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Chinese+ Клуб изучения китайского языка</title>
      </Helmet>
      <div className='dark-overlay'></div>
      <div className='container' id='landingContainer'>
        <div className='row my-5'>
          <div className='col-md-12 text-center'>
            <h2 className='LandingWhiteTxt'>Добро пожаловать в клуб Chinese+</h2>
            <p className='lead LandingWhiteTxt'>Web-приложение для изучающих китайский язык</p>
            <div className='buttons'>
              <Link to='/register' className='btn btn-dark mx-1'>
                Регистрация
              </Link>
              <Link to='/login' className='btn btn-light mx-1'>
                Войти
              </Link>
            </div>
          </div>
        </div>
        <div className='row'>
          <WordModal />
          <div className='col-sm-4'>
            <div className='card border-light mb-3'>
              <div className='card-header h5'>Умный перевод</div>
              <div className='card-body row'>
                <div className='col-md-2'>
                  <h3>{word && <TippyTooltip word={word} />}</h3>
                </div>
                <div className='col-md-10'>
                  <p className='card-text'>
                    Все <Link to='/texts'>тексты</Link> не только с параллельным переводом, но и с
                    переводом каждого слова. Кликните на иероглиф.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-4'>
            <div className='card border-light mb-3'>
              <div className='card-header h5'>Делимся текстами</div>
              <div className='card-body row'>
                <div className='col-md-2'>
                  <h3>
                    <i className='fas fa-book-reader'></i>
                  </h3>
                </div>
                <div className='col-md-10'>
                  <p className='card-text'>
                    <Link to='/statistics'>Пользователи</Link> регулярно добавляют новые{" "}
                    <Link to='/texts'>тексты</Link>. Скоро будут и целые{" "}
                    <Link to='/books'>книги</Link>! Поделитесь и Вы своими переводами.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-4'>
            <div className='card border-light mb-3'>
              <div className='card-header h5'>Личный вокабуляр</div>
              <div className='card-body row'>
                <div className='col-md-2'>
                  <h3>
                    <i className='fas fa-clipboard-list'></i>
                  </h3>
                </div>
                <div className='col-md-10'>
                  <p className='card-text'>
                    Любые слова из лексики <Link to='/hsk-table'>HSK</Link>,{" "}
                    <Link to='/texts'>текстов</Link> или <Link to='/search'>словаря</Link> Вы можете
                    добавить в личный вокабуляр и повторять их отдельно.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-4'>
            <div className='card border-light mb-3'>
              <div className='card-header h5'>Словарь с анимацией</div>
              <div className='card-body row'>
                <div className='col-md-2' id='showCharDiv'></div>
                <div className='col-md-10'>
                  <p className='card-text'>
                    Каждый иероглиф в <Link to='/search'>словаре</Link> снабжен анимированным
                    порядком написания черт иероглифа.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-4'>
            <div className='card border-light mb-3'>
              <div className='card-header h5'>Для начинающих</div>
              <div className='card-body row'>
                <div className='col-md-2'>
                  <h3>
                    <i className='fas fa-brain'></i>
                  </h3>
                </div>
                <div className='col-md-10'>
                  <p className='card-text'>
                    Озвученная таблица <Link to='/pinyin'>пиньиня</Link>, все слова для{" "}
                    <Link to='/hsk-table'>HSK</Link> с озвучкой, а также тесты, чтобы проверить свои
                    знания.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-4'>
            <div className='card border-light mb-3'>
              <div className='card-header h5'>Дневник чтения</div>
              <div className='card-body row'>
                <div className='col-md-2'>
                  <h3>
                    <i className='fas fa-chart-line'></i>
                  </h3>
                </div>
                <div className='col-md-10'>
                  <p className='card-text'>
                    Ставьте себе суточные цели, отмечайте сколько иероглифов прочитано, следите за
                    графиком своей "успеваемости".
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='row my-5'>
          <div className='col-12 d-flex justify-content-center'>
            <div className='embed-responsive embed-responsive-16by9' style={{ maxWidth: "50rem" }}>
              <iframe
                className='embed-responsive-item'
                width='560'
                height='315'
                src='https://www.youtube.com/embed/fxM8lH17fUY'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        <div className='row mb-5'>
          <div className='col-sm-6 LandingWhiteTxt mb-3'>
            <CommentsCard />
          </div>
          <div className='col-sm-6'>
            <h4 className='LandingWhiteTxt'>Последние записи в Гостевой:</h4>

            {posts.map(post => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// <div className='dark-overlay'>
// <div className='landing-inner'>
//   <h1 className='x-large'>Добро пожаловать в клуб Chinese+</h1>

// <p className='lead'>Web-приложение для изучающих китайский язык от ChinesePlus</p>
// <div className='buttons'>
//   <Link to='/register' className='btn btn-dark'>
//     Регистрация
//   </Link>
//   <Link to='/login' className='btn btn-light'>
//     Войти
//   </Link>
// </div>

//   <div className='card text-primary bg-light mt-4'>
//     <div className='card-header'>
//       <h5>Здесь вы сможете</h5>
//     </div>
//     <div className='card-body'>
//       <ul className='card-text' style={{ marginRight: "2rem", textAlign: "left" }}>
//         <li>Почитать тексты и книги на китайском языке со встроенным переводом</li>
//         <li>Изучать любые слова, добавляя их в личные списки для изучения</li>
//         <li>Пользоваться словарем с анимированными иероглифами</li>
//         <li>Проходить тесты на знание китайского языка</li>
//         <li>И многое другое, так как проект каждый день развивается!</li>
//       </ul>
//     </div>
//   </div>
// </div>
// </div>

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  posts: state.posts.posts
});

export default connect(mapStateToProps, { loadPosts })(Landing);
