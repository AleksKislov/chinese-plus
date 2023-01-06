import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookReader, faBrain, faChartArea, faListCheck } from "@fortawesome/free-solid-svg-icons";

import TrPopover from "../translation/tr-popover";
import CharPoint from "./char-point";
import SellPoint from "./point";
import UndecLink from "../layout/undec-link";

export default function SellPoints() {
  return (
    <>
      <div className='row'>
        {firstRow.map(({ icon, headTxt, txt }, ind) => (
          <SellPoint icon={icon} headTxt={headTxt} text={txt} key={ind} />
        ))}
      </div>
      <div className='row'>
        <CharPoint />

        {secondRow.map(({ icon, headTxt, txt }, ind) => (
          <SellPoint icon={icon} headTxt={headTxt} text={txt} key={ind} />
        ))}
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

const firstRow = [
  {
    icon: word && <TrPopover word={word} isCurrent={false} />,
    headTxt: "Умный перевод",
    txt: (
      <span>
        Все <UndecLink href='/texts' txt='тексты' /> не только с параллельным переводом, но и с
        переводом каждого слова. Кликните на иероглиф.
      </span>
    ),
  },
  {
    icon: <FontAwesomeIcon icon={faBookReader} />,
    headTxt: "Делимся текстами",
    txt: (
      <span>
        <UndecLink href='/read/statistics' txt='Пользователи' /> регулярно добавляют новые{" "}
        <UndecLink href='/read/texts' txt='тексты' />. Скоро будут и целые{" "}
        <UndecLink href='/read/books' txt='книги' />! Присоединяйтесь к нам!
      </span>
    ),
  },
  {
    icon: <FontAwesomeIcon icon={faListCheck} />,
    headTxt: "Личный вокабуляр",
    txt: (
      <span>
        Любые слова из <UndecLink href='/hsk2/table' txt='HSK' />,{" "}
        <UndecLink href='/read/texts' txt='текстов' /> или{" "}
        <UndecLink href='/search' txt='словаря' /> Вы можете добавить в личный вокабуляр и повторять
        их отдельно.
      </span>
    ),
  },
];

const secondRow = [
  {
    icon: <FontAwesomeIcon icon={faBrain} />,
    headTxt: "Для начинающих",
    txt: (
      <span>
        Озвученная таблица <UndecLink href='/pinyin' txt='пиньиня' />, все слова для{" "}
        <UndecLink href='/hsk2/table' txt='HSK' /> с озвучкой, а также тесты, чтобы проверить свои
        знания.
      </span>
    ),
  },
  {
    icon: <FontAwesomeIcon icon={faChartArea} />,
    headTxt: "Дневник чтения",
    txt: (
      <span>
        Ставьте себе цели по количеству прочитанных иероглифов, следите за графиком своей
        &quot;успеваемости&quot;.
      </span>
    ),
  },
];
