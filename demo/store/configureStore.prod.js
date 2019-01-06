import { createStore, applyMiddleware, compose } from 'redux'
// import { autoRehydrate } from 'redux-persist'
import { middleware as reduxPackMiddleware } from 'redux-pack'
import { routerMiddleware } from 'connected-react-router'

import history from './history'
import createRootReducer from '../modules'

const historyMiddleware = routerMiddleware(history)

// const middleware = compose(autoRehydrate(), applyMiddleware(reduxPackMiddleware, historyMiddleware))
const middleware = compose(
	applyMiddleware(reduxPackMiddleware, historyMiddleware)
)

export default function configureStore(initialState) {
	return createStore(createRootReducer(history), initialState, middleware)
}
