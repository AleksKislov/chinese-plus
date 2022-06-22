import React, { useState } from "react";

const AudioFilter = ({ onClick }) => {
  const [isAudio, setIsAudio] = useState(false);

  const onSelect = (bool) => {
    onClick();
    setIsAudio(bool);
  };

  return (
    <div className='col-sm-3'>
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
          С аудио
        </button>
      </div>
    </div>
  );
};

export default AudioFilter;
