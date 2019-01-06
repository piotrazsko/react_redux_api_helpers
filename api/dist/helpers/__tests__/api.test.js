'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _api = require('../api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('test  apiSelector:', function () {
	expect((0, _typeof3.default)((0, _api.apiSelector)('TEST_REQUEST'))).toBe('function');
});

test('test  apiSelector: with wrong Action name', function () {
	expect(function () {
		(0, _api.apiSelector)('TEST_REQUESST');
	}).toThrow();
});

test('test  selector success request', function () {
	var state = {
		api: {
			TEST_SUCCESS: {
				response: 'test',
				timestamp: Date.now()
			}
		}
	};
	console.log((0, _api.apiSelector)('TEST_REQUEST')(state));
	expect((0, _api.apiSelector)('TEST_REQUEST')(state).response).toBe('test');
});

test('test  selector success request after failed', function () {
	var state = {
		api: {
			TEST_SUCCESS: {
				response: 'test',
				timestamp: Date.now()
			},
			TEST_FAILED: {
				response: 'fail',
				timestamp: Date.now() - 100
			}
		}
	};
	expect((0, _api.apiSelector)('TEST_REQUEST')(state).response).toBe('test');
});

test('test  selector success failed  after sucess', function () {
	var state = {
		api: {
			TEST_SUCCESS: {
				response: 'test',
				timestamp: Date.now()
			},
			TEST_FAILED: {
				response: 'fail',
				timestamp: Date.now() + 100
			}
		}
	};
	expect((0, _api.apiSelector)('TEST_REQUEST')(state).response).toBe('fail');
});

test('test  selector failed request ', function () {
	var state = {
		api: {
			TEST_FAILED: 'test'
		}
	};
	expect((0, _api.apiSelector)('TEST_REQUEST')(state)).toBe('test');
});

test('test  if store hasn`t  response ', function () {
	var state = {
		api: {
			TEST_REQUEST: 'test'
		}
	};

	expect((0, _api.apiSelector)('TEST_REQUEST')(state)).toBeDefined();
});

test('test  if store hasn`t   request ', function () {
	var state = {
		api: {}
	};
	expect((0, _api.apiSelector)('TEST_REQUEST')(state)).toBeDefined();
});
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}
}();

;