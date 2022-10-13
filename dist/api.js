import { ConnectionRequirement } from './api_types';
import { ParameterTypeInputMap } from './api_types';
import { Type } from './api_types';
import { ValueType } from './schema';
import { booleanArray } from './api_types';
import { dateArray } from './api_types';
import { deepCopy } from './helpers/object_utils';
import { ensureUnreachable } from './helpers/ensure';
import { fileArray } from './api_types';
import { generateObjectResponseHandler } from './handler_templates';
import { generateRequestHandler } from './handler_templates';
import { htmlArray } from './api_types';
import { imageArray } from './api_types';
import { isPromise } from './helpers/object_utils';
import { makeObjectSchema } from './schema';
import { normalizeSchema } from './schema';
import { numberArray } from './api_types';
import { objectSchemaHelper } from './helpers/migration';
import { stringArray } from './api_types';
/**
 * An error whose message will be shown to the end user in the UI when it occurs.
 * If an error is encountered in a formula and you want to describe the error
 * to the end user, throw a UserVisibleError with a user-friendly message
 * and the Coda UI will display the message.
 */
export class UserVisibleError extends Error {
    /**
     * Use to construct a user-visible error.
     *
     * @example
     * ```
     * if (!url.startsWith("http")) {
     *   throw new coda.UserVisibleError("Please provide a valid url.");
     * }
     * ```
     */
    constructor(message, internalError) {
        super(message);
        /** @hidden */
        this.isUserVisible = true;
        this.internalError = internalError;
    }
}
// StatusCodeError is a simple version of StatusCodeError in request-promise to keep backwards compatibility.
// This tries to replicate its exact structure, massaging as necessary to handle the various transforms
// in our stack.
//
// https://github.com/request/promise-core/blob/master/lib/errors.js#L22
/**
 * An error that will be thrown by {@link Fetcher.fetch} when the fetcher response has an
 * HTTP status code of 400 or greater.
 *
 * This class largely models the `StatusCodeError` from the (now deprecated) `request-promise` library,
 * which has a quirky structure.
 */
