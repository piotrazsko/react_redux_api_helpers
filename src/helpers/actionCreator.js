import { createAction } from 'redux-actions'

export function actionCreator(actionType, reducersOptions) {
	const defaultOptions = {
		responseDataPrepare: undefined,
	}
	reducersOptions = Object.assign({}, defaultOptions, reducersOptions)
	let actionCreator = createAction(actionType)
	return (payload, options) => {
		const res = actionCreator(payload)
		if (typeof res !== 'undefined' && typeof options !== 'undefined') {
			res.onFailure = options.onFailure
			res.onSuccess = options.onSuccess
		}
		res.responseDataPrepare = reducersOptions.responseDataPrepare
		return res
	}
}
