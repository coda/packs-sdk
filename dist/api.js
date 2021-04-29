"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCodaFormula = exports.makeEmptyFormula = exports.makeTranslateObjectFormula = exports.makeDynamicSyncTable = exports.makeSyncTable = exports.makeObjectFormula = exports.makeSimpleAutocompleteMetadataFormula = exports.autocompleteSearchObjects = exports.simpleAutocomplete = exports.makeMetadataFormula = exports.makeStringFormula = exports.makeNumericFormula = exports.isSyncPackFormula = exports.isStringPackFormula = exports.isCodaFormula = exports.isObjectPackFormula = exports.check = exports.makeUserVisibleError = exports.makeImageArrayParameter = exports.makeImageParameter = exports.makeHtmlArrayParameter = exports.makeHtmlParameter = exports.makeDateArrayParameter = exports.makeDateParameter = exports.makeBooleanArrayParameter = exports.makeBooleanParameter = exports.makeNumericArrayParameter = exports.makeNumericParameter = exports.makeStringArrayParameter = exports.makeStringParameter = exports.isDynamicSyncTable = exports.isUserVisibleError = exports.StatusCodeError = exports.UserVisibleError = void 0;
const api_types_1 = require("./api_types");
const schema_1 = require("./schema");
const api_types_2 = require("./api_types");
const api_types_3 = require("./api_types");
const ensure_1 = require("./helpers/ensure");
const handler_templates_1 = require("./handler_templates");
const handler_templates_2 = require("./handler_templates");
const schema_2 = require("./schema");
const api_types_4 = require("./api_types");
const api_types_5 = require("./api_types");
const schema_3 = require("./schema");
const schema_4 = require("./schema");
const api_types_6 = require("./api_types");
const api_types_7 = require("./api_types");
/**
 * An error whose message will be shown to the end user in the UI when it occurs.
 * If an error is encountered in a formula and you want to describe the error
 * to the end user, throw a UserVisibleError with a user-friendly message
 * and the Coda UI will display the message.
 */
class UserVisibleError extends Error {
    constructor(message, internalError) {
        super(message);
        this.isUserVisible = true;
        this.internalError = internalError;
    }
}
exports.UserVisibleError = UserVisibleError;
class StatusCodeError extends Error {
    constructor(statusCode) {
        super(`statusCode: ${statusCode}`);
        this.statusCode = statusCode;
    }
}
exports.StatusCodeError = StatusCodeError;
/**
 * Helper to determine if an error is considered user-visible and can be shown in the UI.
 * See {@link UserVisibleError}.
 * @param error Any error object.
 */
function isUserVisibleError(error) {
    return 'isUserVisible' in error && error.isUserVisible;
}
exports.isUserVisibleError = isUserVisibleError;
function isDynamicSyncTable(syncTable) {
    return 'isDynamic' in syncTable;
}
exports.isDynamicSyncTable = isDynamicSyncTable;
function makeStringParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_1.Type.string });
}
exports.makeStringParameter = makeStringParameter;
function makeStringArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_7.stringArray });
}
exports.makeStringArrayParameter = makeStringArrayParameter;
function makeNumericParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_1.Type.number });
}
exports.makeNumericParameter = makeNumericParameter;
function makeNumericArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_6.numberArray });
}
exports.makeNumericArrayParameter = makeNumericArrayParameter;
function makeBooleanParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_1.Type.boolean });
}
exports.makeBooleanParameter = makeBooleanParameter;
function makeBooleanArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_2.booleanArray });
}
exports.makeBooleanArrayParameter = makeBooleanArrayParameter;
function makeDateParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_1.Type.date });
}
exports.makeDateParameter = makeDateParameter;
function makeDateArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_3.dateArray });
}
exports.makeDateArrayParameter = makeDateArrayParameter;
function makeHtmlParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_1.Type.html });
}
exports.makeHtmlParameter = makeHtmlParameter;
function makeHtmlArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_4.htmlArray });
}
exports.makeHtmlArrayParameter = makeHtmlArrayParameter;
function makeImageParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_1.Type.image });
}
exports.makeImageParameter = makeImageParameter;
function makeImageArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_5.imageArray });
}
exports.makeImageArrayParameter = makeImageArrayParameter;
function makeUserVisibleError(msg) {
    return new UserVisibleError(msg);
}
exports.makeUserVisibleError = makeUserVisibleError;
function check(condition, msg) {
    if (!condition) {
        throw makeUserVisibleError(msg);
    }
}
exports.check = check;
function isObjectPackFormula(fn) {
    return fn.resultType === api_types_1.Type.object;
}
exports.isObjectPackFormula = isObjectPackFormula;
function isCodaFormula(fn) {
    return fn.isCodaFormula;
}
exports.isCodaFormula = isCodaFormula;
function isStringPackFormula(fn) {
    return fn.resultType === api_types_1.Type.string;
}
exports.isStringPackFormula = isStringPackFormula;
function isSyncPackFormula(fn) {
    return Boolean(fn.isSyncFormula);
}
exports.isSyncPackFormula = isSyncPackFormula;
/**
 * Helper for returning the definition of a formula that returns a number. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a number.
 */
