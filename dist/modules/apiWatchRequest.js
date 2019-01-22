'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

function callApi(action, apiMethods, options) {
	var defaultOptions, _options, additiveCallback, apiService, apiRequest, data, response, newType, errorModel;

	return _regenerator2.default.wrap(function callApi$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					defaultOptions = {
						apiService: _axios2.default,
						additiveCallback: null
					};

					options = (0, _extends3.default)({}, defaultOptions, options);
					_options = options, additiveCallback = _options.additiveCallback, apiService = _options.apiService;
					apiRequest = apiMethods[action.type];

					if (!(typeof apiRequest === 'function')) {
						_context.next = 29;
						break;
					}

					data = apiRequest(action.payload);

					if (!(typeof additiveCallback === 'function')) {
						_context.next = 10;
						break;
					}

					_context.next = 9;
					return additiveCallback(data);

				case 9:
					data = _context.sent;

				case 10:
					_context.prev = 10;
					_context.next = 13;
					return (0, _effects.call)(apiService, {
						data: data
					});

				case 13:
					response = _context.sent;
					newType = action.type.replace('_REQUEST', '_SUCCESS');

					if (typeof action.onSuccess === 'function') {
						action.onSuccess(response);
					}
					if (typeof action.responseDataPrepare === 'function') {
						response = action.responseDataPrepare(response);
					}
					_context.next = 19;
					return (0, _effects.put)({
						response: response,
						type: newType,
						payload: action.payload
					});

				case 19:
					_context.next = 27;
					break;

				case 21:
					_context.prev = 21;
					_context.t0 = _context['catch'](10);
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

					_context.next = 27;
					return (0, _effects.put)(errorModel);

				case 27:
					_context.next = 30;
					break;

				case 29:
					throw new Error('Api method: [' + action.type + ']() isn\'t defined. Please, create it! Or use another name of action!');

				case 30:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked, this, [[10, 21]]);
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