<<<<<<< HEAD
import type { BasicPackDefinition } from '../types';
import type { Credentials } from './auth_types';
=======
import type { Credentials } from './auth_types';
import type { PackVersionDefinition } from '../types';
>>>>>>> 70ee3ea0 (make build again)
interface SetupAuthOptions {
    oauthServerPort?: number;
    extraOAuthScopes?: string;
}
export declare const DEFAULT_OAUTH_SERVER_PORT = 3000;
<<<<<<< HEAD
export declare function setupAuthFromModule(manifestPath: string, manifest: BasicPackDefinition, opts?: SetupAuthOptions): Promise<void>;
export declare function setupAuth(manifestDir: string, packDef: BasicPackDefinition, opts?: SetupAuthOptions): void;
=======
export declare function setupAuthFromModule(manifestPath: string, manifest: PackVersionDefinition, opts?: SetupAuthOptions): Promise<void>;
export declare function setupAuth(manifestDir: string, packDef: PackVersionDefinition, opts?: SetupAuthOptions): void;
>>>>>>> 70ee3ea0 (make build again)
export declare function storeCredential(manifestDir: string, credentials: Credentials): void;
export declare function readCredentialsFile(manifestDir: string): Credentials | undefined;
export {};
