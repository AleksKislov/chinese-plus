// import Link from "next/link";
import CardInfo from "./card-info";

import myConsts from "../../helpers/constants/consts";
const hskInfo = myConsts.hskInfo;

type TabelCardProps = {
  level: string;
  setLevel: Function;
  isOldHsk: boolean;
  isForTests: boolean;
};

export default function TableCard({ level, setLevel, isOldHsk, isForTests }: TabelCardProps) {
  const infoToUse: HskLvlSizeMap = isOldHsk ? hskInfo.oldLevelSize : hskInfo.bandSize;

  const levels = Object.keys(infoToUse);
  const allWordsNum = levels.map((lvl) => infoToUse[lvl]).reduce((prev, cur) => prev + cur);

  const rmHyphen = (str: string): string => str.replaceAll("-", "");
  return (
    <div className='card border-primary mb-3'>
      <CardInfo isForTests={isForTests} isOldHsk={isOldHsk} />

      <ul className='list-group list-group-flush'>
        {levels.map((lvl) => (
          <li
            className={`list-group-item list-group-item-action ${level === lvl ? "active" : ""}`}
            key={lvl}
          >
            <a
              href={`?lvl=${rmHyphen(lvl)}&pg=0`}
              className='card-link text-decoration-none'
              onClick={() => setLevel(rmHyphen(lvl))}
            >
              {isOldHsk ? "HSK" : "Band"} {lvl}{" "}
              <span className='badge badge-pill bg-warning float-end'>{infoToUse[lvl]}</span>
            </a>
          </li>
        ))}
      </ul>
      <ul className='list-group list-group-flush'>
        <li className='list-group-item'>
          <span className='text-success'>
            Всего слов <span className='badge badge-pill bg-warning float-end'>{allWordsNum}</span>
          </span>
        </li>
      </ul>
    </div>
  );
}
