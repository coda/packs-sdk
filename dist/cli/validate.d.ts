import type { Arguments } from 'yargs';
import type { PackMetadata } from '../compiled_types';
interface ValidateArgs {
    manifestFile: string;
}
export declare function handleValidate({ manifestFile }: Arguments<ValidateArgs>): Promise<void>;
export declare function validateMetadata(metadata: PackMetadata): Promise<void>;
export {};
