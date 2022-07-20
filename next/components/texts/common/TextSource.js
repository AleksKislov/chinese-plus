import React, { useState, useEffect } from "react";
import { validURL, parseURL } from "../../../actions/helpers";

const TextSource = ({ textSource }) => {
  const [source, setState] = useState(null);
  const [isURL, setIsURL] = useState(false);
  const [link, setLink] = useState(null);

  useEffect(() => {
    if (textSource) {
      if (validURL(textSource)) {
        setState(parseURL(textSource));
        setIsURL(true);
      } else {
        setState(textSource);
      }
    }
  }, []);

  useEffect(() => {
    if (source) {
      setLink(
        <a target='_blank' href={source.href}>
          {source.hostname}
        </a>
      );
    }
  }, [source]);

  return (
    source && (
      <h6 className='card-subtitle mb-2'>
        <span className='text-muted'>Источник: </span>
        {isURL ? link : source}
      </h6>
    )
  );
};

export default TextSource;