function makeNumericFormula(definition) {
    return Object.assign({}, definition, { resultType: api_types_1.Type.number });
}
exports.makeNumericFormula = makeNumericFormula;
/**
 * Helper for returning the definition of a formula that returns a string. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a string.
 */
function makeStringFormula(definition) {
    const { response } = definition;
    return Object.assign({}, definition, {
        resultType: api_types_1.Type.string,
        ...(response && { schema: response.schema }),
    });
}
exports.makeStringFormula = makeStringFormula;
function makeMetadataFormula(execute) {
    return makeObjectFormula({
        name: 'getMetadata',
        description: 'Gets metadata',
        // Formula context is serialized here because we do not want to pass objects into
        // regular pack functions (which this is)
        execute([search, serializedFormulaContext], context) {
            let formulaContext = {};
            try {
                formulaContext = JSON.parse(serializedFormulaContext);
            }
            catch (err) {
                //  Ignore.
            }
            return execute(context, search, formulaContext);
        },
        parameters: [
            makeStringParameter('search', 'Metadata to search for', { optional: true }),
            makeStringParameter('formulaContext', 'Serialized JSON for metadata', { optional: true }),
        ],
        examples: [],
        network: {
            hasSideEffect: false,
            requiresConnection: true,
        },
    });
}
exports.makeMetadataFormula = makeMetadataFormula;
function simpleAutocomplete(search, options) {
    const normalizedSearch = (search || '').toLowerCase();
    const filtered = options.filter(option => {
        const display = typeof option === 'string' ? option : option.display;
        return display.toLowerCase().includes(normalizedSearch);
    });
    const metadataResults = filtered.map(option => {
        if (typeof option === 'string') {
            return {
                value: option,
                display: option,
            };
        }
        return option;
    });
    return Promise.resolve(metadataResults);
}
exports.simpleAutocomplete = simpleAutocomplete;
function autocompleteSearchObjects(search, objs, displayKey, valueKey) {
    const normalizedSearch = search.toLowerCase();
    const filtered = objs.filter(o => o[displayKey].toLowerCase().includes(normalizedSearch));
    const metadataResults = filtered.map(o => {
        return {
            value: o[valueKey],
            display: o[displayKey],
        };
    });
    return Promise.resolve(metadataResults);
}
exports.autocompleteSearchObjects = autocompleteSearchObjects;
function makeSimpleAutocompleteMetadataFormula(options) {
    return makeMetadataFormula((context, [search]) => simpleAutocomplete(search, options));
}
exports.makeSimpleAutocompleteMetadataFormula = makeSimpleAutocompleteMetadataFormula;
function isResponseHandlerTemplate(obj) {
    return obj && obj.schema;
}
function isResponseExampleTemplate(obj) {
    return obj && obj.example;
}
function makeObjectFormula({ response, ...definition }) {
    let schema;
    if (response) {
        if (isResponseHandlerTemplate(response) && response.schema) {
            response.schema = schema_4.normalizeSchema(response.schema);
            schema = response.schema;
        }
        else if (isResponseExampleTemplate(response)) {
            // TODO(alexd): Figure out what to do with examples.
            // schema = generateSchema(response.example);
        }
    }
    let execute = definition.execute;
    if (isResponseHandlerTemplate(response)) {
        const { onError } = response;
        const wrappedExecute = execute;
        const responseHandler = handler_templates_1.generateObjectResponseHandler(response);
        execute = async function exec(params, context) {
            let result;
            try {
                result = await wrappedExecute(params, context);
            }
            catch (err) {
                if (onError) {
                    result = onError(err);
                }
                else {
                    throw err;
                }
            }
            return responseHandler({ body: ensure_1.ensureExists(result), status: 200, headers: {} });
        };
    }
    return Object.assign({}, definition, {
        resultType: api_types_1.Type.object,
        execute,
        schema,
    });
}
exports.makeObjectFormula = makeObjectFormula;
/**
 * Wrapper to produce a sync table definition. All (non-dynamic) sync tables should be created
 * using this wrapper rather than declaring a sync table definition object directly.
 *
 * This wrapper does a variety of helpful things, including
 * * Doing basic validation of the provided definition.
 * * Normalizing the schema definition to conform to Coda-recommended syntax.
 * * Wrapping the execute formula to normalize return values to match the normalized schema.
 *
 * See [Normalization](/index.html#normalization) for more information about schema normalization.
 *
 * @param name The name of the sync table. This should describe the entities being synced. For example,
 * a sync table that syncs products from an e-commerce platform should be called 'Products'. This name
 * must not contain spaces.
 * @param schema The definition of the schema that describes a single response object. For example, the
 * schema for a single product. The sync formula will return an array of objects that fit this schema.
 * @param formula The definition of the formula that implements this sync. This is a Coda packs formula
 * that returns an array of objects fitting the given schema and optionally a {@link Continuation}.
 * (The {@link SyncFormulaDef.name} is redundant and should be the same as the `name` parameter here.
 * These will eventually be consolidated.)
 * @param getSchema Only used internally by {@link makeDynamicSyncTable}, see there for more details.
 * @param entityName Only used internally by {@link makeDynamicSyncTable}, see there for more details.
 */
