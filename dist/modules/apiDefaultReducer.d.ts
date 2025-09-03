import { AnyAction } from 'redux';

export interface ApiStateItem {
    responseData?: any;
    loading?: boolean;
    loaded?: boolean;
    timestamp?: number;
    [key: string]: any;
}
export interface ApiReducerState {
    [key: string]: ApiStateItem;
}
export interface ApiAction extends AnyAction {
    type: string;
    key?: string;
    response?: {
        data?: any;
        [key: string]: any;
    };
    payload?: any;
}
/**
 * ApiReducers using for catch actions with prefixes _FAILED and _SUCCESS and save result redux-store
 * if you use custom reducer, both will be used
 * @param  {ApiReducerState} state - current state
 * @param  {ApiAction} action - redux action
 * @return {ApiReducerState} object for saving data to store
 */
declare function apiReducers(state: ApiReducerState | undefined, action: ApiAction): ApiReducerState;
export default apiReducers;
//# sourceMappingURL=apiDefaultReducer.d.ts.map