import type { ArgumentsCamelCase } from 'yargs';
interface CloneArgs {
    packIdOrUrl: string;
    apiEndpoint: string;
    apiToken?: string;
}
export declare function handleClone({ packIdOrUrl, apiEndpoint, apiToken }: ArgumentsCamelCase<CloneArgs>): Promise<undefined>;
export {};
