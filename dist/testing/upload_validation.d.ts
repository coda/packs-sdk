import type { ArraySchema } from '../schema';
import type { ObjectSchema } from '../schema';
import type { PackVersionMetadata } from '../compiled_types';
import type { SyncTable } from '../api';
import type { Tool } from '../types';
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
    MaxSuggestedPromptsPerPack: number;
    NumColumnMatchersPerFormat: number;
    NetworkDomainUrl: number;
    PermissionsBatchSize: number;
    PromptLength: number;
    SuggestedPromptText: number;
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
/**
 * Normalizes a tool for comparison by sorting any arrays within it.
 * This ensures that tools with the same content but different array ordering
 * are considered equal.
 */
export declare function normalizeTool(tool: Tool): Tool;
/**
 * Finds duplicate tools in an array by comparing normalized versions.
 * Returns information about each duplicate found.
 */
export declare function findDuplicateTools(tools: Tool[]): Array<{
    index: number;
    originalIndex: number;
    tool: Tool;
}>;
export declare function zodErrorDetailToValidationError(subError: z.ZodIssue, parentPath?: PropertyKey[]): ValidationError[];
interface BuildMetadataSchemaArgs {
    sdkVersion?: string;
    warningMode?: boolean;
}
export {};
