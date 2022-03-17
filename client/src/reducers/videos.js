import {
  LOAD_VIDEOS,
  LOAD_VIDEO,
  LOAD_VIDEOS_ERR,
  LOAD_VIDEO_ERR,
  CLEAR_VIDEO,
  CLEAR_VIDEOS,
  LOAD_NOT_APPROVED_VIDS,
  LIKE_VIDEO,
  GET_COMMENTS,
  ADD_COMMENT,
  SET_LOADING,
} from "../actions/types";

const initialState = {
  videos: [],
  not_approved: [],
  moreVideos: true,
  moreNotApproved: true,
  video: null,
  loading: true,
  currentComments: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_VIDEOS:
      return {
        ...state,
        video: null,
        loading: false,
        videos: [...state.videos, ...payload],
        moreVideos: payload.length === 10 ? true : false,
      };
    case GET_COMMENTS:
      return {
        ...state,
        currentComments: payload,
        loading: false,
      };
    case ADD_COMMENT:
      return {
        ...state,
        currentComments: payload,
      };
    case LIKE_VIDEO:
      return {
        ...state,
        videos: state.videos.map((video) =>
          video._id === payload.id ? { ...video, likes: payload.likes } : video
        ),
        video: state.video ? { ...state.video, likes: payload.likes } : state.video,
      };
    case CLEAR_VIDEO:
      return {
        ...state,
        video: null,
        currentComments: [],
      };
    case CLEAR_VIDEOS:
      return {
        ...state,
        videos: [],
        loading: true,
      };
    case LOAD_NOT_APPROVED_VIDS:
      return {
        ...state,
        video: null,
        loading: false,
        not_approved: [...state.not_approved, ...payload],
        moreNotApproved: payload.length >= 10 ? true : false,
      };
    case SET_LOADING:
      return {
        ...state,
        video: null,
        currentComments: [],
        loading: payload,
      };
    case LOAD_VIDEOS_ERR:
    case LOAD_VIDEO_ERR:
      return {
        ...state,
        loading: false,
      };

    case LOAD_VIDEO:
      return {
        ...state,
        video: payload,
        loading: false,
      };
    default:
      return {
        ...state,
      };
  }
}
