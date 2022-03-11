'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.init = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instance = void 0;

var init = exports.init = function init() {
	var baseURL = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'http://localhost:3000';

	instance = _axios2.default.create({
		baseURL: baseURL,
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'get'
	});
};

var _default = function _default(params) {
	if (typeof instance === 'undefined') {
		throw new Error('need init axios instance');
	} else {
		var data = params.data,
		    token = params.token;
		// TEMP:  may be structure of token will be changed

		return instance((0, _extends3.default)({}, data)).then(function (response) {
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
	}
};

exports.default = _default;
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(instance, 'instance', 'src/axios/axios.js');

	__REACT_HOT_LOADER__.register(init, 'init', 'src/axios/axios.js');

	__REACT_HOT_LOADER__.register(_default, 'default', 'src/axios/axios.js');
}();

;