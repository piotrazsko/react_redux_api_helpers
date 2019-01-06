import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { persist } from 'src/configs'

import auth from 'src/modules/auth'
import api from 'src/modules/api'

const persistConfig = persist({ storage })

const createRootReducer = (history) => persistReducer(
	persistConfig,
	combineReducers({
		router: connectRouter(history),
		auth,
		api,
	})
)

export default createRootReducer