export class StatusCodeError extends Error {
    /** @hidden */
    constructor(statusCode, body, options, response) {
        super(`${statusCode} - ${JSON.stringify(body)}`);
        /**
         * The name of the error, for identiciation purposes.
         */
        this.name = 'StatusCodeError';
        this.statusCode = statusCode;
        this.body = body;
        this.error = body;
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
    /** Returns if the error is an instance of StatusCodeError. Note that instanceof may not work. */
    static isStatusCodeError(err) {
        return 'name' in err && err.name === StatusCodeError.name;
    }
}
/**
 * Throw this error if the user needs to re-authenticate to gain OAuth scopes that have been added
 * to the pack since their connection was created, or scopes that are specific to a certain formula.
 * This is useful because Coda will always attempt to execute a formula even if a user has not yet
 * re-authenticated with all relevant scopes.
 *
 * You don't *always* need to throw this specific error, as Coda will interpret a 403 (Forbidden)
 * status code error as a MissingScopesError when the user's connection was made without all
 * currently relevant scopes. This error exists because that default behavior is insufficient if
 * the OAuth service does not set a 403 status code (the OAuth spec doesn't specifically require
 * them to, after all).
 */
export class MissingScopesError extends Error {
    /** @hidden */
    constructor(message) {
        super(message || 'Additional permissions are required');
        /**
         * The name of the error, for identification purposes.
         */
        this.name = 'MissingScopesError';
    }
    /** Returns if the error is an instance of MissingScopesError. Note that instanceof may not work. */
    static isMissingScopesError(err) {
        return 'name' in err && err.name === MissingScopesError.name;
    }
}
/**
 * Helper to determine if an error is considered user-visible and can be shown in the UI.
 * See {@link UserVisibleError}.
 * @param error Any error object.
 */
export function isUserVisibleError(error) {
    return 'isUserVisible' in error && error.isUserVisible;
}
export function isDynamicSyncTable(syncTable) {
    return 'isDynamic' in syncTable;
}
export function wrapMetadataFunction(fnOrFormula) {
    return typeof fnOrFormula === 'function' ? makeMetadataFormula(fnOrFormula) : fnOrFormula;
}
function transformToArraySchema(schema) {
    if ((schema === null || schema === void 0 ? void 0 : schema.type) === ValueType.Array) {
        return schema;
    }
    else {
        return {
            type: ValueType.Array,
            items: schema,
        };
    }
}
export function wrapGetSchema(getSchema) {
    if (!getSchema) {
        return;
    }
    return {
        ...getSchema,
        execute(params, context) {
            const schema = getSchema.execute(params, context);
            if (isPromise(schema)) {
                return schema.then(value => transformToArraySchema(value));
            }
            else {
                return transformToArraySchema(schema);
            }
        },
    };
}
/**
 * Create a definition for a parameter for a formula or sync.
 *
 * @example
 * ```
 * makeParameter({type: ParameterType.String, name: 'myParam', description: 'My description'});
 * ```
 *
 * @example
 * ```
 * makeParameter({type: ParameterType.StringArray, name: 'myArrayParam', description: 'My description'});
 * ```
 */
export function makeParameter(paramDefinition) {
    const { type, autocomplete: autocompleteDefOrItems, ...rest } = paramDefinition;
    const actualType = ParameterTypeInputMap[type];
    let autocomplete;
    if (Array.isArray(autocompleteDefOrItems)) {
        const autocompleteDef = makeSimpleAutocompleteMetadataFormula(autocompleteDefOrItems);
        autocomplete = wrapMetadataFunction(autocompleteDef);
    }
    else {
        autocomplete = wrapMetadataFunction(autocompleteDefOrItems);
    }
    return Object.freeze({ ...rest, autocomplete, type: actualType });
}
// Other parameter helpers below here are obsolete given the above generate parameter makers.
/** @deprecated */
export function makeStringParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: Type.string });
}
/** @deprecated */
export function makeStringArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: stringArray });
}
/** @deprecated */
export function makeNumericParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: Type.number });
}
/** @deprecated */
export function makeNumericArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: numberArray });
}
/** @deprecated */
export function makeBooleanParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: Type.boolean });
}
/** @deprecated */
export function makeBooleanArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: booleanArray });
}
/** @deprecated */
export function makeDateParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: Type.date });
}
/** @deprecated */
export function makeDateArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: dateArray });
}
/** @deprecated */
export function makeHtmlParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: Type.html });
}
/** @deprecated */
export function makeHtmlArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: htmlArray });
}
/** @deprecated */
export function makeImageParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: Type.image });
}
/** @deprecated */
export function makeImageArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: imageArray });
}
/** @deprecated */
export function makeFileParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: Type.file });
}
/** @deprecated */
export function makeFileArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: fileArray });
}
/** @deprecated */
export function makeUserVisibleError(msg) {
    return new UserVisibleError(msg);
}
/** @deprecated */
export function check(condition, msg) {
    if (!condition) {
        throw makeUserVisibleError(msg);
    }
}
export function isObjectPackFormula(fn) {
    return fn.resultType === Type.object;
}
export function isStringPackFormula(fn) {
    return fn.resultType === Type.string;
}
export function isSyncPackFormula(fn) {
    return Boolean(fn.isSyncFormula);
}
/**
 * @deprecated
 *
 * Helper for returning the definition of a formula that returns a number. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a number.
 */
export function makeNumericFormula(definition) {
    return Object.assign({}, definition, { resultType: Type.number });
}
/**
 * @deprecated
 *
 * Helper for returning the definition of a formula that returns a string. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a string.
 */
