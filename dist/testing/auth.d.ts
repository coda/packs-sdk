import type { AllCredentials } from './auth_types';
import type { PackDefinition } from '../types';
interface SetupAuthOptions {
    credentialsFile?: string;
}
export declare function setupAuthFromModule(module: any, opts?: SetupAuthOptions): Promise<void>;
export declare function setupAuth(packDef: PackDefinition, opts?: SetupAuthOptions): Promise<void>;
export declare function readCredentialsFile(credentialsFile?: string): AllCredentials | undefined;
export {};
