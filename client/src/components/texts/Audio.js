import React, { useEffect } from "react";
import "./audio.css";
import Shikwasa from "shikwasa";

const Audio = ({ title, src }) => {
  useEffect(() => {
    new Shikwasa({
      container: () => document.querySelector("#audioContainer"),
      audio: {
        title,
        artist: "Chinese+",
        cover: "1.png",
        src: "https://kislov.chineseplus.ru/audio/pinyin/mi1.mp3",
      },
    });
  }, [title, src]);

  return <div className='my-2' id='audioContainer'></div>;
};

export default Audio;
