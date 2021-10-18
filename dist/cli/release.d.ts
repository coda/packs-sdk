import type { Arguments } from 'yargs';
interface ReleaseArgs {
    manifestFile: string;
    packVersion?: string;
    codaApiEndpoint: string;
    notes?: string;
}
export declare function handleRelease({ manifestFile, packVersion: explicitPackVersion, codaApiEndpoint, notes, }: Arguments<ReleaseArgs>): Promise<never>;
export {};
