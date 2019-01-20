'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.callApi = callApi;
exports.default = apiWatchRequest;

var _effects = require('redux-saga/effects');

var _axios = require('../configs/axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(callApi),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(apiWatchRequest); /**
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

function callApi(action, apiMethods, authTokenSelector) {
	var apiRequest, data, token, response, newType, errorModel;
	return _regenerator2.default.wrap(function callApi$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					apiRequest = apiMethods[action.type];

					if (!(typeof apiRequest === 'function')) {
						_context.next = 25;
						break;
					}

					data = apiRequest(action.payload);
					// use for short form of url

					_context.prev = 3;
					_context.next = 6;
					return (0, _effects.select)(authTokenSelector);

				case 6:
					token = _context.sent;
					_context.next = 9;
					return (0, _effects.call)(_axios2.default, {
						data: data,
						token: token
					});

				case 9:
					response = _context.sent;
					newType = action.type.replace('_REQUEST', '_SUCCESS');

					if (typeof action.onSuccess === 'function') {
						action.onSuccess(response);
					}
					if (typeof action.responseDataPrepare === 'function') {
						response = action.responseDataPrepare(response);
					}
					_context.next = 15;
					return (0, _effects.put)({
						response: response,
						type: newType,
						payload: action.payload
					});

				case 15:
					_context.next = 23;
					break;

				case 17:
					_context.prev = 17;
					_context.t0 = _context['catch'](3);
					errorModel = {
						type: action.type.replace('_REQUEST', '_FAILED'),
						payload: action.payload,
						message: _context.t0.statusText,
						status: _context.t0.status,
						response: _context.t0.response
					};

					if (typeof action.onFailure === 'function') {
						action.onFailure(_context.t0);
					}

					_context.next = 23;
					return (0, _effects.put)(errorModel);

				case 23:
					_context.next = 26;
					break;

				case 25:
					throw new Error('Api method: [' + action.type + ']() isn\'t defined. Please, create it! Or use another name of action!');

				case 26:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked, this, [[3, 17]]);
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

function apiWatchRequest(apiMethods, authTokenSelector) {
	return _regenerator2.default.wrap(function apiWatchRequest$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					_context2.next = 2;
					return (0, _effects.takeEvery)(function (action) {
						return (/^.*_REQUEST$/.test(action.type)
						);
					}, function (actions) {
						return callApi(actions, apiMethods, authTokenSelector);
					});

				case 2:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked2, this);
}
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(callApi, 'callApi', 'src/modules/apiWatchRequest.js');

	__REACT_HOT_LOADER__.register(apiWatchRequest, 'apiWatchRequest', 'src/modules/apiWatchRequest.js');
}();

;