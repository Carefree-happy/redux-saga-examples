import { combineReducers } from "redux";
import { countdown, counter } from "./counter";

const rootReducer = combineReducers({
  countdown,
  counter,
});

export default rootReducer;
