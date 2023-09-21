"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeRewriteConnectionForFormula = exports.maybeRewriteConnectionForNamedPropertyOptions = exports.makeEmptyFormula = exports.makeTranslateObjectFormula = exports.makeDynamicSyncTable = exports.makeSyncTableLegacy = exports.makeSyncTable = exports.makeObjectFormula = exports.makeSimpleAutocompleteMetadataFormula = exports.autocompleteSearchObjects = exports.simpleAutocomplete = exports.makePropertyOptionsFormula = exports.makeMetadataFormula = exports.normalizePropertyOptionsResults = exports.makeFormula = exports.makeStringFormula = exports.makeNumericFormula = exports.UpdateOutcome = exports.isSyncPackFormula = exports.isStringPackFormula = exports.isObjectPackFormula = exports.check = exports.makeUserVisibleError = exports.makeFileArrayParameter = exports.makeFileParameter = exports.makeImageArrayParameter = exports.makeImageParameter = exports.makeHtmlArrayParameter = exports.makeHtmlParameter = exports.makeDateArrayParameter = exports.makeDateParameter = exports.makeBooleanArrayParameter = exports.makeBooleanParameter = exports.makeNumericArrayParameter = exports.makeNumericParameter = exports.makeStringArrayParameter = exports.makeStringParameter = exports.makeParameter = exports.wrapGetSchema = exports.wrapMetadataFunction = exports.isDynamicSyncTable = exports.isUserVisibleError = exports.MissingScopesError = exports.StatusCodeError = exports.UserVisibleError = void 0;
const api_types_1 = require("./api_types");
const api_types_2 = require("./api_types");
const api_types_3 = require("./api_types");
const api_types_4 = require("./api_types");
const api_types_5 = require("./api_types");
const schema_1 = require("./schema");
const schema_2 = require("./schema");
const ensure_1 = require("./helpers/ensure");
const api_types_6 = require("./api_types");
const api_types_7 = require("./api_types");
const object_utils_1 = require("./helpers/object_utils");
const ensure_2 = require("./helpers/ensure");
const api_types_8 = require("./api_types");
const handler_templates_1 = require("./handler_templates");
const handler_templates_2 = require("./handler_templates");
const api_types_9 = require("./api_types");
const api_types_10 = require("./api_types");
const object_utils_2 = require("./helpers/object_utils");
const schema_3 = require("./schema");
const schema_4 = require("./schema");
const schema_5 = require("./schema");
const api_types_11 = require("./api_types");
const migration_1 = require("./helpers/migration");
const api_types_12 = require("./api_types");
const schema_6 = require("./schema");
/**
 * An error whose message will be shown to the end user in the UI when it occurs.
 * If an error is encountered in a formula and you want to describe the error
 * to the end user, throw a UserVisibleError with a user-friendly message
 * and the Coda UI will display the message.
 *
 * @example
 * ```
 * if (!url.startsWith("https://")) {
 *   throw new coda.UserVisibleError("Please provide a valid url.");
 * }
 * ```
 *
 * @see
 * - [Handling errors - User-visible errors](https://coda.io/packs/build/latest/guides/advanced/errors/#user-visible-errors)
 */
