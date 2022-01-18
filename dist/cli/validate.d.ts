import type { ArgumentsCamelCase } from 'yargs';
import type { PackVersionMetadata } from '../compiled_types';
interface ValidateArgs {
    manifestFile: string;
}
export declare function handleValidate({ manifestFile }: ArgumentsCamelCase<ValidateArgs>): Promise<void>;
export declare function validateMetadata(metadata: PackVersionMetadata): Promise<void>;
export {};
