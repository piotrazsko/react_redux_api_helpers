export interface ApiSelectorOptions<T = any> {
    onlyResultObject?: boolean;
    filter?: 'success' | 'failed' | false;
    resultPrepareCallback?: (result: T) => T;
    key?: string;
    initialData?: T;
}
export interface ApiState {
    api: {
        [key: string]: {
            responseData?: any;
            timestamp?: number;
            loading?: boolean;
            loaded?: boolean;
            status?: 'success' | 'failed' | false;
        };
    };
}
export interface ApiResult<T = any> {
    status: 'success' | 'failed' | false;
    responseData?: T;
    timestamp?: number;
    loading?: boolean;
    loaded?: boolean;
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
export declare const apiSelector: <T = any>(actionName: string, options?: ApiSelectorOptions<T>) => (state: ApiState) => T;
//# sourceMappingURL=apiSelector.d.ts.map