import {
  GET_COMMENTS_ERR,
  GET_COMMENTS,
  GET_10COMMENTS,
  SET_COMMENT_TO_DEL,
  SET_MENTIONS_LEN,
  SET_COMMENT_REPLY,
  UNSET_COMMENT_REPLY,
  EDIT_COMMENT,
  LIKE_COMMENT
} from "../actions/types";

const initialState = {
  currentComments: [],
  lastComments: [],
  commentToDelete: null,
  mentionsLen: 0,
  commentIdToReply: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_10COMMENTS:
      return {
        ...state,
        lastComments: payload
      };
    case EDIT_COMMENT:
      return {
        ...state,
        commentToDelete: null,
        currentComments: state.currentComments.map(x => {
          if (x._id === payload.id) x.text = payload.text;
          return x;
        })
      };
    case LIKE_COMMENT:
      return {
        ...state,
        currentComments: state.currentComments.map(comment =>
          comment._id === payload.id ? { ...comment, likes: payload.likes } : comment
        )
      };
    case GET_COMMENTS:
      return {
        ...state,
        currentComments: payload,
        commentToDelete: null
      };
    case SET_MENTIONS_LEN:
      return {
        ...state,
        mentionsLen: payload
      };
    case GET_COMMENTS_ERR:
      return {
        ...state
      };
    case SET_COMMENT_REPLY:
      return {
        ...state,
        commentIdToReply: payload
      };
    case UNSET_COMMENT_REPLY:
      return {
        ...state,
        commentIdToReply: null
      };
    case SET_COMMENT_TO_DEL:
      return { ...state, commentToDelete: payload };
    default:
      return state;
  }
}
