import type {Schema} from '../schema';
import {ValueType} from '../schema';

/**
 * A helper to extract properties fromKeys from a schema object. This is mostly useful
 * in processing the context.sync.schema in a sync formula, where the schema would only
 * include a subset of properties which were manually selected by the Pack user.
 */
export function getEffectivePropertyKeysFromSchema(schema: Schema): string[] | undefined {
  // make it easier if the caller simply passed in the full sync schema.
  if (schema.type === ValueType.Array) {
    schema = schema.items;
  }

  if (schema.type !== ValueType.Object) {
    return;
  }

  return [...new Set(Object.entries(schema.properties).map(([key, property]) => property.fromKey || key))];
}
