import memoize from 'memoize-state'

export interface ApiSelectorOptions<T = any> {
	onlyResultObject?: boolean
	filter?: 'success' | 'failed' | false
	resultPrepareCallback?: (result: T) => T
	key?: string
	initialData?: T
}

export interface ApiState {
	api: {
		[key: string]: {
			responseData?: any
			timestamp?: number
			loading?: boolean
			loaded?: boolean
			status?: 'success' | 'failed' | false
		}
	}
}

export interface ApiResult<T = any> {
	status: 'success' | 'failed' | false
	responseData?: T
	timestamp?: number
	loading?: boolean
	loaded?: boolean
}

/**
 * [apiSelector description]
 * @param  {string} actionName - argument for get data from state
 * @param  {object} options    - settings
 * 	  @param [any] filter - use for get only success response - 'success', if false - 'all'
 * 		@param [boolean] onlyResultObject - use for get only result data
 * 		@param [any] initialData - set default response (if data not found)
 * 	 	@param [function] resultPrepareCallback - prepare data before return
 * @return {function} selector function
 */
export const apiSelector = memoize(function <T = any>(
	actionName: string,
	options?: ApiSelectorOptions<T>
): (state: ApiState) => T {
	const defaultInitialData = (() => {
		const arr: any[] = []
		;(arr as any).loaded = false
		return arr
	})()

	const defaultOptions: ApiSelectorOptions<T> = {
		onlyResultObject: true,
		filter: 'success',
		resultPrepareCallback: undefined,
		key: undefined,
		initialData: defaultInitialData as T,
	}

	const mergedOptions = Object.assign({}, defaultOptions, options)

	if (/^.*_REQUEST$/.test(actionName)) {
		const partActionName = actionName.split('_REQUEST')[0]

		return function (state: ApiState): T {
			let result: ApiResult<T> = {
				status: false,
			}
			const failedName = `${partActionName}_FAILED${mergedOptions.key ? mergedOptions.key : ''}`
			const successName = `${partActionName}_SUCCESS${mergedOptions.key ? mergedOptions.key : ''}`
			let timeStamp = 0

			if (failedName in state.api) {
				timeStamp = state.api[failedName].timestamp || 0
				result = Object.assign(result, state.api[failedName])
				result.status = 'failed'
			}
			if (successName in state.api && timeStamp < (state.api[successName].timestamp || 0)) {
				result = Object.assign(result, state.api[successName])
				result.status = 'success'
			}
			let tempRes: any = result

			if (mergedOptions.onlyResultObject) {
				if (typeof result.responseData !== 'undefined') {
					tempRes = result.responseData
				} else {
					tempRes = mergedOptions.initialData
				}
			}

			switch (true) {
				case mergedOptions.filter === result.status: {
					// Return the data for matching status
					if (typeof tempRes === 'object' && tempRes !== null) {
						tempRes.loaded = true
					}
					break
				}
				case mergedOptions.filter === false: {
					// Return the data regardless of status
					if (typeof tempRes === 'object' && tempRes !== null) {
						tempRes.loaded = true
					}
					break
				}
				default:
					// Status doesn't match filter, return initial data
					tempRes = mergedOptions.initialData
			}

			if (typeof mergedOptions.resultPrepareCallback === 'function') {
				return mergedOptions.resultPrepareCallback(tempRes)
			} else {
				return tempRes
			}
		}
	} else {
		throw new Error('Action Name incorrect! Check: ' + actionName)
	}
})
