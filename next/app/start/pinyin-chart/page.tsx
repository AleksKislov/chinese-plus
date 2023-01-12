"use client";
import { useState } from "react";

import Link from "next/link";
import Alert from "react-bootstrap/Alert";
import PinyinTable from "../../../src/components/start/pinyin-table";

export default function PinyinChartPage() {
  const [show, setShow] = useState(true);

  return (
    <div className='row'>
      <h1>Таблица Пиньиня с Озвучкой</h1>

      <div>
        {show && (
          <Alert variant={"info"} onClose={() => setShow(false)} dismissible>
            - Кликайте на слоги, чтобы услышать озвучку носителем языка <br />- Если нашли
            какой-либо недочет, то сообщите, пожалуйста, <Link href={"/posts"}>здесь</Link> или
            сразу <Link href={"/contacts"}>админу</Link>
          </Alert>
        )}
      </div>

      <PinyinTable></PinyinTable>
    </div>
  );
}
