/* eslint-disable no-constant-condition */

import { END, eventChannel } from "redux-saga";
import { call, cancelled, fork, put, race, take } from "redux-saga/effects";
import {
  CANCEL_INCREMENT_ASYNC,
  COUNTDOWN_TERMINATED,
  INCREMENT,
  INCREMENT_ASYNC,
} from "../actionTypes";

const action = (type) => ({ type });

/*eslint-disable no-console*/
export const countdown = (secs) => {
  console.log("countdown", secs);
  return eventChannel((listener) => {
    const iv = setInterval(() => {
      secs -= 1;
      console.log("countdown", secs);
      if (secs > 0) listener(secs);
      else {
        listener(END);
        clearInterval(iv);
        console.log("countdown terminated");
      }
    }, 1000);
    return () => {
      clearInterval(iv);
      console.log("countdown cancelled");
    };
  });
};

export function* incrementAsync({ value }) {
  const chan = yield call(countdown, value);
  try {
    while (true) {
      let seconds = yield take(chan);
      yield put({
        type: INCREMENT_ASYNC,
        value: seconds,
      });
    }
  } finally {
    if (!(yield cancelled())) {
      yield put(action(INCREMENT));
      yield put(action(COUNTDOWN_TERMINATED));
    }
    chan.close();
  }
}

export function* watchIncrementAsync() {
  try {
    while (true) {
      const action = yield take(INCREMENT_ASYNC);
      // 在异步递增和用户取消操作之间启动"竞赛"
      // 如果用户取消操作获胜，incrementAsync将自动取消
      yield race([call(incrementAsync, action), take(CANCEL_INCREMENT_ASYNC)]);
    }
  } finally {
    console.log("watchIncrementAsync terminated");
  }
}

export default function* rootSaga() {
  yield fork(watchIncrementAsync);
}
