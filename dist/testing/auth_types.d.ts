export interface AllCredentials {
    [packName: string]: Credentials;
}
export interface TokenCredentials {
    token: string;
}
export interface WebBasicCredentials {
    username: string;
    password: string;
}
export interface QueryParamCredentials {
    paramValue: string;
}
export interface MultiQueryParamCredentials {
    [paramName: string]: string;
}
export declare type Credentials = TokenCredentials | WebBasicCredentials | QueryParamCredentials | MultiQueryParamCredentials;
