import React, { useState } from "react";

const Task = ({ task }) => {
  const { title, text } = task;
  const [length, setLen] = useState(50);
  const [clicked, setClicked] = useState(false);

  const onClick = () => {
    setClicked(!clicked);
    if (clicked) {
      setLen(50);
    } else {
      setLen(text.length);
    }
  };

  return (
    <div className='toast show'>
      <div className='toast-header'>
        <strong className='mr-auto'>{title}</strong>
      </div>
      <div className='toast-body'>
        {text.slice(0, length)}
        {clicked ? " " : "... "}
        <span
          type='button'
          className={`badge badge-${clicked ? "info" : "secondary"}`}
          onClick={onClick}
        >
          <i className={`fas fa-angle-double-${clicked ? "left" : "right"}`}></i>
        </span>
      </div>
    </div>
  );
};

export default Task;
