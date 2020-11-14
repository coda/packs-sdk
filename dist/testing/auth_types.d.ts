export interface AllCredentials {
    [packName: string]: Credentials;
}
export interface TokenCredentials {
    token: string;
}
export interface AWSSignature4Credentials {
    accessKeyId: string;
    secretAccessKey: string;
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
export declare type Credentials = TokenCredentials | AWSSignature4Credentials | WebBasicCredentials | QueryParamCredentials | MultiQueryParamCredentials;
