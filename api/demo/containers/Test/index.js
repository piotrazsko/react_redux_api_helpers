import React from 'react'
import { connect } from 'react-redux'

import { login, logout, refresh, setIn, mergeIn } from 'src/modules/auth'
import apiLocations, {
	generateLocationFromName,
} from 'src/configs/apiLocations'
import { getApiUrl } from 'src/configs/api'

import { axios } from 'src/configs'
// import axios from 'axios'

import {
	resolveEnvironment,
	resolveCookeiDomain,
	resolvePortalUrl,
	resolveAdminUrl,
} from 'src/configs/env'

import {
	isAuthenticated,
	getAuthToken,
	tokenIsValid,
	tokenHasExpired,
} from 'src/helpers/auth'

class Test extends React.Component {
	componentDidMount() {}

	onLogin = () => {
		const { dispatch } = this.props

		const request = {
			location: 'single-auth:login',
			path: 'login',
			params: {
				data: { username: 'test@test.ru', password: '123456' },
				onSuccess: res => {
					console.log(res)
					// onSuccess(res)
					// history.push('/')
				},
				onFailure: error => {
					console.log(error)
					// onFailure(error)
					// message.error(error.message)
				},
			},
		}

		dispatch(login(request))
	}

	onRefresh = () => {
		const { dispatch } = this.props
		dispatch(
			refresh({
				params: {
					onFailure: error => console.log(error.response),
				},
			})
		)
	}

	onLogout = () => {
		const { dispatch } = this.props
		dispatch(logout())
	}

	testLocations = () => {
		console.log(generateLocationFromName('single-auth'))
		console.log(getApiUrl('single-auth:test'))
		console.log(generateLocationFromName('test-location/v2'))
		console.log(getApiUrl('test-location/v2:method'))

		console.log(generateLocationFromName('uni-track/v2'))
		console.log(getApiUrl('tuni-track/v2:track'))
	}

	testUrls = () => {
		console.log(resolvePortalUrl())
		console.log(resolvePortalUrl('/portal/url'))
		console.log(resolveAdminUrl())
		console.log(resolveAdminUrl('/admin/url'))
	}

	checkAuth = () => {
		const token = getAuthToken()
		console.log('token', token)

		console.log('isValid', tokenIsValid(token))
		console.log('hasExpired', tokenIsValid(token) && tokenHasExpired(token))

		console.log('isAuthenticated', isAuthenticated())
	}

	testGenerics = () => {
		const { dispatch } = this.props

		dispatch(setIn('name', 'Alex'))
		dispatch(mergeIn('ym', { clientId: 123, hello: 'world' }))
	}

	testExternalLinks = () => {
		axios()
			.get('https://experum.ru/api/users/281')
			.then(res => console.log(res))
	}

	render() {
		return (
			<ul>
				<li>
					<a onClick={this.onLogin}>Login</a>
				</li>
				<li>
					<a onClick={this.onRefresh}>Refresh</a>
				</li>
				<li>
					<a onClick={this.onLogout}>Logout</a>
				</li>
				<li>
					<a onClick={this.testLocations}>Test locations</a>
				</li>
				<li>
					<a onClick={this.testUrls}>Test URLs</a>
				</li>
				<li>
					<a onClick={this.testGenerics}>Test generics</a>
				</li>
				<li>
					<a onClick={this.checkAuth}>Check auth</a>
				</li>
				<li>
					<a onClick={this.testExternalLinks}>Test external links</a>
				</li>
			</ul>
		)
	}
}

export default connect()(Test)
