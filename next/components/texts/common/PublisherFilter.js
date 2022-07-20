import React from "react";

const PublisherFilter = ({ onChange, publishers }) => {
  return (
    <div className='col-sm-3 mb-2'>
      <label htmlFor='publisherFilt'>Опубликовавший</label>
      <select className='custom-select' onChange={e => onChange(e)} id='publisherFilt'>
        <option defaultValue='all' value='all'>
          Все пользователи
        </option>
        {publishers.map((x, ind) => (
          <option key={ind} value={x}>
            {x}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PublisherFilter;
