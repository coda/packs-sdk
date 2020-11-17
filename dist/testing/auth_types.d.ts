export interface AllCredentials {
    [packName: string]: Credentials;
}
interface BaseCredentials {
    endpointUrl?: string;
}
export interface TokenCredentials extends BaseCredentials {
    token: string;
}
export interface WebBasicCredentials extends BaseCredentials {
    username: string;
    password?: string;
}
export interface QueryParamCredentials extends BaseCredentials {
    paramValue: string;
}
export interface MultiQueryParamCredentials extends BaseCredentials {
    params: {
        [paramName: string]: string;
    };
}
export declare type Credentials = TokenCredentials | WebBasicCredentials | QueryParamCredentials | MultiQueryParamCredentials;
export {};
