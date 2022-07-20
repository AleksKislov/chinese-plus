import React from "react";
import Tippy from "@tippyjs/react";
import { commentEmojis } from "../../constants/consts.json";

const EmojiSelect = ({ addEmoToText }) => {
  return (
    <Tippy
      className='emotippy-box'
      trigger='click'
      theme='light-border'
      placement='bottom'
      interactive={true}
      content={
        <div className='text-center'>
          {commentEmojis.map((emo, ind) => (
            <span
              style={{ cursor: "pointer" }}
              className='h5 mx-1 my-1'
              key={ind}
              onClick={e => addEmoToText(e)}
            >
              {emo}
            </span>
          ))}
        </div>
      }
    >
      <span style={{ cursor: "pointer" }}>😀</span>
    </Tippy>
  );
};

export default EmojiSelect;
