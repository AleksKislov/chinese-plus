import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlay, faPlus } from "@fortawesome/free-solid-svg-icons";
import constUrls from "../../helpers/constants/urls";

type TableRowType = {
  word: OldHskWordType;
  hideChinese: boolean;
  hidePinyin: boolean;
  hideRussian: boolean;
};

export default function OldHskTableRow({
  word,
  hideChinese,
  hidePinyin,
  hideRussian,
}: TableRowType) {
  const { chinese: cn, pinyin: py, translation: ru, word_id: id, level: lvl } = word;
  const [userSelected, setUserSelected] = useState(false);

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
            // onClick={(e) => onClick(e)}
          >
            {userSelected ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
          </button>
        </td>
      </tr>
    </>
  );
}
