"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwOnDynamicSchemaWithJsOptionsFunction = exports.withIdentity = exports.makeReferenceSchemaFromObjectSchema = exports.normalizeObjectSchema = exports.normalizeSchema = exports.normalizePropertyValuePathIntoSchemaPath = exports.normalizeSchemaKeyPath = exports.normalizeSchemaKey = exports.makeObjectSchema = exports.makeSchema = exports.generateSchema = exports.maybeUnwrapArraySchema = exports.maybeSchemaOptionsValue = exports.unwrappedSchemaSupportsOptions = exports.isArray = exports.isObject = exports.makeAttributionNode = exports.AttributionNodeType = exports.PropertyLabelValueTemplate = exports.SimpleStringHintValueTypes = exports.DurationUnit = exports.ImageCornerStyle = exports.ImageOutline = exports.LinkDisplayType = exports.EmailDisplayType = exports.ScaleIconSet = exports.CurrencyFormat = exports.AutocompleteHintValueTypes = exports.ObjectHintValueTypes = exports.BooleanHintValueTypes = exports.NumberHintValueTypes = exports.StringHintValueTypes = exports.ValueHintType = exports.ValueType = void 0;
const ensure_1 = require("./helpers/ensure");
const object_utils_1 = require("./helpers/object_utils");
const ensure_2 = require("./helpers/ensure");
const ensure_3 = require("./helpers/ensure");
const ensure_4 = require("./helpers/ensure");
const ensure_5 = require("./helpers/ensure");
const migration_1 = require("./helpers/migration");
const pascalcase_1 = __importDefault(require("pascalcase"));
// Defines a subset of the JSON Object schema for use in annotating API results.
// http://json-schema.org/latest/json-schema-core.html#rfc.section.8.2
/**
 * The set of primitive value types that can be used as return values for formulas
 * or in object schemas.
 */
var ValueType;
(function (ValueType) {
    /**
     * Indicates a JavaScript boolean (true/false) should be returned.
     */
    ValueType["Boolean"] = "boolean";
    /**
     * Indicates a JavaScript number should be returned.
     */
    ValueType["Number"] = "number";
    /**
     * Indicates a JavaScript string should be returned.
     */
    ValueType["String"] = "string";
    /**
     * Indicates a JavaScript array should be returned. The schema of the array items must also be specified.
     */
    ValueType["Array"] = "array";
    /**
     * Indicates a JavaScript object should be returned. The schema of each object property must also be specified.
     */
    ValueType["Object"] = "object";
})(ValueType || (exports.ValueType = ValueType = {}));
/**
 * Synthetic types that instruct Coda how to coerce values from primitives at ingestion time.
 */
