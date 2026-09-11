import type { ArgumentsCamelCase } from 'yargs';
interface RegisterArgs {
    apiToken?: string;
    apiEndpoint: string;
    open?: boolean;
    yes?: boolean;
}
export declare function getApiTokenCreationUrl(apiEndpoint: string): string;
export declare function handleRegister({ apiToken, apiEndpoint, open: openBrowser, yes, }: ArgumentsCamelCase<RegisterArgs>): Promise<never>;
export {};
