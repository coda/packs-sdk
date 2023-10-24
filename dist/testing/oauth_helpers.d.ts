import type { OAuth2ClientCredentialsAuthentication } from '../types';
import type { OAuth2ClientCredentialsRequestAccessTokenParams } from './auth_types';
import type { OAuth2RequestAccessTokenParams } from './auth_types';
export declare function requestOAuthAccessToken(params: OAuth2RequestAccessTokenParams | OAuth2ClientCredentialsRequestAccessTokenParams, { tokenUrl, nestedResponseKey, scopeParamName }: {
    tokenUrl: string;
    nestedResponseKey?: string;
    scopeParamName?: string;
}): Promise<{
    accessToken: any;
    refreshToken: any;
    data: any;
}>;
export declare function performOAuthClientCredentialsServerFlow({ clientId, clientSecret, authDef, scopes, }: {
    clientId: string;
    clientSecret: string;
    authDef: OAuth2ClientCredentialsAuthentication;
    scopes?: string[];
}): Promise<AfterTokenOAuthClientCredentialsExchangeParams>;
interface AfterTokenOAuthClientCredentialsExchangeParams {
    accessToken: string;
    expires?: string;
}
export declare function getTokenExpiry(data: {
    [key: string]: string;
}): string;
export {};
