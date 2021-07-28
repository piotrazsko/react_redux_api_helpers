import { createAction } from 'redux-actions';

export const actionCreator = function (actionType, reducersOptions) {
    const defaultOptions = {
        responseDataPrepare: actionCreator.responseDataPrepareDefault,
        preventSuccess: false,
        preventFailure: false,
        postSaveToStoreCallback: false,
    };
    reducersOptions = Object.assign({}, defaultOptions, reducersOptions);
    let action = createAction(actionType);
    return (payload, options) => {
        const res = action(payload);
        if (typeof res !== 'undefined' && typeof options !== 'undefined') {
            res.onFailure = options.onFailure;
            res.onSuccess = options.onSuccess;
            res.key = options.key;
            res.preventSuccess = options.preventSuccess;
            res.preventFailure = options.preventFailure;
            res.postSaveToStoreCallback = options.postSaveToStoreCallback;
        }
        res.responseDataPrepare = reducersOptions.responseDataPrepare;
        return res;
    };
};

// const newType = action.type.replace('_REQUEST', '_SUCCESS');
// export  const actionSuccess createAction
export function responseActionsTypes(actionsRequestType) {
    const success = actionsRequestType.replace('_REQUEST', '_SUCCESS');
    const failed = actionsRequestType.replace('_REQUEST', '_FAILED');
    return {
        successAction: success,
        failedAction: failed,
    };
}
