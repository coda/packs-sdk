"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemaId = exports.SchemaIdPrefix = exports.makeReferenceSchemaFromObjectSchema = exports.normalizeSchema = exports.makeObjectSchema = exports.makeSchema = exports.generateSchema = exports.isArray = exports.isObject = exports.makeAttributionNode = exports.AttributionNodeType = exports.DurationUnit = exports.CurrencyFormat = exports.ValueType = void 0;
const ensure_1 = require("./helpers/ensure");
const ensure_2 = require("./helpers/ensure");
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
    ValueType["Time"] = "time";
    ValueType["DateTime"] = "datetime";
    ValueType["Duration"] = "duration";
    ValueType["Person"] = "person";
    ValueType["Percent"] = "percent";
    ValueType["Currency"] = "currency";
    ValueType["Image"] = "image";
    ValueType["Url"] = "url";
    ValueType["Markdown"] = "markdown";
    ValueType["Html"] = "html";
    ValueType["Embed"] = "embed";
    ValueType["Reference"] = "reference";
    ValueType["Attachment"] = "attachment";
    ValueType["Slider"] = "slider";
    ValueType["Scale"] = "scale";
})(ValueType = exports.ValueType || (exports.ValueType = {}));
var CurrencyFormat;
(function (CurrencyFormat) {
    CurrencyFormat["Currency"] = "currency";
    CurrencyFormat["Accounting"] = "accounting";
    CurrencyFormat["Financial"] = "financial";
})(CurrencyFormat = exports.CurrencyFormat || (exports.CurrencyFormat = {}));
var DurationUnit;
(function (DurationUnit) {
    DurationUnit["Days"] = "days";
    DurationUnit["Hours"] = "hours";
    DurationUnit["Minutes"] = "minutes";
    DurationUnit["Seconds"] = "seconds";
})(DurationUnit = exports.DurationUnit || (exports.DurationUnit = {}));
var AttributionNodeType;
(function (AttributionNodeType) {
    AttributionNodeType[AttributionNodeType["Text"] = 1] = "Text";
    AttributionNodeType[AttributionNodeType["Link"] = 2] = "Link";
    AttributionNodeType[AttributionNodeType["Image"] = 3] = "Image";
})(AttributionNodeType = exports.AttributionNodeType || (exports.AttributionNodeType = {}));
function makeAttributionNode(node) {
    return node;
}
exports.makeAttributionNode = makeAttributionNode;
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
    return ensure_2.ensureUnreachable(obj);
}
exports.generateSchema = generateSchema;
function makeSchema(schema) {
    return schema;
}
exports.makeSchema = makeSchema;
function makeObjectSchema(schema) {
    return schema;
}
exports.makeObjectSchema = makeObjectSchema;
function normalizeKey(key) {
    // Colons cause problems in our formula handling.
    return pascalcase_1.default(key).replace(/:/g, '_');
}
function normalizeSchema(schema) {
    if (isArray(schema)) {
        return {
            type: ValueType.Array,
            items: normalizeSchema(schema.items),
        };
    }
    else if (isObject(schema)) {
        const normalized = {};
        const { id, primary, featured } = schema;
        for (const key of Object.keys(schema.properties)) {
            const normalizedKey = normalizeKey(key);
            const props = schema.properties[key];
            const { required, fromKey } = props;
            normalized[normalizedKey] = Object.assign(normalizeSchema(props), {
                required,
                fromKey: fromKey || (normalizedKey !== key ? key : undefined),
            });
        }
        const normalizedSchema = {
            type: ValueType.Object,
            id: id ? normalizeKey(id) : undefined,
            featured: featured ? featured.map(normalizeKey) : undefined,
            primary: primary ? normalizeKey(primary) : undefined,
            properties: normalized,
            identity: schema.identity,
            codaType: schema.codaType,
        };
        return normalizedSchema;
    }
    return schema;
}
exports.normalizeSchema = normalizeSchema;
// Convenience for creating a reference object schema from an existing schema for the
// object. Copies over the identity, id, and primary from the schema, and the subset of
// properties indicated by the id and primary.
// A reference schema can always be defined directly, but if you already have an object
// schema it provides better code reuse to derive a reference schema instead.
function makeReferenceSchemaFromObjectSchema(schema) {
    const { type, id, primary, identity, properties } = schema;
    ensure_1.ensureExists(identity);
    const validId = ensure_1.ensureExists(id);
    const referenceProperties = { [validId]: properties[validId] };
    if (primary && primary !== id) {
        referenceProperties[primary] = properties[primary];
    }
    return {
        codaType: ValueType.Reference,
        type,
        id,
        identity,
        primary,
        properties: referenceProperties,
    };
}
exports.makeReferenceSchemaFromObjectSchema = makeReferenceSchemaFromObjectSchema;
var SchemaIdPrefix;
(function (SchemaIdPrefix) {
    SchemaIdPrefix["Identity"] = "I";
})(SchemaIdPrefix = exports.SchemaIdPrefix || (exports.SchemaIdPrefix = {}));
// Return a canonical ID for the schema
function getSchemaId(schema) {
    if (!(isObject(schema) && schema.identity)) {
        return;
    }
    return `${SchemaIdPrefix.Identity}:${schema.identity.packId}:${schema.identity.name}`;
}
exports.getSchemaId = getSchemaId;
