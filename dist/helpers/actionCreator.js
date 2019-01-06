'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.actionCreator = actionCreator;

var _reduxActions = require('redux-actions');

function actionCreator(actionType, reducersOptions) {
	var defaultOptions = {
		responseDataPrepare: undefined
	};
	reducersOptions = Object.assign({}, defaultOptions, reducersOptions);
	var actionCreator = (0, _reduxActions.createAction)(actionType);
	return function (payload, options) {
		var res = actionCreator(payload);
		if (typeof res !== 'undefined' && typeof options !== 'undefined') {
			res.onFailure = options.onFailure;
			res.onSuccess = options.onSuccess;
		}
		res.responseDataPrepare = reducersOptions.responseDataPrepare;
		return res;
	};
}
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(actionCreator, 'actionCreator', 'src/helpers/actionCreator.js');
}();

;