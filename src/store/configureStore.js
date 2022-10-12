import { applyMiddleware, createStore } from "redux"
import createSagaMiddleware from "redux-saga"
import rootReducer from "../reducers"

export default function configureStore() {
    const sagaMiddleware = createSagaMiddleware()
    return {
        ...createStore(rootReducer, applyMiddleware(sagaMiddleware)),
        runSaga: sagaMiddleware.run
    }
}
