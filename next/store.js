import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

export default store;
