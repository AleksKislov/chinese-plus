"use client";
import { useState, useRef } from "react";

import Popover from "react-bootstrap/Popover";
import CloseButton from "react-bootstrap/CloseButton";
import Overlay from "react-bootstrap/Overlay";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";

import { parseRussian } from "../../helpers/translation";
import MoreInfoModal from "./more-info-modal";
import MoreInfoBtn from "./more-info-btn";
// import "./tippy.css";

type WordFromDB = {
  _id: string;
  chinese: string;
  russian: string;
  pinyin: string;
};

export default function TrPopover({ word, isCurrent }: { word: WordFromDB; isCurrent: boolean }) {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
        <MoreInfoBtn handleShow={handleShow} />

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

  return (
    <>
      <span
        ref={target}
        onClick={() => setShow(!show)}
        className={`tippyTooltips ${inVocab && "tippySelected"} ${isCurrent ? "text-danger" : ""}`}
      >
        {chinese}
      </span>
      <Overlay show={show} placement='bottom' target={target.current} rootClose>
        {content}
      </Overlay>
      {
        <MoreInfoModal
          handleClose={handleClose}
          ru={russian}
          cn={chinese}
          py={pinyin}
          showModal={showModal}
        />
      }
    </>
  );
}