var ValueHintType;
(function (ValueHintType) {
    /**
     * Indicates to interpret the value as a date (e.g. March 3, 2021).
     */
    ValueHintType["Date"] = "date";
    /**
     * Indicates to interpret the value as a time (e.g. 5:24pm).
     */
    ValueHintType["Time"] = "time";
    /**
     * Indicates to interpret the value as a datetime (e.g. March 3, 2021 at 5:24pm).
     */
    ValueHintType["DateTime"] = "datetime";
    /**
     * Indicates to interpret the value as a duration (e.g. 3 hours).
     */
    ValueHintType["Duration"] = "duration";
    /**
     * Indicates to interpret the value as an email address (e.g. joe@foo.com).
     */
    ValueHintType["Email"] = "email";
    /**
     * Indicates to interpret and render the value as a Coda person reference. The provided value should be
     * an object whose `id` property is an email address, which Coda will try to resolve to a user
     * and render an @-reference to the user.
     *
     * @example
     * ```
     * makeObjectSchema({
     *   type: ValueType.Object,
     *   codaType: ValueHintType.Person,
     *   id: 'email',
     *   primary: 'name',
     *   properties: {
     *     email: {type: ValueType.String, required: true},
     *     name: {type: ValueType.String, required: true},
     *   },
     * });
     * ```
     */
    ValueHintType["Person"] = "person";
    /**
     * Indicates to interpret and render the value as a percentage.
     */
    ValueHintType["Percent"] = "percent";
    /**
     * Indicates to interpret and render the value as a currency value.
     */
    ValueHintType["Currency"] = "currency";
    /**
     * Indicates to interpret and render the value as an image. The provided value should be a URL that
     * points to an image. Coda will hotlink to the image when rendering it a doc.
     *
     * Using {@link ImageAttachment} is recommended instead, so that the image is always accessible
     * and won't appear as broken if the source image is later deleted.
     */
    ValueHintType["ImageReference"] = "image";
    /**
     * Indicates to interpret and render the value as an image. The provided value should be a URL that
     * points to an image. Coda will ingest the image and host it from Coda infrastructure.
     */
    ValueHintType["ImageAttachment"] = "imageAttachment";
    /**
     * Indicates to interpret and render the value as a URL link.
     */
    ValueHintType["Url"] = "url";
    /**
     * Indicates to interpret a text value as Markdown, which will be converted and rendered as Coda rich text.
     */
    ValueHintType["Markdown"] = "markdown";
    /**
     * Indicates to interpret a text value as HTML, which will be converted and rendered as Coda rich text.
     */
    ValueHintType["Html"] = "html";
    /**
     * Indicates to interpret and render a value as an embed. The provided value should be a URL pointing
     * to an embeddable web page.
     */
    ValueHintType["Embed"] = "embed";
    /**
     * Indicates to interpret and render the value as a Coda @-reference to a table row. The provided value should
     * be an object whose `id` value matches the id of some row in a sync table. The schema where this hint type is
     * used must specify an identity that specifies the desired sync table.
     *
     * Normally a reference schema is constructed from the schema object being referenced using the helper
     * {@link makeReferenceSchemaFromObjectSchema}.
     *
     * @example
     * ```
     * makeObjectSchema({
     *   type: ValueType.Object,
     *   codaType: ValueHintType.Reference,
     *   identity: {
     *     name: "SomeSyncTableIdentity"
     *   },
     *   id: 'identifier',
     *   primary: 'name',
     *   properties: {
     *     identifier: {type: ValueType.Number, required: true},
     *     name: {type: ValueType.String, required: true},
     *   },
     * });
     * ```
     */
    ValueHintType["Reference"] = "reference";
    /**
     * Indicates to interpret and render a value as a file attachment. The provided value should be a URL
     * pointing to a file of a Coda-supported type. Coda will ingest the file and host it from Coda infrastructure.
     */
    ValueHintType["Attachment"] = "attachment";
    /**
     * Indicates to render a numeric value as a slider UI component.
     */
    ValueHintType["Slider"] = "slider";
    /**
     * Indicates to render a numeric value as a scale UI component (e.g. a star rating).
     */
    ValueHintType["Scale"] = "scale";
    /**
     * Indicates to render a numeric value as a progress bar UI component.
     */
    ValueHintType["ProgressBar"] = "progressBar";
    /**
     * Indicates to render a boolean value as a toggle.
     */
    ValueHintType["Toggle"] = "toggle";
    /** @hidden */
    ValueHintType["CodaInternalRichText"] = "codaInternalRichText";
    /**
     * Indicates to render a value as a select list.
     */
    ValueHintType["SelectList"] = "selectList";
})(ValueHintType || (exports.ValueHintType = ValueHintType = {}));
exports.StringHintValueTypes = [
    ValueHintType.Attachment,
    ValueHintType.Date,
    ValueHintType.Time,
    ValueHintType.DateTime,
    ValueHintType.Duration,
    ValueHintType.Email,
    ValueHintType.Embed,
    ValueHintType.Html,
    ValueHintType.ImageReference,
    ValueHintType.ImageAttachment,
    ValueHintType.Markdown,
    ValueHintType.Url,
    ValueHintType.CodaInternalRichText,
    ValueHintType.SelectList,
];
exports.NumberHintValueTypes = [
    ValueHintType.Date,
    ValueHintType.Time,
    ValueHintType.DateTime,
    ValueHintType.Duration,
    ValueHintType.Percent,
    ValueHintType.Currency,
    ValueHintType.Slider,
    ValueHintType.ProgressBar,
    ValueHintType.Scale,
];
exports.BooleanHintValueTypes = [ValueHintType.Toggle];
exports.ObjectHintValueTypes = [ValueHintType.Person, ValueHintType.Reference, ValueHintType.SelectList];
exports.AutocompleteHintValueTypes = [ValueHintType.SelectList, ValueHintType.Reference];
/**
 * Enumeration of formats supported by schemas that use {@link ValueHintType.Currency}.
 *
 * These affect how a numeric value is rendered in docs.
 */
