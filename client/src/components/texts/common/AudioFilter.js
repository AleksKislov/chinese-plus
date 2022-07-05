import React, { useState, useEffect } from "react";
import axios from "axios";

const AudioFilter = ({ onClick, withAudio }) => {
  const loadNums = async (content) => {
    try {
      const { data } = await axios.get(`api/${content}/${content}_num`);
      setNum(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadNums("texts");
  }, []);

  useEffect(() => {
    setIsAudio(withAudio);
  }, [withAudio]);

  const [isAudio, setIsAudio] = useState(false);
  const [num, setNum] = useState({ withAudio: 0 });

  const onSelect = (bool) => {
    onClick(bool);
    setIsAudio(bool);
  };

  return (
    <div className='col-sm-3 mb-2'>
      <div className='btn-group w-100' role='group'>
        <button
          className={`btn btn-outline-primary btn-sm ${!isAudio ? "active" : ""}`}
          type='button'
          onClick={() => onSelect(false)}
        >
          Все
        </button>
        <button
          type='button'
          className={`btn btn-outline-primary btn-sm ${isAudio ? "active" : ""}`}
          onClick={() => onSelect(true)}
        >
          С аудио {num.withAudio}
        </button>
      </div>
    </div>
  );
};

export default AudioFilter;
