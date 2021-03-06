import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadTexts, clearTexts } from "../../actions/texts";
import Spinner from "../layout/Spinner";
import TextCard from "./TextCard";
import ReadingCard from "../dashboard/ReadingCard";
import { Helmet } from "react-helmet";
import PleaseShare from "../common/PleaseShare";
import LevelFilter from "./common/LevelFilter";
import CategoryFilter from "./common/CategoryFilter";
import ReadFilter from "../common/ReadFilter";
import AudioFilter from "./common/AudioFilter";
import UnsetFiltersBtn from "./common/UnsetFiltersBtn";
import ContentInfoCard from "../common/ContentInfoCard";

const Texts = ({ loadTexts, texts, loading, moreTexts, clearTexts }) => {
  const [categoryFlag, setCategoryFlag] = useState(0);
  const [hideReadFlag, setHideReadFlag] = useState(0);
  const [hideLevelFlag, setHideLevelFlag] = useState(0);
  const [withAudio, setWithAudio] = useState(false);

  useEffect(() => {
    loadTexts(texts.length, +categoryFlag - 1, hideLevelFlag, withAudio);
  }, [categoryFlag, hideLevelFlag, withAudio]);

  const onLevelSelect = (e) => {
    clearTexts();
    setHideLevelFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));
  };

  const onReadSelect = (e) => {
    // clearTexts();
    setHideReadFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));
  };

  const onCategorySelect = (e) => {
    clearTexts();
    setCategoryFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));
  };

  const onAudioSelect = (bool) => {
    clearTexts();
    setWithAudio(bool);
  };

  const clearFilters = () => {
    setWithAudio(false);
    clearTexts();
    setCategoryFlag(0);
    setHideReadFlag(0);
    setHideLevelFlag(0);
    loadTexts(0, -1);
    document.getElementById("levelFilt").value = 0;
    document.getElementById("readFilt").value = 0;
    document.getElementById("categoryFilt").value = 0;
  };

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>???????????? ???? ?????????????????? ?????????? ?? ?????????????????? | Chinese+</title>
      </Helmet>

      <div className='col-md-3'>
        <ContentInfoCard text={"???????????? ?????????????????? ?????????????? ?? ?????????? ??????????????????."} />
        <PleaseShare />
        <ReadingCard />
      </div>

      <div className='col-md-9'>
        <h2>???????????? ???? ?????????????????? ?????????? ?? ??????????????????</h2>

        <div className='form-group row'>
          <LevelFilter onChange={onLevelSelect} />
          <ReadFilter onChange={onReadSelect} />
          <CategoryFilter onChange={onCategorySelect} />

          <div className='com-sm-3 w-100'></div>

          <AudioFilter onClick={onAudioSelect} withAudio={withAudio} />
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
                  onClick={() =>
                    loadTexts(texts.length, Number(categoryFlag) - 1, hideLevelFlag, withAudio)
                  }
                >
                  ?????????????????? ??????
                </button>
              ) : (
                <button type='button' className='btn btn-warning btn-sm mb-1' disabled>
                  ???????????? ??????
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

export default connect(mapStateToProps, { loadTexts, clearTexts })(Texts);
