import type { ArgumentsCamelCase } from 'yargs';
interface CloneArgs {
    packIdOrUrl: string;
    codaApiEndpoint: string;
    packVersion?: string;
}
export declare function handleClone({ packIdOrUrl, codaApiEndpoint }: ArgumentsCamelCase<CloneArgs>): Promise<undefined>;
export {};
