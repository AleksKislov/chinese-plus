import { useState } from "react";
import { parseRussian } from "../../helpers/translation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import constUrls from "../../helpers/constants/urls";
import MoreInfoModal from "../translation/more-info-modal";
import MoreInfoBtn from "../translation/more-info-btn";

type TableRowType = {
  word: NewHskWordType;
  hideChinese: boolean;
  hidePinyin: boolean;
  hideRussian: boolean;
};

export default function NewHskTableRow({
  word,
  hideChinese,
  hidePinyin,
  hideRussian,
}: TableRowType) {
  const { cn, py, ru, id, lvl } = word;
  const russian = parseRussian(ru, false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const pronounce = (id: number, lvl: string) => {
    new Audio(`${constUrls.myAudioURL}newhsk/band${lvl}/${id}.mp3`).play();
  };

  return (
    <>
      {<MoreInfoModal cn={cn} ru={ru} py={py} handleClose={handleClose} showModal={showModal} />}
      <tr>
        <td className='small'>{id}</td>
        {!hideChinese && (
          <td>
            <h5>{cn}</h5>
          </td>
        )}
        {!hidePinyin && <td>{py}</td>}
        {!hideRussian && (
          <td>
            <small dangerouslySetInnerHTML={{ __html: russian }}></small>
          </td>
        )}
        <td>
          <MoreInfoBtn handleShow={handleShow} />
        </td>
        <td>
          <button className='btn btn-sm btn-info' onClick={() => pronounce(id, lvl)}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
        </td>
      </tr>
    </>
  );
}
