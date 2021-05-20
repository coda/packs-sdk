import type { Arguments } from 'yargs';
interface UploadArgs {
    manifestFile: string;
    codaApiEndpoint: string;
    notes?: string;
}
export declare function handleUpload({ manifestFile, codaApiEndpoint, notes }: Arguments<UploadArgs>): Promise<undefined>;
export {};
