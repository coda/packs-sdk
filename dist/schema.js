"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ensure_1 = require("./helpers/ensure");
const pascalcase_1 = __importDefault(require("pascalcase"));
// Defines a subset of the JSON Object schema for use in annotating API results.
// http://json-schema.org/latest/json-schema-core.html#rfc.section.8.2
var ValueType;
(function (ValueType) {
    ValueType["Boolean"] = "boolean";
    ValueType["Number"] = "number";
    ValueType["String"] = "string";
    ValueType["Array"] = "array";
    ValueType["Object"] = "object";
    // Synthetic types we will use to coerce values.
    ValueType["Date"] = "date";
    ValueType["Percent"] = "percent";
    ValueType["Currency"] = "currency";
    ValueType["Image"] = "image";
    ValueType["Url"] = "url";
    ValueType["Markdown"] = "markdown";
    ValueType["Html"] = "html";
    ValueType["Embed"] = "embed";
})(ValueType = exports.ValueType || (exports.ValueType = {}));
var AttributionNodeType;
(function (AttributionNodeType) {
    AttributionNodeType[AttributionNodeType["Text"] = 1] = "Text";
    AttributionNodeType[AttributionNodeType["Link"] = 2] = "Link";
    AttributionNodeType[AttributionNodeType["Image"] = 3] = "Image";
})(AttributionNodeType = exports.AttributionNodeType || (exports.AttributionNodeType = {}));
function isObject(val) {
    return Boolean(val && val.type === ValueType.Object);
}
exports.isObject = isObject;
function isArray(val) {
    return Boolean(val && val.type === ValueType.Array);
}
exports.isArray = isArray;
function generateSchema(obj) {
    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            throw new Error('Must have representative value.');
        }
        return { type: ValueType.Array, items: generateSchema(obj[0]) };
    }
    if (typeof obj === 'object') {
        const properties = {};
        if (obj === null) {
            throw new Error('No nulls allowed.');
        }
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                properties[key] = generateSchema(obj[key]);
            }
        }
        return { type: ValueType.Object, properties };
    }
    else if (typeof obj === 'string') {
        return { type: ValueType.String };
    }
    else if (typeof obj === 'boolean') {
        return { type: ValueType.Boolean };
    }
    else if (typeof obj === 'number') {
        return { type: ValueType.Number };
    }
    return ensure_1.ensureUnreachable(obj);
}
exports.generateSchema = generateSchema;
function makeSchema(schema) {
    return schema;
}
exports.makeSchema = makeSchema;
function normalizeSchema(schema) {
    if (isArray(schema)) {
        return {
            type: ValueType.Array,
            items: normalizeSchema(schema.items),
        };
    }
    else if (isObject(schema)) {
        const normalized = {};
        for (const key of Object.keys(schema.properties)) {
            const normalizedKey = pascalcase_1.default(key);
            const props = schema.properties[key];
            const { primary, required, fromKey } = props;
            normalized[normalizedKey] = Object.assign(normalizeSchema(props), {
                primary,
                required,
                fromKey: fromKey || (normalizedKey !== key ? key : undefined),
            });
        }
        return { type: ValueType.Object, properties: normalized, identity: schema.identity };
    }
    return schema;
}
exports.normalizeSchema = normalizeSchema;
