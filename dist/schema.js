"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeReferenceSchemaFromObjectSchema = exports.normalizeSchema = exports.normalizeSchemaKey = exports.makeObjectSchema = exports.PlaceholderIdentityPackId = exports.makeSchema = exports.generateSchema = exports.isArray = exports.isObject = exports.makeAttributionNode = exports.AttributionNodeType = exports.DurationUnit = exports.CurrencyFormat = exports.ObjectHintValueTypes = exports.NumberHintValueTypes = exports.StringHintValueTypes = exports.ValueType = void 0;
const ensure_1 = require("./helpers/ensure");
const ensure_2 = require("./helpers/ensure");
const ensure_3 = require("./helpers/ensure");
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
    ValueType["ImageAttachment"] = "imageAttachment";
    ValueType["Attachment"] = "attachment";
    ValueType["Slider"] = "slider";
    ValueType["Scale"] = "scale";
})(ValueType = exports.ValueType || (exports.ValueType = {}));
exports.StringHintValueTypes = [
    ValueType.Attachment,
    ValueType.Date,
    ValueType.Time,
    ValueType.DateTime,
    ValueType.Duration,
    ValueType.Embed,
    ValueType.Html,
    ValueType.Image,
    ValueType.ImageAttachment,
    ValueType.Markdown,
    ValueType.Url,
];
exports.NumberHintValueTypes = [
    ValueType.Date,
    ValueType.Time,
    ValueType.DateTime,
    ValueType.Percent,
    ValueType.Currency,
    ValueType.Slider,
    ValueType.Scale,
];
exports.ObjectHintValueTypes = [ValueType.Person, ValueType.Reference];
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
    return ensure_3.ensureUnreachable(obj);
}
exports.generateSchema = generateSchema;
function makeSchema(schema) {
    return schema;
}
exports.makeSchema = makeSchema;
exports.PlaceholderIdentityPackId = -1;
function makeObjectSchema(schemaDef) {
    validateObjectSchema(schemaDef);
    const schema = schemaDef;
    // TODO(jonathan): Enable after existing packs go through the v2 upload flow.
    // if (schema.identity) {
    //   schema.identity = {...schema.identity, packId: PlaceholderIdentityPackId};
    // }
    return schema;
}
exports.makeObjectSchema = makeObjectSchema;
function validateObjectSchema(schema) {
    if (schema.codaType === ValueType.Reference) {
        const { id, identity, primary } = schema;
        checkRequiredFieldInObjectSchema(id, 'id', schema.codaType);
        checkRequiredFieldInObjectSchema(identity, 'identity', schema.codaType);
        checkRequiredFieldInObjectSchema(primary, 'primary', schema.codaType);
        checkSchemaPropertyIsRequired(ensure_2.ensureExists(id), schema);
        checkSchemaPropertyIsRequired(ensure_2.ensureExists(primary), schema);
    }
    if (schema.codaType === ValueType.Person) {
        const { id } = schema;
        checkRequiredFieldInObjectSchema(id, 'id', schema.codaType);
        checkSchemaPropertyIsRequired(ensure_2.ensureExists(id), schema);
    }
    for (const [_propertyKey, propertySchema] of Object.entries(schema.properties)) {
        if (propertySchema.type === ValueType.Object) {
            validateObjectSchema(propertySchema);
        }
    }
}
function checkRequiredFieldInObjectSchema(field, fieldName, codaType) {
    ensure_2.ensureExists(field, `Objects with codaType "${codaType}" require a "${fieldName}" property in the schema definition.`);
}
function checkSchemaPropertyIsRequired(field, schema) {
    const { properties, codaType } = schema;
    ensure_1.assertCondition(properties[field].required, `Field "${field}" must be marked as required in schema with codaType "${codaType}".`);
}
function normalizeSchemaKey(key) {
    // Colons cause problems in our formula handling.
    return pascalcase_1.default(key).replace(/:/g, '_');
}
exports.normalizeSchemaKey = normalizeSchemaKey;
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
            const normalizedKey = normalizeSchemaKey(key);
            const props = schema.properties[key];
            const { required, fromKey } = props;
            normalized[normalizedKey] = Object.assign(normalizeSchema(props), {
                required,
                fromKey: fromKey || (normalizedKey !== key ? key : undefined),
            });
        }
        const normalizedSchema = {
            type: ValueType.Object,
            id: id ? normalizeSchemaKey(id) : undefined,
            featured: featured ? featured.map(normalizeSchemaKey) : undefined,
            primary: primary ? normalizeSchemaKey(primary) : undefined,
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
    ensure_2.ensureExists(identity);
    const validId = ensure_2.ensureExists(id);
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
