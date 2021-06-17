import type { OAuth2Authentication } from '../types';
interface AfterTokenExchangeParams {
    accessToken: string;
    refreshToken?: string;
    expires?: string;
}
export declare type AfterTokenExchangeCallback = (params: AfterTokenExchangeParams) => void;
export declare function launchOAuthServerFlow({ clientId, clientSecret, authDef, port, afterTokenExchange, scopes, }: {
    clientId: string;
    clientSecret: string;
    authDef: OAuth2Authentication;
    port: number;
    afterTokenExchange: AfterTokenExchangeCallback;
    scopes?: string[];
}): void;
export declare function makeRedirectUrl(port: number): string;
export {};
