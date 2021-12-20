import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadPost, clearPost } from "../../actions/posts";
import { getComments } from "../../actions/comments";
import Post from "./Post";
import Comment from "../comments/Comment";
import LeaveComment from "../comments/LeaveComment";
import ConfirmModal from "../comments/ConfirmModal";

const PostPage = ({ clearPost, loadPost, post, match, loading, comments, getComments }) => {
  useEffect(() => {
    clearPost();
    setTimeout(() => {
      loadPost(match.params.id);
      getComments("post", match.params.id);
    }, 100);
  }, [loading]);

  return (
    post && (
      <div className='row'>
        <ConfirmModal />
        <div className='col-sm-6'>
          <Link to='/posts'>
            <button className='btn btn-outline-info my-2 btn-sm'>Назад</button>
          </Link>
          <Post post={post} isPage={true} />

          <LeaveComment _id={post._id} where={"post"} />
        </div>
        <div className='col-sm-6'>
          <div className='my-2 mx-2'>
            <h4>Комментарии:</h4>

            {comments.length > 0 &&
              comments.map(comment => <Comment key={comment._id} comment={comment} />)}
          </div>
        </div>
      </div>
    )
  );
};

PostPage.propTypes = {
  loadPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.posts.post,
  loading: state.posts.loading,
  comments: state.comments.currentComments,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { loadPost, getComments, clearPost })(PostPage);
