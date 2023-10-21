import 'cross-fetch/polyfill';
import type { OAuth2Authentication } from '../types';
import type { OAuth2ClientCredentialsAuthentication } from '../types';
interface AfterTokenExchangeParams {
    accessToken: string;
    refreshToken?: string;
    expires?: string;
}
export type AfterTokenExchangeCallback = (params: AfterTokenExchangeParams) => void;
export declare function launchOAuthServerFlow({ clientId, clientSecret, authDef, port, afterTokenExchange, scopes, }: {
    clientId: string;
    clientSecret: string;
    authDef: OAuth2Authentication;
    port: number;
    afterTokenExchange: AfterTokenExchangeCallback;
    scopes?: string[];
}): void;
export declare function makeRedirectUrl(port: number): string;
export declare function performOAuthClientCredentialsServerFlow({ clientId, clientSecret, authDef, scopes, }: {
    clientId: string;
    clientSecret: string;
    authDef: OAuth2ClientCredentialsAuthentication;
    scopes?: string[];
}): Promise<{
    accessToken: any;
    expires: string;
}>;
export {};
