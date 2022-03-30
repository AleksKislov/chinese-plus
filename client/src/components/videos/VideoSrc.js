import React from "react";
import { Link } from "react-router-dom";
import { YoutubeService } from "../../patterns/YoutubeService";

const VideoSrc = ({ source }) => {
  return (
    <h6 className='card-subtitle mb-2'>
      <span className='text-muted'>Ссылка: </span>
      <Link to={{ pathname: YoutubeService.getSrcLink(source) }} target='_blank'>
        youtube
      </Link>
    </h6>
  );
};

export default VideoSrc;
