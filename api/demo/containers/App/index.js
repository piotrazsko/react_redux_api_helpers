// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

import { app as appRoutes } from 'routes'
import styles from './index.less'

type PropTypes = {}

const renderRoutes = ({ path, component, exact }) => (
	<Route key={path} exact={exact} path={path} component={component} />
)


class App extends Component<PropTypes> {
	props: PropTypes

	componentDidMount() {}

	render() {
		return (
			<Switch>
				{appRoutes.map(route => renderRoutes(route))}
				<Route component={() => <div>404</div>} />
			</Switch>
		)
	}
}

export default connect()(App)
