import React from "react";
import Tippy from "@tippyjs/react";
import { connect } from "react-redux";

const ReadFilter = ({ onChange, user }) => {
  return (
    <Tippy content='Только для авторизованных' placement='bottom' disabled={user ? true : false}>
      <div className='col-sm-3 mb-2'>
        <label htmlFor='readFilt'>Прочитанные</label>
        <select
          className='custom-select'
          onChange={e => onChange(e)}
          id='readFilt'
          disabled={user ? false : true}
        >
          <option defaultValue='0' value='0'>
            Все тексты
          </option>
          <option value='1'>Непрочитанные</option>
          <option value='2'>Прочитанные</option>
        </select>
      </div>
    </Tippy>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {})(ReadFilter);
