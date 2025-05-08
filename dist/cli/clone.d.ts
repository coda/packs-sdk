import type { ArgumentsCamelCase } from 'yargs';
interface CloneArgs {
    packIdOrUrl: string;
    codaApiEndpoint: string;
    apiToken?: string;
}
export declare function handleClone({ packIdOrUrl, codaApiEndpoint, apiToken }: ArgumentsCamelCase<CloneArgs>): Promise<undefined>;
export {};
