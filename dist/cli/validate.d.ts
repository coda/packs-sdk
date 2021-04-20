import type { Arguments } from 'yargs';
import type { PackDefinition } from '../types';
interface ValidateArgs {
    manifestFile: string;
}
export declare function handleValidate({ manifestFile }: Arguments<ValidateArgs>): Promise<void>;
export declare function validateMetadata(manifest: PackDefinition): Promise<void>;
export {};
