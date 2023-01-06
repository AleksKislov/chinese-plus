"use client";
import { useState, useRef } from "react";

import Popover from "react-bootstrap/Popover";
import CloseButton from "react-bootstrap/CloseButton";
import Overlay from "react-bootstrap/Overlay";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus, faWindowRestore } from "@fortawesome/free-solid-svg-icons";

import { parseRussian, markUpRuText } from "../../helpers/translation";
import "./tippy.css";

type WordFromDB = {
  _id: string;
  chinese: string;
  russian: string;
  pinyin: string;
};

export default function TrPopover({ word, isCurrent }: { word: WordFromDB; isCurrent: boolean }) {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [inVocab, setInVocab] = useState(false);
  const target = useRef(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const { chinese, pinyin, russian } = word;
  let translation = "";
  if (russian) translation = parseRussian(russian, false);

  const content = (
    <Popover>
      <Popover.Header className='bg-primary'>
        <span className='h5'>{chinese}</span> <span>{pinyin}</span>
        <CloseButton className='float-end' onClick={() => setShow(!show)} />
      </Popover.Header>
      <Popover.Body
        className='bg-secondary'
        dangerouslySetInnerHTML={{ __html: translation }}
      ></Popover.Body>
      <div className='px-2 pb-2 bg-secondary rounded-bottom'>
        <OverlayTrigger placement='bottom' overlay={<Tooltip>Примеры и другие значения</Tooltip>}>
          <Button variant='info' size='sm' onClick={handleShow}>
            <FontAwesomeIcon icon={faWindowRestore} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger placement='bottom' overlay={<Tooltip>Отредактировать</Tooltip>}>
          <Button variant='warning' size='sm' className='mx-2'>
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
        </OverlayTrigger>

        <div className='float-end'>
          <OverlayTrigger placement='bottom' overlay={<Tooltip>В личный словарик</Tooltip>}>
            <Button variant='info' size='sm'>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </OverlayTrigger>
        </div>
      </div>
    </Popover>
  );

  const modal = (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header className='bg-primary' closeButton>
        <Modal.Title>
          {chinese} | {pinyin}{" "}
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
      <Modal.Body
        dangerouslySetInnerHTML={{ __html: markUpRuText(russian, showMore) }}
      ></Modal.Body>
    </Modal>
  );

  return (
    <>
      <span
        ref={target}
        onClick={() => setShow(!show)}
        className={`tippyTooltips ${inVocab && "tippySelected"} ${isCurrent ? "text-danger" : ""}`}
      >
        {chinese}
      </span>
      <Overlay show={show} placement='bottom' target={target.current}>
        {content}
      </Overlay>
      {modal}
    </>
  );
}