var CurrencyFormat;
(function (CurrencyFormat) {
    /**
     * Indicates the value should be rendered as a number with a currency symbol as a prefix, e.g. `$2.50`.
     */
    CurrencyFormat["Currency"] = "currency";
    /**
     * Indicates the value should be rendered as a number with a currency symbol as a prefix, but padded
     * to allow the numeric values to line up vertically, e.g.
     *
     * ```
     * $       2.50
     * $      29.99
     * ```
     */
    CurrencyFormat["Accounting"] = "accounting";
    /**
     * Indicates the value should be rendered as a number without a currency symbol, e.g. `2.50`.
     */
    CurrencyFormat["Financial"] = "financial";
})(CurrencyFormat || (exports.CurrencyFormat = CurrencyFormat = {}));
/**
 * Icons that can be used with a {@link ScaleSchema}.
 *
 * For example, to render a star rating, use a {@link ScaleSchema} with `icon: coda.ScaleIconSet.Star`.
 */
var ScaleIconSet;
(function (ScaleIconSet) {
    ScaleIconSet["Star"] = "star";
    ScaleIconSet["Circle"] = "circle";
    ScaleIconSet["Fire"] = "fire";
    ScaleIconSet["Bug"] = "bug";
    ScaleIconSet["Diamond"] = "diamond";
    ScaleIconSet["Bell"] = "bell";
    ScaleIconSet["ThumbsUp"] = "thumbsup";
    ScaleIconSet["Heart"] = "heart";
    ScaleIconSet["Chili"] = "chili";
    ScaleIconSet["Smiley"] = "smiley";
    ScaleIconSet["Lightning"] = "lightning";
    ScaleIconSet["Currency"] = "currency";
    ScaleIconSet["Coffee"] = "coffee";
    ScaleIconSet["Person"] = "person";
    ScaleIconSet["Battery"] = "battery";
    ScaleIconSet["Cocktail"] = "cocktail";
    ScaleIconSet["Cloud"] = "cloud";
    ScaleIconSet["Sun"] = "sun";
    ScaleIconSet["Checkmark"] = "checkmark";
    ScaleIconSet["LightBulb"] = "lightbulb";
})(ScaleIconSet || (exports.ScaleIconSet = ScaleIconSet = {}));
/**
 * Display types that can be used with an {@link EmailSchema}.
 */
var EmailDisplayType;
(function (EmailDisplayType) {
    /**
     * Display both icon and email (default).
     */
    EmailDisplayType["IconAndEmail"] = "iconAndEmail";
    /**
     * Display icon only.
     */
    EmailDisplayType["IconOnly"] = "iconOnly";
    /**
     * Display email address only.
     */
    EmailDisplayType["EmailOnly"] = "emailOnly";
})(EmailDisplayType || (exports.EmailDisplayType = EmailDisplayType = {}));
/**
 * Display types that can be used with a {@link LinkSchema}.
 */
