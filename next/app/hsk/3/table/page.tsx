"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiGetReq } from "../../../../src/helpers/api";

import TableCard from "../../../../src/components/hsk/table-card";
import Pagination from "../../../../src/components/hsk/pagination";
import HskTable from "../../../../src/components/hsk/hsk-table";

export default function Hsk3TablePage() {
  const searchParams = useSearchParams();
  const [level, setLevel] = useState("1");
  const [limit, setLimit] = useState(0);
  const [hskWords, setHskWords] = useState<NewHskWordType[] | null>(null);

  useEffect(() => {
    const lvl = searchParams.get("lvl") || "1";
    const pageParam = searchParams.get("pg");
    const lmt = pageParam ? +pageParam : 0;

    setLimit(lmt);
    setLevel(lvl);
    loadLexicon(lvl, lmt);
  }, []);

  async function loadLexicon(lvl: string, lmt: number) {
    setHskWords(null);

    try {
      const data = await apiGetReq(`/api/newhskwords?hsk_level=${lvl}&limit=${lmt}`);
      if (data.length > 0) setHskWords(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className='row'>
        <div className='col-sm-3'>
          <TableCard level={level} setLevel={setLevel} isOldHsk={false} isForTests={false} />
        </div>

        <div className='col-sm-9'>
          <h1>Вся лексика для HSK 3</h1>
          <Pagination level={level} setLimit={setLimit} curPage={limit} isOldHsk={false} />
          <HskTable isOldHsk={false} hskWords={hskWords} />
        </div>
      </div>
    </>
  );
}
