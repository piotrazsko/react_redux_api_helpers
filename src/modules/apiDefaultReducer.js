/**
 * ApiReducers using for catch  actions with prefixes _FAILED and _SUCCESS and save result redux-store
 * if you use custom reducer, both will be used
 *
 * @param       {[type]} [state=initialState]
 * @param       {[type]} action
 * @constructor
 */

const initialState = {}

const setNewState = function(state, path, object) {
	state[path] = object
}

function apiReducers(state = initialState, action) {
	const isRequest = /^.*_REQUEST$/.test(action.type)
	if (
		(typeof action.response !== 'undefined' && typeof action.response.data !== 'undefined') ||
		isRequest
	) {
		switch (true) {
			case isRequest:
				return setNewState(state, `${action.type}`, Object.assign({}, action, { loading: true }))
			case /^.*_SUCCESS$/.test(action.type):
				return setNewState(
					state,
					`${action.type}`,
					Object.assign(
						{},
						{ responseData: action.response.data },
						{ loading: false, loаded: true, timestamp: Date.now() }
					)
				)
			case /^.*_FAILED$/.test(action.type):
				return setNewState(
					state,
					`${action.type}`,
					Object.assign(
						{},
						{ responseData: action.response.data },
						{ loading: false, loаded: false, timestamp: Date.now() }
					)
				)
			default:
				return state
		}
	} else {
		return state
	}
}
export default apiReducers