var LinkDisplayType;
(function (LinkDisplayType) {
    /**
     * Display icon only.
     */
    LinkDisplayType["IconOnly"] = "iconOnly";
    /**
     * Display URL.
     */
    LinkDisplayType["Url"] = "url";
    /**
     * Display web page title.
     */
    LinkDisplayType["Title"] = "title";
    /**
     * Display the referenced web page as a card.
     */
    LinkDisplayType["Card"] = "card";
    /**
     * Display the referenced web page as an embed.
     */
    LinkDisplayType["Embed"] = "embed";
})(LinkDisplayType || (exports.LinkDisplayType = LinkDisplayType = {}));
/**
 * State of outline on images that can be used with a {@link ImageSchema}.
 */
var ImageOutline;
(function (ImageOutline) {
    /** Image is rendered without outline. */
    ImageOutline["Disabled"] = "disabled";
    /** Image is rendered with outline. */
    ImageOutline["Solid"] = "solid";
})(ImageOutline || (exports.ImageOutline = ImageOutline = {}));
/**
 * State of corners on images that can be used with a {@link ImageSchema}.
 */
var ImageCornerStyle;
(function (ImageCornerStyle) {
    /** Image is rendered with rounded corners. */
    ImageCornerStyle["Rounded"] = "rounded";
    /** Image is rendered with square corners. */
    ImageCornerStyle["Square"] = "square";
})(ImageCornerStyle || (exports.ImageCornerStyle = ImageCornerStyle = {}));
/**
 * Enumeration of units supported by duration schemas. See {@link DurationSchema.maxUnit}.
 */
var DurationUnit;
(function (DurationUnit) {
    /**
     * Indications a duration as a number of days.
     */
    DurationUnit["Days"] = "days";
    /**
     * Indications a duration as a number of hours.
     */
    DurationUnit["Hours"] = "hours";
    /**
     * Indications a duration as a number of minutes.
     */
    DurationUnit["Minutes"] = "minutes";
    /**
     * Indications a duration as a number of seconds.
     */
    DurationUnit["Seconds"] = "seconds";
})(DurationUnit || (exports.DurationUnit = DurationUnit = {}));
/**
 * The subset of StringHintTypes that don't have specific schema attributes.
 */
exports.SimpleStringHintValueTypes = [
    ValueHintType.Attachment,
    ValueHintType.Html,
    ValueHintType.Markdown,
    ValueHintType.Url,
    ValueHintType.Email,
    ValueHintType.CodaInternalRichText,
];
/**
 * An identifier for the value of a property for use in the {@link PropertyIdentifierDetails.label} field.
 * When used, this will be substituted with the value of the property for the final output of the label.
 *
 * If not present, the label will be used as-is in the default label format of '\{label\}: \{VALUE\}'.
 */
exports.PropertyLabelValueTemplate = '{VALUE}';
/**
 * The type of content in this attribution node.
 *
 * Multiple attribution nodes can be rendered all together, for example to have
 * attribution that contains both text and a logo image.
 *
 * @see [Structuring data with schemas - Data attribution](https://coda.io/packs/build/latest/guides/advanced/schemas/#attribution)
 */
