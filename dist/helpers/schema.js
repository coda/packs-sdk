"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEffectivePropertyKeysFromSchema = void 0;
const schema_1 = require("../schema");
/**
 * A helper to extract properties fromKeys from a schema object. This is mostly useful
 * in processing the context.sync.schema in a sync formula, where the schema would only
 * include a subset of properties which were manually selected by the Pack user.
 */
function getEffectivePropertyKeysFromSchema(schema) {
    // make it easier if the caller simply passed in the full sync schema.
    if (schema.type === schema_1.ValueType.Array) {
        schema = schema.items;
    }
    if (schema.type !== schema_1.ValueType.Object) {
        return;
    }
    return [...new Set(Object.entries(schema.properties).map(([key, property]) => property.fromKey || key))];
}
exports.getEffectivePropertyKeysFromSchema = getEffectivePropertyKeysFromSchema;
