import React from "react";
import Tippy from "@tippyjs/react";
import { connect } from "react-redux";

const ReadFilter = ({ onChange, user, isVideos }) => {
  return (
    <Tippy content='Только для авторизованных' placement='bottom' disabled={user ? true : false}>
      <div className='col-sm-3 mb-2'>
        <label htmlFor='readFilt'>{isVideos ? "Просмотренные" : "Прочитанные"}</label>
        <select
          className='custom-select'
          onChange={(e) => onChange(e)}
          id='readFilt'
          disabled={user ? false : true}
        >
          <option defaultValue='0' value='0'>
            Все {isVideos ? "видео" : "тексты"}
          </option>
          <option value='1'>{isVideos ? "Непросмотренные" : "Непрочитанные"}</option>
          <option value='2'>{isVideos ? "Просмотренные" : "Прочитанные"}</option>
        </select>
      </div>
    </Tippy>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(ReadFilter);
