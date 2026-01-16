import type { ArgumentsCamelCase } from 'yargs';
interface ReleaseArgs {
    manifestFile: string;
    packVersion?: string;
    codaApiEndpoint: string;
    notes: string;
    apiToken?: string;
    gitTag?: boolean;
}
export declare function handleRelease({ manifestFile, packVersion: explicitPackVersion, codaApiEndpoint, notes, apiToken, gitTag, }: ArgumentsCamelCase<ReleaseArgs>): Promise<never>;
export {};
