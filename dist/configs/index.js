'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('./axios');

Object.defineProperty(exports, 'axios', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_axios).default;
  }
});
Object.defineProperty(exports, 'init', {
  enumerable: true,
  get: function get() {
    return _axios.init;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
}();

;