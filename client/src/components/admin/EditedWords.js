import React, { useState, useEffect } from "react";
import axios from "axios";
import AdWordsItem from "./AdWordsItem";
import WordModal from "../translation/WordModal";
import WordEditModal from "../translation/WordEditModal";

const EditedWords = () => {
  const [words, setWords] = useState(null);
  const [count, setCount] = useState(0);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    loadEditedWords();
  }, []);

  const loadEditedWords = async () => {
    try {
      const { data } = await axios.get("/api/dictionary/editedWords?skip=" + skip);
      setWords(data.words);
      setCount(data.count);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    words && (
      <div>
        <WordModal />
        <WordEditModal />
        <p className='mb-2'>Всего отредактированных слов: {count}</p>
        <p className='mb-2'>skip: {skip}</p>

        <table className='table table-hover mb-3'>
          <thead style={{ visibility: "collapse" }}>
            <tr>
              <th style={{ width: "15%" }}></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {words.map((word) => (
              <AdWordsItem
                key={word._id}
                lexicon={{
                  _id: word._id,
                  chinese: word.chinese,
                  pinyin: word.pinyin,
                  russian: word.russian,
                }}
                fromSearch={true}
                hideFlag={{}}
              />
            ))}
          </tbody>
        </table>
      </div>
    )
  );
};

export default EditedWords;
