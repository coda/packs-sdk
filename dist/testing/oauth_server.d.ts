import 'cross-fetch/polyfill';
import type { OAuth2Authentication } from '../types';
interface AfterTokenOAuthAuthorizationCodeExchangeParams {
    accessToken: string;
    refreshToken?: string;
    expires?: string;
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
export {};
