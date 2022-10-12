import { call, cancelled, put, race, take } from "redux-saga/effects";
import { countdown, incrementAsync, watchIncrementAsync } from "../sagas";

const getState = () => ({ value: 10 });
const action = (type) => ({ type });

test("watchIncrementAsync Saga", async () => {
  const generator = watchIncrementAsync();

  expect(generator.next().value).toEqual(take("INCREMENT_ASYNC"));

  expect(generator.next(getState()).value).toEqual(
    race([call(incrementAsync, getState()), take("CANCEL_INCREMENT_ASYNC")])
  );
});

test("incrementAsync Saga successful", async () => {
  const generator = incrementAsync(getState());

  expect(generator.next().value).toEqual(call(countdown, getState().value));

  const chan = countdown(getState().value);

  expect(generator.next(chan).value).toEqual(take(chan));

  expect(generator.next(9).value).toEqual(
    put({ type: "INCREMENT_ASYNC", value: 9 })
  );

  expect(generator.return().value).toEqual(cancelled());

  expect(generator.next(false).value).toEqual(put(action("INCREMENT")));

  expect(generator.next().value).toEqual(put(action("COUNTDOWN_TERMINATED")));
});

test("incrementAsync Saga with cancellation", async () => {
  const generator = incrementAsync(getState());
  expect(generator.next().value).toEqual(call(countdown, getState().value));

  const chan = countdown(getState().value);
  expect(generator.next(chan).value).toEqual(take(chan));

  expect(generator.next(9).value).toEqual(
    put({ type: "INCREMENT_ASYNC", value: 9 })
  );

  expect(generator.return().value).toEqual(cancelled());

  expect(generator.next(true).done).toBeTruthy();
});
