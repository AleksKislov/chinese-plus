import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadNotAppoved, clearText } from "../../actions/texts";
import Spinner from "../layout/Spinner";
import NotApprovedTextCard from "./NotApprovedTextCard";
import ReadingCard from "../dashboard/ReadingCard";
import TextsInfoCard from "./common/TextsInfoCard";

const NotApprovedTexts = ({ loadNotAppoved, texts, loading, clearText, moreTexts }) => {
  useEffect(() => {
    clearText();
    if (texts.length === 0) loadNotAppoved(0);
  }, []);

  return (
    <div className='row'>
      <div className='col-md-3'>
        <TextsInfoCard text={"Эти тексты ожидают проверки модератором"} />
        <ReadingCard />
      </div>

      <div className='col-md-9'>
        <h2>Тексты, ожидающие проверки</h2>

        {loading ? (
          <Spinner />
        ) : (
          <div className=''>
            {texts.map(text => (
              <NotApprovedTextCard key={text._id} text={text} />
            ))}
            <div className='text-center'>
              {moreTexts ? (
                <button
                  type='button'
                  className='btn btn-info btn-sm mb-1'
                  onClick={() => loadNotAppoved(texts.length)}
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

const mapStateToProps = state => ({
  texts: state.texts.not_approved,
  loading: state.texts.loading,
  moreTexts: state.texts.moreNotApproved
});

export default connect(mapStateToProps, { loadNotAppoved, clearText })(NotApprovedTexts);
