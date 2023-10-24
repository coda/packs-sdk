import 'cross-fetch/polyfill';
import type { OAuth2Authentication } from '../types';
import type { OAuth2ClientCredentialsAuthentication } from '../types';
interface AfterTokenOAuthAuthorizationCodeExchangeParams {
    accessToken: string;
    refreshToken?: string;
    expires?: string;
}
export type AfterAuthorizationCodeTokenExchangeCallback = (params: AfterTokenOAuthAuthorizationCodeExchangeParams) => void;
interface AfterTokenOAuthClientCredentialsExchangeParams {
    accessToken: string;
    expires?: string;
}
export declare function launchOAuthServerFlow({ clientId, clientSecret, authDef, port, afterTokenExchange, scopes, }: {
    clientId: string;
    clientSecret: string;
    authDef: OAuth2Authentication;
    port: number;
    afterTokenExchange: AfterAuthorizationCodeTokenExchangeCallback;
    scopes?: string[];
}): void;
export declare function makeRedirectUrl(port: number): string;
export declare function performOAuthClientCredentialsServerFlow({ clientId, clientSecret, authDef, scopes, afterTokenExchange, }: {
    clientId: string;
    clientSecret: string;
    authDef: OAuth2ClientCredentialsAuthentication;
    scopes?: string[];
    afterTokenExchange?: (params: AfterTokenOAuthClientCredentialsExchangeParams) => void;
}): Promise<AfterTokenOAuthClientCredentialsExchangeParams>;
export {};