function makeSyncTable(name, schema, formula, getSchema, entityName, inferSchema) {
    const { execute: wrappedExecute, ...definition } = formula;
    const formulaSchema = getSchema
        ? undefined
        : schema_4.normalizeSchema({ type: schema_1.ValueType.Array, items: schema });
    const { identity, id, primary } = schema;
    if (!(primary && id && identity)) {
        throw new Error(`Sync table schemas should have defined properties for identity, id and primary`);
    }
    if (name.includes(' ')) {
        throw new Error('Sync table name should not include spaces');
    }
    const responseHandler = handler_templates_1.generateObjectResponseHandler({ schema: formulaSchema });
    const execute = async function exec(params, context) {
        const { result, continuation } = await wrappedExecute(params, context);
        const appliedSchema = inferSchema
            ? schema_2.generateSchema(result)
            : context.sync.schema;
        return {
            result: responseHandler({ body: ensure_1.ensureExists(result), status: 200, headers: {} }, appliedSchema),
            schema: inferSchema
                ? appliedSchema
                : undefined,
            continuation,
        };
    };
    return {
        name,
        schema: schema_4.normalizeSchema(schema),
        getter: {
            ...definition,
            cacheTtlSecs: 0,
            execute,
            schema: formulaSchema,
            isSyncFormula: true,
            resultType: api_types_1.Type.object,
        },
        getSchema,
        entityName,
    };
}
exports.makeSyncTable = makeSyncTable;
function makeDynamicSyncTable({ packId, name, getName, getSchema, inferSchema, getDisplayUrl, formula, listDynamicUrls, entityName, }) {
    const fakeSchema = schema_3.makeObjectSchema({
        // This schema is useless... just creating a stub here but the client will use
        // the dynamic one.
        type: schema_1.ValueType.Object,
        id: 'id',
        primary: 'id',
        identity: {
            packId,
            name,
        },
        properties: {
            id: { type: schema_1.ValueType.String },
        },
    });
    const table = makeSyncTable(name, fakeSchema, formula, getSchema, entityName, inferSchema);
    return {
        ...table,
        isDynamic: true,
        getDisplayUrl,
        listDynamicUrls,
        getName,
    };
}
exports.makeDynamicSyncTable = makeDynamicSyncTable;
function makeTranslateObjectFormula({ response, ...definition }) {
    const { request, parameters } = definition;
    response.schema = response.schema ? schema_4.normalizeSchema(response.schema) : undefined;
    const { onError } = response;
    const requestHandler = handler_templates_2.generateRequestHandler(request, parameters);
    const responseHandler = handler_templates_1.generateObjectResponseHandler(response);
    function execute(params, context) {
        return context.fetcher
            .fetch(requestHandler(params))
            .catch(err => {
            if (onError) {
                return onError(err);
            }
            throw err;
        })
            .then(responseHandler);
    }
    return Object.assign({}, definition, {
        execute,
        resultType: api_types_1.Type.object,
        schema: response.schema,
    });
}
exports.makeTranslateObjectFormula = makeTranslateObjectFormula;
function makeEmptyFormula(definition) {
    const { request, parameters } = definition;
    const requestHandler = handler_templates_2.generateRequestHandler(request, parameters);
    function execute(params, context) {
        return context.fetcher.fetch(requestHandler(params)).then(() => '');
    }
    return Object.assign({}, definition, {
        execute,
        resultType: api_types_1.Type.string,
    });
}
exports.makeEmptyFormula = makeEmptyFormula;
function makeCodaFormula(definition) {
    return {
        ...definition,
        isCodaFormula: true,
    };
}
exports.makeCodaFormula = makeCodaFormula;
