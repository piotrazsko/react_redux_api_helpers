import { AnyAction } from 'redux'

export interface ApiStateItem {
	responseData?: any
	loading?: boolean
	loaded?: boolean
	timestamp?: number
	[key: string]: any
}

export interface ApiReducerState {
	[key: string]: ApiStateItem
}

export interface ApiAction extends AnyAction {
	type: string
	key?: string
	response?: {
		data?: any
		[key: string]: any
	}
	payload?: any
}

const initialState: ApiReducerState = {}

const setNewState = function (
	state: ApiReducerState = initialState, 
	path: string, 
	object: ApiStateItem
): ApiReducerState {
	const newState = { ...state }
	newState[path] = object
	return newState
}

/**
 * ApiReducers using for catch actions with prefixes _FAILED and _SUCCESS and save result redux-store
 * if you use custom reducer, both will be used
 * @param  {ApiReducerState} state - current state
 * @param  {ApiAction} action - redux action
 * @return {ApiReducerState} object for saving data to store
 */
function apiReducers(state: ApiReducerState = initialState, action: ApiAction): ApiReducerState {
	const isRequest = /^.*_REQUEST$/.test(action.type)
	const isClear = /^.*_CLEAR$/.test(action.type)
	const forceClear = 'FORCE_CLEAR_ALL_API' === action.type
	
	if (
		(typeof action.response !== 'undefined' && typeof action.response.data !== 'undefined') ||
		isRequest ||
		isClear ||
		forceClear
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
						{ responseData: action.response?.data },
						{ loading: false, loaded: true, timestamp: Date.now() }
					)
				)
			}
			case /^.*_FAILED$/.test(action.type): {
				return setNewState(
					state,
					`${action.type}${action.key ? action.key : ''}`,
					Object.assign(
						{},
						{ responseData: action.response?.data },
						{
							loading: false,
							loaded: false,
							timestamp: Date.now(),
						}
					)
				)
			}
			case isClear:
				return setNewState(
					state,
					`${action.type.replace('CLEAR', 'SUCCESS')}${action.key ? action.key : ''}`,
					{}
				)
			case forceClear:
				return initialState
			default:
				return state
		}
	} else {
		return state
	}
}

export default apiReducers
