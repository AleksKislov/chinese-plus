import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { textCategories } from "../../constants/consts.json";
import { levelStars } from "../../actions/helpers.js";
import Tippy from "@tippyjs/react";

const AllUserTextsTableItem = ({ text }) => {
  const { _id, level, title, likes, hits, categoryInd, comments_id } = text;

  const [isDark, setIsDark] = useState("");
  useEffect(() => {
    setIsDark(+localStorage.isDarkTheme ? "light-border" : "");
  }, []);

  return (
    <tr>
      <td>{levelStars(level)}</td>
      <td className='text-left'>
        <Link to={`/texts/${_id}`}>{title}</Link>
      </td>
      <td>{textCategories[categoryInd]}</td>

      <Tippy theme={isDark} content={`${likes.length} раз сказали спасибо`} placement='bottom'>
        <td>{likes.length}</td>
      </Tippy>
      <Tippy theme={isDark} content={`${hits} просмотров`} placement='bottom'>
        <td>{hits}</td>
      </Tippy>
      <Tippy theme={isDark} content={`${comments_id.length} комментариев`} placement='bottom'>
        <td>{comments_id.length}</td>
      </Tippy>
    </tr>
  );
};

export default AllUserTextsTableItem;
