import type { BasicPackDefinition } from '../types';
import type { Credentials } from './auth_types';
interface SetupAuthOptions {
    oauthServerPort?: number;
    extraOAuthScopes?: string;
}
export declare const DEFAULT_OAUTH_SERVER_PORT = 3000;
export declare function setupAuthFromModule(manifestPath: string, manifest: BasicPackDefinition, opts?: SetupAuthOptions): Promise<void>;
export declare function setupAuth(manifestDir: string, packDef: BasicPackDefinition, opts?: SetupAuthOptions): Promise<void>;
export declare function storeCredential(manifestDir: string, credentials: Credentials): void;
export declare function readCredentialsFile(manifestDir: string): Credentials | undefined;
export {};
