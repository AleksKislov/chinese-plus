import {
  ADD_POST,
  ADD_POST_ERR,
  LOAD_POSTS,
  LOAD_POST,
  LOAD_POSTS_ERR,
  LOAD_POST_ERR,
  ADD_DISLIKE,
  ADD_LIKE,
  GET_COMMENTS,
  ADD_COMMENT,
  GET_10COMMENTS,
  GET_COMMENTS_ERR,
  CLEAR_POSTS,
  CLEAR_POST
} from "../actions/types";

const initialState = {
  posts: [],
  morePosts: true,
  post: null,
  loading: true,
  currentComments: [],
  lastComments: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_POSTS:
      return {
        ...state,
        posts: [...state.posts, ...payload],
        morePosts: payload.length === 5 ? true : false,
        loading: false
      };
    case ADD_POST:
      return {
        ...state
        // posts: [payload, ...state.posts]
      };
    case CLEAR_POSTS:
      return {
        ...state,
        posts: [],
        loading: true
      };
    case CLEAR_POST:
      return {
        ...state,
        post: null
        // loading: true
      };
    case GET_10COMMENTS:
      return {
        ...state,
        lastComments: payload,
        loading: false
      };
    case GET_COMMENTS:
      return {
        ...state,
        currentComments: payload,
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        currentComments: payload
      };
    case ADD_DISLIKE:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.id ? { ...post, dislikes: payload.dislikes } : post
        )
      };
    case ADD_LIKE:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        )
      };
    case LOAD_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };
    case ADD_POST_ERR:
    case LOAD_POSTS_ERR:
    case GET_COMMENTS_ERR:
    case LOAD_POST_ERR:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
