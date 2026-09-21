import type { ArgumentsCamelCase } from 'yargs';
interface CloneArgs {
    packIdOrUrl: string;
    apiEndpoint: string;
    apiToken?: string;
    yes?: boolean;
}
export declare function handleClone({ packIdOrUrl, apiEndpoint, apiToken, yes }: ArgumentsCamelCase<CloneArgs>): Promise<undefined>;
export {};
