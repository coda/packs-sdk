import type { ArraySchema } from '../schema';
import type { ObjectSchema } from '../schema';
import type { PackVersionMetadata } from '../compiled_types';
import type { SyncTable } from '../api';
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
    MaxSkillCount: number;
    NumColumnMatchersPerFormat: number;
    NetworkDomainUrl: number;
    PermissionsBatchSize: number;
    PromptLength: number;
    UpdateBatchSize: number;
    FilterableProperties: number;
};
export declare class PackMetadataValidationError extends Error {
    readonly originalError: Error | undefined;
    readonly validationErrors: ValidationError[] | undefined;
    constructor(message: string, originalError?: Error, validationErrors?: ValidationError[]);
}
export declare function validatePackVersionMetadata(metadata: Record<string, any>, sdkVersion: string | undefined, { warningMode }?: {
    warningMode?: boolean;
}): Promise<PackVersionMetadata>;
export declare function validateVariousAuthenticationMetadata(auth: any, options: BuildMetadataSchemaArgs): VariousAuthentication;
export declare function validateSyncTableSchema(schema: any, options: BuildMetadataSchemaArgs & Required<Pick<BuildMetadataSchemaArgs, 'sdkVersion'>>): ArraySchema<ObjectSchema<any, any>>;
/**
 * Returns a map of sync table names to their child sync table names, or undefined if the hierarchy is invalid.
 * Example valid return: { Parent: 'Child' }
 * {} is also a valid result, when there are no sync tables, or no parent relationships.
 * @hidden
 */
export declare function validateCrawlHierarchy(syncTables: SyncTable[], context?: z.RefinementCtx): Record<string, string[]> | undefined;
export declare function validateParents(syncTables: SyncTable[], context: z.RefinementCtx): void;
/** @hidden */
export declare function _hasCycle(tree: Record<string, string[]>): boolean;
export declare function zodErrorDetailToValidationError(subError: z.ZodIssue): ValidationError[];
interface BuildMetadataSchemaArgs {
    sdkVersion?: string;
    warningMode?: boolean;
}
export {};
