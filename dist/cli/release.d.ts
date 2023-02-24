import type { ArgumentsCamelCase } from 'yargs';
interface ReleaseArgs {
    manifestFile: string;
    packVersion?: string;
    codaApiEndpoint: string;
    notes: string;
    apiToken?: string;
}
export declare function handleRelease({ manifestFile, packVersion: explicitPackVersion, codaApiEndpoint, notes, apiToken, }: ArgumentsCamelCase<ReleaseArgs>): Promise<never>;
export {};
