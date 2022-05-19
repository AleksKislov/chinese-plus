import React from "react";
import { videoCategories } from "../../constants/consts.json";

const CategoryFilter = ({ onChange }) => {
  return (
    <div className='col-sm-3 mb-2'>
      <label htmlFor='categoryFilt'>Категория</label>
      <select className='custom-select' onChange={(e) => onChange(e)} id='categoryFilt'>
        <option defaultValue='' value=''>
          Все Категории
        </option>
        {Object.values(videoCategories).map((x, ind) => (
          <option value={Object.keys(videoCategories)[ind]} key={ind}>
            {x}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
