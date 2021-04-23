import type { Credentials } from './auth_types';
import type { PackDefinition } from '../types';
interface SetupAuthOptions {
    oauthServerPort?: number;
}
export declare const DEFAULT_OAUTH_SERVER_PORT = 3000;
export declare function setupAuthFromModule(manifestPath: string, module: any, opts?: SetupAuthOptions): Promise<void>;
export declare function setupAuth(manifestDir: string, packDef: PackDefinition, opts?: SetupAuthOptions): void;
export declare function storeCredential(manifestDir: string, credentials: Credentials): void;
export declare function getApiKey(codaApiEndpoint?: string): string | undefined;
export declare function storeCodaApiKey(apiKey: string, projectDir?: string, codaApiEndpoint?: string): void;
export declare function readCredentialsFile(manifestDir: string): Credentials | undefined;
export {};
