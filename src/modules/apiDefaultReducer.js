const initialState = {}

const setNewState = function (state = initialState, path, object) {
	const newState = { ...state }
	newState[path] = object
	return newState
}

/**
 * ApiReducers using for catch  actions with prefixes _FAILED and _SUCCESS and save result redux-store
 * if you use custom reducer, both will be used
 * @param  {*} [state=initialState]  another type
 * @param  {string} action               action
 * @return {object}                      object for saving data to store
 */

function apiReducers(state = initialState, action) {
	const isRequest = /^.*_REQUEST$/.test(action.type)
	const isClear = /^.*_CLEAR$/.test(action.type)
	if (
		(typeof action.response !== 'undefined' && typeof action.response.data !== 'undefined') ||
		isRequest ||
		isClear
	) {
		switch (true) {
			case isRequest:
				return setNewState(
					state,
					`${action.type}${action.key ? action.key : ''}`,
					Object.assign({}, action, { loading: true })
				)
			case /^.*_SUCCESS$/.test(action.type): {
				return setNewState(
					state,
					`${action.type}${action.key ? action.key : ''}`,
					Object.assign(
						{},
						{ responseData: action.response.data },
						{ loading: false, loаded: true, timestamp: Date.now() }
					)
				)
			}
			case /^.*_FAILED$/.test(action.type): {
				return setNewState(
					state,
					`${action.type}${action.key ? action.key : ''}`,
					Object.assign(
						{},
						{ responseData: action.response.data },
						{
							loading: false,
							loаded: false,
							timestamp: Date.now(),
						}
					)
				)
			}
			case isClear:
				return setNewState(state, `${action.type}${action.key ? action.key : ''}`, initialState)
			default:
				return state
		}
	} else {
		return state
	}
}
export default apiReducers
