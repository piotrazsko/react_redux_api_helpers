'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _set2 = require('lodash/set');

var _set3 = _interopRequireDefault(_set2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instance = _axios2.default.create({
	baseURL: 'https://randomuser.me',
	headers: {
		'Content-Type': 'application/json'
	},
	method: 'get'
});

var _default = function _default(params) {
	var data = params.data,
	    token = params.token;
	// TEMP:  may be structure of token will be changed

	return instance((0, _set3.default)(data, 'headers.Authorization', '' + token)).then(function (response) {
		return response;
	}).catch(function (error) {
		var _ref = error.response || {},
		    statusText = _ref.statusText,
		    status = _ref.status;

		var errorObj = {
			statusText: statusText,
			status: status,
			response: error.response
		};
		throw errorObj;
	});
};

exports.default = _default;
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(instance, 'instance', 'src/configs/axios.js');

	__REACT_HOT_LOADER__.register(_default, 'default', 'src/configs/axios.js');
}();

;