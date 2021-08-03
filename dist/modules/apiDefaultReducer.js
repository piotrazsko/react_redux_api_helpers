'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {};

var setNewState = function setNewState() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var path = arguments[1];
	var object = arguments[2];

	var newState = (0, _extends3.default)({}, state);
	newState[path] = object;
	return newState;
};

/**
 * ApiReducers using for catch  actions with prefixes _FAILED and _SUCCESS and save result redux-store
 * if you use custom reducer, both will be used
 * @param  {*} [state=initialState]  another type
 * @param  {string} action               action
 * @return {object}                      object for saving data to store
 */

function apiReducers() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	var isRequest = /^.*_REQUEST$/.test(action.type);
	var isClear = /^.*_CLEAR$/.test(action.type);
	if (typeof action.response !== 'undefined' && typeof action.response.data !== 'undefined' || isRequest || isClear) {
		switch (true) {
			case isRequest:
				return setNewState(state, '' + action.type + (action.key ? action.key : ''), Object.assign({}, action, { loading: true }));
			case /^.*_SUCCESS$/.test(action.type):
				{
					return setNewState(state, '' + action.type + (action.key ? action.key : ''), Object.assign({}, { responseData: action.response.data }, { loading: false, loаded: true, timestamp: Date.now() }));
				}
			case /^.*_FAILED$/.test(action.type):
				{
					return setNewState(state, '' + action.type + (action.key ? action.key : ''), Object.assign({}, { responseData: action.response.data }, {
						loading: false,
						loаded: false,
						timestamp: Date.now()
					}));
				}
			case isClear:
				return setNewState(state, '' + action.type + (action.key ? action.key : ''), initialState);
			default:
				return state;
		}
	} else {
		return state;
	}
}
var _default = apiReducers;
exports.default = _default;
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(initialState, 'initialState', 'src/modules/apiDefaultReducer.js');

	__REACT_HOT_LOADER__.register(setNewState, 'setNewState', 'src/modules/apiDefaultReducer.js');

	__REACT_HOT_LOADER__.register(apiReducers, 'apiReducers', 'src/modules/apiDefaultReducer.js');

	__REACT_HOT_LOADER__.register(_default, 'default', 'src/modules/apiDefaultReducer.js');
}();

;