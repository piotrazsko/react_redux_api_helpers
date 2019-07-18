'use strict';

var _api = require('../api.js');

var internalUrl = 'applications:/v1/application?page=' + 0 + '&size=' + 50;
var externalUrl = 'external:https://randomuser.com/api/?inc=name&results=50';
var httpsUrl = 'https://randomuser.com/api/?inc=name&results=50';

test('internal:', function () {
	expect((0, _api.getApiUrl)(internalUrl)).toBe('https://uni-applications.dev.kredo:443/v1//v1/application?page=0&size=50');
});
test('external:', function () {
	expect((0, _api.getApiUrl)(externalUrl)).toBe('https://randomuser.com/api/?inc=name&results=50');
});
test('https:', function () {
	expect((0, _api.getApiUrl)(httpsUrl)).toBe('https://randomuser.com/api/?inc=name&results=50');
});
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(internalUrl, 'internalUrl', 'src/axios/__tests__/apiLocations.test.js');

	__REACT_HOT_LOADER__.register(externalUrl, 'externalUrl', 'src/axios/__tests__/apiLocations.test.js');

	__REACT_HOT_LOADER__.register(httpsUrl, 'httpsUrl', 'src/axios/__tests__/apiLocations.test.js');
}();

;