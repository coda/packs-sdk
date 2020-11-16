import type { AllCredentials } from './auth_types';
interface SetupAuthOptions {
    credentialsFile?: string;
}
export declare function setupAuth(module: any, opts?: SetupAuthOptions): Promise<void>;
export declare function readCredentialsFile(credentialsFile?: string): AllCredentials | undefined;
export {};
