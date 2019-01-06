import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import { autoRehydrate } from 'redux-persist'
import { middleware as reduxPackMiddleware } from 'redux-pack'
import { routerMiddleware } from 'connected-react-router'

import history from './history'
import createRootReducer from 'modules/index'

const loggerMiddleware = createLogger({
	level: 'info',
	collapsed: true,
})
const userLogger = true

const historyMiddleware = routerMiddleware(history)

const middleware = compose(
	// autoRehydrate(),
	userLogger
		? applyMiddleware(reduxPackMiddleware, historyMiddleware, loggerMiddleware)
		: applyMiddleware(reduxPackMiddleware, historyMiddleware)
)

const configureStore = function(initialState) {
	const store = createStore(createRootReducer(history), initialState, middleware)

	// Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
	if (module.hot) {
		module.hot.accept('../modules', () =>
			store.replaceReducer(
				require('../modules') /* .default if you use Babel 6+ */
			)
		)
	}

	return store
}

export default configureStore
