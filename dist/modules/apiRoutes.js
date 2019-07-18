'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ApiRoutes = new function () {
    var _this = this;

    var instance = this;
    this.routes = {};
    this.add = function (key, func) {
        if (typeof func === 'function') {
            if (key in _this.routes) {
                throw new Error('Check your key! This key is already in use.');
            }
            _this.routes[key] = func;
        } else {
            throw new Error('Check your arguments');
        }
    };
    return function () {
        return instance;
    };
}();
var apiRoutes = exports.apiRoutes = new ApiRoutes();
var _default = ApiRoutes;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(ApiRoutes, 'ApiRoutes', 'src/modules/apiRoutes.js');

    __REACT_HOT_LOADER__.register(apiRoutes, 'apiRoutes', 'src/modules/apiRoutes.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/modules/apiRoutes.js');
}();

;