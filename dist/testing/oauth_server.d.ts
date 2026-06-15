import 'cross-fetch/polyfill';
import type { OAuth2Authentication } from '../types';
interface AfterTokenOAuthAuthorizationCodeExchangeParams {
    accessToken: string;
    refreshToken?: string;
    expires?: string;
    data?: {
        [key: string]: string;
    };
}
export type AfterAuthorizationCodeTokenExchangeCallback = (params: AfterTokenOAuthAuthorizationCodeExchangeParams) => void;
export declare function launchOAuthServerFlow({ clientId, clientSecret, authDef, port, afterTokenExchange, scopes, }: {
    clientId: string;
    clientSecret: string;
    authDef: OAuth2Authentication;
    port: number;
    afterTokenExchange: AfterAuthorizationCodeTokenExchangeCallback;
    scopes?: string[];
}): void;
export declare function makeRedirectUrl(port: number): string;
/**
 * Builds the authorization URL the user is redirected to in order to begin the OAuth handshake.
 */
export declare function makeAuthorizationUrl({ authorizationUrl, clientId, redirectUri, scope, scopeParamName, additionalParams, resource, state, }: {
    authorizationUrl: string;
    clientId: string;
    redirectUri: string;
    scope?: string;
    scopeParamName?: string;
    additionalParams?: {
        [key: string]: any;
    };
    resource?: string | string[];
    state: string | number;
}): string;
export {};
