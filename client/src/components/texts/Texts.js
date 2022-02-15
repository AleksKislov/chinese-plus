import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadTexts, clearText, clearTexts } from "../../actions/texts";
import Spinner from "../layout/Spinner";
import TextCard from "./TextCard";
import ReadingCard from "../dashboard/ReadingCard";
import { Helmet } from "react-helmet";
import PleaseShareText from "./common/PleaseShareText";
import LevelFilter from "./common/LevelFilter";
import CategoryFilter from "./common/CategoryFilter";
import ReadFilter from "./common/ReadFilter";
import UnsetFiltersBtn from "./common/UnsetFiltersBtn";
import TextsInfoCard from "./common/TextsInfoCard";

const Texts = ({ loadTexts, texts, loading, clearText, moreTexts, clearTexts }) => {
  const [categoryFlag, setCategoryFlag] = useState(0);
  const [hideReadFlag, setHideReadFlag] = useState(0);
  const [hideLevelFlag, setHideLevelFlag] = useState(0);

  useEffect(() => {
    loadTexts(texts.length, Number(categoryFlag) - 1);
  }, [categoryFlag]);

  const onLevelSelect = (e) =>
    setHideLevelFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));

  const onReadSelect = (e) =>
    setHideReadFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));

  const onCategorySelect = (e) => {
    clearTexts();
    setCategoryFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));
  };

  const clearFilters = () => {
    clearTexts();
    setCategoryFlag(0);
    setHideReadFlag(0);
    setHideLevelFlag(0);
    document.getElementById("levelFilt").value = 0;
    document.getElementById("readFilt").value = 0;
    document.getElementById("categoryFilt").value = 0;
  };

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Тексты на китайском языке с переводом | Chinese+</title>
      </Helmet>

      <div className='col-md-3'>
        <TextsInfoCard text={"Чтение китайских текстов с умным переводом."} />
        <PleaseShareText />
        <ReadingCard />
      </div>

      <div className='col-md-9'>
        <h2>Тексты на китайском языке с переводом</h2>

        <div className='form-group row'>
          <LevelFilter onChange={onLevelSelect} />
          <ReadFilter onChange={onReadSelect} />
          <CategoryFilter onChange={onCategorySelect} />
          <UnsetFiltersBtn onClick={clearFilters} />
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className=''>
            {texts.map((text) => (
              <TextCard
                key={text._id}
                text={text}
                hide={hideReadFlag}
                category={categoryFlag}
                hideLevel={hideLevelFlag}
              />
            ))}
            <div className='text-center'>
              {moreTexts ? (
                <button
                  type='button'
                  className='btn btn-info btn-sm mb-1'
                  onClick={() => loadTexts(texts.length, Number(categoryFlag) - 1)}
                >
                  Загрузить Ещё
                </button>
              ) : (
                <button type='button' className='btn btn-warning btn-sm mb-1' disabled>
                  Больше нетути
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  texts: state.texts.texts,
  loading: state.texts.loading,
  moreTexts: state.texts.moreTexts,
  user: state.auth.user,
});

export default connect(mapStateToProps, { loadTexts, clearText, clearTexts })(Texts);
