import type { ArgumentsCamelCase } from 'yargs';
interface LinkArgs {
    manifestDir: string;
    codaApiEndpoint: string;
    packIdOrUrl: string;
    apiToken?: string;
}
export declare function handleLink({ manifestDir, codaApiEndpoint, packIdOrUrl, apiToken }: ArgumentsCamelCase<LinkArgs>): Promise<never>;
export declare function parsePackIdOrUrl(packIdOrUrl: string): number | null;
export {};
