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
    var defaultOptions, _options, additiveCallback, apiService, successCallback, failedCallback, apiRequest, data, actionsTypes, response, errorModel;

    return _regenerator2.default.wrap(function callApi$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    defaultOptions = {
                        apiService: _axios2.default,
                        additiveCallback: null,
                        successCallback: null,
                        failedCallback: null
                    };

                    options = (0, _extends3.default)({}, defaultOptions, options);
                    _options = options, additiveCallback = _options.additiveCallback, apiService = _options.apiService, successCallback = _options.successCallback, failedCallback = _options.failedCallback;
                    apiRequest = apiMethods[action.type];

                    if (!(typeof apiRequest === 'function')) {
                        _context.next = 35;
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
                    _context.next = 14;
                    return (0, _effects.call)(apiService, {
                        data: data
                    });

                case 14:
                    response = _context.sent;

                    if (typeof action.onSuccess === 'function') {
                        action.onSuccess(response);
                    }

                    if (!(typeof successCallback === 'function')) {
                        _context.next = 19;
                        break;
                    }

                    _context.next = 19;
                    return (0, _effects.call)(successCallback, response);

                case 19:
                    if (typeof action.responseDataPrepare === 'function') {
                        response = action.responseDataPrepare(response);
                    }
                    _context.next = 22;
                    return (0, _effects.put)({
                        response: response,
                        type: actionsTypes.successAction,
                        payload: action.payload
                    });

                case 22:
                    _context.next = 33;
                    break;

                case 24:
                    _context.prev = 24;
                    _context.t0 = _context['catch'](11);
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
                        _context.next = 31;
                        break;
                    }

                    _context.next = 31;
                    return (0, _effects.call)(failedCallback, errorModel);

                case 31:
                    _context.next = 33;
                    return (0, _effects.put)(errorModel);

                case 33:
                    _context.next = 36;
                    break;

                case 35:
                    throw new Error('Api method: [' + action.type + ']() isn\'t defined. Please, create it! Or use another name of action!');

                case 36:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked, this, [[11, 24]]);
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

function apiWatchRequest(authTokenSelector) {
    return _regenerator2.default.wrap(function apiWatchRequest$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return (0, _effects.takeEvery)(function (action) {
                        return (/^.*_REQUEST$/.test(action.type)
                        );
                    }, function (actions) {
                        return callApi(actions, apiRoutes.routes, authTokenSelector);
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