var AttributionNodeType;
(function (AttributionNodeType) {
    /**
     * Text attribution content.
     */
    AttributionNodeType[AttributionNodeType["Text"] = 1] = "Text";
    /**
     * A hyperlink pointing to the data source.
     */
    AttributionNodeType[AttributionNodeType["Link"] = 2] = "Link";
    /**
     * An image, often a logo of the data source.
     */
    AttributionNodeType[AttributionNodeType["Image"] = 3] = "Image";
})(AttributionNodeType || (exports.AttributionNodeType = AttributionNodeType = {}));
/**
 * A helper for constructing attribution text, links, or images that render along with a Pack value.
 *
 * Many APIs have licensing requirements that ask for specific attribution to be included
 * when using their data. For example, a stock photo API may require attribution text
 * and a logo.
 *
 * Any {@link IdentityDefinition} can include one or more attribution nodes that will be
 * rendered any time a value with that identity is rendered in a doc.
 */
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
function unwrappedSchemaSupportsOptions(schema) {
    return Boolean(schema === null || schema === void 0 ? void 0 : schema.codaType) && [ValueHintType.SelectList, ValueHintType.Reference].includes(schema.codaType);
}
exports.unwrappedSchemaSupportsOptions = unwrappedSchemaSupportsOptions;
function maybeSchemaOptionsValue(schema) {
    const unwrappedSchema = maybeUnwrapArraySchema(schema);
    if (unwrappedSchemaSupportsOptions(unwrappedSchema)) {
        return unwrappedSchema.options;
    }
}
exports.maybeSchemaOptionsValue = maybeSchemaOptionsValue;
/**
 * Pulls out the item type of an Array schema, returning undefined if the Array contains another Array.
 */
function maybeUnwrapArraySchema(val) {
    if (!isArray(val)) {
        return val;
    }
    if (!isArray(val.items)) {
        return val.items;
    }
}
exports.maybeUnwrapArraySchema = maybeUnwrapArraySchema;
/**
 * Utility that examines a JavaScript value and attempts to infer a schema definition
 * that describes it.
 *
 * It is vastly preferable to define a schema manually. A clear and accurate schema is one of the
 * fundamentals of a good pack. However, for data that is truly dynamic for which a schema can't
 * be known in advance nor can a function be written to generate a dynamic schema from other
 * inputs, it may be useful to us this helper to sniff the return value and generate a basic
 * inferred schema from it.
 *
 * This utility does NOT attempt to determine {@link ObjectSchemaDefinition.idProperty} or
 * {@link ObjectSchemaDefinition.displayProperty} attributes for
 * an object schema, those are left undefined.
 */
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
            // Default nulls to string which is the least common denominator.
            return { type: ValueType.String };
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
    return (0, ensure_5.ensureUnreachable)(obj);
}
exports.generateSchema = generateSchema;
/**
 * A wrapper for creating any schema definition.
 *
 * If you are creating a schema for an object (as opposed to a scalar or array),
 * use the more specific {@link makeObjectSchema}.
 *
 * It is always recommended to use wrapper functions for creating top-level schema
 * objects rather than specifying object literals. Wrappers validate your schemas
 * at creation time, provide better TypeScript type inference, and can reduce
 * boilerplate.
 *
 * At this time, this wrapper provides only better TypeScript type inference,
 * but it may do validation in a future SDK version.
 *
 * @example
 * ```
 * coda.makeSchema({
 *   type: coda.ValueType.Array,
 *   items: {type: coda.ValueType.String},
 * });
 * ```
 */
function makeSchema(schema) {
    return schema;
}
exports.makeSchema = makeSchema;
/**
 * A wrapper for creating a schema definition for an object value.
 *
 * It is always recommended to use wrapper functions for creating top-level schema
 * objects rather than specifying object literals. Wrappers validate your schemas
 * at creation time, provide better TypeScript type inference, and can reduce
 * boilerplate.
 *
 * @example
 * ```
 * coda.makeObjectSchema({
 *   id: "email",
 *   primary: "name",
 *   properties: {
 *     email: {type: coda.ValueType.String, required: true},
 *     name: {type: coda.ValueType.String, required: true},
 *   },
 * });
 * ```
 */
