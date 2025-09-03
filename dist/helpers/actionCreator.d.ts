export interface ReducerOptions {
    responseDataPrepare?: (data: any) => any;
    preventSuccess?: boolean;
    preventFailure?: boolean;
    postSaveToStoreCallback?: boolean | ((response: any) => void);
}
export interface ActionOptions {
    onFailure?: (error: any) => void;
    onSuccess?: (response: any) => void;
    key?: string;
    preventSuccess?: boolean;
    preventFailure?: boolean;
    postSaveToStoreCallback?: (response: any) => void;
}
export interface ExtendedAction {
    type: string;
    payload?: any;
    onFailure?: (error: any) => void;
    onSuccess?: (response: any) => void;
    key?: string;
    preventSuccess?: boolean;
    preventFailure?: boolean;
    postSaveToStoreCallback?: (response: any) => void;
    responseDataPrepare?: (data: any) => any;
    beforeRequestCallback?: (data: any) => void;
}
export interface ResponseActionTypes {
    successAction: string;
    failedAction: string;
}
export declare const actionCreator: (actionType: string, reducersOptions?: ReducerOptions) => (payload?: any, options?: ActionOptions) => ExtendedAction;
export declare function responseActionsTypes(actionsRequestType: string): ResponseActionTypes;
//# sourceMappingURL=actionCreator.d.ts.map