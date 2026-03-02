import type { ArgumentsCamelCase } from 'yargs';
interface ReleaseArgs {
    manifestFile: string;
    packVersion?: string;
    apiEndpoint: string;
    notes: string;
    apiToken?: string;
    gitTag?: boolean;
}
export declare function handleRelease({ manifestFile, packVersion: explicitPackVersion, apiEndpoint, notes, apiToken, gitTag, }: ArgumentsCamelCase<ReleaseArgs>): Promise<never>;
export {};
