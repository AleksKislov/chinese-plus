import React, { useState, useEffect } from "react";

const AudioFilter = ({ onClick, withAudio }) => {
  useEffect(() => {
    setIsAudio(withAudio);
  }, [withAudio]);
  const [isAudio, setIsAudio] = useState(false);

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
          С аудио
        </button>
      </div>
    </div>
  );
};

export default AudioFilter;
