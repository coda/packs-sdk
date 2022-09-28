import type { Schema } from '../schema';
/**
 * A helper to extract properties fromKeys from a schema object. This is mostly useful
 * in processing the context.sync.schema in a sync formula, where the schema would only
 * include a subset of properties which were manually selected by the Pack user.
 */
export declare function getEffectivePropertyKeysFromSchema(schema: Schema): string[] | undefined;
