/**
 * apiWatchRequest
 * - saga uisng for catch all actions with postfix _REQUEST and send data of paylod
 * to server
 * after responce  it function generate actions with postfix _SUCCESS or _FAILED
 * and add to action 'responce' property with status and date of responce
 *  apiService is a service for  change data between server oand client( axios, fetch,...)
 *
 *
 *
 * @type { Generator}
 */

import { call, put, select, takeEvery } from 'redux-saga/effects'
import apiServiceDefault from '../configs/axios'

export function* callApi(
	action,
	apiMethods,
	options: {
		additiveCallback: null,
		apiService: apiServiceDefault,
	}
) {
	const { apiService, additiveCallback } = options

	const apiRequest = apiMethods[action.type]
	if (typeof apiRequest === 'function') {
		let data = apiRequest(action.payload)
		if (typeof additiveCallback === 'function') {
			data = yield additiveCallback(data)
		}
		try {
			let response = yield call(apiService, {
				data,
			})

			const newType = action.type.replace('_REQUEST', '_SUCCESS')
			if (typeof action.onSuccess === 'function') {
				action.onSuccess(response)
			}
			if (typeof action.responseDataPrepare === 'function') {
				response = action.responseDataPrepare(response)
			}
			yield put({
				response,
				type: newType,
				payload: action.payload,
			})
		} catch (e) {
			const errorModel = {
				type: action.type.replace('_REQUEST', '_FAILED'),
				payload: action.payload,
				message: e.statusText,
				status: e.status,
				response: e.response,
			}
			if (typeof action.onFailure === 'function') {
				action.onFailure(e)
			}

			yield put(errorModel)
		}
	} else {
		throw new Error(
			`Api method: [${action.type}]() isn't defined. Please, create it! Or use another name of action!`
		)
	}
}

/**
 * [watchRequest  - saga for  catching all actions with posfix _REQUEST and send data server]
 * @param  {object}    apiMethods   object with functions
 *
 Example:
 export const ACTION_GET_USER_REQUEST = `${prefix}/ACTION_GET_USER_REQUEST`

 const authRequests = {}

 authRequests[ACTION_GET_USER_REQUEST] = page => ({
 	url: `api/?inc=gender,name,picture&results=20&page=${page}`,
 	method: 'get',
 })

 export { authRequests }

 * @param  {function}    authTokenSelector function for get auth token  from redux-store
 *
	 Example: export const getUserTocken = state => state.auth.user.token
  * @return {Generator}
 */

export default function* apiWatchRequest(apiMethods, authTokenSelector) {
	yield takeEvery(
		action => /^.*_REQUEST$/.test(action.type),
		actions => callApi(actions, apiMethods, authTokenSelector)
	)
}
