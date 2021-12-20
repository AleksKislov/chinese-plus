import React from "react";
import { Link } from "react-router-dom";
import PageButtons from "./info/PageButtons";

const ChapterItem = ({ chapter, ind, bookId }) => {
  const { chineseTitle, russianTitle, chapterId, length, pages } = chapter;

  const onClick = async e => {};

  // <td>{ind + 1}</td>
  return (
    <tr onClick={e => onClick(e)}>
      <td>{chineseTitle}</td>
      <td>
        <Link to={`/books/${bookId}/${chapterId}/0`}>{russianTitle}</Link>
      </td>
      <td>{length}</td>
      <td>
        <PageButtons pages={pages} bookId={bookId} chapterId={chapterId} />
      </td>
    </tr>
  );
};

export default ChapterItem;
