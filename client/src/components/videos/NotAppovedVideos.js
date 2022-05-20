import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadNotAppoved, clearVideo } from "../../actions/videos";
import Spinner from "../layout/Spinner";
import VideoCard from "./VideoCard";
import ReadingCard from "../dashboard/ReadingCard";
import ContentInfoCard from "../common/ContentInfoCard";

const NotApprovedVideos = ({ loadNotAppoved, videos, loading, clearVideo, moreVideos }) => {
  useEffect(() => {
    clearVideo();
    if (videos.length === 0) loadNotAppoved(0);
  }, []);

  return (
    <div className='row'>
      <div className='col-md-3'>
        <ContentInfoCard text={"Эти видео ожидают проверки модератором"} contentType={"video"} />
        <ReadingCard />
      </div>

      <div className='col-md-9'>
        <h2>Видео, ожидающие проверки</h2>

        {loading ? (
          <Spinner />
        ) : (
          <div className=''>
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} hideLevel={0} hide={0} />
            ))}
            <div className='text-center'>
              {moreVideos ? (
                <button
                  type='button'
                  className='btn btn-info btn-sm mb-1'
                  onClick={() => loadNotAppoved(videos.length)}
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
  videos: state.videos.notApproved,
  loading: state.videos.loading,
  moreVideos: state.videos.moreNotApproved,
});

export default connect(mapStateToProps, { loadNotAppoved, clearVideo })(NotApprovedVideos);
