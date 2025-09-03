import { ApiRouteFunction } from './apiRoutes';
import { call as callSaga, put as putSaga, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { ApiRequestParams } from '../axios/axios';
import { ExtendedAction } from '../helpers';
import { AxiosResponse } from 'axios';

export interface CallApiOptions {
    apiService?: (params: ApiRequestParams) => Promise<AxiosResponse>;
    additiveCallback?: ((data: any) => any) | null;
    successCallback?: ((response: any) => any) | null;
    failedCallback?: ((errorModel: any) => any) | null;
    stopRequest?: (data: any) => boolean;
    preventSuccessAction?: boolean;
    preventFailedAction?: boolean;
    call?: typeof callSaga;
    put?: typeof putSaga;
}
export interface ApiMethods {
    [key: string]: ApiRouteFunction;
}
export interface ErrorModel {
    type: string;
    payload?: any;
    message?: string;
    status?: number;
    response?: any;
    key?: string;
}
export declare function callApi(action: ExtendedAction, apiMethods: ApiMethods, options?: CallApiOptions): SagaIterator;
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
export default function apiWatchRequest(options?: CallApiOptions, takeEveryEffect?: typeof takeEvery): SagaIterator;
//# sourceMappingURL=apiWatchRequest.d.ts.map