import type { PackVersionMetadata } from '../compiled_types';
import type { ValidationError } from './types';
import type { VariousAuthentication } from '../types';
export declare class PackMetadataValidationError extends Error {
    readonly originalError: Error | undefined;
    readonly validationErrors: ValidationError[] | undefined;
    constructor(message: string, originalError?: Error, validationErrors?: ValidationError[]);
}
export declare function validatePackVersionMetadata(metadata: Record<string, any>): Promise<PackVersionMetadata>;
export declare function validateVariousAuthenticationMetadata(auth: any): VariousAuthentication;