function makeObjectSchema(schemaDef) {
    const schema = { ...schemaDef, type: ValueType.Object };
    // In case a single schema object was used for multiple properties, make copies for each of them.
    for (const key of Object.keys(schema.properties)) {
        // 'type' was just created from scratch above
        if (key !== 'type') {
            // Typescript doesn't like the raw schema.properties[key] (on the left only though...)
            const typedKey = key;
            const schemaForOptions = maybeUnwrapArraySchema(schema.properties[key]);
            const optionsValue = schemaForOptions === null || schemaForOptions === void 0 ? void 0 : schemaForOptions.options;
            const optionsFunction = typeof optionsValue === 'function' ? optionsValue : undefined;
            schema.properties[typedKey] = (0, object_utils_1.deepCopy)(schema.properties[key]);
            // Options gets manually copied over because it may be a function, which deepCopy wouldn't
            // support.
            if (optionsFunction) {
                const schemaCopyForOptions = maybeUnwrapArraySchema(schema.properties[typedKey]);
                (0, ensure_2.ensureExists)(schemaCopyForOptions, 'deepCopy() broke maybeUnwrapArraySchema?...');
                schemaCopyForOptions.options = optionsFunction;
            }
        }
    }
    validateObjectSchema(schema);
    return schema;
}
exports.makeObjectSchema = makeObjectSchema;
function validateObjectSchema(schema) {
    // TODO(jonathan): These should all move to upload_validation checks, since these aren't getting
    // enforced on upload and a hacked CLI could just bypass these.
    // These aren't particularly important checks, they're more just aids for the maker
    // so that their reference and people values won't be broken at runtime.
    if (schema.codaType === ValueHintType.Reference) {
        const { id, identity, primary } = (0, migration_1.objectSchemaHelper)(schema);
        checkRequiredFieldInObjectSchema(id, 'idProperty', schema.codaType);
        checkRequiredFieldInObjectSchema(identity, 'identity', schema.codaType);
        checkRequiredFieldInObjectSchema(primary, 'displayProperty', schema.codaType);
        checkSchemaPropertyIsRequired((0, ensure_2.ensureExists)(id), schema, 'idProperty');
        checkSchemaPropertyIsRequired((0, ensure_2.ensureExists)(primary), schema, 'displayProperty');
    }
    if (schema.codaType === ValueHintType.Person) {
        const { id } = (0, migration_1.objectSchemaHelper)(schema);
        checkRequiredFieldInObjectSchema(id, 'idProperty', schema.codaType);
        checkSchemaPropertyIsRequired((0, ensure_2.ensureExists)(id), schema, 'idProperty');
    }
    for (const [_propertyKey, propertySchema] of Object.entries(schema.properties)) {
        if (propertySchema.type === ValueType.Object) {
            validateObjectSchema(propertySchema);
        }
    }
}
function checkRequiredFieldInObjectSchema(field, fieldName, codaType) {
    (0, ensure_2.ensureExists)(field, `Objects with codaType "${codaType}" require a "${fieldName}" property in the schema definition.`);
}
function checkSchemaPropertyIsRequired(field, schema, referencedByPropertyName) {
    const { properties, codaType } = schema;
    (0, ensure_1.assertCondition)(properties[field], `${referencedByPropertyName} set to undefined field "${field}"`);
    (0, ensure_1.assertCondition)(properties[field].required, `Field "${field}" must be marked as required in schema with codaType "${codaType}".`);
}
/**
 * Normalizes a schema key into PascalCase.
 */
function normalizeSchemaKey(key) {
    // Colons cause problems in our formula handling.
    return (0, pascalcase_1.default)(key).replace(/:/g, '_');
}
exports.normalizeSchemaKey = normalizeSchemaKey;
/**
 * Normalizes a schema property key path. This interprets "."s as accessing object properties
 * and "[]" as accessing array items. Uses normalizeSchemaKey to normalize each part in-between.
 *
 * This is used for object schema properties that support path projection.
 */
