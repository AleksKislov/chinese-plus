"use client";
import { useEffect, useState, MouseEvent } from "react";
import "./Pinyin.css";

import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import { pinyinMap, tableMap } from "../../helpers/constants/pinyin";
import { playAudioFromBtn } from "./play-audio";

export default function PinyinTable() {
  const [curSound, setCurSound] = useState("");

  useEffect(() => {
    initHiglights();
  });

  const initHiglights = () => {
    const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
    const tableHead = document.querySelector("#tableHead2") as Element;
    const tds = tbody.getElementsByTagName("td");
    const ths = tableHead.getElementsByTagName("th");

    const tdsArr = Array.from(tds);
    const thsArr = Array.from(ths);

    function higlightEvent(i: number, action: string) {
      const cols = i % 36;

      for (let index = 0; index < 22; index++) {
        const el = tdsArr[cols + index * 36];
        action === "set"
          ? el.setAttribute("class", "highlighted")
          : el.classList.remove("highlighted");
      }
      action === "set"
        ? thsArr[cols + 1].setAttribute("class", "highlighted")
        : thsArr[cols + 1].classList.remove("highlighted");
    }

    tdsArr.forEach((td, ind) => {
      td.addEventListener("mouseover", () => higlightEvent(ind, "set"));
      td.addEventListener("mouseout", () => higlightEvent(ind, "remove"));
    });
  };

  const popover = (
    <Popover className='bg-secondary'>
      <Popover.Body>
        <ButtonGroup>
          {curSound &&
            pinyinMap[curSound] &&
            Object.keys(pinyinMap[curSound]).map((x, ind) => (
              <Button
                variant={pinyinMap[curSound][x] ? "info" : "danger"}
                key={ind}
                onClick={(e) => {
                  if (pinyinMap[curSound][x]) playAudioFromBtn(e);
                }}
                id={pinyinMap[curSound][x]}
              >
                {x}
              </Button>
            ))}
        </ButtonGroup>
      </Popover.Body>
    </Popover>
  );

  const setSound = (e: MouseEvent<HTMLSpanElement>) => {
    const target = e.target as Element;
    setCurSound(target.innerHTML);
  };

  const consonansts = Object.keys(tableMap);

  return (
    <div className='table-responsive'>
      <table className='table table-bordered table-dark table-hover table-sm'>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th colSpan={5}>a</th>
            <th colSpan={3}>o</th>
            <th colSpan={5}>e</th>
            <th colSpan={10}>i</th>
            <th colSpan={9}>u</th>
            <th colSpan={4}>ü</th>
          </tr>
          <tr id='tableHead2'>
            <th>&nbsp;</th>
            <th>a</th>
            <th>ai</th>
            <th>ao</th>
            <th>an</th>
            <th>ang</th>
            <th>o</th>
            <th>ong</th>
            <th>ou</th>
            <th>e</th>
            <th>ei</th>
            <th>en</th>
            <th>eng</th>
            <th>er</th>
            <th>i</th>
            <th>ia</th>
            <th>iao</th>
            <th>ie</th>
            <th>iou</th>
            <th>ian</th>
            <th>iang</th>
            <th>in</th>
            <th>ing</th>
            <th>iong</th>
            <th>u</th>
            <th>ua</th>
            <th>uo</th>
            <th>ui</th>
            <th>uai</th>
            <th>uan</th>
            <th>un</th>
            <th>uang</th>
            <th>ueng</th>
            <th>ü</th>
            <th>üe</th>
            <th>üan</th>
            <th>ün</th>
          </tr>
        </thead>
        <tbody id={"pinyinTable"}>
          {consonansts.map((conson, k) => (
            <tr key={k}>
              <th scope='row'>{conson}</th>
              {tableMap[conson].map((pySound, ind) => (
                <td key={ind}>
                  {pySound ? (
                    <OverlayTrigger trigger='click' placement='bottom' overlay={popover} rootClose>
                      <div onClick={(e) => setSound(e)}>{pySound}</div>
                    </OverlayTrigger>
                  ) : (
                    <span></span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
