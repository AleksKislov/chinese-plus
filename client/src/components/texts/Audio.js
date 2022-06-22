import React, { useEffect } from "react";
import "./audio.css";
import Shikwasa from "shikwasa";
import { textsAudioUrl } from "../../constants/urls.json";

const Audio = ({ title, textId }) => {
  useEffect(() => {
    new Shikwasa({
      container: () => document.querySelector("#audioContainer"),
      audio: {
        title,
        artist: "Chinese+",
        cover: "1.png",
        src: `${textsAudioUrl}${textId}.mp3`,
      },
      speedOptions: [0.5, 0.75, 1.25, 1.5, 1.75, 2],
      fixed: {
        type: "static",
        position: "bottom",
      },
      themeColor: "#3498db",
      theme: +localStorage.isDarkTheme ? "dark" : "light",
    });
  }, [title, textId]);

  return <div className='my-2 card border-secondary' id='audioContainer'></div>;
};

export default Audio;
