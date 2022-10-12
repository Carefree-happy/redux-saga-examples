import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { applyMiddleware, createStore } from "redux"
import createSagaMiddleware from "redux-saga"
import App from "./components/App"
import reducer from "./reducers"
import rootSaga from "./sagas"

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)

const rootElement = document.getElementById("root")

const root = createRoot(rootElement)

root.render(
    <Provider store={store}>
        <App />
    </Provider>
)

// import React from "react"
// import ReactDOM from "react-dom/client"
// import App from "./App"
// import "./index.css"
// import reportWebVitals from "./reportWebVitals"

// const root = ReactDOM.createRoot(document.getElementById("root"))
// root.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>
// )
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
