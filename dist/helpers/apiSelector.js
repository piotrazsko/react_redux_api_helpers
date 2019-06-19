'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.apiSelector = apiSelector;
/**
 * [apiSelector description]
 * @param  {string} actionName - rgument for get data of from state
 * @param  {object} options    - settings
 * 	  @param [any] filter - use for get only sucess responce - 'success', if false - 'all'
 * 		@param [boolean] onlyResultObject - use for get only result data
 * 		@param [any] initialData - set default responce( if date not founded)
 * 	 	@param [function]  resultPrepareCalback  - prepare data before return
 * @return {result}
 */

function apiSelector(actionName, options) {
	var defaultOptions = {
		onlyResultObject: true,
		filter: false,
		resultPrepareCalback: function resultPrepareCalback(res) {
			return res;
		},
		initialData: []
	};
	options = Object.assign({}, defaultOptions, options);

	if (/^.*_REQUEST$/.test(actionName)) {
		var partActionName = actionName.split('_REQUEST')[0];

		return function (state) {
			var result = {
				status: false
			};
			var failedName = partActionName + '_FAILED';
			var successName = partActionName + '_SUCCESS';
			var timeStamp = 0;

			if (failedName in state.api) {
				timeStamp = state.api[failedName].timestamp;
				result = Object.assign(result, state.api[failedName]);
				result.status = 'failed';
			}
			if (successName in state.api && timeStamp < state.api[successName].timestamp) {
				result = Object.assign(result, state.api[successName]);
				result.status = 'success';
			}
			var tempRes = result;

			if (options.onlyResultObject) {
				if (typeof result.responseData !== 'undefined') {
					tempRes = result.responseData;
				} else {
					tempRes = options.initialData;
				}
			}
			switch (true) {
				case options.filter === result.status:
					result = tempRes;
					break;
				case options.filter === false:
					result = tempRes;
					break;
				default:
					result = options.initialData;
			}
			if (typeof options.resultPrepareCalback === 'function') {
				return options.resultPrepareCalback(result);
			} else {
				return result;
			}
		};
	} else {
		throw new Error('Action Name incorrect! Check:' + actionName);
	}
}
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(apiSelector, 'apiSelector', 'src/helpers/apiSelector.js');
}();

;