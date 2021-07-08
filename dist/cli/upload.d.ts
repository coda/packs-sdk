import type { Arguments } from 'yargs';
interface UploadArgs {
    manifestFile: string;
    codaApiEndpoint: string;
    notes?: string;
    skipValidation?: boolean;
}
export declare function handleUpload({ manifestFile, codaApiEndpoint, notes, skipValidation }: Arguments<UploadArgs>): Promise<undefined>;
export {};
