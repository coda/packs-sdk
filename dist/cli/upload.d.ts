import type { Arguments } from 'yargs';
interface UploadArgs {
    manifestFile: string;
    codaApiEndpoint: string;
    notes?: string;
    outputDir?: string;
}
export declare function handleUpload({ outputDir, manifestFile, codaApiEndpoint, notes }: Arguments<UploadArgs>): Promise<undefined>;
export {};
