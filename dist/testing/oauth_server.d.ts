import type { OAuth2Authentication } from '../types';
interface AfterTokenExchangeParams {
    accessToken: string;
    refreshToken?: string;
}
declare type AfterTokenExchangeCallback = (params: AfterTokenExchangeParams) => void;
export declare function launchOAuthServerFlow({ clientId, clientSecret, authDef, port, afterTokenExchange, }: {
    clientId: string;
    clientSecret: string;
    authDef: OAuth2Authentication;
    port?: number;
    afterTokenExchange: AfterTokenExchangeCallback;
}): void;
export declare function makeRedirectUrl(port?: number): string;
export {};
