import { applyMiddleware, createStore } from "redux"
import sagaMiddleware from "redux-saga"
import { delay } from "redux-saga/effects"
import {
    errorInCallAsyncSaga,
    errorInCallInlineSaga,
    errorInDelegateSaga,
    errorInForkSaga,
    errorInPutSaga,
    errorInRaceSaga,
    errorInRetrySaga,
    errorInSelectSaga,
    funcExpressionSaga,
    primitiveErrorSaga
} from "../sagas"

test("when run saga via sagaMiddleware errors are shown in logs", () => {
    const middleware = sagaMiddleware({
        onError: function mute() {}
    })
    createStore(() => ({}), {}, applyMiddleware(middleware))
    middleware
        .run(errorInCallAsyncSaga)
        .toPromise()
        .then(() => jest.end())
        .catch((/*error*/) => jest.end())
})

test("when run generator manually errors aren't shown in logs", () => {
    const generator = errorInCallAsyncSaga()

    expect(generator.next().value).toEqual(delay(100))

    try {
        generator.next()
    } catch (e) {
        // just ignore errors to prevent tests from failing
    }
})

test("error in async call: shows correct error logs with source of error", () => {
    const actual = []
    const middleware = sagaMiddleware({
        onError(error, { sagaStack }) {
            actual.push(error.message, sagaStack)
        }
    })
    createStore(() => ({}), {}, applyMiddleware(middleware))

    // eslint-disable-next-line jest/valid-expect-in-promise
    middleware
        .run(errorInCallAsyncSaga)
        .toPromise()
        .catch((/*error*/) => {
            const expected = [
                "undefinedIsNotAFunction is not defined",
                "The above error occurred in task throwAnErrorSaga  src/sagas/index.js?16\n    created by errorInCallAsyncSaga  src/sagas/index.js?25\n"
            ]
            // eslint-disable-next-line
            expect(actual).toEqual(expected)
        })
})

test("error in inlined saga:shows correct error logs with source of error", () => {
    const actual = []
    const middleware = sagaMiddleware({
        onError(error, { sagaStack }) {
            actual.push(error.message, sagaStack)
        }
    })
    createStore(() => ({}), {}, applyMiddleware(middleware))
    // eslint-disable-next-line jest/valid-expect-in-promise
    middleware
        .run(errorInCallInlineSaga)
        .toPromise()
        .catch((/*error*/) => {
            const expected = [
                "undefinedIsNotAFunction is not defined",
                "The above error occurred in task anonymous\n    created by errorInCallInlineSaga\n"
            ]
            // eslint-disable-next-line
            expect(actual).toEqual(expected)
        })
})

test("error in fork:shows correct error logs with source of error", () => {
    const actual = []
    const middleware = sagaMiddleware({
        onError(error, { sagaStack }) {
            actual.push(error.message, sagaStack)
        }
    })
    createStore(() => ({}), {}, applyMiddleware(middleware))

    // eslint-disable-next-line jest/valid-expect-in-promise
    middleware
        .run(errorInForkSaga)
        .toPromise()
        .catch((/*error*/) => {
            const expected = [
                "undefinedIsNotAFunction is not defined",
                "The above error occurred in task throwAnErrorSaga  src/sagas/index.js?16\n    created by errorInForkSaga  src/sagas/index.js?37\n"
            ]
            // eslint-disable-next-line
            expect(actual).toEqual(expected)
        })
})

test("error in race: shows correct error logs with source of error", () => {
    const actual = []
    const middleware = sagaMiddleware({
        onError(error, { sagaStack }) {
            actual.push(error.message, sagaStack)
        }
    })
    createStore(() => ({}), {}, applyMiddleware(middleware))
    // eslint-disable-next-line jest/valid-expect-in-promise
    middleware
        .run(errorInRaceSaga)
        .toPromise()
        .catch((/* error */) => {
            const expected = [
                "undefinedIsNotAFunction is not defined",
                "The above error occurred in task throwAnErrorSaga  src/sagas/index.js?16\n    created by errorInRaceSaga  src/sagas/index.js?47\n"
            ]
            // eslint-disable-next-line
            expect(actual).toEqual(expected)
        })
})

