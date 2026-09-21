import type { ArgumentsCamelCase } from 'yargs';
interface LinkArgs {
    manifestDir: string;
    apiEndpoint: string;
    packIdOrUrl: string;
    apiToken?: string;
    yes?: boolean;
}
export declare function handleLink({ manifestDir, apiEndpoint, packIdOrUrl, apiToken, yes }: ArgumentsCamelCase<LinkArgs>): Promise<never>;
export declare function parsePackIdOrUrl(packIdOrUrl: string): number | null;
export {};
