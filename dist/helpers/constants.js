'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var getConstantsFromRequestConstant = exports.getConstantsFromRequestConstant = function getConstantsFromRequestConstant(str) {
	var div = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';

	var partActionName = str.split('_REQUEST')[0];
	var failedName = partActionName + '_FAILED';
	var successName = partActionName + '_SUCCESS';
	var res = {};
	res[successName.split(div)[1]] = successName;
	res[failedName.split(div)[1]] = failedName;
	res[str.split(div)[1]] = str;
	return res;
};
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(getConstantsFromRequestConstant, 'getConstantsFromRequestConstant', 'src/helpers/constants.js');
}();

;