test("error in delegated saga: doesn't show delegated in error stack", () => {
    const actual = []
    const middleware = sagaMiddleware({
        onError(error, { sagaStack }) {
            actual.push(error.message, sagaStack)
        }
    })
    createStore(() => ({}), {}, applyMiddleware(middleware))

    // eslint-disable-next-line jest/valid-expect-in-promise
    middleware
        .run(errorInDelegateSaga)
        .toPromise()
        .catch((/* error */) => {
            const expected = [
                "undefinedIsNotAFunction is not defined",
                "The above error occurred in task throwAnErrorSaga  src/sagas/index.js?16\n    created by errorInDelegateSaga  src/sagas/index.js?69\n"
            ]
            // eslint-disable-next-line
            expect(actual).toEqual(expected)
        })
})

test("error in helper: shows correct error logs with source of error", () => {
    const actual = []
    const middleware = sagaMiddleware({
        onError(error, { sagaStack }) {
            actual.push(error.message, sagaStack)
        }
    })
    createStore(() => ({}), {}, applyMiddleware(middleware))

    // eslint-disable-next-line jest/valid-expect-in-promise
    middleware
        .run(errorInRetrySaga)
        .toPromise()
        .catch((/* error */) => {
            const expected = [
                "undefinedIsNotAFunction is not defined",
                "The above error occurred in task retry\n    created by errorInRetrySaga  src/sagas/index.js?73\n"
            ]
            // eslint-disable-next-line
            expect(actual).toEqual(expected)
        })
})

test("error in select: shows correct error logs with source of error", () => {
    const actual = []
    const middleware = sagaMiddleware({
        onError(error, { sagaStack }) {
            actual.push(error.message, sagaStack)
        }
    })
    createStore(() => ({}), {}, applyMiddleware(middleware))

    // eslint-disable-next-line jest/valid-expect-in-promise
    middleware
        .run(errorInSelectSaga)
        .toPromise()
        .catch((/* error */) => {
            const expected = [
                "undefinedIsNotAFunction is not defined",
                "The above error occurred in task errorInSelectSaga  src/sagas/index.js?11 \n when executing effect select(errorGeneratorSelector)  src/sagas/index.js?13\n"
            ]
            // eslint-disable-next-line
            expect(actual).toEqual(expected)
        })
})

test("error in put: shows correct error logs with source of error", () => {
    const actual = []
    const middleware = sagaMiddleware({
        onError(error, { sagaStack }) {
            actual.push(error.message, sagaStack)
        }
    })

    function rootReducer(state = {}, action) {
        if (action.type === "REDUCER_ACTION_ERROR_IN_PUT") throw new Error("error in put")
        return state
    }
    createStore(rootReducer, {}, applyMiddleware(middleware))

    // eslint-disable-next-line jest/valid-expect-in-promise
    middleware
        .run(errorInPutSaga)
        .toPromise()
        .catch((/* error */) => {
            const expected = [
                "error in put",
                "The above error occurred in task errorInPutSaga  src/sagas/index.js?6 \n when executing effect put({ type: 'REDUCER_ACTION_ERROR_IN_PUT' })  src/sagas/index.js?8\n"
            ]
            // eslint-disable-next-line
            expect(actual).toEqual(expected)
        })
})

test("error in functional expression saga: shows correct error logs with source of error", () => {
    const actual = []
    const middleware = sagaMiddleware({
        onError(error, { sagaStack }) {
            actual.push(error.message, sagaStack)
        }
    })

    createStore(() => ({}), {}, applyMiddleware(middleware))

    // eslint-disable-next-line jest/valid-expect-in-promise
    middleware
        .run(funcExpressionSaga)
        .toPromise()
        .catch((/* error */) => {
            const expected = [
                "undefinedIsNotAFunction is not defined",
                "The above error occurred in task throwAnErrorSaga  src/sagas/index.js?16\n    created by functionExpressionSaga  src/sagas/index.js?79\n"
            ]
            // eslint-disable-next-line
            expect(actual).toEqual(expected)
        })
})

test("should return error stack if primitive is thrown", () => {
    const actual = []
    const middleware = sagaMiddleware({
        onError(error, { sagaStack }) {
            actual.push(error, sagaStack)
        }
    })

    createStore(() => ({}), {}, applyMiddleware(middleware))

    // eslint-disable-next-line jest/valid-expect-in-promise
    middleware
        .run(primitiveErrorSaga)
        .toPromise()
        .catch((/* error */) => {
            const expected = ["error reason", "The above error occurred in task primitiveErrorSaga  src/sagas/index.js?83\n"]
            // eslint-disable-next-line
            expect(actual).toEqual(expected)
        })
})
