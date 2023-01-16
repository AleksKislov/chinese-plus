import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { markUpRuText } from "../../helpers/translation";

type MoreInfoModalProps = {
  showModal: boolean;
  handleClose: () => void;
  cn: string;
  py: string;
  ru: string;
};

export default function MoreInfoModal({ showModal, handleClose, cn, py, ru }: MoreInfoModalProps) {
  const [showMore, setShowMore] = useState(true);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header className='bg-primary' closeButton>
        <Modal.Title>
          {cn} | {py}{" "}
          <OverlayTrigger
            placement='bottom'
            overlay={<Tooltip>{showMore ? "Без примеров" : "С примерами"}</Tooltip>}
          >
            <Button variant='warning' size='sm' onClick={() => setShowMore(!showMore)}>
              {showMore ? "Меньше" : "Больше"}
            </Button>
          </OverlayTrigger>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body dangerouslySetInnerHTML={{ __html: markUpRuText(ru, showMore) }}></Modal.Body>
    </Modal>
  );
}