export function makeStringFormula(definition) {
    const { response } = definition;
    return Object.assign({}, definition, {
        resultType: Type.string,
        ...(response && { schema: response.schema }),
    });
}
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
 * ```
 * makeFormula({resultType: ValueType.String, name: 'Hello', ...});
 * ```
 *
 * @example
 * ```
 * makeFormula({resultType: ValueType.String, codaType: ValueType.Html, name: 'HelloHtml', ...});
 * ```
 *
 * @example
 * ```
 * makeFormula({resultType: ValueType.Array, items: {type: ValueType.String}, name: 'HelloStringArray', ...});
 * ```
 *
 * @example
 * ```
 * makeFormula({
 *   resultType: ValueType.Object,
 *   schema: makeObjectSchema({type: ValueType.Object, properties: {...}}),
 *   name: 'HelloObject',
 *   ...
 * });
 * ```
 *
 * @example
 * ```
 * makeFormula({
 *   resultType: ValueType.Array,
 *   items: makeObjectSchema({type: ValueType.Object, properties: {...}}),
 *   name: 'HelloObjectArray',
 *   ...
 * });
 * ```
 */
export function makeFormula(fullDefinition) {
    let formula;
    switch (fullDefinition.resultType) {
        case ValueType.String: {
            // very strange ts knows that fullDefinition.codaType is StringHintTypes but doesn't know if
            // fullDefinition is StringFormulaDefV2.
            const def = {
                ...fullDefinition,
                codaType: 'codaType' in fullDefinition ? fullDefinition.codaType : undefined,
                formulaSchema: 'schema' in fullDefinition ? fullDefinition.schema : undefined,
            };
            const { onError: _, resultType: unused, codaType, formulaSchema, ...rest } = def;
            const stringFormula = {
                ...rest,
                resultType: Type.string,
                schema: formulaSchema || (codaType ? { type: ValueType.String, codaType } : undefined),
            };
            formula = stringFormula;
            break;
        }
        case ValueType.Number: {
            const def = {
                ...fullDefinition,
                codaType: 'codaType' in fullDefinition ? fullDefinition.codaType : undefined,
                formulaSchema: 'schema' in fullDefinition ? fullDefinition.schema : undefined,
            };
            const { onError: _, resultType: unused, codaType, formulaSchema, ...rest } = def;
            const numericFormula = {
                ...rest,
                resultType: Type.number,
                schema: formulaSchema || (codaType ? { type: ValueType.Number, codaType } : undefined),
            };
            formula = numericFormula;
            break;
        }
        case ValueType.Boolean: {
            const { onError: _, resultType: unused, ...rest } = fullDefinition;
            const booleanFormula = {
                ...rest,
                resultType: Type.boolean,
            };
            formula = booleanFormula;
            break;
        }
        case ValueType.Array: {
            const { onError: _, resultType: unused, items, ...rest } = fullDefinition;
            const arrayFormula = {
                ...rest,
                // TypeOf<SchemaType<ArraySchema<SchemaT>>> is always Type.object but TS can't infer this.
                resultType: Type.object,
                schema: normalizeSchema({ type: ValueType.Array, items }),
            };
            formula = arrayFormula;
            break;
        }
        case ValueType.Object: {
            const { onError: _, resultType: unused, schema, ...rest } = fullDefinition;
            // need a force cast since execute has a different return value due to key normalization.
            const objectFormula = {
                ...rest,
                resultType: Type.object,
                schema: normalizeSchema(schema),
            };
            formula = objectFormula;
            break;
        }
        default:
            return ensureUnreachable(fullDefinition);
    }
    const onError = fullDefinition.onError;
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
    return maybeRewriteConnectionForFormula(formula, fullDefinition.connectionRequirement);
}
/**
 * A wrapper that generates a formula definition from the function that implements a metadata formula.
 * It is uncommon to ever need to call this directly, normally you would just define the JavaScript
 * function implementation, and Coda will wrap it with this to generate a full metadata formula
 * definition.
 *
 * All function-like behavior in a pack is ultimately implemented using formulas, like you would
 * define using {@link makeFormula}. That is, a formula with a name, description, parameter list,
 * and an `execute` function body. This includes supporting utilities like paramter autocomplete functions.
 * This wrapper simply adds the surrounding boilerplate for a given JavaScript function so that
 * it is shaped like a Coda formula to be used at runtime.
 */
