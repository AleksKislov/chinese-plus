import React, { useState, useEffect } from "react";
import "./audio.css";
import Shikwasa from "shikwasa";

const Audio = ({ title, src }) => {
  useEffect(() => {
    const player = new Shikwasa({
      container: () => document.querySelector("#audioContainer"),
      audio: {
        title,
        artist: "Chinese+",
        cover: "1.png",
        src: "https://kislov.chineseplus.ru/audio/pinyin/mi1.mp3",
      },
    });
  }, [title, src]);

  // <div className='row'>
  //   <div className='col-sm-12 my-2'>
  //     <div className=''>
  //       <audio controls className='' style={{ width: "100%" }}>
  //         <source src='sample.mp3' />
  //       </audio>
  //     </div>
  //   </div>
  // </div>

  return <div className='my-2' id='audioContainer'></div>;
};

export default Audio;
