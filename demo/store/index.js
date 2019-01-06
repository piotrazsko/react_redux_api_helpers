// import { persistStore } from 'redux-persist/lib'
//
// import configureStore from './configureStore'
// import history from './history'
//
// import { persist } from 'src/configs'
//
// console.log(persist)
//
// // const { persist } = configs
// const persistConfig = persist({})
//
// const store = configureStore({})
// persistStore(store, { keyPrefix: 'ecostorage' })
//
// export { store, history }

import { persistStore } from 'redux-persist'

import configureStore from './configureStore'
import history from './history'

const store = configureStore({})
const persistor = persistStore(store)

export { store, history, persistor }
