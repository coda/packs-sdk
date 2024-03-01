export interface CredentialsFile {
    credentials: Credentials;
}
interface BaseCredentials {
    endpointUrl?: string;
}
export interface TokenCredentials extends BaseCredentials {
    token: string;
}
export interface MultiHeaderCredentials extends BaseCredentials {
    headers: {
        [headerName: string]: string;
    };
}
export interface WebBasicCredentials extends BaseCredentials {
    username: string;
    password?: string;
}
export type CustomCredentials = BaseCredentials & {
    params: {
        [key: string]: string;
    };
};
export interface QueryParamCredentials extends BaseCredentials {
    paramValue: string;
}
export interface MultiQueryParamCredentials extends BaseCredentials {
    params: {
        [paramName: string]: string;
    };
}
export interface BaseOAuth2Credentials extends BaseCredentials {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
    scopes?: string[];
    expires?: string;
}
export interface OAuth2Credentials extends BaseOAuth2Credentials {
    refreshToken?: string;
}
export interface OAuth2ClientCredentials extends BaseOAuth2Credentials {
}
export interface AWSAccessKeyCredentials extends BaseCredentials {
    accessKeyId: string;
    secretAccessKey: string;
}
export interface AWSAssumeRoleCredentials extends BaseCredentials {
    roleArn: string;
    externalId?: string;
}
export type Credentials = TokenCredentials | MultiHeaderCredentials | WebBasicCredentials | CustomCredentials | QueryParamCredentials | MultiQueryParamCredentials | OAuth2Credentials | OAuth2ClientCredentials | AWSAccessKeyCredentials | AWSAssumeRoleCredentials;
interface BaseOauth2RequestAccessTokenParams {
    client_id: string;
    client_secret: string;
}
export interface OAuth2RequestAccessTokenParams extends BaseOauth2RequestAccessTokenParams {
    grant_type: 'authorization_code';
    code: string;
    redirect_uri: string;
}
export interface OAuth2ClientCredentialsRequestAccessTokenParams extends BaseOauth2RequestAccessTokenParams {
    grant_type: 'client_credentials';
    scope?: string;
}
export {};
