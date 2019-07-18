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

import ApiRoutes from './apiRoutes';
import { call, put, takeEvery } from 'redux-saga/effects';
import apiServiceDefault from '../axios/axios';
import { responseActionsTypes } from '../helpers';
const apiRoutes = new ApiRoutes();

export function* callApi(action, apiMethods, options) {
    const defaultOptions = {
        apiService: apiServiceDefault,
        additiveCallback: null,
        successCallback: null,
        failedCallback: null,
    };
    options = { ...defaultOptions, ...options };
    const { additiveCallback, apiService, successCallback, failedCallback } = options;

    const apiRequest = apiMethods[action.type];
    if (typeof apiRequest === 'function') {
        let data = apiRequest(action.payload);
        if (typeof additiveCallback === 'function') {
            data = yield additiveCallback(data);
        }
        let actionsTypes = responseActionsTypes(action.type);
        try {
            let response = yield call(apiService, {
                data,
            });
            if (typeof action.onSuccess === 'function') {
                action.onSuccess(response);
            }
            if (typeof successCallback === 'function') {
                yield call(successCallback, response);
            }
            if (typeof action.responseDataPrepare === 'function') {
                response = action.responseDataPrepare(response);
            }
            yield put({
                response,
                type: actionsTypes.successAction,
                payload: action.payload,
            });
        } catch (e) {
            const errorModel = {
                type: actionsTypes.failedAction,
                payload: action.payload,
                message: e.statusText,
                status: e.status,
                response: e.response,
            };
            if (typeof action.onFailure === 'function') {
                action.onFailure(e);
            }
            if (typeof failedCallback === 'function') {
                yield call(failedCallback, errorModel);
            }
            yield put(errorModel);
        }
    } else {
        throw new Error(
            `Api method: [${action.type}]() isn't defined. Please, create it! Or use another name of action!`
        );
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

export default function* apiWatchRequest(authTokenSelector) {
    yield takeEvery(
        action => /^.*_REQUEST$/.test(action.type),
        actions => callApi(actions, apiRoutes.routes, authTokenSelector)
    );
}