class UserVisibleError extends Error {
    /**
     * Use to construct a user-visible error.
     */
    constructor(message, internalError) {
        super(message);
        /** @hidden */
        this.isUserVisible = true;
        this.internalError = internalError;
    }
}
exports.UserVisibleError = UserVisibleError;
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
 *
 * @example
 * ```ts
 * let response;
 * try {
 *   response = await context.fetcher.fetch({
 *     method: "GET",
 *     // Open this URL in your browser to see what the data looks like.
 *     url: "https://api.artic.edu/api/v1/artworks/123",
 *   });
 * } catch (error) {
 *   // If the request failed because the server returned a 300+ status code.
 *   if (coda.StatusCodeError.isStatusCodeError(error)) {
 *     // Cast the error as a StatusCodeError, for better intellisense.
 *     let statusError = error as coda.StatusCodeError;
 *     // If the API returned an error message in the body, show it to the user.
 *     let message = statusError.body?.detail;
 *     if (message) {
 *       throw new coda.UserVisibleError(message);
 *     }
 *   }
 *   // The request failed for some other reason. Re-throw the error so that it
 *   // bubbles up.
 *   throw error;
 * }
 * ```
 *
 * @see [Fetching remote data - Errors](https://coda.io/packs/build/latest/guides/basics/fetcher/#errors)
 */
class StatusCodeError extends Error {
    /** @hidden */
    constructor(statusCode, body, options, response) {
        super(`${statusCode} - ${JSON.stringify(body)}`);
        /**
         * The name of the error, for identification purposes.
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
    /** Returns if the error is an instance of StatusCodeError. Note that `instanceof` may not work. */
    static isStatusCodeError(err) {
        return 'name' in err && err.name === StatusCodeError.name;
    }
}
exports.StatusCodeError = StatusCodeError;
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
 *
 * @example
 * ```ts
 * try {
 *   let response = context.fetcher.fetch({
 *     // ...
 *   });
 * } catch (error) {
 *   // Determine if the error is due to missing scopes.
 *   if (error.statusCode == 400 && error.body?.message.includes("permission")) {
 *     throw new coda.MissingScopesError();
 *   }
 *   // Else handle or throw the error as normal.
 * }
 * ```
 *
 * @see
 * - [Guide: Authenticating using OAuth](https://coda.io/packs/build/latest/guides/basics/authentication/oauth2/#triggering-a-prompt)
 */
class MissingScopesError extends Error {
    /** @hidden */
    constructor(message) {
        super(message || 'Additional permissions are required');
        /**
         * The name of the error, for identification purposes.
         */
        this.name = 'MissingScopesError';
    }
    /** Returns if the error is an instance of MissingScopesError. Note that `instanceof` may not work. */
    static isMissingScopesError(err) {
        return 'name' in err && err.name === MissingScopesError.name;
    }
}
exports.MissingScopesError = MissingScopesError;
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
function transformToArraySchema(schema) {
    if ((schema === null || schema === void 0 ? void 0 : schema.type) === schema_2.ValueType.Array) {
        return schema;
    }
    else {
        return {
            type: schema_2.ValueType.Array,
            items: schema,
        };
    }
}
function wrapGetSchema(getSchema) {
    if (!getSchema) {
        return;
    }
    return {
        ...getSchema,
        execute(params, context) {
            const schema = getSchema.execute(params, context);
            if ((0, object_utils_2.isPromise)(schema)) {
                return schema.then(value => transformToArraySchema(value));
            }
            else {
                return transformToArraySchema(schema);
            }
        },
    };
}
exports.wrapGetSchema = wrapGetSchema;
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
function makeParameter(paramDefinition) {
    const { type, autocomplete: autocompleteDefOrItems, ...rest } = paramDefinition;
    const actualType = api_types_4.ParameterTypeInputMap[type];
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
exports.makeParameter = makeParameter;
/** @deprecated */
function makeStringParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_5.Type.string });
}
exports.makeStringParameter = makeStringParameter;
/** @deprecated */
function makeStringArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_12.stringArray });
}
exports.makeStringArrayParameter = makeStringArrayParameter;
/** @deprecated */
function makeNumericParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_5.Type.number });
}
exports.makeNumericParameter = makeNumericParameter;
/** @deprecated */
function makeNumericArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_11.numberArray });
}
exports.makeNumericArrayParameter = makeNumericArrayParameter;
/** @deprecated */
function makeBooleanParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_5.Type.boolean });
}
exports.makeBooleanParameter = makeBooleanParameter;
/** @deprecated */
function makeBooleanArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_6.booleanArray });
}
exports.makeBooleanArrayParameter = makeBooleanArrayParameter;
/** @deprecated */
function makeDateParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_5.Type.date });
}
exports.makeDateParameter = makeDateParameter;
/** @deprecated */
function makeDateArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_7.dateArray });
}
exports.makeDateArrayParameter = makeDateArrayParameter;
/** @deprecated */
function makeHtmlParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_5.Type.html });
}
exports.makeHtmlParameter = makeHtmlParameter;
/** @deprecated */
function makeHtmlArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_9.htmlArray });
}
exports.makeHtmlArrayParameter = makeHtmlArrayParameter;
/** @deprecated */
function makeImageParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_5.Type.image });
}
exports.makeImageParameter = makeImageParameter;
/** @deprecated */
function makeImageArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_10.imageArray });
}
exports.makeImageArrayParameter = makeImageArrayParameter;
/** @deprecated */
function makeFileParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_5.Type.file });
}
exports.makeFileParameter = makeFileParameter;
/** @deprecated */
function makeFileArrayParameter(name, description, args = {}) {
    return Object.freeze({ ...args, name, description, type: api_types_8.fileArray });
}
exports.makeFileArrayParameter = makeFileArrayParameter;
/** @deprecated */
function makeUserVisibleError(msg) {
    return new UserVisibleError(msg);
}
exports.makeUserVisibleError = makeUserVisibleError;
/** @deprecated */
function check(condition, msg) {
    if (!condition) {
        throw makeUserVisibleError(msg);
    }
}
exports.check = check;
function isObjectPackFormula(fn) {
    return fn.resultType === api_types_5.Type.object;
}
exports.isObjectPackFormula = isObjectPackFormula;
function isStringPackFormula(fn) {
    return fn.resultType === api_types_5.Type.string;
}
exports.isStringPackFormula = isStringPackFormula;
function isSyncPackFormula(fn) {
    return Boolean(fn.isSyncFormula);
}
exports.isSyncPackFormula = isSyncPackFormula;
/**
 * Possible outcomes for a single sync update.
 * @hidden
 */
