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

var _apiRoutes = require('./apiRoutes');

var _apiRoutes2 = _interopRequireDefault(_apiRoutes);

var _effects = require('redux-saga/effects');

var _axios = require('../axios/axios');

var _axios2 = _interopRequireDefault(_axios);

var _helpers = require('../helpers');

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

var apiRoutes = new _apiRoutes2.default();

function callApi(action, apiMethods, options) {
	var defaultOptions, _options, additiveCallback, apiService, successCallback, failedCallback, stopRequest, preventSuccessAction, preventFailedAction, apiRequest, data, actionsTypes, response, errorModel;

	return _regenerator2.default.wrap(function callApi$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					defaultOptions = {
						apiService: _axios2.default,
						additiveCallback: null,
						successCallback: null,
						failedCallback: null,
						stopRequest: function stopRequest() {
							// callback  used before request -  we can stop it
							return false;
						},
						preventSuccessAction: false,
						preventFailedAction: false
					};

					options = (0, _extends3.default)({}, defaultOptions, options);
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
					_options = options, additiveCallback = _options.additiveCallback, apiService = _options.apiService, successCallback = _options.successCallback, failedCallback = _options.failedCallback, stopRequest = _options.stopRequest, preventSuccessAction = _options.preventSuccessAction, preventFailedAction = _options.preventFailedAction;
					apiRequest = apiMethods[action.type];

					if (!(typeof apiRequest === 'function')) {
						_context.next = 43;
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
					actionsTypes = (0, _helpers.responseActionsTypes)(action.type);
					_context.prev = 11;

					if (stopRequest(data)) {
						_context.next = 28;
						break;
					}

					if (typeof action.beforeRequestCallback === 'function') {
						action.beforeRequestCallback(data);
					}
					_context.next = 16;
					return (0, _effects.call)(apiService, {
						data: data
					});

				case 16:
					response = _context.sent;

					if (typeof action.onSuccess === 'function') {
						action.onSuccess(response);
					}

					if (!(typeof successCallback === 'function')) {
						_context.next = 21;
						break;
					}

					_context.next = 21;
					return (0, _effects.call)(successCallback, response);

				case 21:
					if (typeof action.responseDataPrepare === 'function') {
						response = action.responseDataPrepare(response);
					}

					if (preventSuccessAction || action.preventSuccess) {
						_context.next = 25;
						break;
					}

					_context.next = 25;
					return (0, _effects.put)({
						response: response,
						type: actionsTypes.successAction,
						payload: action.payload,
						key: action.key
					});

				case 25:
					if (!(typeof action.postSaveToStoreCallback === 'function')) {
						_context.next = 28;
						break;
					}

					_context.next = 28;
					return (0, _effects.call)([action, 'postSaveToStoreCallback'], response);

				case 28:
					_context.next = 41;
					break;

				case 30:
					_context.prev = 30;
					_context.t0 = _context['catch'](11);

					console.error(_context.t0);
					errorModel = {
						type: actionsTypes.failedAction,
						payload: action.payload,
						message: _context.t0.statusText,
						status: _context.t0.status,
						response: _context.t0.response
					};

					if (typeof action.onFailure === 'function') {
						action.onFailure(_context.t0);
					}

					if (!(typeof failedCallback === 'function')) {
						_context.next = 38;
						break;
					}

					_context.next = 38;
					return (0, _effects.call)(failedCallback, errorModel);

				case 38:
					if (preventFailedAction || action.preventFailure) {
						_context.next = 41;
						break;
					}

					_context.next = 41;
					return (0, _effects.put)(errorModel);

				case 41:
					_context.next = 44;
					break;

				case 43:
					throw new Error('Api method: [' + action.type + ']() isn\'t defined. Please, create it! Or use another name of action!');

				case 44:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked, this, [[11, 30]]);
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

function apiWatchRequest() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	return _regenerator2.default.wrap(function apiWatchRequest$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					_context2.next = 2;
					return (0, _effects.takeEvery)(function (action) {
						return (/^.*_REQUEST$/.test(action.type) && apiRoutes.routes[action.type]
						);
					}, function (actions) {
						return callApi(actions, apiRoutes.routes, options);
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

	__REACT_HOT_LOADER__.register(apiRoutes, 'apiRoutes', 'src/modules/apiWatchRequest.js');

	__REACT_HOT_LOADER__.register(callApi, 'callApi', 'src/modules/apiWatchRequest.js');

	__REACT_HOT_LOADER__.register(apiWatchRequest, 'apiWatchRequest', 'src/modules/apiWatchRequest.js');
}();

;