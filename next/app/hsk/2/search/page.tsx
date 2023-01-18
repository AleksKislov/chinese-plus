"use client";
import { useState } from "react";
import HskTable from "../../../../src/components/hsk/hsk-table";
import HskSearchForm from "../../../../src/components/hsk/search-form";
import { apiPostReq } from "../../../../src/helpers/api/request";

export default function Hsk3Search({}) {
  const [hskWords, setHskWords] = useState<NewHskWordType[] | null>(null);
  const [chineseWord, setChineseWord] = useState("");

  const onSubmit = async () => {
    setHskWords(null);

    if (chineseWord) {
      try {
        const data = await apiPostReq("/api/newhskwords/search", { chinese: chineseWord });
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
            <h4 className='card-title'>HSK 3</h4>
            <h6 className='card-subtitle mb-2 text-muted'>Поиск слов</h6>

            <p className='card-text'>
              Найдите нужные вам слова нового HSK 3.0
              <br />1 band - 500 слов
              <br />2 band - 772 слова
              <br />3 band - 973 слова
              <br />4 band - 1000 слов
              <br />5 band - 1071 слово
              <br />6 band - 1140 слов
              <br />
              7,8,9 bands - 5636 слов
            </p>
          </div>
        </div>
      </div>

      <div className='col-sm-9'>
        <h1>Поиск слов HSK 3</h1>
        <HskSearchForm onSubmit={onSubmit} setChineseWord={setChineseWord} />

        <HskTable isOldHsk={false} hskWords={hskWords} />
      </div>
    </div>
  );
}
