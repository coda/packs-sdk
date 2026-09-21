import type { ArgumentsCamelCase } from 'yargs';
interface ReleaseArgs {
    manifestFile: string;
    packVersion?: string;
    apiEndpoint: string;
    notes: string;
    apiToken?: string;
    gitTag?: boolean;
    yes?: boolean;
    useLatest?: boolean;
}
export declare function handleRelease({ manifestFile, packVersion: explicitPackVersion, apiEndpoint, notes, apiToken, gitTag, yes, useLatest, }: ArgumentsCamelCase<ReleaseArgs>): Promise<never>;
export {};
