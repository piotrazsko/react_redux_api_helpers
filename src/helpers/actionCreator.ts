import { createAction, ActionFunction1 } from 'redux-actions'

export interface ReducerOptions {
    responseDataPrepare?: (data: any) => any
    preventSuccess?: boolean
    preventFailure?: boolean
    postSaveToStoreCallback?: boolean | ((response: any) => void)
}

export interface ActionOptions {
    onFailure?: (error: any) => void
    onSuccess?: (response: any) => void
    key?: string
    preventSuccess?: boolean
    preventFailure?: boolean
    postSaveToStoreCallback?: (response: any) => void
}

export interface ExtendedAction {
    type: string
    payload?: any
    onFailure?: (error: any) => void
    onSuccess?: (response: any) => void
    key?: string
    preventSuccess?: boolean
    preventFailure?: boolean
    postSaveToStoreCallback?: (response: any) => void
    responseDataPrepare?: (data: any) => any
    beforeRequestCallback?: (data: any) => void
}

export interface ResponseActionTypes {
    successAction: string
    failedAction: string
}

export const actionCreator = function (
    actionType: string, 
    reducersOptions?: ReducerOptions
): (payload?: any, options?: ActionOptions) => ExtendedAction {
    const defaultOptions: ReducerOptions = {
        responseDataPrepare: undefined,
        preventSuccess: false,
        preventFailure: false,
        postSaveToStoreCallback: false,
    }
    reducersOptions = Object.assign({}, defaultOptions, reducersOptions)
    const action = createAction(actionType)
    
    return (payload?: any, options?: ActionOptions): ExtendedAction => {
        const res = action(payload) as ExtendedAction
        if (typeof res !== 'undefined' && typeof options !== 'undefined') {
            res.onFailure = options.onFailure
            res.onSuccess = options.onSuccess
            res.key = options.key
            res.preventSuccess = options.preventSuccess
            res.preventFailure = options.preventFailure
            res.postSaveToStoreCallback = options.postSaveToStoreCallback
        }
        res.responseDataPrepare = reducersOptions.responseDataPrepare
        return res
    }
}

export function responseActionsTypes(actionsRequestType: string): ResponseActionTypes {
    const success = actionsRequestType.replace('_REQUEST', '_SUCCESS')
    const failed = actionsRequestType.replace('_REQUEST', '_FAILED')
    return {
        successAction: success,
        failedAction: failed,
    }
}
