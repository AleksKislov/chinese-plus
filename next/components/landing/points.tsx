import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookReader, faBrain, faChartArea, faListCheck } from "@fortawesome/free-solid-svg-icons";

import TrPopover from "../translation/tr-popover";
import CharPoint from "./char-point";

export default function SellPoints() {
  return (
    <>
      <div className='row'>
        <div className='col-sm-4'>
          <div className='card border-light mb-3'>
            <div className='card-header h5'>Умный перевод</div>
            <div className='card-body row'>
              <div className='col-md-2'>
                <h3>{word && <TrPopover word={word} isCurrent={false} />}</h3>
              </div>
              <div className='col-md-10'>
                <p className='card-text'>
                  Все <Link href='/texts'>тексты</Link> не только с параллельным переводом, но и с
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
                  <FontAwesomeIcon icon={faBookReader} />
                </h3>
              </div>
              <div className='col-md-10'>
                <p className='card-text'>
                  <Link href='/read/statistics'>Пользователи</Link> регулярно добавляют новые{" "}
                  <Link href='/read/texts'>тексты</Link>. Скоро будут и целые{" "}
                  <Link href='/read/books'>книги</Link>! Поделитесь и Вы своими переводами.
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
                  <FontAwesomeIcon icon={faListCheck} />
                </h3>
              </div>
              <div className='col-md-10'>
                <p className='card-text'>
                  Любые слова из лексики <Link href='/hsk2/table'>HSK</Link>,{" "}
                  <Link href='/read/texts'>текстов</Link> или <Link href='/search'>словаря</Link> Вы
                  можете добавить в личный вокабуляр и повторять их отдельно.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <CharPoint />

        <div className='col-sm-4'>
          <div className='card border-light mb-3'>
            <div className='card-header h5'>Для начинающих</div>
            <div className='card-body row'>
              <div className='col-md-2'>
                <h3>
                  <FontAwesomeIcon icon={faBrain} />
                </h3>
              </div>
              <div className='col-md-10'>
                <p className='card-text'>
                  Озвученная таблица <Link href='/pinyin'>пиньиня</Link>, все слова для{" "}
                  <Link href='/hsk2/table'>HSK</Link> с озвучкой, а также тесты, чтобы проверить
                  свои знания.
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
                  <FontAwesomeIcon icon={faChartArea} />
                </h3>
              </div>
              <div className='col-md-10'>
                <p className='card-text'>
                  Ставьте себе суточные цели, отмечайте сколько иероглифов прочитано, следите за
                  графиком своей &quot;успеваемости&quot;.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const word = {
  chinese: "我",
  _id: "5f04819868566a15a9ff0227",
  pinyin: "wǒ",
  russian:
    " [m1]1) я; мой[/m][m2][*][ex]我是学生 я ― учащийся[/ex][/*][/m][m2][*][ex]我父亲 мой отец[/ex][/*][/m][m1]2) мы; наш ([i]о коллективе, стране[/i])[/m][m2][*][ex]我方 наша сторона, наши[/ex][/*][/m][m2][*][ex]我军 наша армия[/ex][/*][/m][m2][*][ex]敌我 противник и мы[/ex][/*][/m][m1]3) сам; самоличный, частный, личный[/m][m2][*][ex]自我 сам; собственный[/ex][/*][/m][m2][*][ex]大公无我 всё общественное, нет ничего личного (собственного)[/ex][/*][/m]",
};
