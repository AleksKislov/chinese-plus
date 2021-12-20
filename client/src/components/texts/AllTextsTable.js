import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../layout/Spinner";
import Tippy from "@tippyjs/react";
import AllTextsTableItem from "./AllTextsTableItem";
import LevelFilter from "./common/LevelFilter";
import CategoryFilter from "./common/CategoryFilter";
import PublisherFilter from "./common/PublisherFilter";
import ReadFilter from "./common/ReadFilter";
import UnsetFiltersBtn from "./common/UnsetFiltersBtn";
import { Helmet } from "react-helmet";
import TextsInfoCard from "./common/TextsInfoCard";
import PleaseShareText from "./common/PleaseShareText";
import ReadingCard from "../dashboard/ReadingCard";
import { connect } from "react-redux";

const AllTextsTable = ({ user }) => {
  useEffect(() => {
    loadAllTexts();
  }, []);

  const [texts, setTexts] = useState(null);
  const [dateClicked, setDateClicked] = useState(true);
  const [hitsClicked, setHitsClicked] = useState(true);
  const [likesClicked, setLikesClicked] = useState(true);
  const [commentsClicked, setCommentsClicked] = useState(true);
  const [publishers, setPublishers] = useState(null);

  useEffect(() => {
    if (texts) setPublishers([...new Set(texts.map(text => text.name))]);
  }, [texts]);

  useEffect(() => {
    setTexts(texts);
  }, [hitsClicked, likesClicked, commentsClicked, dateClicked]);

  const loadAllTexts = async () => {
    try {
      const { data } = await axios.get("/api/texts");
      setTexts(data);
    } catch (err) {
      console.log(err);
    }
  };
  const [publisherFlag, setPublisherFlag] = useState("all");
  const [categoryFlag, setCategoryFlag] = useState(0);
  const [hideReadFlag, setHideReadFlag] = useState(0);
  const [hideLevelFlag, setHideLevelFlag] = useState(0);

  const onLevelSelect = e =>
    setHideLevelFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));

  const onReadSelect = e =>
    setHideReadFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));

  const onCategorySelect = e => {
    setCategoryFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));
  };

  const onPublisherSelect = e => {
    setPublisherFlag(e.target.options[e.target.options.selectedIndex].value);
  };

  const clearFilters = () => {
    setCategoryFlag(0);
    setHideReadFlag(0);
    setHideLevelFlag(0);
    setPublisherFlag("all");
    document.getElementById("levelFilt").value = 0;
    document.getElementById("readFilt").value = 0;
    document.getElementById("categoryFilt").value = 0;
    document.getElementById("publisherFilt").value = "all";
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

  const sortByDate = () => {
    setTexts(
      texts.sort((a, b) =>
        dateClicked ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
      )
    );
    setDateClicked(!dateClicked);
  };

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Тексты на китайском языке с переводом | Chinese+</title>
      </Helmet>
      <div className='col-sm-3'>
        <TextsInfoCard text={"Все проверенные тексты Читалки единым списком"} />
        <PleaseShareText />
        <ReadingCard />
      </div>

      <div className='col-sm-9'>
        <h2>Тексты на китайском языке с переводом</h2>

        <div className='form-group row'>
          <LevelFilter onChange={onLevelSelect} />
          <ReadFilter onChange={onReadSelect} />
          <CategoryFilter onChange={onCategorySelect} />
          <PublisherFilter onChange={onPublisherSelect} publishers={publishers ? publishers : []} />

          <UnsetFiltersBtn onClick={clearFilters} />
        </div>
        <div className='table-responsive'>
          <table className='table table-hover text-center'>
            <thead>
              <tr className='table-info'>
                <th style={thStyle}>
                  <div onClick={sortByDate} style={{ cursor: "pointer" }}>
                    Дата <i className='fas fa-sort'></i>
                  </div>
                </th>
                <th>Уровень</th>
                <th className='text-left'>Название</th>
                <th>Категория</th>
                <th>Опубликовал</th>
                <Tippy content='Кол-во благодарностей' placement='top'>
                  <th style={thStyle}>
                    <div onClick={sortByLikes} style={{ cursor: "pointer" }}>
                      <i className='fas fa-heart'></i> <i className='fas fa-sort'></i>
                    </div>
                  </th>
                </Tippy>
                <Tippy content='Кол-во просмотров' placement='top'>
                  <th style={thStyle}>
                    <div onClick={sortByHits} style={{ cursor: "pointer" }}>
                      <i className='fas fa-eye'></i> <i className='fas fa-sort'></i>
                    </div>
                  </th>
                </Tippy>
                <Tippy content='Кол-во комментариев' placement='top'>
                  <th style={thStyle}>
                    <div onClick={sortByComments} style={{ cursor: "pointer" }}>
                      <i className='fas fa-comment-dots'></i> <i className='fas fa-sort'></i>
                    </div>
                  </th>
                </Tippy>
                {user && (
                  <Tippy content='Прочитано ли' placement='top'>
                    <th style={{ paddingRight: "1.5rem" }}>
                      <i className='fas fa-clipboard-check'></i>{" "}
                    </th>
                  </Tippy>
                )}
              </tr>
            </thead>
            <tbody>
              {texts ? (
                texts.map(text => (
                  <AllTextsTableItem
                    key={text._id}
                    text={text}
                    hide={hideReadFlag}
                    category={categoryFlag}
                    hideLevel={hideLevelFlag}
                    publisher={publisherFlag}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={user ? "9" : "8"}>
                    <Spinner />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const thStyle = {
  whiteSpace: "nowrap"
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {})(AllTextsTable);
