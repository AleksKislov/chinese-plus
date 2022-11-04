import React, { useState, useEffect } from "react";
import axios from "axios";
import NoticeWell from "./NoticeWell";

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

  return notice && <NoticeWell notice={notice} />;
};

export default Notice;
