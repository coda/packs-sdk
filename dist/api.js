"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeRewriteConnectionForFormula = exports.makeEmptyFormula = exports.makeTranslateObjectFormula = exports.makeDynamicSyncTable = exports.makeSyncTableLegacy = exports.makeSyncTable = exports.makeObjectFormula = exports.makeSimpleAutocompleteMetadataFormula = exports.autocompleteSearchObjects = exports.simpleAutocomplete = exports.makeMetadataFormula = exports.makeFormula = exports.makeStringFormula = exports.makeNumericFormula = exports.isSyncPackFormula = exports.isStringPackFormula = exports.isObjectPackFormula = exports.check = exports.makeUserVisibleError = exports.makeImageArrayParameter = exports.makeImageParameter = exports.makeHtmlArrayParameter = exports.makeHtmlParameter = exports.makeDateArrayParameter = exports.makeDateParameter = exports.makeBooleanArrayParameter = exports.makeBooleanParameter = exports.makeNumericArrayParameter = exports.makeNumericParameter = exports.makeStringArrayParameter = exports.makeStringParameter = exports.makeParameter = exports.wrapMetadataFunction = exports.isDynamicSyncTable = exports.isUserVisibleError = exports.StatusCodeError = exports.UserVisibleError = void 0;
const api_types_1 = require("./api_types");
const api_types_2 = require("./api_types");
const api_types_3 = require("./api_types");
const schema_1 = require("./schema");
const api_types_4 = require("./api_types");
const api_types_5 = require("./api_types");
const ensure_1 = require("./helpers/ensure");
const ensure_2 = require("./helpers/ensure");
const handler_templates_1 = require("./handler_templates");
const handler_templates_2 = require("./handler_templates");
const api_types_6 = require("./api_types");
const api_types_7 = require("./api_types");
const schema_2 = require("./schema");
const schema_3 = require("./schema");
const api_types_8 = require("./api_types");
const api_types_9 = require("./api_types");
const handler_templates_3 = require("./handler_templates");
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
/**
 * StatusCodeError is a simple version of StatusCodeError in request-promise to keep backwards compatibility.
 */
class StatusCodeError extends Error {
    constructor(statusCode, body, options, response) {
        super(`${statusCode} - ${body}`);
        this.statusCode = statusCode;
        this.body = body;
        this.options = options;
        let responseBody = response === null || response === void 0 ? void 0 : response.body;
        if (typeof responseBody === 'object') {
            // "request-promise"'s error.response.body is always the original, unparsed response body,
            // while our fetcher service may attempt a JSON.parse for any response body and alter the behavior.
            // Here we attempt to restore the original response body for a few v1 packs compatibility.
            responseBody = JSON.stringify(responseBody);
        }
        this.response = { ...response, body: responseBody };
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
function wrapMetadataFunction(fnOrFormula) {
    return typeof fnOrFormula === 'function' ? makeMetadataFormula(fnOrFormula) : fnOrFormula;
}
exports.wrapMetadataFunction = wrapMetadataFunction;
/**
 * Create a definition for a parameter for a formula or sync.
 *
 * @example
 * makeParameter({type: ParameterType.String, name: 'myParam', description: 'My description'});
 *
 * @example
 * makeParameter({type: ParameterType.StringArray, name: 'myArrayParam', description: 'My description'});
 */
function makeParameter(paramDefinition) {
    const { type, autocomplete: autocompleteDefOrItems, ...rest } = paramDefinition;
    const actualType = api_types_2.ParameterTypeInputMap[type];
    let autocompleteDef = autocompleteDefOrItems;
    if (Array.isArray(autocompleteDef)) {
        autocompleteDef = makeSimpleAutocompleteMetadataFormula(autocompleteDef);
    }
    const autocomplete = wrapMetadataFunction(autocompleteDef);
    return Object.freeze({ ...rest, autocomplete, type: actualType });
}
exports.makeParameter = makeParameter;
// Other parameter helpers below here are obsolete given the above generate parameter makers.
function makeStringParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_3.Type.string });
}
exports.makeStringParameter = makeStringParameter;
function makeStringArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_9.stringArray });
}
exports.makeStringArrayParameter = makeStringArrayParameter;
function makeNumericParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_3.Type.number });
}
exports.makeNumericParameter = makeNumericParameter;
function makeNumericArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_8.numberArray });
}
exports.makeNumericArrayParameter = makeNumericArrayParameter;
function makeBooleanParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_3.Type.boolean });
}
exports.makeBooleanParameter = makeBooleanParameter;
function makeBooleanArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_4.booleanArray });
}
exports.makeBooleanArrayParameter = makeBooleanArrayParameter;
function makeDateParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_3.Type.date });
}
exports.makeDateParameter = makeDateParameter;
function makeDateArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_5.dateArray });
}
exports.makeDateArrayParameter = makeDateArrayParameter;
function makeHtmlParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_3.Type.html });
}
exports.makeHtmlParameter = makeHtmlParameter;
function makeHtmlArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_6.htmlArray });
}
exports.makeHtmlArrayParameter = makeHtmlArrayParameter;
function makeImageParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_3.Type.image });
}
exports.makeImageParameter = makeImageParameter;
function makeImageArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_7.imageArray });
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
    return fn.resultType === api_types_3.Type.object;
}
exports.isObjectPackFormula = isObjectPackFormula;
function isStringPackFormula(fn) {
    return fn.resultType === api_types_3.Type.string;
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
    return Object.assign({}, definition, { resultType: api_types_3.Type.number });
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
        resultType: api_types_3.Type.string,
        ...(response && { schema: response.schema }),
    });
}
exports.makeStringFormula = makeStringFormula;
/**
 * Creates a formula definition.
 *
 * You must indicate the kind of value that this formula returns (string, number, boolean, array, or object)
 * using the `resultType` field.
 *
 * Formulas always return basic types, but you may optionally give a type hint using
 * `codaType` to tell Coda how to interpret a given value. For example, you can return
 * a string that represents a date, but use `codaType: ValueType.Date` to tell Coda
 * to interpret as a date in a document.
 *
 * If your formula returns an object, you must provide a `schema` property that describes
 * the structure of the object. See {@link makeObjectSchema} for how to construct an object schema.
 *
 * If your formula returns a list (array), you must provide an `items` property that describes
 * what the elements of the array are. This could be a simple schema like `{type: ValueType.String}`
 * indicating that the array elements are all just strings, or it could be an object schema
 * created using {@link makeObjectSchema} if the elements are objects.
 *
 * @example
 * makeFormula({resultType: ValueType.String, name: 'Hello', ...});
 *
 * @example
 * makeFormula({resultType: ValueType.String, codaType: ValueType.Html, name: 'HelloHtml', ...});
 *
 * @example
 * makeFormula({resultType: ValueType.Array, items: {type: ValueType.String}, name: 'HelloStringArray', ...});
 *
 * @example
 * makeFormula({
 *   resultType: ValueType.Object,
 *   schema: makeObjectSchema({type: ValueType.Object, properties: {...}}),
 *   name: 'HelloObject',
 *   ...
 * });
 *
 * @example
 * makeFormula({
 *   resultType: ValueType.Array,
 *   items: makeObjectSchema({type: ValueType.Object, properties: {...}}),
 *   name: 'HelloObjectArray',
 *   ...
 * });
 */
