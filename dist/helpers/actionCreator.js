'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.actionCreator = actionCreator;
exports.responseActionsTypes = responseActionsTypes;

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

// const newType = action.type.replace('_REQUEST', '_SUCCESS');
// export  const actionSuccess createAction
function responseActionsTypes(actionsRequestType) {
    var success = actionsRequestType.replace('_REQUEST', '_SUCCESS');
    var failed = actionsRequestType.replace('_REQUEST', '_FAILED');
    return {
        successAction: success,
        failedAction: failed
    };
}
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(actionCreator, 'actionCreator', 'src/helpers/actionCreator.js');

    __REACT_HOT_LOADER__.register(responseActionsTypes, 'responseActionsTypes', 'src/helpers/actionCreator.js');
}();

;