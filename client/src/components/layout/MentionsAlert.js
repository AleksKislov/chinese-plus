import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const MentionsAlert = ({ mentionsLen, isAuthenticated }) => {
  return (
    isAuthenticated &&
    mentionsLen > 0 && (
      <div className='row'>
        <div className='col-md-12'>
          <div className='alert alert-dismissible alert-warning'>
            <button type='button' className='close' data-dismiss='alert'>
              &times;
            </button>
            У Вас есть непрочитанные{" "}
            <Link to='/mentions'>
              <strong>сообщения</strong>
            </Link>
          </div>
        </div>
      </div>
    )
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  mentionsLen: state.comments.mentionsLen
});

export default connect(mapStateToProps, {})(MentionsAlert);
