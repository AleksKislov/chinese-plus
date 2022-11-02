import React, { useState, useEffect } from "react";
import axios from "axios";

const Notice = () => {
  const [notice, setNotice] = useState(null);
  useEffect(() => {
    loadNotice();
  }, []);

  const loadNotice = async () => {
    try {
      const { data } = await axios.get("/api/notices");
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
          <div className={`alert alert-dismissible text-center alert-${notice.color}`}>
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
