import type { ArgumentsCamelCase } from 'yargs';
import type { PackVersionMetadata } from '../compiled_types';
interface ValidateArgs {
    manifestFile: string;
    checkDeprecationWarnings: boolean;
}
export declare function handleValidate({ manifestFile, checkDeprecationWarnings }: ArgumentsCamelCase<ValidateArgs>): Promise<void>;
export declare function validateMetadata(metadata: PackVersionMetadata, { checkDeprecationWarnings }?: {
    checkDeprecationWarnings?: boolean;
}): Promise<void>;
export {};
