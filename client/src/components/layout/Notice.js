import React, { useState, useEffect } from "react";
import axios from "axios";

const Notice = ({}) => {
  const [notice, setNotice] = useState(null);
  useEffect(() => {
    loadNotice();
  }, []);

  const loadNotice = async () => {
    try {
      const { data } = await axios.get("/api/notices");
      // console.log(data);
      setNotice(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    notice &&
    notice.display && (
      <div className='row'>
        <div className='col-md-12'>
          <div className='alert alert-dismissible alert-light text-center'>
            <button type='button' className='close' data-dismiss='alert'>
              &times;
            </button>
            {notice.text}
          </div>
        </div>
      </div>
    )
  );
};

export default Notice;