function normalizeSchemaKeyPath(key, normalizedProperties) {
    // Try an exact match on the properties first.
    if (normalizedProperties.hasOwnProperty(normalizeSchemaKey(key))) {
        return normalizeSchemaKey(key);
    }
    // Try splitting by . to handle json paths.
    return key
        .split('.')
        .map(val => {
        let partToNormalize = val;
        let partToIgnoreNormalization = '';
        // Handles array pathing.
        if (val.includes('[')) {
            partToNormalize = val.substring(0, val.indexOf('['));
            partToIgnoreNormalization = val.substring(val.indexOf('['));
        }
        return normalizeSchemaKey(partToNormalize) + partToIgnoreNormalization;
    })
        .join('.');
}
exports.normalizeSchemaKeyPath = normalizeSchemaKeyPath;
/**
 * Normalizes a schema PropertyIdentifier by converting it to PascalCase.
 */
function normalizeSchemaPropertyIdentifier(key, normalizedProperties) {
    if (typeof key === 'string') {
        return normalizeSchemaKeyPath(key, normalizedProperties);
    }
    const { label, property: value, placeholder, ...rest } = key;
    (0, ensure_3.ensureNever)();
    return {
        property: normalizeSchemaKeyPath(value, normalizedProperties),
        label,
        placeholder,
    };
}
/**
 * Attempts to transform a property value (which may be a json-path string or a normal object schema property) into
 * a path to access the relevant schema. Specifically this handles the case of
 *   1) object schemas which have an intermediate `properties` object and
 *   2) array schemas which have an intermediate `items` object to traverse.
 */
function normalizePropertyValuePathIntoSchemaPath(propertyValue) {
    const normalizedValue = propertyValue
        .split('.')
        .map(val => {
        return val.replace(/\[(.*?)\]/, '.items');
    })
        .join('.properties.');
    return normalizedValue;
}
exports.normalizePropertyValuePathIntoSchemaPath = normalizePropertyValuePathIntoSchemaPath;
function normalizeSchema(schema) {
    if (isArray(schema)) {
        return {
            ...schema,
            type: ValueType.Array,
            items: normalizeSchema(schema.items),
        };
    }
    else if (isObject(schema)) {
        // The `as T` here seems like a typescript bug... shouldn't the above typeguard be
        // sufficient to define T === GenericObjectSchema?
        return normalizeObjectSchema(schema);
    }
    // We always make a copy of the input schema so we never accidentally mutate it.
    return { ...schema };
}
exports.normalizeSchema = normalizeSchema;
function normalizeObjectSchema(schema) {
    const normalizedProperties = {};
    const { attribution, options, codaType, description, displayProperty, featured, featuredProperties, id, identity, idProperty, imageProperty, includeUnknownProperties, linkProperty, primary, properties, snippetProperty, subtitleProperties, titleProperty, type, 
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __packId, ...rest } = schema;
    // Have TS ensure we don't forget about new fields in this function.
    (0, ensure_3.ensureNever)();
    for (const key of Object.keys(properties)) {
        const normalizedKey = normalizeSchemaKey(key);
        const property = properties[key];
        const { fixedId, fromKey, mutable, originalKey, required } = property;
        if (originalKey) {
            throw new Error('Original key is only for internal use.');
        }
        const normalizedPropertyAttrs = {
            fixedId,
            fromKey: fromKey || (normalizedKey !== key ? key : undefined),
            mutable,
            originalKey: key,
            required,
        };
        normalizedProperties[normalizedKey] = Object.assign(normalizeSchema(property), normalizedPropertyAttrs);
    }
    return {
        attribution,
        options,
        codaType,
        description,
        displayProperty: displayProperty ? normalizeSchemaKey(displayProperty) : undefined,
        featured: featured ? featured.map(normalizeSchemaKey) : undefined,
        featuredProperties: featuredProperties ? featuredProperties.map(normalizeSchemaKey) : undefined,
        id: id ? normalizeSchemaKey(id) : undefined,
        identity,
        idProperty: idProperty ? normalizeSchemaKey(idProperty) : undefined,
        imageProperty: imageProperty ? normalizeSchemaPropertyIdentifier(imageProperty, normalizedProperties) : undefined,
        includeUnknownProperties,
        linkProperty: linkProperty ? normalizeSchemaPropertyIdentifier(linkProperty, normalizedProperties) : undefined,
        primary: primary ? normalizeSchemaKey(primary) : undefined,
        properties: normalizedProperties,
        snippetProperty: snippetProperty
            ? normalizeSchemaPropertyIdentifier(snippetProperty, normalizedProperties)
            : undefined,
        subtitleProperties: subtitleProperties
            ? subtitleProperties.map(subProp => normalizeSchemaPropertyIdentifier(subProp, normalizedProperties))
            : undefined,
        titleProperty: titleProperty ? normalizeSchemaPropertyIdentifier(titleProperty, normalizedProperties) : undefined,
        type: ValueType.Object,
    };
}
exports.normalizeObjectSchema = normalizeObjectSchema;
/**
 * Convenience for creating a reference object schema from an existing schema for the
 * object. Copies over the identity, idProperty, and displayProperty from the schema,
 * and the subset of properties indicated by the idProperty and displayProperty.
 * A reference schema can always be defined directly, but if you already have an object
 * schema it provides better code reuse to derive a reference schema instead.
 */
