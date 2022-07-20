import React from "react";

const LevelFilter = ({ onChange }) => {
  return (
    <div className='col-sm-3 mb-2'>
      <label htmlFor='levelFilt'>Уровень</label>
      <select className='custom-select' onChange={e => onChange(e)} id='levelFilt'>
        <option defaultValue='0' value='0'>
          Все Уровни
        </option>
        <option value='1'>1 Простой ⭐</option>
        <option value='2'>2 Средний ⭐⭐</option>
        <option value='3'>3 Сложный ⭐⭐⭐</option>
      </select>
    </div>
  );
};

export default LevelFilter;
