import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getLastComments } from "../../actions/comments";
import { Link } from "react-router-dom";
import { fromNow } from "../../actions/helpers";
import Spinner from "../layout/Spinner";

const CommentsCard = ({ getLastComments, comments, loading }) => {
  useEffect(() => {
    getLastComments();
  }, [getLastComments]);

  return (
    <div className=''>
      <h4 className=''>Последние 10 комментариев:</h4>
      <ul className='list-group'>
        {!loading ? (
          comments.map(comment => (
            <Link
              to={`/${comment.destination}s/${comment.path || comment.post_id}`}
              className='list-group-item list-group-item-action'
              key={comment._id}
            >
              <span className='text-success'>{comment.name}</span>
              <span className='badge badge-primary float-right mx-2'>{fromNow(comment.date)}</span>
              <p dangerouslySetInnerHTML={{ __html: comment.text }} className='commentP'></p>
            </Link>
          ))
        ) : (
          <Spinner />
        )}
      </ul>
    </div>
  );
};

const mapStateTioProps = state => ({
  comments: state.comments.lastComments,
  loading: state.posts.loading
});

export default connect(mapStateTioProps, { getLastComments })(CommentsCard);