function makeReferenceSchemaFromObjectSchema(schema, identityName) {
    const { type, id, primary, identity, properties, options } = (0, migration_1.objectSchemaHelper)(schema);
    const { mutable } = schema;
    (0, ensure_2.ensureExists)(identity || identityName, 'Source schema must have an identity field, or you must provide an identity name for the reference.');
    const validId = (0, ensure_2.ensureExists)(id);
    const referenceProperties = { [validId]: properties[validId] };
    if (primary && primary !== id) {
        (0, ensure_2.ensureExists)(properties[primary], `Display property "${primary}" must refer to a valid property schema.`);
        referenceProperties[primary] = properties[primary];
    }
    const referenceSchema = {
        codaType: ValueHintType.Reference,
        displayProperty: primary,
        identity: identity || { name: (0, ensure_2.ensureExists)(identityName) },
        idProperty: id,
        mutable,
        options,
        properties: referenceProperties,
        type,
    };
    return makeObjectSchema(referenceSchema);
}
exports.makeReferenceSchemaFromObjectSchema = makeReferenceSchemaFromObjectSchema;
/**
 * Convenience for defining the result schema for an action. The identity enables Coda to
 * update the corresponding sync table row, if it exists.
 * You could add the identity directly, but that would make the schema less re-usable.
 */
function withIdentity(schema, identityName) {
    return makeObjectSchema({
        ...(0, object_utils_1.deepCopy)(schema),
        identity: { name: (0, ensure_4.ensureNonEmptyString)(identityName) },
    });
}
exports.withIdentity = withIdentity;
/**
 * If someone tries to put a js function into a getSchema result in a dynamic schema, it's not going to work.
 * This method is to detect this proactively and give a clear, user-visible error message. Otherwise the error
 * they'd get would be an internal error, and the pack maker tools logs would just mention that structured clone
 * failed to copy a function.
 */
function throwOnDynamicSchemaWithJsOptionsFunction(dynamicSchema, parentKey) {
    if (!dynamicSchema) {
        return;
    }
    if (Array.isArray(dynamicSchema)) {
        dynamicSchema.forEach(item => throwOnDynamicSchemaWithJsOptionsFunction(item));
        return;
    }
    if (typeof dynamicSchema === 'object') {
        for (const key of Object.keys(dynamicSchema)) {
            throwOnDynamicSchemaWithJsOptionsFunction(dynamicSchema[key], key);
        }
    }
    if (typeof dynamicSchema === 'function' && parentKey === 'options') {
        throw new Error('Sync tables with dynamic schemas must use "options: OptionsType.Dynamic" instead of "options: () => {...}');
    }
}
exports.throwOnDynamicSchemaWithJsOptionsFunction = throwOnDynamicSchemaWithJsOptionsFunction;
