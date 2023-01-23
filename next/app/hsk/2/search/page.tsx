"use client";
import { useState } from "react";
import HskTable from "../../../../src/components/hsk/hsk-table";
import HskSearchForm from "../../../../src/components/hsk/search-form";
import { apiPostReq } from "../../../../src/helpers/api/request";

export default function Hsk2Search({}) {
  const [hskWords, setHskWords] = useState<NewHskWordType[] | null>(null);
  const [chineseWord, setChineseWord] = useState("");

  const onSubmit = async () => {
    setHskWords(null);

    if (chineseWord) {
      try {
        const data = await apiPostReq("/api/lexicon/search", { chinese: chineseWord });
        if (data.length > 0) setHskWords(data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className='row'>
      <div className='col-sm-3'>
        <div className='card border-primary mb-3'>
          <div className='card-body'>
            <h4 className='card-title'>Поиск слов HSK 2</h4>
            <h6 className='card-subtitle mb-2 text-muted'>Вся лексика</h6>
            <p className='card-text'>Найдите нужные вам слова HSK (любые из 5 000 слов)</p>
          </div>
        </div>
      </div>

      <div className='col-sm-9'>
        <h1>Поиск слов HSK 2</h1>
        <HskSearchForm onSubmit={onSubmit} setChineseWord={setChineseWord} />
        <HskTable isOldHsk={true} hskWords={hskWords} />
      </div>
    </div>
  );
}
