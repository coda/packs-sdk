import type { ArgumentsCamelCase } from 'yargs';
interface ReleaseArgs {
    manifestFile: string;
    packVersion?: string;
    codaApiEndpoint: string;
    notes: string;
}
export declare function handleRelease({ manifestFile, packVersion: explicitPackVersion, codaApiEndpoint, notes, }: ArgumentsCamelCase<ReleaseArgs>): Promise<never>;
export {};
