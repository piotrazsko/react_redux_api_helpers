export type ApiRouteFunction = (payload?: any) => any;
export interface ApiRoutesInterface {
    routes: {
        [key: string]: ApiRouteFunction;
    };
    add: (key: string, func: ApiRouteFunction) => void;
}
declare class ApiRoutesClass implements ApiRoutesInterface {
    routes: {
        [key: string]: ApiRouteFunction;
    };
    add: (key: string, func: ApiRouteFunction) => void;
}
declare const ApiRoutes: () => ApiRoutesClass;
export declare const apiRoutes: ApiRoutesClass;
export default ApiRoutes;
//# sourceMappingURL=apiRoutes.d.ts.map