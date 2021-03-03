import type { Arguments } from 'yargs';
interface AuthArgs {
    manifestPath: string;
    credentialsFile?: string;
    oauthServerPort?: number;
}
export declare function handleAuth({ manifestPath, credentialsFile, oauthServerPort }: Arguments<AuthArgs>): Promise<void>;
export {};
