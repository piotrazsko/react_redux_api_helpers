import memoize from 'memoize-state';

/**
 * [apiSelector description]
 * @param  {string} actionName - rgument for get data of from state
 * @param  {object} options    - settings
 * 	  @param [any] filter - use for get only sucess responce - 'success', if false - 'all'
 * 		@param [boolean] onlyResultObject - use for get only result data
 * 		@param [any] initialData - set default responce( if date not founded)
 * 	 	@param [function]  resultPrepareCallback  - prepare data before return
 * @return {result}
 */

export const apiSelector = memoize(function (actionName, options) {
    let defaultOptions = {
        onlyResultObject: true,
        filter: 'success',
        resultPrepareCallback: undefined,
        key: undefined,
        initialData: { loaded: false },
    };
    options = Object.assign({}, defaultOptions, options);
    if (/^.*_REQUEST$/.test(actionName)) {
        var partActionName = actionName.split('_REQUEST')[0];

        return function (state) {
            var result = {
                status: false,
            };
            var failedName = `${partActionName}_FAILED${
                options.key ? options.key : ''
            }`;
            var successName = `${partActionName}_SUCCESS${
                options.key ? options.key : ''
            }`;
            var timeStamp = 0;

            if (failedName in state.api) {
                timeStamp = state.api[failedName].timestamp;
                result = Object.assign(result, state.api[failedName]);
                result.status = 'failed';
            }
            if (
                successName in state.api &&
                timeStamp < state.api[successName].timestamp
            ) {
                result = Object.assign(result, state.api[successName]);
                result.status = 'success';
            }
            let tempRes = result;

            if (options.onlyResultObject) {
                if (typeof result.responseData !== 'undefined') {
                    tempRes = result.responseData;
                } else {
                    tempRes = options.initialData;
                }
            }
            switch (true) {
                case options.filter === result.status: {
                    result = tempRes;
                    result.loaded = true;
                    break;
                }
                case options.filter === false: {
                    result = tempRes;
                    result.loaded = true;
                    break;
                }
                default:
                    result = options.initialData;
            }
            if (typeof options.resultPrepareCallback === 'function') {
                result = options.resultPrepareCallback(result);
                return result;
            } else {
                return result;
            }
        };
    } else {
        throw new Error('Action Name incorrect! Check:' + actionName);
    }
});
