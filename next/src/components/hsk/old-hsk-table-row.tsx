"use client";
import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlay, faPlus } from "@fortawesome/free-solid-svg-icons";
import constUrls from "../../helpers/constants/urls";
import { useAlertCtx } from "../../context/alerts/store";
import { useHskCtx } from "../../context/hsk/store";
import { addUserHskWord, removeUserHskWord } from "../../context/hsk/actions";
import CONSTANTS from "../../helpers/constants/consts";

type TableRowType = {
  word: OldHskWordType;
  hideChinese: boolean;
  hidePinyin: boolean;
  hideRussian: boolean;
  userSelected: boolean;
};

export default function OldHskTableRow({
  word,
  hideChinese,
  hidePinyin,
  hideRussian,
  userSelected,
}: TableRowType) {
  const { chinese: cn, pinyin: py, translation: ru, word_id: id, level: lvl } = word;
  const { alerts, setAlerts } = useAlertCtx();
  const { userHsk2Words, setUserHsk2Words } = useHskCtx();
  const pronounce = (id: number, lvl: number) => {
    const o: { [key: number]: number } = {
      1: id - 1,
      2: id - 151,
      3: id - 301,
      4: id - 601,
      5: id - 1201,
      6: id - 2501,
    };
    const wordId = o[lvl];
    new Audio(`${constUrls.myAudioURL}hsk${lvl}/${wordId}.mp3`).play();
  };

  const addOrRemoveHskWord = () => {
    const id = uuid();
    const token = localStorage.token;
    if (!token) {
      return setAlerts([...alerts, { id, bgColor: "danger", txt: "Нужно авторизоваться" }]);
    }

    if (userSelected) {
      setUserHsk2Words(userHsk2Words.filter((x) => x.word_id !== word.word_id));
      removeUserHskWord(word.word_id, token);
      return setAlerts([
        ...alerts,
        { id, bgColor: "warning", txt: "Слово удалено из вашего словарика" },
      ]);
    }

    if (userHsk2Words.length >= CONSTANTS.users.vocabSize) {
      return setAlerts([
        ...alerts,
        {
          id,
          bgColor: "danger",
          txt: `Нет! В вашем словарике HSK уже ${CONSTANTS.users.vocabSize} слов!`,
        },
      ]);
    }

    addUserHskWord(word, token);
    setUserHsk2Words([...userHsk2Words, word]);
    setAlerts([...alerts, { id, bgColor: "success", txt: "Слово добавлено в ваш словарик" }]);
  };

  return (
    <>
      <tr className={userSelected ? "table-secondary" : ""}>
        <td className='small'>{id}</td>
        {!hideChinese && (
          <td>
            <h5>{cn}</h5>
          </td>
        )}
        {!hidePinyin && <td>{py}</td>}
        {!hideRussian && <td className='small'>{ru}</td>}
        <td>
          <button className='btn btn-sm btn-info' onClick={() => pronounce(id, lvl)}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
        </td>
        <td>
          <button
            className={userSelected ? "btn btn-sm btn-warning" : "btn btn-sm btn-info"}
            onClick={addOrRemoveHskWord}
          >
            {userSelected ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
          </button>
        </td>
      </tr>
    </>
  );
}