var UpdateOutcome;
(function (UpdateOutcome) {
    UpdateOutcome["Success"] = "success";
    UpdateOutcome["Error"] = "error";
})(UpdateOutcome || (exports.UpdateOutcome = UpdateOutcome = {}));
/**
 * @deprecated
 *
 * Helper for returning the definition of a formula that returns a number. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a number.
 */
function makeNumericFormula(definition) {
    return Object.assign({}, definition, { resultType: api_types_5.Type.number });
}
exports.makeNumericFormula = makeNumericFormula;
/**
 * @deprecated
 *
 * Helper for returning the definition of a formula that returns a string. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a string.
 */
function makeStringFormula(definition) {
    const { response } = definition;
    return Object.assign({}, definition, {
        resultType: api_types_5.Type.string,
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
function makeFormula(fullDefinition) {
    let formula;
    switch (fullDefinition.resultType) {
        case schema_2.ValueType.String: {
            // very strange ts knows that fullDefinition.codaType is StringHintTypes but doesn't know if
            // fullDefinition is StringFormulaDefV2.
            const def = {
                ...fullDefinition,
                codaType: 'codaType' in fullDefinition ? fullDefinition.codaType : undefined,
                formulaSchema: 'schema' in fullDefinition ? fullDefinition.schema : undefined,
            };
            const { onError: _, resultType: unused, codaType, formulaSchema, ...rest } = def;
            (0, ensure_1.assertCondition)(codaType !== schema_1.ValueHintType.SelectList, 'ValueHintType.SelectList is not supported for formula result types.');
            const stringFormula = {
                ...rest,
                resultType: api_types_5.Type.string,
                schema: formulaSchema || (codaType ? { type: schema_2.ValueType.String, codaType } : undefined),
            };
            formula = stringFormula;
            break;
        }
        case schema_2.ValueType.Number: {
            const def = {
                ...fullDefinition,
                codaType: 'codaType' in fullDefinition ? fullDefinition.codaType : undefined,
                formulaSchema: 'schema' in fullDefinition ? fullDefinition.schema : undefined,
            };
            const { onError: _, resultType: unused, codaType, formulaSchema, ...rest } = def;
            const numericFormula = {
                ...rest,
                resultType: api_types_5.Type.number,
                schema: formulaSchema || (codaType ? { type: schema_2.ValueType.Number, codaType } : undefined),
            };
            formula = numericFormula;
            break;
        }
        case schema_2.ValueType.Boolean: {
            const { onError: _, resultType: unused, ...rest } = fullDefinition;
            const booleanFormula = {
                ...rest,
                resultType: api_types_5.Type.boolean,
            };
            formula = booleanFormula;
            break;
        }
        case schema_2.ValueType.Array: {
            const { onError: _, resultType: unused, items, ...rest } = fullDefinition;
            const arrayFormula = {
                ...rest,
                // TypeOf<SchemaType<ArraySchema<SchemaT>>> is always Type.object but TS can't infer this.
                resultType: api_types_5.Type.object,
                // The deepCopy() is here to drop property option functions, which have no effect on non-sync formulas.
                schema: (0, object_utils_1.deepCopy)((0, schema_5.normalizeSchema)({ type: schema_2.ValueType.Array, items })),
            };
            formula = arrayFormula;
            break;
        }
        case schema_2.ValueType.Object: {
            const { onError: _, resultType: unused, schema, ...rest } = fullDefinition;
            // need a force cast since execute has a different return value due to key normalization.
            const objectFormula = {
                ...rest,
                resultType: api_types_5.Type.object,
                // The deepCopy() is here to drop property option functions, which have no effect on non-sync formulas.
                schema: (0, object_utils_1.deepCopy)((0, schema_5.normalizeSchema)(schema)),
            };
            formula = objectFormula;
            break;
        }
        default:
            return (0, ensure_2.ensureUnreachable)(fullDefinition);
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
exports.makeFormula = makeFormula;
function normalizePropertyOptionsResultsArray(results) {
    return results.map(r => {
        if (typeof r === 'object' && Object.keys(r).length === 2 && 'display' in r && 'value' in r) {
            return { display: r.display, value: r.value };
        }
        return { display: undefined, value: r };
    });
}
function normalizePropertyOptionsResults(results) {
    if (Array.isArray(results)) {
        return {
            results: normalizePropertyOptionsResultsArray(results),
        };
    }
    const { result: resultsArray, ...otherProps } = results;
    return {
        results: normalizePropertyOptionsResultsArray(resultsArray),
        ...otherProps,
    };
}
exports.normalizePropertyOptionsResults = normalizePropertyOptionsResults;
/**
 * A wrapper that generates a formula definition from the function that implements a metadata formula.
 * It is uncommon to ever need to call this directly, normally you would just define the JavaScript
 * function implementation, and Coda will wrap it with this to generate a full metadata formula
 * definition.
 *
 * All function-like behavior in a pack is ultimately implemented using formulas, like you would
 * define using {@link makeFormula}. That is, a formula with a name, description, parameter list,
 * and an `execute` function body. This includes supporting utilities like parameter autocomplete functions.
 * This wrapper simply adds the surrounding boilerplate for a given JavaScript function so that
 * it is shaped like a Coda formula to be used at runtime.
 */
function makeMetadataFormula(execute, options) {
    return makeObjectFormula({
        name: 'getMetadata',
        description: 'Gets metadata',
        // Formula context is serialized here because we do not want to pass objects into
        // regular pack functions (which this is)
        execute([search, serializedFormulaContext], context) {
            let formulaContext = {};
            try {
                formulaContext = JSON.parse(serializedFormulaContext || '');
            }
            catch (err) {
                //  Ignore.
            }
            // TODO(oleg): once MetadataFunction types are fixed, remove non-null assertion.
            return execute(context, search, formulaContext);
        },
        parameters: [
            makeParameter({
                type: api_types_3.ParameterType.String,
                name: 'search',
                description: 'Metadata to search for.',
                optional: true,
            }),
            makeParameter({
                type: api_types_3.ParameterType.String,
                name: 'formulaContext',
                description: 'Serialized JSON for metadata.',
                optional: true,
            }),
        ],
        examples: [],
        connectionRequirement: (options === null || options === void 0 ? void 0 : options.connectionRequirement) || api_types_1.ConnectionRequirement.Optional,
    });
}
exports.makeMetadataFormula = makeMetadataFormula;
/**
 * Builds a formula to store in {@link SyncTablePropertyOptions}.
 * @hidden
 */
function makePropertyOptionsFormula({ execute, schema, name, }) {
    if (!(execute instanceof Function)) {
        throw new Error(`Value for execute must be a function`);
    }
    // This cast is necessary for two reasons:
    // 1) The type SchemaType<ArraySchema<T>> is equivalent to Array<SchemaType<T>>, but typescript doesn't know that.
    // 2) This metadata function itself has a flexible return type of either Array<ResultType> or
    //    {results: Array<ResultType>, cacheTtlSecs: number}, which is not something a pack schema can natively represent.
    const executeRetyped = execute;
    // Bend the type to satisfy PackFormulaDef's declaration.
    const innerExecute = async ([], context) => executeRetyped(context);
    const formulaDefn = {
        connectionRequirement: api_types_1.ConnectionRequirement.Optional,
        execute: innerExecute,
        name,
        description: `A property options function for ${name}`,
        parameters: [],
        resultType: schema_2.ValueType.Array,
        items: schema,
    };
    const formula = makeFormula(formulaDefn);
    return formula;
}
exports.makePropertyOptionsFormula = makePropertyOptionsFormula;
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
function simpleAutocomplete(search, options) {
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
exports.simpleAutocomplete = simpleAutocomplete;
/**
 * A helper to search over a list of objects representing candidate search results,
 * filtering to only those that match a search string, and converting the matching
 * objects into the format needed for autocomplete results.
 *
 * A case-insensitive search is performed over each object's `displayKey` property.
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
async function autocompleteSearchObjects(search, objs, displayKey, valueKey) {
    if (typeof search !== 'string') {
        throw new TypeError(`Expecting a string for "search" parameter but received ${search}`);
    }
    const normalizedSearch = search.toLowerCase();
    const metadataResults = [];
    for (const obj of objs) {
        const display = obj[displayKey];
        if (!display.toLowerCase().includes(normalizedSearch)) {
            continue;
        }
        const value = obj[valueKey];
        metadataResults.push({ display, value });
    }
    return metadataResults;
}
exports.autocompleteSearchObjects = autocompleteSearchObjects;
/**
 * @deprecated If you have a hardcoded array of autocomplete options, simply include that array
 * as the value of the `autocomplete` property in your parameter definition. There is no longer
 * any needed to wrap a value with this formula.
 */
function makeSimpleAutocompleteMetadataFormula(options) {
    return makeMetadataFormula((_context, search) => simpleAutocomplete(search, options), {
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
/** @deprecated */
function makeObjectFormula({ response, ...definition }) {
    let schema;
    if (response) {
        if (isResponseHandlerTemplate(response) && response.schema) {
            // Since the schema may be re-used, make a copy.
            const inputSchema = (0, object_utils_1.deepCopy)(response.schema);
            response.schema = (0, schema_5.normalizeSchema)(inputSchema);
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
        const responseHandler = (0, handler_templates_1.generateObjectResponseHandler)(response);
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
        resultType: api_types_5.Type.object,
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
 * See [Normalization](https://coda.io/packs/build/latest/guides/advanced/schemas/#normalization) for more information about schema normalization.
 */
function makeSyncTable({ name, description, identityName, schema: inputSchema, formula, connectionRequirement, dynamicOptions = {}, }) {
    const { getSchema: getSchemaDef, entityName, defaultAddDynamicColumns } = dynamicOptions;
    const { execute: wrappedExecute, executeUpdate: wrappedExecuteUpdate, ...definition } = maybeRewriteConnectionForFormula(formula, connectionRequirement);
    // Since we mutate schemaDef, we need to make a copy so the input schema can be reused across sync tables.
    const schemaDef = (0, object_utils_1.deepCopy)(inputSchema);
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
    const schema = (0, schema_3.makeObjectSchema)(schemaDef);
    let namedPropertyOptions = moveJsPropertyOptionsFunctionsToFormulas({
        inputSchema,
        schema,
        identityName,
    });
    if (dynamicOptions.propertyOptions) {
        namedPropertyOptions !== null && namedPropertyOptions !== void 0 ? namedPropertyOptions : (namedPropertyOptions = {});
        namedPropertyOptions[api_types_2.OptionsType.Dynamic] = makePropertyOptionsFormula({
            execute: dynamicOptions.propertyOptions,
            schema: (0, schema_3.makeObjectSchema)({
                // A dynamic autocomplete formula can return different result types depending
                // on which property is being autocompleted, so there's no accurate schema
                // type to set on the formula. We just use an empty object schema, but it could
                // be anything.
                properties: {},
            }),
            name: `${identityName}.DynamicPropertyOptions`,
        });
    }
    const normalizedSchema = (0, schema_5.normalizeSchema)(schema);
    const formulaSchema = getSchema
        ? undefined
        : { type: schema_2.ValueType.Array, items: normalizedSchema };
    const { identity, id, primary } = (0, migration_1.objectSchemaHelper)(schema);
    if (!(primary && id)) {
        throw new Error(`Sync table schemas should have defined properties for idProperty and displayProperty`);
    }
    if (!identity) {
        throw new Error(`Unknown error creating sync table identity`);
    }
    if (name.includes(' ')) {
        throw new Error('Sync table name should not include spaces');
    }
    const responseHandler = (0, handler_templates_1.generateObjectResponseHandler)({ schema: formulaSchema });
    const execute = async function exec(params, context) {
        const { result, continuation } = (await wrappedExecute(params, context)) || {};
        const appliedSchema = context.sync.schema;
        return {
            result: responseHandler({ body: result || [], status: 200, headers: {} }, appliedSchema),
            continuation,
        };
    };
    const executeUpdate = wrappedExecuteUpdate
        ? async function execUpdate(params, updates, context) {
            const { result } = (await wrappedExecuteUpdate(params, updates, context)) || {};
            const appliedSchema = context.sync.schema;
            return {
                result: responseHandler({ body: result || [], status: 200, headers: {} }, appliedSchema),
            };
        }
        : undefined;
    return {
        name,
        description,
        schema: normalizedSchema,
        identityName,
        getter: {
            ...definition,
            cacheTtlSecs: 0,
            execute,
            executeUpdate: executeUpdate,
            schema: formulaSchema,
            isSyncFormula: true,
            supportsUpdates: Boolean(executeUpdate),
            connectionRequirement: definition.connectionRequirement || connectionRequirement,
            resultType: api_types_5.Type.object,
        },
        getSchema: maybeRewriteConnectionForFormula(getSchema, connectionRequirement),
        entityName,
        defaultAddDynamicColumns,
        namedPropertyOptions: maybeRewriteConnectionForNamedPropertyOptions(namedPropertyOptions, connectionRequirement),
    };
}
exports.makeSyncTable = makeSyncTable;
/** @deprecated */
function makeSyncTableLegacy(name, schema, formula, connectionRequirement, dynamicOptions = {}) {
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
exports.makeSyncTableLegacy = makeSyncTableLegacy;
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
function makeDynamicSyncTable({ name, description, getName: getNameDef, getSchema: getSchemaDef, identityName, getDisplayUrl: getDisplayUrlDef, formula, listDynamicUrls: listDynamicUrlsDef, searchDynamicUrls: searchDynamicUrlsDef, entityName, connectionRequirement, defaultAddDynamicColumns, placeholderSchema: placeholderSchemaInput, propertyOptions, }) {
    const placeholderSchema = placeholderSchemaInput ||
        // default placeholder only shows a column of id, which will be replaced later by the dynamic schema.
        (0, schema_3.makeObjectSchema)({
            type: schema_2.ValueType.Object,
            idProperty: 'id',
            displayProperty: 'id',
            identity: { name: identityName },
            properties: {
                id: { type: schema_2.ValueType.String },
            },
        });
    const getName = wrapMetadataFunction(getNameDef);
    const getSchema = wrapMetadataFunction(getSchemaDef);
    const getDisplayUrl = wrapMetadataFunction(getDisplayUrlDef);
    const listDynamicUrls = wrapMetadataFunction(listDynamicUrlsDef);
    const searchDynamicUrls = wrapMetadataFunction(searchDynamicUrlsDef);
    const table = makeSyncTable({
        name,
        description,
        identityName,
        schema: placeholderSchema,
        formula,
        connectionRequirement,
        dynamicOptions: { getSchema, entityName, defaultAddDynamicColumns, propertyOptions },
    });
    return {
        ...table,
        isDynamic: true,
        getDisplayUrl: maybeRewriteConnectionForFormula(getDisplayUrl, connectionRequirement),
        listDynamicUrls: maybeRewriteConnectionForFormula(listDynamicUrls, connectionRequirement),
        searchDynamicUrls: maybeRewriteConnectionForFormula(searchDynamicUrls, connectionRequirement),
        getName: maybeRewriteConnectionForFormula(getName, connectionRequirement),
    };
}
exports.makeDynamicSyncTable = makeDynamicSyncTable;
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
function makeTranslateObjectFormula({ response, ...definition }) {
    const { request, ...rest } = definition;
    const { parameters } = rest;
    response.schema = response.schema ? (0, schema_5.normalizeSchema)(response.schema) : undefined;
    const { onError } = response;
    const requestHandler = (0, handler_templates_2.generateRequestHandler)(request, parameters);
    const responseHandler = (0, handler_templates_1.generateObjectResponseHandler)(response);
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
        resultType: api_types_5.Type.object,
        schema: response.schema,
    });
}
exports.makeTranslateObjectFormula = makeTranslateObjectFormula;
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
function makeEmptyFormula(definition) {
    const { request, ...rest } = definition;
    const { parameters } = rest;
    const requestHandler = (0, handler_templates_2.generateRequestHandler)(request, parameters);
    function execute(params, context) {
        return context.fetcher.fetch(requestHandler(params)).then(() => '');
    }
    return Object.assign({}, rest, {
        execute,
        resultType: api_types_5.Type.string,
    });
}
exports.makeEmptyFormula = makeEmptyFormula;
function maybeRewriteConnectionForNamedPropertyOptions(namedPropertyOptions, connectionRequirement) {
    if (!namedPropertyOptions) {
        return namedPropertyOptions;
    }
    const result = {};
    for (const name of Object.keys(namedPropertyOptions)) {
        result[name] = maybeRewriteConnectionForFormula(namedPropertyOptions[name], connectionRequirement);
    }
    return result;
}
exports.maybeRewriteConnectionForNamedPropertyOptions = maybeRewriteConnectionForNamedPropertyOptions;
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
// This helper method finds any inline options functions in a static sync table schema.
// These functions will need to be extracted into the "namedPropertyOptions" property on the sync
// table and replaced with strings.
//
// Not that we won't detect options functions within nested object schemas, but that's not necessary
// here: the only types you can options in a 2-way schema are the top-level ones.
function listPropertiesWithOptionsFunctions(schema) {
    const result = [];
    for (const propertyName of Object.keys(schema.properties)) {
        const propertySchema = (0, schema_4.maybeUnwrapArraySchema)(schema.properties[propertyName]);
        if (!propertySchema || !('options' in propertySchema)) {
            continue;
        }
        const { options } = propertySchema;
        if (!options) {
            continue;
        }
        if (typeof options !== 'function') {
            continue;
        }
        result.push(propertyName);
    }
    return result;
}
// TODO(dweitzman): Use fixedId for the autocomplete name when available to support property renames.
// Finds any inline options functions within the inputSchema and replaces them
// with strings references into the returned namedPropertyOptions.
function moveJsPropertyOptionsFunctionsToFormulas({ inputSchema, // DO NOT MUTATE inputSchema!
schema, identityName, }) {
    // Converting JS functions to strings happens on inputSchema instead of the deep copied version because the
    // deep copy will have already thrown away any JS functions.
    const namedPropertyOptions = {};
    const propertiesWithOptionsFunctions = listPropertiesWithOptionsFunctions(inputSchema);
    if (!propertiesWithOptionsFunctions.length) {
        return undefined;
    }
    for (const propertyName of propertiesWithOptionsFunctions) {
        const inputSchemaWithoutArray = (0, schema_4.maybeUnwrapArraySchema)(inputSchema.properties[propertyName]);
        const outputSchema = (0, schema_4.maybeUnwrapArraySchema)(schema.properties[propertyName]);
        (0, ensure_1.assertCondition)((0, schema_6.unwrappedSchemaSupportsOptions)(inputSchemaWithoutArray), `Property "${propertyName}" must have codaType of ValueHintType.SelectList or ValueHintType.Reference to configure property options`);
        (0, ensure_1.assertCondition)((0, schema_6.unwrappedSchemaSupportsOptions)(outputSchema), `Property "${propertyName}" lost codaType on deep copy?...`);
        outputSchema.options = propertyName;
        namedPropertyOptions[propertyName] = makePropertyOptionsFormula({
            execute: inputSchemaWithoutArray.options,
            schema: schema.properties[propertyName],
            name: `${identityName}.${propertyName}.Options`,
        });
    }
    return namedPropertyOptions;
}
