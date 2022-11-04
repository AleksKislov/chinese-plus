import React, { useState, useEffect } from "react";
import axios from "axios";
import NoticeWell from "../layout/NoticeWell";

const AdNotices = () => {
  const [notice, setNotice] = useState(null);
  const [color, setColor] = useState(WellColors.info);
  const [text, setText] = useState("Новый текст");
  const [display, setDisplay] = useState(true);
  const [link, setLink] = useState("");

  useEffect(() => {
    loadNotice();
  }, []);

  useEffect(() => {
    if (!notice) return;
    setText(notice.text);
    setDisplay(notice.display);
    setColor(notice.color);
  }, [notice]);

  const loadNotice = async () => {
    try {
      const { data } = await axios.get("/api/notices");
      setNotice(data);
    } catch (err) {
      console.log(err);
    }
  };

  const postNewNotice = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ text, display, color, link });

    try {
      const { data } = await axios.post("/api/notices/edit", body, config);
      console.log(JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    notice && (
      <div>
        <div>
          <textarea
            disabled
            rows={7}
            cols={80}
            defaultValue={JSON.stringify(notice, null, 2)}
          ></textarea>
        </div>

        <div>
          <p>Выбор цвета:</p>
          <div className='btn-group' role='group'>
            {Object.keys(WellColors).map((color, ind) => (
              <button
                type='button'
                id={color}
                key={ind}
                className={`btn btn-sm btn-${color}`}
                onClick={(e) => {
                  setColor(e.target.id);
                }}
              >
                {color}
              </button>
            ))}
          </div>

          <p>Новый текст:</p>
          <div className='form-group col-md-12'>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              type='textarea'
              className='form-control'
              rows='2'
            />
          </div>
          <p>Отображать или нет</p>
          <div className='custom-control custom-switch mb-2'>
            <input
              type='checkbox'
              className='custom-control-input'
              id='display'
              checked={display}
              onChange={() => setDisplay(!display)}
            />
            <label className='custom-control-label text-danger' htmlFor='display'>
              {display.toString()}
            </label>
          </div>
          <p>Внутренний линк</p>
          <div className='form-group col-md-6'>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              type='text'
              className={`form-control`}
              placeholder='/posts/...'
            />
          </div>
          <p>Пример ниже:</p>
        </div>

        <NoticeWell notice={{ text, color, display: true, link }} />

        <button type='button' className={`btn btn-sm btn-danger`} onClick={postNewNotice}>
          Submit
        </button>
      </div>
    )
  );
};

const WellColors = {
  warning: "warning",
  info: "info",
  primary: "primary",
  light: "light",
  secondary: "secondary",
  success: "success",
  danger: "danger",
};

export default AdNotices;
