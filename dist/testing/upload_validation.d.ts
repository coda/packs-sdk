import type { ArraySchema } from '../schema';
import type { ObjectSchema } from '../schema';
import type { PackVersionMetadata } from '../compiled_types';
import type { ValidationError } from './types';
import type { VariousAuthentication } from '../types';
import * as z from 'zod';
/**
 * The uncompiled column format matchers will be expected to be actual regex objects,
 * and when we compile the pack / stringify it to json, we will store the .toString()
 * of those regex objects. This regex is used to hydrate the stringified regex back into
 * a real RegExp object.
 */
export declare const PACKS_VALID_COLUMN_FORMAT_MATCHER_REGEX: RegExp;
export declare const Limits: {
    BuildingBlockCountPerType: number;
    BuildingBlockName: number;
    BuildingBlockDescription: number;
    ColumnMatcherRegex: number;
    NumColumnMatchersPerFormat: number;
    NetworkDomainUrl: number;
    UpdateBatchSize: number;
};
export declare class PackMetadataValidationError extends Error {
    readonly originalError: Error | undefined;
    readonly validationErrors: ValidationError[] | undefined;
    constructor(message: string, originalError?: Error, validationErrors?: ValidationError[]);
}
export declare function validatePackVersionMetadata(metadata: Record<string, any>, sdkVersion: string | undefined, { warningMode }?: {
    warningMode?: boolean;
}): Promise<PackVersionMetadata>;
export declare function validateVariousAuthenticationMetadata(auth: any): VariousAuthentication;
export declare function validateSyncTableSchema(schema: any): ArraySchema<ObjectSchema<any, any>>;
export declare function zodErrorDetailToValidationError(subError: z.ZodIssue): ValidationError[];
