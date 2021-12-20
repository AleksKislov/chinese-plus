import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../layout/Spinner";
import Tippy from "@tippyjs/react";
import AllUserTextsTableItem from "./AllUserTextsTableItem";

const AllUserTextsTable = ({ userId }) => {
  useEffect(() => {
    loadAllTexts();
  }, []);

  const [texts, setTexts] = useState(null);
  const [hitsClicked, setHitsClicked] = useState(true);
  const [likesClicked, setLikesClicked] = useState(true);
  const [commentsClicked, setCommentsClicked] = useState(true);

  useEffect(() => {
    setTexts(texts);
  }, [hitsClicked, likesClicked, commentsClicked]);

  const loadAllTexts = async () => {
    try {
      const { data } = await axios.get("/api/texts/user/" + userId);
      setTexts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const sortByHits = () => {
    setTexts(texts.sort((a, b) => (hitsClicked ? b.hits - a.hits : a.hits - b.hits)));
    setHitsClicked(!hitsClicked);
  };

  const sortByLikes = () => {
    setTexts(
      texts.sort((a, b) =>
        likesClicked ? b.likes.length - a.likes.length : a.likes.length - b.likes.length
      )
    );
    setLikesClicked(!likesClicked);
  };

  const sortByComments = () => {
    setTexts(
      texts.sort((a, b) =>
        commentsClicked
          ? b.comments_id.length - a.comments_id.length
          : a.comments_id.length - b.comments_id.length
      )
    );
    setCommentsClicked(!commentsClicked);
  };

  return (
    <div className=''>
      <h4>Тексты, опубликованные пользователем:</h4>

      {texts && texts.length > 0 && (
        <div className='table-responsive'>
          <table className='table table-hover text-center'>
            <thead>
              <tr className='table-info'>
                <th className=''>Уровень</th>
                <th className='text-left'>Название</th>
                <th>Категория</th>
                <Tippy content='Кол-во благодарностей' placement='top'>
                  <th style={thStyle}>
                    <div onClick={sortByLikes}>
                      <i className='fas fa-heart'></i> <i className='fas fa-sort'></i>
                    </div>
                  </th>
                </Tippy>
                <Tippy content='Кол-во просмотров' placement='top'>
                  <th style={thStyle}>
                    <div onClick={sortByHits}>
                      <i className='fas fa-eye'></i> <i className='fas fa-sort'></i>
                    </div>
                  </th>
                </Tippy>
                <Tippy content='Кол-во комментариев' placement='top'>
                  <th style={thStyle}>
                    <div onClick={sortByComments}>
                      <i className='fas fa-comment-dots'></i> <i className='fas fa-sort'></i>
                    </div>
                  </th>
                </Tippy>
              </tr>
            </thead>
            <tbody>
              {texts ? (
                texts.map(text => <AllUserTextsTableItem key={text._id} text={text} />)
              ) : (
                <tr>
                  <td colSpan='7'>
                    <Spinner />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  whiteSpace: "nowrap"
};

export default AllUserTextsTable;
