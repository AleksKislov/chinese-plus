import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const NumOfTexts = () => {
  const loadNums = async () => {
    try {
      const { data } = await axios.get("api/texts/approved_num");
      setNum(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadNums();
  }, []);

  const [num, setNum] = useState({ approved: 0, notApproved: 0 });

  return (
    <p className='card-text'>
      <Link className='card-link' to='/texts'>
        Проверенные:
      </Link>{" "}
      <span className='badge badge-success float-right' style={badgeStyle}>
        {num.approved}
      </span>
      <br />
      <Link className='card-link' to='/not_approved_texts'>
        На проверке:
      </Link>
      <span className='badge badge-success float-right' style={badgeStyle}>
        {num.notApproved}
      </span>
    </p>
  );
};

const badgeStyle = {
  marginTop: "0.2rem"
};

export default NumOfTexts;
