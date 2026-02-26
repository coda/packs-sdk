import type { ArgumentsCamelCase } from 'yargs';
interface LinkArgs {
    manifestDir: string;
    apiEndpoint: string;
    packIdOrUrl: string;
    apiToken?: string;
}
export declare function handleLink({ manifestDir, apiEndpoint, packIdOrUrl, apiToken }: ArgumentsCamelCase<LinkArgs>): Promise<never>;
export declare function parsePackIdOrUrl(packIdOrUrl: string): number | null;
export {};
