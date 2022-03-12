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

import ApiRoutes from './apiRoutes'
import { call, put, takeEvery } from 'redux-saga/effects'
import apiServiceDefault from '../axios/axios'
import { responseActionsTypes } from '../helpers'

const apiRoutes = new ApiRoutes()

export function* callApi(action, apiMethods, options) {
	const defaultOptions = {
		apiService: apiServiceDefault,
		additiveCallback: null,
		successCallback: null,
		failedCallback: null,
		stopRequest: () => {
			// callback  used before request -  we can stop it
			return false
		},
		preventSuccessAction: false,
		preventFailedAction: false,
	}
	options = { ...defaultOptions, ...options }
	/**
	 * [additiveCallback used for prepare  request]
	 * [stopRequest used for  stop responce if nesessary ]
	 * [onSuccess used for  listening of result  - get from  action ]
	 * [beforeRequestCallback used before  request- get from  action ]
	 * [responseDataPrepare  used for prepare responce before save to store- get from  action ]
	 * [preventSuccess  used for  flag for prevent save to store- get from  action ]
	 * [preventSuccessAction  used for  flag for prevent save to store ]
	 * [postSaveToStoreCallback  used after save to store- get from  action ]
	 * @type {[type]}
	 */
	const {
		additiveCallback,
		apiService,
		successCallback,
		failedCallback,
		stopRequest,
		preventSuccessAction,
		preventFailedAction,
	} = options

	const apiRequest = apiMethods[action.type]
	if (typeof apiRequest === 'function') {
		let data = apiRequest(action.payload)
		if (typeof additiveCallback === 'function') {
			data = yield additiveCallback(data)
		}
		let actionsTypes = responseActionsTypes(action.type)
		try {
			if (!stopRequest(data)) {
				if (typeof action.beforeRequestCallback === 'function') {
					action.beforeRequestCallback(data)
				}
				let response = yield call(apiService, {
					data,
				})
				if (typeof action.onSuccess === 'function') {
					action.onSuccess(response)
				}
				if (typeof successCallback === 'function') {
					yield call(successCallback, response)
				}
				if (typeof action.responseDataPrepare === 'function') {
					response = action.responseDataPrepare(response)
				}
				if (!(preventSuccessAction || action.preventSuccess)) {
					yield put({
						response,
						type: actionsTypes.successAction,
						payload: action.payload,
						key: action.key,
					})
				}
				if (typeof action.postSaveToStoreCallback === 'function') {
					yield call([action, 'postSaveToStoreCallback'], response)
				}
			}
		} catch (e) {
			console.error(e)
			const errorModel = {
				type: actionsTypes.failedAction,
				payload: action.payload,
				message: e.statusText,
				status: e.status,
				response: e.response,
			}
			if (typeof action.onFailure === 'function') {
				action.onFailure(e)
			}
			if (typeof failedCallback === 'function') {
				yield call(failedCallback, errorModel)
			}
			if (!(preventFailedAction || action.preventFailure)) {
				yield put(errorModel)
			}
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

 * @param  {object}    options object for  set new options
 *
	 Example: export const getUserToken = state => state.auth.user.token
  * @return {Generator}
 */

export default function* apiWatchRequest(options = {}) {
	yield takeEvery(
		(action) => {
			return /^.*_REQUEST$/.test(action.type) && apiRoutes.routes[action.type]
		},
		(actions) => callApi(actions, apiRoutes.routes, options)
	)
}
