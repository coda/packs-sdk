import type { Arguments } from 'yargs';
interface AuthArgs {
    manifestPath: string;
    oauthServerPort?: number;
}
export declare function handleAuth({ manifestPath, oauthServerPort }: Arguments<AuthArgs>): Promise<void>;
export {};
