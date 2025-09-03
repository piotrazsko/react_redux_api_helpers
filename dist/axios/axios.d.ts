import { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface ApiRequestParams {
    data: AxiosRequestConfig;
    token?: string;
}
export interface ApiErrorResponse {
    statusText?: string;
    status?: number;
    response?: any;
}
export declare const init: (baseURL?: string) => void;
declare const _default: (params: ApiRequestParams) => Promise<AxiosResponse>;
export default _default;
//# sourceMappingURL=axios.d.ts.map