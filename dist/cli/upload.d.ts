import type { Arguments } from 'yargs';
interface UploadArgs {
    manifestFile: string;
    codaApiEndpoint: string;
    notes?: string;
    intermediateOutputDirectory: string;
}
export declare function handleUpload({ intermediateOutputDirectory, manifestFile, codaApiEndpoint, notes, }: Arguments<UploadArgs>): Promise<undefined>;
export {};