function makeFormula(fullDefinition) {
    let formula;
    const { onError, ...definition } = fullDefinition;
    switch (definition.resultType) {
        case schema_1.ValueType.String: {
            const { resultType: unused, codaType, ...rest } = definition;
            const stringFormula = {
                ...rest,
                resultType: api_types_3.Type.string,
                schema: codaType ? { type: schema_1.ValueType.String, codaType } : undefined,
            };
            formula = stringFormula;
            break;
        }
        case schema_1.ValueType.Number: {
            const { resultType: unused, codaType, ...rest } = definition;
            const numericFormula = {
                ...rest,
                resultType: api_types_3.Type.number,
                schema: codaType ? { type: schema_1.ValueType.Number, codaType } : undefined,
            };
            formula = numericFormula;
            break;
        }
        case schema_1.ValueType.Boolean: {
            const { resultType: unused, ...rest } = definition;
            const booleanFormula = {
                ...rest,
                resultType: api_types_3.Type.boolean,
            };
            formula = booleanFormula;
            break;
        }
        case schema_1.ValueType.Array: {
            const { resultType: unused, items, ...rest } = definition;
            const arrayFormula = {
                ...rest,
                resultType: api_types_3.Type.object,
                schema: schema_3.normalizeSchema({ type: schema_1.ValueType.Array, items }),
            };
            formula = arrayFormula;
            break;
        }
        case schema_1.ValueType.Object: {
            const { resultType: unused, schema, ...rest } = definition;
            const objectFormula = {
                ...rest,
                resultType: api_types_3.Type.object,
                schema: schema_3.normalizeSchema(schema),
            };
            formula = objectFormula;
            break;
        }
        default:
            return ensure_2.ensureUnreachable(definition);
    }
    if ([schema_1.ValueType.Object, schema_1.ValueType.Array].includes(definition.resultType)) {
        const wrappedExecute = formula.execute;
        formula.execute = async function (params, context) {
            const result = await wrappedExecute(params, context);
            return handler_templates_3.transformBody(result, ensure_1.ensureExists(formula.schema));
        };
    }
    if (onError) {
        const wrappedExecute = formula.execute;
        formula.execute = async function (params, context) {
            try {
                return await wrappedExecute(params, context);
            }
            catch (err) {
                return onError(err);
            }
        };
    }
    return maybeRewriteConnectionForFormula(formula, definition.connectionRequirement);
}
exports.makeFormula = makeFormula;
function makeMetadataFormula(execute, options) {
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
        connectionRequirement: (options === null || options === void 0 ? void 0 : options.connectionRequirement) || api_types_1.ConnectionRequirement.Required,
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
    return makeMetadataFormula((context, [search]) => simpleAutocomplete(search, options), {
        // A connection won't be used here, but if the parent formula uses a connection
        // the execution code is going to try to pass it here. We should fix that.
        connectionRequirement: api_types_1.ConnectionRequirement.Optional,
    });
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
            response.schema = schema_3.normalizeSchema(response.schema);
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
        resultType: api_types_3.Type.object,
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
 */
function makeSyncTable({ name, identityName, schema: schemaDef, formula, connectionRequirement, dynamicOptions = {}, }) {
    const { getSchema: getSchemaDef, entityName } = dynamicOptions;
    const { execute: wrappedExecute, ...definition } = maybeRewriteConnectionForFormula(formula, connectionRequirement);
    if (schemaDef.identity) {
        schemaDef.identity = { ...schemaDef.identity, name: identityName || schemaDef.identity.name };
    }
    else if (identityName) {
        schemaDef.identity = { name: identityName };
    }
    const getSchema = wrapMetadataFunction(getSchemaDef);
    const schema = schema_2.makeObjectSchema(schemaDef);
    const formulaSchema = getSchema
        ? undefined
        : schema_3.normalizeSchema({ type: schema_1.ValueType.Array, items: schema });
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
        const appliedSchema = context.sync.schema;
        return {
            result: responseHandler({ body: ensure_1.ensureExists(result), status: 200, headers: {} }, appliedSchema),
            continuation,
        };
    };
    return {
        name,
        schema: schema_3.normalizeSchema(schema),
        getter: {
            ...definition,
            cacheTtlSecs: 0,
            execute,
            schema: formulaSchema,
            isSyncFormula: true,
            connectionRequirement: definition.connectionRequirement || connectionRequirement,
            resultType: api_types_3.Type.object,
        },
        getSchema: maybeRewriteConnectionForFormula(getSchema, connectionRequirement),
        entityName,
    };
}
exports.makeSyncTable = makeSyncTable;
function makeSyncTableLegacy(name, schema, formula, connectionRequirement, dynamicOptions = {}) {
    return makeSyncTable({ name, identityName: '', schema, formula, connectionRequirement, dynamicOptions });
}
exports.makeSyncTableLegacy = makeSyncTableLegacy;
function makeDynamicSyncTable({ name, getName: getNameDef, getSchema: getSchemaDef, getDisplayUrl: getDisplayUrlDef, formula, listDynamicUrls: listDynamicUrlsDef, entityName, connectionRequirement, }) {
    const fakeSchema = schema_2.makeObjectSchema({
        // This schema is useless... just creating a stub here but the client will use
        // the dynamic one.
        type: schema_1.ValueType.Object,
        id: 'id',
        primary: 'id',
        identity: { name },
        properties: {
            id: { type: schema_1.ValueType.String },
        },
    });
    const getName = wrapMetadataFunction(getNameDef);
    const getSchema = wrapMetadataFunction(getSchemaDef);
    const getDisplayUrl = wrapMetadataFunction(getDisplayUrlDef);
    const listDynamicUrls = wrapMetadataFunction(listDynamicUrlsDef);
    const table = makeSyncTable({
        name,
        identityName: '',
        schema: fakeSchema,
        formula,
        connectionRequirement,
        dynamicOptions: { getSchema, entityName },
    });
    return {
        ...table,
        isDynamic: true,
        getDisplayUrl: maybeRewriteConnectionForFormula(getDisplayUrl, connectionRequirement),
        listDynamicUrls: maybeRewriteConnectionForFormula(listDynamicUrls, connectionRequirement),
        getName: maybeRewriteConnectionForFormula(getName, connectionRequirement),
    };
}
exports.makeDynamicSyncTable = makeDynamicSyncTable;
function makeTranslateObjectFormula({ response, ...definition }) {
    const { request, parameters } = definition;
    response.schema = response.schema ? schema_3.normalizeSchema(response.schema) : undefined;
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
        resultType: api_types_3.Type.object,
        schema: response.schema,
    });
}
exports.makeTranslateObjectFormula = makeTranslateObjectFormula;
function makeEmptyFormula(definition) {
    const { request, ...rest } = definition;
    const { parameters } = rest;
    const requestHandler = handler_templates_2.generateRequestHandler(request, parameters);
    function execute(params, context) {
        return context.fetcher.fetch(requestHandler(params)).then(() => '');
    }
    return Object.assign({}, rest, {
        execute,
        resultType: api_types_3.Type.string,
    });
}
exports.makeEmptyFormula = makeEmptyFormula;
function maybeRewriteConnectionForFormula(formula, connectionRequirement) {
    var _a;
    if (formula && connectionRequirement) {
        return {
            ...formula,
            parameters: formula.parameters.map((param) => {
                return {
                    ...param,
                    autocomplete: param.autocomplete
                        ? maybeRewriteConnectionForFormula(param.autocomplete, connectionRequirement)
                        : undefined,
                };
            }),
            varargParameters: (_a = formula.varargParameters) === null || _a === void 0 ? void 0 : _a.map((param) => {
                return {
                    ...param,
                    autocomplete: param.autocomplete
                        ? maybeRewriteConnectionForFormula(param.autocomplete, connectionRequirement)
                        : undefined,
                };
            }),
            connectionRequirement,
        };
    }
    return formula;
}
exports.maybeRewriteConnectionForFormula = maybeRewriteConnectionForFormula;
