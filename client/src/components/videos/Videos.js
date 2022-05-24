import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadVideos, clearVideos } from "../../actions/videos";
import Spinner from "../layout/Spinner";
import VideoCard from "./VideoCard";
import ReadingCard from "../dashboard/ReadingCard";
import { Helmet } from "react-helmet";
import PleaseShare from "../common/PleaseShare";

import LevelFilter from "../texts/common/LevelFilter";
import CategoryFilter from "./CategoryFilter";
import ReadFilter from "../common/ReadFilter";
import UnsetFiltersBtn from "../texts/common/UnsetFiltersBtn";

import ContentInfoCard from "../common/ContentInfoCard";

const Videos = ({ loadVideos, videos, loading, moreVideos, clearVideos }) => {
  const [categoryFlag, setCategoryFlag] = useState();
  const [hideReadFlag, setHideReadFlag] = useState(0);
  const [hideLevelFlag, setHideLevelFlag] = useState(0);

  useEffect(() => {
    loadVideos(videos.length, categoryFlag);
  }, [categoryFlag]);

  const onLevelSelect = (e) =>
    setHideLevelFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));

  const onReadSelect = (e) =>
    setHideReadFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));

  const onCategorySelect = (e) => {
    clearVideos();
    setCategoryFlag(e.target.options[e.target.options.selectedIndex].value);
  };

  const clearFilters = () => {
    clearVideos();
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
        <title>Видео на китайском языке с переводом | Chinese+</title>
      </Helmet>

      <div className='col-md-3'>
        <ContentInfoCard
          text={"Тройные субтитры (оригинал, пиньинь и перевод) для видео на китайском языке."}
          contentType={"video"}
        />
        <PleaseShare contentType={"video"} />
        <ReadingCard />
      </div>

      <div className='col-md-9'>
        <h2>Китайские видео с умными субтитрами</h2>

        <div className='form-group row'>
          <LevelFilter onChange={onLevelSelect} />
          <ReadFilter onChange={onReadSelect} isVideos={true} />
          <CategoryFilter onChange={onCategorySelect} />
          <UnsetFiltersBtn onClick={clearFilters} />
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className=''>
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                hide={hideReadFlag}
                categoryChosen={categoryFlag}
                hideLevel={hideLevelFlag}
              />
            ))}

            <div className='text-center'>
              {moreVideos ? (
                <button
                  type='button'
                  className='btn btn-info btn-sm mb-1'
                  onClick={() => loadVideos(videos.length, categoryFlag)}
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
  videos: state.videos.videos,
  loading: state.videos.loading,
  moreVideos: state.videos.moreVideos,
  user: state.auth.user,
});

export default connect(mapStateToProps, { loadVideos, clearVideos })(Videos);
