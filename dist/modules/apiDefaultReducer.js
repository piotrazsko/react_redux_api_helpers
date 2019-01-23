'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * ApiReducers using for catch  actions with prefixes _FAILED and _SUCCESS and save result redux-store
 * if you use custom reducer, both will be used
 *
 * @param       {[type]} [state=initialState]
 * @param       {[type]} action
 * @constructor
 */

var initialState = {};

var setNewState = function setNewState() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var path = arguments[1];
	var object = arguments[2];

	state[path] = object;
	return state;
};

function apiReducers() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	var isRequest = /^.*_REQUEST$/.test(action.type);
	if (typeof action.response !== 'undefined' && typeof action.response.data !== 'undefined' || isRequest) {
		switch (true) {
			case isRequest:
				return setNewState(state, '' + action.type, Object.assign({}, action, { loading: true }));
			case /^.*_SUCCESS$/.test(action.type):
				return setNewState(state, '' + action.type, Object.assign({}, { responseData: action.response.data }, { loading: false, loаded: true, timestamp: Date.now() }));
			case /^.*_FAILED$/.test(action.type):
				return setNewState(state, '' + action.type, Object.assign({}, { responseData: action.response.data }, { loading: false, loаded: false, timestamp: Date.now() }));
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