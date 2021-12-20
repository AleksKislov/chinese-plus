import React from "react";
import { textCategories } from "../../../constants/consts.json";

const CategoryFilter = ({ onChange }) => {
  return (
    <div className='col-sm-3 mb-2'>
      <label htmlFor='categoryFilt'>Категория</label>
      <select className='custom-select' onChange={e => onChange(e)} id='categoryFilt'>
        <option defaultValue='0' value='0'>
          Все Категории
        </option>
        {textCategories.map((x, ind) => (
          <option value={ind + 1} key={ind}>
            {x}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
