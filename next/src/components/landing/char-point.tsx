"use client";
import { useEffect } from "react";

import HanziWriter from "hanzi-writer";
import UndecLink from "../layout/undec-link";

const charAnimDiv = "showCharDiv";
export default function CharPoint() {
  useEffect(() => {
    const el = document.getElementById(charAnimDiv);
    if (el) el.innerHTML = "";

    const writer = HanziWriter.create(charAnimDiv, "字", {
      width: 40,
      height: 40,
      padding: 0,
      showOutline: true,
      radicalColor: "#168F16",
      delayBetweenLoops: 3000,
    });
    writer.loopCharacterAnimation();
  });
  return (
    <div className='col-sm-4 px-4'>
      <div className='card border-light mb-3'>
        <div className='card-header h5'>Словарь с анимацией</div>
        <div className='card-body row'>
          <div className='col-2' id={charAnimDiv}></div>
          <div className='col-10'>
            <p className='card-text'>
              Каждый иероглиф в <UndecLink href='/search' txt='словаре' /> снабжен анимированным
              порядком написания черт иероглифа.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
