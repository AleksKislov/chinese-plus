import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { changeFontSize } from "../../actions/profile";

const FontSize = ({ changeFontSize, fontsize }) => {
  const [active, setActive] = useState([false, true, false]);

  useEffect(() => {
    const smBtn = document.getElementById("smallfont");
    const medBtn = document.getElementById("mediumfont");
    const bigBtn = document.getElementById("bigfont");

    if (smBtn.dataset.size === fontsize) setActive([true, false, false]);
    if (medBtn.dataset.size === fontsize) setActive([false, true, false]);
    if (bigBtn.dataset.size === fontsize) setActive([false, false, true]);

    // return () => {
    //   cleanup;
    // };
  }, [fontsize]);

  return (
    <h6 className='card-subtitle mb-2'>
      <span className='text-muted'>Шрифт: </span>
      <div className='btn-group' role='group' onClick={e => changeFontSize(e.target.dataset.size)}>
        <button
          type='button'
          className={`btn btn-sm btn-secondary${active[0] ? "-active" : ""}`}
          id='smallfont'
          data-size='-sm'
        >
          小
        </button>
        <button
          type='button'
          className={`btn btn-sm btn-secondary${active[1] ? "-active" : ""}`}
          id='mediumfont'
          data-size=''
        >
          中
        </button>
        <button
          type='button'
          className={`btn btn-sm btn-secondary${active[2] ? "-active" : ""}`}
          id='bigfont'
          data-size='-bg'
        >
          大
        </button>
      </div>
    </h6>
  );
};

const mapStateToProps = state => ({
  fontsize: state.profile.fontsize
});

export default connect(mapStateToProps, { changeFontSize })(FontSize);
