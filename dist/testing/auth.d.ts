import type { AllCredentials } from './auth_types';
import type { Credentials } from './auth_types';
import type { PackDefinition } from '../types';
interface SetupAuthOptions {
    credentialsFile?: string;
    oauthServerPort?: number;
}
export declare const DEFAULT_CREDENTIALS_FILE = ".coda/credentials.json";
export declare const DEFAULT_OAUTH_SERVER_PORT = 3000;
export declare function setupAuthFromModule(module: any, opts?: SetupAuthOptions): Promise<void>;
export declare function setupAuth(packDef: PackDefinition, opts?: SetupAuthOptions): void;
export declare function storeCredential(credentialsFile: string, packName: string, credentials: Credentials): void;
export declare function storeCodaApiKey(apiKey: string, credentialsFile?: string): void;
export declare function readCredentialsFile(credentialsFile?: string): AllCredentials | undefined;
export declare function writeCredentialsFile(credentialsFile: string, allCredentials: AllCredentials): void;
export {};
