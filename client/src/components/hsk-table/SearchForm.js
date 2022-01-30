import React from "react";

const SearchForm = ({ onSubmit, setChineseWord }) => {
  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <div className='form-group'>
        <small className='form-text text-muted'>китайское слово + Enter</small>
        <div className='input-group'>
          <input
            type='text'
            className='form-control'
            placeholder='汉字。。。'
            autoComplete='off'
            onInput={(e) => setChineseWord(e.target.value)}
          />
          <div className='input-group-append' id='searchButton'>
            <button className='btn btn-primary' type='submit' onClick={onSubmit}>
              <i className='fas fa-search'></i>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
