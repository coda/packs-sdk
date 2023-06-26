import type { ArgumentsCamelCase } from 'yargs';
import type { PackVersionMetadata } from '../compiled_types';
interface ValidateArgs {
    manifestFile: string;
    checkDeprecationWarnings: boolean;
    writeMetadata: boolean;
}
export declare function handleValidate({ manifestFile, checkDeprecationWarnings, writeMetadata, }: ArgumentsCamelCase<ValidateArgs>): Promise<void>;
export declare function validateMetadata(metadata: PackVersionMetadata, { checkDeprecationWarnings }?: {
    checkDeprecationWarnings?: boolean;
}): Promise<void>;
export {};
