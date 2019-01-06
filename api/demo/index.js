import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import 'styles/index.less'

import { store, history } from 'store'
import Root from 'containers'

if (process.env.NODE_ENV === 'development') {
	const { AppContainer } = require('react-hot-loader')

	ReactDOM.render(
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<AppContainer>
					<Root />
				</AppContainer>
			</ConnectedRouter>
		</Provider>,
		document.getElementById('root')
	)

	if (module.hot) module.hot.accept()

} else {
	ReactDOM.render(
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<Root />
			</ConnectedRouter>
		</Provider>,
		document.getElementById('root')
	)
}