export function makeMetadataFormula(execute, options) {
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
        connectionRequirement: (options === null || options === void 0 ? void 0 : options.connectionRequirement) || ConnectionRequirement.Optional,
    });
}
/**
 * Utility to search over an array of autocomplete results and return only those that
 * match the given search string.
 *
 * You can do this yourself but this function helps simplify many common scenarios.
 * Note that if you have a hardcoded list of autocomplete options, you can simply specify
 * them directly as a list, you need not actually implement an autocomplete function.
 *
 * The primary use case here is fetching a list of all possible results from an API
 * and then refining them using the user's current search string.
 *
 * @example
 * ```
 * autocomplete: async function(context, search) {
 *   const response = await context.fetcher.fetch({method: "GET", url: "/api/entities"});
 *   const allOptions = response.body.entities.map(entity => entity.name);
 *   return coda.simpleAutocomplete(search, allOptions);
 * }
 * ```
 */
export function simpleAutocomplete(search, options) {
    const normalizedSearch = (search || '').toLowerCase();
    const filtered = options.filter(option => {
        const display = typeof option === 'string' || typeof option === 'number' ? option : option.display;
        return display.toString().toLowerCase().includes(normalizedSearch);
    });
    const metadataResults = [];
    for (const option of filtered) {
        if (typeof option === 'string') {
            metadataResults.push({
                value: option,
                display: option,
            });
        }
        else if (typeof option === 'number') {
            metadataResults.push({
                value: option,
                display: option.toString(),
            });
        }
        else {
            metadataResults.push(option);
        }
    }
    return Promise.resolve(metadataResults);
}
/**
 * A helper to search over a list of objects representing candidate search results,
 * filtering to only those that match a search string, and converting the matching
 * objects into the format needed for autocomplete results.
 *
 * A case-sensitive search is performed over each object's `displayKey` property.
 *
 * A common pattern for implementing autocomplete for a formula pattern is to
 * make a request to an API endpoint that returns a list of all entities,
 * and then to take the user's partial input and search over those entities
 * for matches. The helper generalizes this use case.
 *
 * @example
 * ```
 * coda.makeParameter({
 *   type: ParameterType.Number,
 *   name: "userId",
 *   description: "The ID of a user.",
 *   autocomplete: async function(context, search) {
 *     // Suppose this endpoint returns a list of users that have the form
 *     // `{name: "Jane Doe", userId: 123, email: "jane@doe.com"}`
 *     const usersResponse = await context.fetcher.fetch("/api/users");
 *     // This will search over the name property of each object and filter to only
 *     // those that match. Then it will transform the matching objects into the form
 *     // `{display: "Jane Doe", value: 123}` which is what is required to render
 *     // autocomplete responses.
 *     return coda.autocompleteSearchObjects(search, usersResponse.body, "name", "userId");
 *   }
 * });
 * ```
 */
