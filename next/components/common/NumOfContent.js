import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CONTENT } from "../../constants/consts.json";

const NumOfContent = ({ contentType }) => {
  const loadNums = async (content) => {
    try {
      const { data } = await axios.get(`api/${content}/${content}_num`);
      setNum(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const contentWord = contentType === CONTENT.video ? "videos" : "texts"; // plural
    setLink(contentWord);
    loadNums(contentWord);
  }, []);

  const [link, setLink] = useState("texts"); // or videos
  const [num, setNum] = useState({ approved: 0, notApproved: 0 });

  return (
    <p className='card-text'>
      <Link className='card-link' to={link}>
        Проверенные:
      </Link>{" "}
      <span className='badge badge-success float-right' style={badgeStyle}>
        {num.approved}
      </span>
      <br />
      <Link className='card-link' to={`/not_approved_${link}`}>
        На проверке:
      </Link>
      <span className='badge badge-success float-right' style={badgeStyle}>
        {num.notApproved}
      </span>
    </p>
  );
};

const badgeStyle = {
  marginTop: "0.2rem",
};

export default NumOfContent;
