import type { ArgumentsCamelCase } from 'yargs';
interface AuthArgs {
    manifestPath: string;
    oauthServerPort?: number;
    extraOAuthScopes?: string;
}
export declare function handleAuth({ manifestPath, oauthServerPort, extraOAuthScopes }: ArgumentsCamelCase<AuthArgs>): Promise<void>;
export {};
