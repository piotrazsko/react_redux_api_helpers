/**
 * apiWatchRequest
 * - saga using for catch all actions with postfix _REQUEST and send data of payload
 * to server
 * after response it function generate actions with postfix _SUCCESS or _FAILED
 * and add to action 'response' property with status and date of response
 * apiService is a service for change data between server and client (axios, fetch,...)
 */

import ApiRoutes, { ApiRouteFunction } from './apiRoutes'
import { call as callSaga, put as putSaga, takeEvery, CallEffect, PutEffect } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import apiServiceDefault, { ApiRequestParams } from '../axios/axios'
import { responseActionsTypes, ExtendedAction } from '../helpers'
import { AxiosResponse } from 'axios'

const apiRoutes = ApiRoutes()

export interface CallApiOptions {
	apiService?: (params: ApiRequestParams) => Promise<AxiosResponse>
	additiveCallback?: ((data: any) => any) | null
	successCallback?: ((response: any) => any) | null
	failedCallback?: ((errorModel: any) => any) | null
	stopRequest?: (data: any) => boolean
	preventSuccessAction?: boolean
	preventFailedAction?: boolean
	call?: typeof callSaga
	put?: typeof putSaga
}

export interface ApiMethods {
	[key: string]: ApiRouteFunction
}

export interface ErrorModel {
	type: string
	payload?: any
	message?: string
	status?: number
	response?: any
	key?: string
}

export function* callApi(
	action: ExtendedAction,
	apiMethods: ApiMethods,
	options?: CallApiOptions
): SagaIterator {
	const defaultOptions: Required<CallApiOptions> = {
		apiService: apiServiceDefault,
		additiveCallback: null,
		successCallback: null,
		failedCallback: null,
		stopRequest: () => {
			// callback used before request - we can stop it
			return false
		},
		preventSuccessAction: false,
		preventFailedAction: false,
		call: callSaga,
		put: putSaga,
	}
	const mergedOptions = { ...defaultOptions, ...options }

	/**
	 * [additiveCallback used for prepare request]
	 * [stopRequest used for stop response if necessary]
	 * [onSuccess used for listening of result - get from action]
	 * [beforeRequestCallback used before request - get from action]
	 * [responseDataPrepare used for prepare response before save to store - get from action]
	 * [preventSuccess used for flag for prevent save to store - get from action]
	 * [preventSuccessAction used for flag for prevent save to store]
	 * [postSaveToStoreCallback used after save to store - get from action]
	 */
	const {
		additiveCallback,
		apiService,
		successCallback,
		failedCallback,
		stopRequest,
		preventSuccessAction,
		preventFailedAction,
		call,
		put,
	} = mergedOptions

	const apiRequest = apiMethods[action.type]
	if (typeof apiRequest === 'function') {
		let data = apiRequest(action.payload)
		if (typeof additiveCallback === 'function') {
			data = yield call(additiveCallback, data)
		}
		const actionsTypes = responseActionsTypes(action.type)
		try {
			if (!stopRequest(data)) {
				if (typeof action.beforeRequestCallback === 'function') {
					action.beforeRequestCallback(data)
				}
				let response: AxiosResponse = yield call(apiService, {
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
					yield call(action.postSaveToStoreCallback, response)
				}
			}
		} catch (e: any) {
			console.error(e)
			const errorModel: ErrorModel = {
				type: actionsTypes.failedAction,
				payload: action.payload,
				message: e.statusText,
				status: e.status,
				response: e.response,
				key: action.key,
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
 * [watchRequest - saga for catching all actions with postfix _REQUEST and send data server]
 * @param {CallApiOptions} options object for set new options
 * @param {typeof takeEvery} takeEveryEffect - saga effect for watching actions
 * @return {SagaGenerator} saga generator
 *
 * Example:
 * export const ACTION_GET_USER_REQUEST = `${prefix}/ACTION_GET_USER_REQUEST`
 *
 * const authRequests = {}
 *
 * authRequests[ACTION_GET_USER_REQUEST] = page => ({
 *   url: `api/?inc=gender,name,picture&results=20&page=${page}`,
 *   method: 'get',
 * })
 *
 * export { authRequests }
 */
export default function* apiWatchRequest(
	options: CallApiOptions = {},
	takeEveryEffect = takeEvery
): SagaIterator {
	yield takeEveryEffect('*', function* (action: ExtendedAction) {
		if (/^.*_REQUEST$/.test(action.type) && apiRoutes.routes[action.type]) {
			yield callApi(action, apiRoutes.routes, options)
		}
	})
}