export function autocompleteSearchObjects(search, objs, displayKey, valueKey) {
    if (typeof search !== 'string') {
        throw new TypeError(`Exepcting a string for "search" parameter but received ${search}`);
    }
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
/**
 * @deprecated If you have a hardcoded array of autocomplete options, simply include that array
 * as the value of the `autocomplete` property in your parameter definition. There is no longer
 * any needed to wrap a value with this formula.
 */
export function makeSimpleAutocompleteMetadataFormula(options) {
    return makeMetadataFormula((context, [search]) => simpleAutocomplete(search, options), {
        // A connection won't be used here, but if the parent formula uses a connection
        // the execution code is going to try to pass it here. We should fix that.
        connectionRequirement: ConnectionRequirement.Optional,
    });
}
function isResponseHandlerTemplate(obj) {
    return obj && obj.schema;
}
function isResponseExampleTemplate(obj) {
    return obj && obj.example;
}
/** @deprecated */
export function makeObjectFormula({ response, ...definition }) {
    let schema;
    if (response) {
        if (isResponseHandlerTemplate(response) && response.schema) {
            response.schema = normalizeSchema(response.schema);
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
        const responseHandler = generateObjectResponseHandler(response);
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
            return responseHandler({ body: result || {}, status: 200, headers: {} });
        };
    }
    return Object.assign({}, definition, {
        resultType: Type.object,
        execute,
        schema,
    });
}
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
export function makeSyncTable({ name, description, identityName, schema: inputSchema, formula, connectionRequirement, dynamicOptions = {}, }) {
    const { getSchema: getSchemaDef, entityName, defaultAddDynamicColumns } = dynamicOptions;
    const { execute: wrappedExecute, ...definition } = maybeRewriteConnectionForFormula(formula, connectionRequirement);
    // Since we mutate schemaDef, we need to make a copy so the input schema can be reused across sync tables.
    const schemaDef = deepCopy(inputSchema);
    // Hydrate the schema's identity.
    if (!identityName) {
        throw new Error(`Sync table schemas must set an identityName`);
    }
    if (schemaDef.identity) {
        if (schemaDef.identity.name && schemaDef.identity.name !== identityName) {
            throw new Error(`Identity name mismatch for sync table ${name}. Either remove the schema's identity.name (${schemaDef.identity.name}) or ensure it matches the table's identityName (${identityName}).`);
        }
        schemaDef.identity = { ...schemaDef.identity, name: identityName };
    }
    else {
        schemaDef.identity = { name: identityName };
    }
    const getSchema = wrapGetSchema(wrapMetadataFunction(getSchemaDef));
    const schema = makeObjectSchema(schemaDef);
    const formulaSchema = getSchema
        ? undefined
        : normalizeSchema({ type: ValueType.Array, items: schema });
    const { identity, id, primary } = objectSchemaHelper(schema);
    if (!(primary && id)) {
        throw new Error(`Sync table schemas should have defined properties for idProperty and displayProperty`);
    }
    if (!identity) {
        throw new Error(`Unknown error creating sync table identity`);
    }
    if (name.includes(' ')) {
        throw new Error('Sync table name should not include spaces');
    }
    const responseHandler = generateObjectResponseHandler({ schema: formulaSchema });
    const execute = async function exec(params, context) {
        const { result, continuation } = (await wrappedExecute(params, context)) || {};
        const appliedSchema = context.sync.schema;
        return {
            result: responseHandler({ body: result || [], status: 200, headers: {} }, appliedSchema),
            continuation,
        };
    };
    return {
        name,
        description,
        schema: normalizeSchema(schema),
        identityName,
        getter: {
            ...definition,
            cacheTtlSecs: 0,
            execute,
            schema: formulaSchema,
            isSyncFormula: true,
            connectionRequirement: definition.connectionRequirement || connectionRequirement,
            resultType: Type.object,
        },
        getSchema: maybeRewriteConnectionForFormula(getSchema, connectionRequirement),
        entityName,
        defaultAddDynamicColumns,
    };
}
/** @deprecated */
export function makeSyncTableLegacy(name, schema, formula, connectionRequirement, dynamicOptions = {}) {
    var _a;
    if (!((_a = schema.identity) === null || _a === void 0 ? void 0 : _a.name)) {
        throw new Error('Legacy sync tables must specify identity.name');
    }
    if (schema.__packId) {
        throw new Error('Do not use the __packId field, it is only for internal Coda use.');
    }
    return makeSyncTable({
        name,
        identityName: schema.identity.name,
        schema,
        formula,
        connectionRequirement,
        dynamicOptions,
    });
}
/**
 * Creates a dynamic sync table definition.
 *
 * @example
 * ```
 * coda.makeDynamicSyncTable({
 *   name: "MySyncTable",
 *   getName: async function(context) => {
 *     const response = await context.fetcher.fetch({method: "GET", url: context.sync.dynamicUrl});
 *     return response.body.name;
 *   },
 *   getName: async function(context) => {
 *     const response = await context.fetcher.fetch({method: "GET", url: context.sync.dynamicUrl});
 *     return response.body.browserLink;
 *   },
 *   ...
 * });
 * ```
 */
export function makeDynamicSyncTable({ name, description, getName: getNameDef, getSchema: getSchemaDef, identityName, getDisplayUrl: getDisplayUrlDef, formula, listDynamicUrls: listDynamicUrlsDef, entityName, connectionRequirement, defaultAddDynamicColumns, placeholderSchema: placeholderSchemaInput, }) {
    const placeholderSchema = placeholderSchemaInput ||
        // default placeholder only shows a column of id, which will be replaced later by the dynamic schema.
        makeObjectSchema({
            type: ValueType.Object,
            idProperty: 'id',
            displayProperty: 'id',
            identity: { name: identityName },
            properties: {
                id: { type: ValueType.String },
            },
        });
    const getName = wrapMetadataFunction(getNameDef);
    const getSchema = wrapMetadataFunction(getSchemaDef);
    const getDisplayUrl = wrapMetadataFunction(getDisplayUrlDef);
    const listDynamicUrls = wrapMetadataFunction(listDynamicUrlsDef);
    const table = makeSyncTable({
        name,
        description,
        identityName,
        schema: placeholderSchema,
        formula,
        connectionRequirement,
        dynamicOptions: { getSchema, entityName, defaultAddDynamicColumns },
    });
    return {
        ...table,
        isDynamic: true,
        getDisplayUrl: maybeRewriteConnectionForFormula(getDisplayUrl, connectionRequirement),
        listDynamicUrls: maybeRewriteConnectionForFormula(listDynamicUrls, connectionRequirement),
        getName: maybeRewriteConnectionForFormula(getName, connectionRequirement),
    };
}
/**
 * Helper to generate a formula that fetches a list of entities from a given URL and returns them.
 *
 * One of the simplest but most common use cases for a pack formula is to make a request to an API
 * endpoint that returns a list of objects, and then return those objects either as-is
 * or with slight transformations. The can be accomplished with an `execute` function that does
 * exactly that, but alternatively you could use `makeTranslateObjectFormula` and an
 * `execute` implementation will be generated for you.
 *
 * @example
 * ```
 * makeTranslateObjectFormula({
 *   name: "Users",
 *   description: "Returns a list of users."
 *   // This will generate an `execute` function that makes a GET request to the given URL.
 *   request: {
 *     method: 'GET',
 *     url: 'https://api.example.com/users',
 *   },
 *   response: {
 *     // Suppose the response body has the form `{users: [{ ...user1 }, { ...user2 }]}`.
 *     // This "projection" key tells the `execute` function that the list of results to return
 *     // can be found in the object property `users`. If omitted, the response body itself
 *     // should be the list of results.
 *     projectKey: 'users',
 *     schema: UserSchema,
 *   },
 * });
 */
export function makeTranslateObjectFormula({ response, ...definition }) {
    const { request, ...rest } = definition;
    const { parameters } = rest;
    response.schema = response.schema ? normalizeSchema(response.schema) : undefined;
    const { onError } = response;
    const requestHandler = generateRequestHandler(request, parameters);
    const responseHandler = generateObjectResponseHandler(response);
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
    return Object.assign({}, rest, {
        execute,
        resultType: Type.object,
        schema: response.schema,
    });
}
// TODO(jonathan/ekoleda): Flesh out a guide for empty formulas if this is something we care to support.
// We probably also need the builder's addFormula() method to support empty formula defs if it doesn't already.
/**
 * Creates the definition of an "empty" formula, that is, a formula that uses a {@link RequestHandlerTemplate}
 * to define an implementation for the formula rather than implementing an actual `execute` function
 * in JavaScript.
 *
 * @example
 * ```
 * coda.makeEmptyFormula({
    name: "GetWidget",
    description: "Gets a widget.",
    request: {
      url: "https://example.com/widgets/{id}",
      method: "GET",
    },
    parameters: [
      coda.makeParameter({type: coda.ParameterType.Number, name: "id", description: "The ID of the widget to get."}),
    ],
  }),
 * ```
 */
export function makeEmptyFormula(definition) {
    const { request, ...rest } = definition;
    const { parameters } = rest;
    const requestHandler = generateRequestHandler(request, parameters);
    function execute(params, context) {
        return context.fetcher.fetch(requestHandler(params)).then(() => '');
    }
    return Object.assign({}, rest, {
        execute,
        resultType: Type.string,
    });
}
export function maybeRewriteConnectionForFormula(formula, connectionRequirement) {
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
