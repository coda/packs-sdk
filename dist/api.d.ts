import type { ArraySchema } from './schema';
import type { ArrayType } from './api_types';
import type { BooleanSchema } from './schema';
import type { CommonPackFormulaDef } from './api_types';
import { ConnectionRequirement } from './api_types';
import type { ExecutionContext } from './api_types';
import type { FetchRequest } from './api_types';
import type { GetPermissionExecutionContext } from './api_types';
import type { Identity } from './schema';
import type { NumberHintTypes } from './schema';
import type { NumberSchema } from './schema';
import type { ObjectSchema } from './schema';
import type { ObjectSchemaDefinition } from './schema';
import type { ObjectSchemaDefinitionType } from './schema';
import type { OptionalParamDef } from './api_types';
import type { PackFormulaResult } from './api_types';
import type { ParamArgs } from './api_types';
import type { ParamDef } from './api_types';
import type { ParamDefs } from './api_types';
import type { ParamValues } from './api_types';
import { ParameterType } from './api_types';
import type { ParameterTypeMap } from './api_types';
import type { PropertyOptionsExecutionContext } from './api_types';
import type { PropertyOptionsMetadataFunction } from './api_types';
import type { PropertyOptionsMetadataResult } from './api_types';
import type { RequestHandlerTemplate } from './handler_templates';
import type { RequiredParamDef } from './api_types';
import type { ResponseHandlerTemplate } from './handler_templates';
import type { RowAccessDefinition } from './schema';
import type { Schema } from './schema';
import type { SchemaType } from './schema';
import type { StringHintTypes } from './schema';
import type { StringSchema } from './schema';
import type { SyncCompletionMetadataResult } from './api_types';
import type { SyncExecutionContext } from './api_types';
import { TableRole } from './api_types';
import { Type } from './api_types';
import type { TypeMap } from './api_types';
import type { TypeOf } from './api_types';
import type { UpdateSyncExecutionContext } from './api_types';
import { ValueType } from './schema';
export { ExecutionContext };
export { FetchRequest } from './api_types';
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
export declare class UserVisibleError extends Error {
    /** @hidden */
    readonly isUserVisible = true;
    /** @hidden */
    readonly internalError: Error | undefined;
    /**
     * Use to construct a user-visible error.
     */
    constructor(message?: string, internalError?: Error);
}
/**
 * An error that occurs when validating parameters.
 */
export interface ParameterValidationDetail {
    /** The error message for the parameter. */
    message: string;
    /** The name of the parameter that caused the error. */
    parameterName: string;
}
/**
 * An parameter validation result where the parameters are invalid.
 */
export interface InvalidParameterValidationResult {
    /**
     * The parameters that were invalid, alongside a message describing the error for the parameter.
     */
    errors?: ParameterValidationDetail[];
    /**
     * Whether the parameters are valid.
     */
    isValid: false;
    /**
     * The message to display to the user. Each ParameterValidationDetail will also have a message.
     */
    message: string;
}
/**
 * An parameter validation result where the parameters are valid.
 */
export interface ValidParameterValidationResult {
    /**
     * Whether the parameters are valid.
     */
    isValid: true;
}
/**
 * A parameter validation result.
 */
export type ParameterValidationResult = InvalidParameterValidationResult | ValidParameterValidationResult;
/**
 * The raw HTTP response from a {@link StatusCodeError}.
 */
export interface StatusCodeErrorResponse {
    /** The raw body of the HTTP error response. */
    body?: any;
    /** The headers from the HTTP error response. Many header values are redacted by Coda. */
    headers?: {
        [key: string]: string | string[] | undefined;
    };
}
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
export declare class StatusCodeError extends Error {
    /**
     * The name of the error, for identification purposes.
     */
    name: string;
    /**
     * The HTTP status code, e.g. `404`.
     */
    statusCode: number;
    /**
     * The parsed body of the HTTP response.
     */
    body: any;
    /**
     * Alias for {@link body}.
     */
    error: any;
    /**
     * The original fetcher request used to make this HTTP request.
     */
    options: FetchRequest;
    /**
     * The raw HTTP response, including headers.
     */
    response: StatusCodeErrorResponse;
    /** @hidden */
    constructor(statusCode: number, body: any, options: FetchRequest, response: StatusCodeErrorResponse);
    /** Returns if the error is an instance of StatusCodeError. Note that `instanceof` may not work. */
    static isStatusCodeError(err: any): err is StatusCodeError;
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
export declare class MissingScopesError extends Error {
    /**
     * The name of the error, for identification purposes.
     */
    name: string;
    /** @hidden */
    constructor(message?: string);
    /** Returns if the error is an instance of MissingScopesError. Note that `instanceof` may not work. */
    static isMissingScopesError(err: any): err is MissingScopesError;
}
/**
 * This error will be thrown by the fetcher if it fails to generate a valid DWD impersonation token.
 */
export declare class GoogleDwdError extends Error {
    name: string;
    /** @hidden */
    constructor(message?: string);
    static isGoogleDwdError(err: any): err is GoogleDwdError;
}
/**
 * An error that will be thrown by {@link Fetcher.fetch} when the response body from the external system
 * exceeds packs platform limits
 *
 * This error can be caught and retried by requesting less data from the external system through
 * a smaller page size or omitting large fields.
 *
 * @hidden
 */
export declare class ResponseSizeTooLargeError extends Error {
    /**
     * The name of the error, for identification purposes.
     */
    name: string;
    /** @hidden */
    constructor(message?: string | undefined);
    /** Returns if the error is an instance of ResponseSizeTooLargeError. Note that `instanceof` may not work. */
    static isResponseSizeTooLargeError(err: any): err is ResponseSizeTooLargeError;
}
/**
 * A map of named property options methods for a particular sync table. The names need to match
 * the values stored in the object schema. For the name, we use the property's name so that
 * it'll be consistent across pack versions. In the future if we want to support packs
 * being able to rename an existing property, we could try to set the names to the old
 * property names. Alternatively, we could just say that property options will briefly stop
 * working until the sync table is refereshed so its schema matches the current pack release's
 * schema.
 */
interface SyncTablePropertyOptions {
    [name: string]: PropertyOptionsMetadataFormula<any>;
}
/**
 * The result of defining a sync table. Should not be necessary to use directly,
 * instead, define sync tables using {@link makeSyncTable}.
 */
export interface SyncTableDef<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>, ContextT extends SyncExecutionContext<any, any>, PermissionsContextT extends SyncPassthroughData> {
    /** See {@link SyncTableOptions.name} */
    name: string;
    /** See {@link SyncTableOptions.displayName} */
    displayName?: string;
    /** See {@link SyncTableOptions.description} */
    description?: string;
    /** See {@link SyncTableOptions.schema} */
    schema: SchemaT;
    /**
     * The `identityName` is persisted for all sync tables so that a dynamic schema
     * can be annotated with an identity automatically.
     *
     * See {@link SyncTableOptions.identityName} for more details.
     */
    identityName: string;
    /** See {@link SyncTableOptions.formula} */
    getter: SyncFormula<K, L, ParamDefsT, SchemaT, ContextT, PermissionsContextT>;
    /** See {@link DynamicOptions.getSchema} */
    getSchema?: MetadataFormula;
    /** See {@link DynamicOptions.entityName} */
    entityName?: string;
    /** See {@link DynamicOptions.defaultAddDynamicColumns} */
    defaultAddDynamicColumns?: boolean;
    /**
     * To configure options for properties in a sync table, use {@link DynamicSyncTableOptions.propertyOptions}.
     * @hidden
     */
    namedPropertyOptions?: SyncTablePropertyOptions;
    /**
     * See {@link SyncTableOptions.role}
     * @hidden
     */
    role?: TableRole;
}
/**
 * Type definition for a Dynamic Sync Table. Should not be necessary to use directly,
 * instead, define dynamic sync tables using {@link makeDynamicSyncTable}.
 */
export interface DynamicSyncTableDef<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>, ContextT extends SyncExecutionContext<any, any>, PermissionsContextT extends SyncPassthroughData> extends SyncTableDef<K, L, ParamDefsT, SchemaT, ContextT, PermissionsContextT> {
    /** Identifies this sync table as dynamic. */
    isDynamic: true;
    /** See {@link DynamicSyncTableOptions.getSchema} */
    getSchema: MetadataFormula<ContextT>;
    /** See {@link DynamicSyncTableOptions.getName} */
    getName: MetadataFormula<ContextT>;
    /** See {@link DynamicSyncTableOptions.getDisplayUrl} */
    getDisplayUrl: MetadataFormula<ContextT>;
    /** See {@link DynamicSyncTableOptions.listDynamicUrls} */
    listDynamicUrls?: MetadataFormula;
    /** See {@link DynamicSyncTableOptions.searchDynamicUrls} */
    searchDynamicUrls?: MetadataFormula;
    /**
     * See {@link DynamicSyncTableOptions.propertyOptions}
     */
    propertyOptions?: PropertyOptionsMetadataFormula<any>;
}
/**
 * Container for arbitrary data about which page of data to retrieve in this sync invocation.
 *
 * Sync formulas fetch one reasonable size "page" of data per invocation such that the formula
 * can be invoked quickly. The end result of a sync is the concatenation of the results from
 * each individual invocation.
 *
 * To instruct Coda to fetch a subsequent result page, return a `Continuation` that
 * describes which page of results to fetch next. The continuation will be passed verbatim
 * as an input to the subsequent invocation of the sync formula.
 *
 * The contents of this object are entirely up to the pack author.
 *
 * Examples:
 *
 * ```
 * {nextPage: 3}
 * ```
 *
 * ```
 * {nextPageUrl: 'https://someapi.com/api/items?pageToken=asdf123'}
 * ```
 */
export interface Continuation {
    [key: string]: string | number | {
        [key: string]: string | number;
    };
}
/**
 * Type definition for some additional data that is returned by a sync table
 * in addition to the data itself. This data is not stored in Coda, but
 * is passed to the executeGetPermissions function of the sync table
 * See {@link SyncFormulaResult.permissionsContext}.
 * TODO(drew): Unhide this
 * @hidden
 */
export type SyncPassthroughData = Record<string, any>;
/**
 * Type definition for the formula that implements a sync table.
 * Should not be necessary to use directly, see {@link makeSyncTable}
 * for defining a sync table.
 */
export type GenericSyncFormula = SyncFormula<any, any, ParamDefs, any, SyncExecutionContext, SyncPassthroughData>;
/**
 * Type definition for the return value of a sync table.
 * Should not be necessary to use directly, see {@link makeSyncTable}
 * for defining a sync table.
 */
export type GenericSyncFormulaResult = SyncFormulaResult<any, any, any, any>;
/**
 * Type definition for a static (non-dynamic) sync table.
 * Should not be necessary to use directly, see {@link makeSyncTable}
 * for defining a sync table.
 */
export type GenericSyncTable = SyncTableDef<any, any, ParamDefs, any, SyncExecutionContext, SyncPassthroughData>;
/**
 * Type definition for a dynamic sync table.
 * Should not be necessary to use directly, see {@link makeDynamicSyncTable}
 * for defining a sync table.
 */
export type GenericDynamicSyncTable = DynamicSyncTableDef<any, any, ParamDefs, any, SyncExecutionContext, SyncPassthroughData>;
/**
 * Union of type definitions for sync tables..
 * Should not be necessary to use directly, see {@link makeSyncTable} or {@link makeDynamicSyncTable}
 * for defining a sync table.
 */
export type SyncTable = GenericSyncTable | GenericDynamicSyncTable;
/**
 * Helper to determine if an error is considered user-visible and can be shown in the UI.
 * See {@link UserVisibleError}.
 * @param error Any error object.
 */
export declare function isUserVisibleError(error: Error): error is UserVisibleError;
export declare function isDynamicSyncTable(syncTable: SyncTable): syncTable is GenericDynamicSyncTable;
export declare function wrapMetadataFunction<ContextT extends ExecutionContext, ReturnT extends PackFormulaResult = LegacyDefaultMetadataReturnType>(fnOrFormula: MetadataFormula<ContextT, ReturnT> | MetadataFunction<ContextT, ReturnT> | undefined): MetadataFormula<ContextT, ReturnT> | undefined;
export declare function wrapGetSchema(getSchema: MetadataFormula | undefined): MetadataFormula | undefined;
/**
 * List of ParameterTypes that support autocomplete.
 */
export type AutocompleteParameterTypes = ParameterType.Number | ParameterType.String | ParameterType.StringArray | ParameterType.SparseStringArray;
/**
 * Mapping of autocomplete-enabled ParameterTypes to the underlying Type that should be returned
 * by the autocomplete parameter.
 */
export interface AutocompleteParameterTypeMapping {
    [ParameterType.Number]: Type.number;
    [ParameterType.String]: Type.string;
    [ParameterType.StringArray]: Type.string;
    [ParameterType.SparseStringArray]: Type.string;
}
/** Options you can specify when defining a parameter using {@link makeParameter}. */
export type ParameterOptions<T extends ParameterType> = Omit<ParamDef<ParameterTypeMap[T]>, 'type' | 'autocomplete'> & {
    type: T;
    autocomplete?: T extends AutocompleteParameterTypes ? MetadataFormulaDef | Array<TypeMap[AutocompleteParameterTypeMapping[T]] | SimpleAutocompleteOption<T>> : undefined;
};
/**
 * Equivalent to {@link ParamDef}. A helper type to generate a param def based
 * on the inputs to {@link makeParameter}.
 */
export type ParamDefFromOptionsUnion<T extends ParameterType, O extends ParameterOptions<T>> = Omit<O, 'type' | 'autocomplete'> & {
    type: O extends ParameterOptions<infer S> ? ParameterTypeMap[S] : never;
    autocomplete: MetadataFormula;
};
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
export declare function makeParameter<T extends ParameterType, O extends ParameterOptions<T>>(paramDefinition: O): ParamDefFromOptionsUnion<T, O>;
/** @deprecated */
export declare function makeStringParameter(name: string, description: string, args: ParamArgs<Type.string> & {
    optional: true;
}): OptionalParamDef<Type.string>;
/** @deprecated */
export declare function makeStringParameter(name: string, description: string, args?: ParamArgs<Type.string>): RequiredParamDef<Type.string>;
/** @deprecated */
export declare function makeStringArrayParameter(name: string, description: string, args: ParamArgs<ArrayType<Type.string>> & {
    optional: true;
}): OptionalParamDef<ArrayType<Type.string>>;
/** @deprecated */
export declare function makeStringArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.string>>): RequiredParamDef<ArrayType<Type.string>>;
/** @deprecated */
export declare function makeNumericParameter(name: string, description: string, args: ParamArgs<Type.number> & {
    optional: true;
}): OptionalParamDef<Type.number>;
/** @deprecated */
export declare function makeNumericParameter(name: string, description: string, args?: ParamArgs<Type.number>): RequiredParamDef<Type.number>;
/** @deprecated */
export declare function makeNumericArrayParameter(name: string, description: string, args: ParamArgs<ArrayType<Type.number>> & {
    optional: true;
}): OptionalParamDef<ArrayType<Type.number>>;
/** @deprecated */
export declare function makeNumericArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.number>>): RequiredParamDef<ArrayType<Type.number>>;
/** @deprecated */
export declare function makeBooleanParameter(name: string, description: string, args: ParamArgs<Type.boolean> & {
    optional: true;
}): OptionalParamDef<Type.boolean>;
/** @deprecated */
export declare function makeBooleanParameter(name: string, description: string, args?: ParamArgs<Type.boolean>): RequiredParamDef<Type.boolean>;
/** @deprecated */
export declare function makeBooleanArrayParameter(name: string, description: string, args: ParamArgs<ArrayType<Type.boolean>> & {
    optional: true;
}): OptionalParamDef<ArrayType<Type.boolean>>;
/** @deprecated */
export declare function makeBooleanArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.boolean>>): RequiredParamDef<ArrayType<Type.boolean>>;
/** @deprecated */
export declare function makeDateParameter(name: string, description: string, args: ParamArgs<Type.date> & {
    optional: true;
}): OptionalParamDef<Type.date>;
/** @deprecated */
export declare function makeDateParameter(name: string, description: string, args?: ParamArgs<Type.date>): RequiredParamDef<Type.date>;
/** @deprecated */
export declare function makeDateArrayParameter(name: string, description: string, args: ParamArgs<ArrayType<Type.date>> & {
    optional: true;
}): OptionalParamDef<ArrayType<Type.date>>;
/** @deprecated */
export declare function makeDateArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.date>>): RequiredParamDef<ArrayType<Type.date>>;
/** @deprecated */
export declare function makeHtmlParameter(name: string, description: string, args: ParamArgs<Type.html> & {
    optional: true;
}): OptionalParamDef<Type.html>;
/** @deprecated */
export declare function makeHtmlParameter(name: string, description: string, args?: ParamArgs<Type.html>): RequiredParamDef<Type.html>;
/** @deprecated */
export declare function makeHtmlArrayParameter(name: string, description: string, args: ParamArgs<ArrayType<Type.html>> & {
    optional: true;
}): OptionalParamDef<ArrayType<Type.html>>;
/** @deprecated */
export declare function makeHtmlArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.html>>): RequiredParamDef<ArrayType<Type.html>>;
/** @deprecated */
export declare function makeImageParameter(name: string, description: string, args: ParamArgs<Type.image> & {
    optional: true;
}): OptionalParamDef<Type.image>;
/** @deprecated */
export declare function makeImageParameter(name: string, description: string, args?: ParamArgs<Type.image>): RequiredParamDef<Type.image>;
/** @deprecated */
export declare function makeImageArrayParameter(name: string, description: string, args: ParamArgs<ArrayType<Type.image>> & {
    optional: true;
}): OptionalParamDef<ArrayType<Type.image>>;
/** @deprecated */
export declare function makeImageArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.image>>): RequiredParamDef<ArrayType<Type.image>>;
/** @deprecated */
export declare function makeFileParameter(name: string, description: string, args: ParamArgs<Type.file> & {
    optional: true;
}): OptionalParamDef<Type.file>;
/** @deprecated */
export declare function makeFileParameter(name: string, description: string, args?: ParamArgs<Type.file>): RequiredParamDef<Type.file>;
/** @deprecated */
export declare function makeFileArrayParameter(name: string, description: string, args: ParamArgs<ArrayType<Type.file>> & {
    optional: true;
}): OptionalParamDef<ArrayType<Type.file>>;
/** @deprecated */
export declare function makeFileArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.file>>): RequiredParamDef<ArrayType<Type.file>>;
/** @deprecated */
export declare function makeUserVisibleError(msg: string): UserVisibleError;
/** @deprecated */
export declare function check(condition: boolean, msg: string): void;
/**
 * Base type for the inputs for creating a pack formula.
 */
export interface PackFormulaDef<ParamsT extends ParamDefs, ResultT extends PackFormulaResult, ContextT extends ExecutionContext = ExecutionContext> extends CommonPackFormulaDef<ParamsT> {
    /** The JavaScript function that implements this formula */
    execute(params: ParamValues<ParamsT>, context: ContextT): Promise<ResultT> | ResultT;
}
export interface StringFormulaDefLegacy<ParamsT extends ParamDefs> extends CommonPackFormulaDef<ParamsT> {
    execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<string> | string;
    response?: {
        schema: StringSchema;
    };
}
export interface ObjectResultFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema> extends PackFormulaDef<ParamsT, object | object[]> {
    execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<object> | object;
    response?: ResponseHandlerTemplate<SchemaT>;
}
/**
 * Inputs to declaratively define a formula that returns a list of objects.
 * That is, a formula that doesn't require code, which like an {@link EmptyFormulaDef} uses
 * a {@link RequestHandlerTemplate} to describe the request to be made, but also includes a
 * {@link ResponseHandlerTemplate} to describe the schema of the returned objects.
 * These take the place of implementing a JavaScript `execute` function.
 *
 * This type is generally not used directly, but describes the inputs to {@link makeTranslateObjectFormula}.
 */
export interface ObjectArrayFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema> extends Omit<PackFormulaDef<ParamsT, SchemaType<SchemaT>>, 'execute'> {
    /** A definition of the request and any parameter transformations to make in order to implement this formula. */
    request: RequestHandlerTemplate;
    /** A definition of the schema for the object list returned by this function. */
    response: ResponseHandlerTemplate<SchemaT>;
}
/**
 * Inputs to define an "empty" formula, that is, a formula that uses a {@link RequestHandlerTemplate}
 * to define an implementation for the formula rather than implementing an actual `execute` function
 * in JavaScript. An empty formula returns a string. To return a list of objects, see
 * {@link ObjectArrayFormulaDef}.
 *
 * This type is generally not used directly, but describes the inputs to {@link makeEmptyFormula}.
 */
export interface EmptyFormulaDef<ParamsT extends ParamDefs> extends Omit<PackFormulaDef<ParamsT, string>, 'execute'> {
    /** A definition of the request and any parameter transformations to make in order to implement this formula. */
    request: RequestHandlerTemplate;
}
/** The base class for pack formula descriptors. Subclasses vary based on the return type of the formula. */
export type BaseFormula<ParamDefsT extends ParamDefs, ResultT extends PackFormulaResult, ContextT extends ExecutionContext = ExecutionContext> = PackFormulaDef<ParamDefsT, ResultT, ContextT> & {
    resultType: TypeOf<ResultT>;
};
/** A pack formula that returns a number. */
export type NumericPackFormula<ParamDefsT extends ParamDefs> = BaseFormula<ParamDefsT, number> & {
    schema?: NumberSchema;
};
/** A pack formula that returns a boolean. */
export type BooleanPackFormula<ParamDefsT extends ParamDefs> = BaseFormula<ParamDefsT, boolean> & {
    schema?: BooleanSchema;
};
/** A pack formula that returns a string. */
export type StringPackFormula<ParamDefsT extends ParamDefs> = BaseFormula<ParamDefsT, SchemaType<StringSchema>> & {
    schema?: StringSchema;
};
/** A pack formula that returns a JavaScript object. */
export type ObjectPackFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema> = Omit<BaseFormula<ParamDefsT, SchemaType<SchemaT>>, 'execute'> & {
    schema?: SchemaT;
    execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<object> | object;
};
/**
 * A pack formula, complete with metadata about the formula like its name, description, and parameters,
 * as well as the implementation of that formula.
 *
 * This is the type for an actual user-facing formula, rather than other formula-shaped resources within a
 * pack, like an autocomplete metadata formula or a sync getter formula.
 */
export type Formula<ParamDefsT extends ParamDefs = ParamDefs, ResultT extends ValueType = ValueType, SchemaT extends Schema = Schema> = ResultT extends ValueType.String ? StringPackFormula<ParamDefsT> : ResultT extends ValueType.Number ? NumericPackFormula<ParamDefsT> : ResultT extends ValueType.Boolean ? BooleanPackFormula<ParamDefsT> : ResultT extends ValueType.Array ? ObjectPackFormula<ParamDefsT, ArraySchema<SchemaT>> : ObjectPackFormula<ParamDefsT, SchemaT>;
/**
 * The union of types that represent formula definitions, including standard formula definitions,
 * metadata formulas, and the formulas that implement sync tables.
 *
 * It should be very uncommon to need to use this type, it is most common in meta analysis of the
 * contents of a pack for for Coda internal use.
 */
export type TypedPackFormula = Formula | GenericSyncFormula;
export type TypedObjectPackFormula = ObjectPackFormula<ParamDefs, Schema>;
/** @hidden */
export type PackFormulaMetadata = Omit<TypedPackFormula, 'execute' | 'executeUpdate' | 'executeGetPermissions' | 'validateParameters'> & {
    validateParameters?: MetadataFormulaMetadata<ExecutionContext, ParameterValidationResult>;
};
/** @hidden */
export type ObjectPackFormulaMetadata = Omit<TypedObjectPackFormula, 'execute' | 'validateParameters'> & {
    validateParameters?: MetadataFormulaMetadata<ExecutionContext, ParameterValidationResult>;
};
export declare function isObjectPackFormula(fn: PackFormulaMetadata): fn is ObjectPackFormulaMetadata;
export declare function isStringPackFormula(fn: BaseFormula<ParamDefs, any>): fn is StringPackFormula<ParamDefs>;
export declare function isSyncPackFormula(fn: BaseFormula<ParamDefs, any>): fn is GenericSyncFormula;
/**
 * The return value from the formula that implements a sync table. Each sync formula invocation
 * returns one reasonable size page of results. The formula may also return a continuation, indicating
 * that the sync formula should be invoked again to get a next page of results. Sync functions
 * are called repeatedly until there is no continuation returned.
 */
export interface SyncFormulaResult<K extends string, L extends string, SchemaT extends ObjectSchemaDefinition<K, L>, ContextT extends SyncExecutionContext<any> = SyncExecutionContext, PermissionsContextT extends SyncPassthroughData = SyncPassthroughData> {
    /** The list of rows from this page. */
    result: Array<ObjectSchemaDefinitionType<K, L, SchemaT>>;
    /**
     * Additional side data to pass through to `executeGetPermissions`. Because each result item
     * is also passed through, this is only needed for cases where you have data that doesn't need
     * to be part of the result item but is nonetheless useful for fetching permissions, for example,
     * the API requests to get item data may include permissions inline, so there is no need to
     * re-fetch permission data if you can just pass it through.
     *
     * This array must be the same length as the `result` array.
     * TODO(drew): Unhide this
     * @hidden
     */
    permissionsContext?: PermissionsContextT[];
    /**
     * A marker indicating where the next sync formula invocation should pick up to get the next page of results.
     * The contents of this object are entirely of your choosing. Sync formulas are called repeatedly
     * until there is no continuation returned.
     */
    continuation?: ContextT['sync']['continuation'];
    /**
     * Once there is no additional continuation returned from a pack sync formula, this may be returned instead, to give
     * metadata about the entirety of the sync execution.
     *
     * This is ignored if there is also a {@link continuation} on this object.
     *
     * TODO(patrick): Unhide this
     * @hidden
     */
    completion?: SyncCompletionMetadataResult<NonNullable<ContextT['sync']['previousCompletion']>['incrementalContinuation']>;
    /**
     * Return the list of deleted item ids for incremental sync deletion.
     *
     * TODO(ebo): Unhide this
     * @hidden
     */
    deletedRowIds?: string[];
    /**
     * @deprecated Use {@link deletedRowIds} instead.
     * @hidden
     */
    deletedItemIds?: string[];
}
/** @hidden */
export interface TypedSyncFormulaResult<T extends object, ContextT extends SyncExecutionContext<any>, PermissionsContextT extends SyncPassthroughData> extends SyncFormulaResult<string, string, any, ContextT, PermissionsContextT> {
    result: T[];
}
/**
 * Type definition for the parameter used to pass in a batch of updates to a sync table update function.
 */
export interface SyncUpdate<K extends string, L extends string, SchemaT extends ObjectSchemaDefinition<K, L>> {
    /**
     * The previous value of the row.
     */
    previousValue: ObjectSchemaDefinitionType<K, L, SchemaT>;
    /**
     * The new value of the row, with the user edits applied.
     */
    newValue: ObjectSchemaDefinitionType<K, L, SchemaT>;
    /**
     * The fields of the row that have been updated.
     */
    updatedFields: string[];
}
/**
 * Generic type definition for the parameter used to pass in updates to a sync table update function.
 */
export type GenericSyncUpdate = SyncUpdate<any, any, any>;
/**
 * Type definition for a single update result returned by a sync table update function.
 */
export type SyncUpdateSingleResult<K extends string, L extends string, SchemaT extends ObjectSchemaDefinition<K, L>> = ObjectSchemaDefinitionType<K, L, SchemaT> | Error;
/**
 * Generic type definition for a single update result returned by a sync table update function.
 */
export type GenericSyncUpdateSingleResult = SyncUpdateSingleResult<any, any, any>;
/**
 * Type definition for the batched result returned by a sync table update function.
 */
export interface SyncUpdateResult<K extends string, L extends string, SchemaT extends ObjectSchemaDefinition<K, L>> {
    /**
     * The individual update results. Every incoming update should have a corresponding result, in the same order.
     */
    result: Array<SyncUpdateSingleResult<K, L, SchemaT>>;
}
/**
 * Generic type definition for the result returned by a sync table update function.
 * @hidden
 */
export type GenericSyncUpdateResult = SyncUpdateResult<any, any, any>;
/**
 * Type definition for a single marshaled update result returned by a sync table update function.
 * @hidden
 */
export type SyncUpdateSingleResultMarshaled<K extends string, L extends string, SchemaT extends ObjectSchemaDefinition<K, L>> = SyncUpdateSingleResultMarshaledSuccess<K, L, SchemaT> | SyncUpdateSingleResultMarshaledError;
/**
 * Possible outcomes for a single sync update.
 * @hidden
 */
export declare enum UpdateOutcome {
    Success = "success",
    Error = "error"
}
/**
 * Type definition for a single marshaled update success result returned by a sync table update function.
 * @hidden
 */
export interface SyncUpdateSingleResultMarshaledSuccess<K extends string, L extends string, SchemaT extends ObjectSchemaDefinition<K, L>> {
    outcome: UpdateOutcome.Success;
    finalValue: ObjectSchemaDefinitionType<K, L, SchemaT>;
}
/**
 * Type definition for a single marshaled update failure result returned by a sync table update function.
 * @hidden
 */
export interface SyncUpdateSingleResultMarshaledError {
    outcome: UpdateOutcome.Error;
    error: Error;
}
/**
 * Generic type definition for a single marshaled update result returned by a sync table update function.
 * @hidden
 */
export type GenericSyncUpdateSingleResultMarshaled = SyncUpdateSingleResultMarshaled<any, any, any>;
/**
 * Type definition for the marshaled result returned by a sync table update function.
 * @hidden
 */
export interface SyncUpdateResultMarshaled<K extends string, L extends string, SchemaT extends ObjectSchemaDefinition<K, L>> {
    result: Array<SyncUpdateSingleResultMarshaled<K, L, SchemaT>>;
}
/**
 * Generic type definition for the marshaled result returned by a sync table update function.
 * @hidden
 */
export type GenericSyncUpdateResultMarshaled = SyncUpdateResultMarshaled<any, any, any>;
/**
 * Type definition for the result of calls to {@link executeGetPermissions}.
 *
 * TODO(sam): Unhide this
 * @hidden
 */
export interface GetPermissionsResult {
    /**
     * The access definition for each row that was passed to {@link executeGetPermissions}.
     *
     */
    rowAccessDefinitions: RowAccessDefinition[];
    /**
     * A marker indicating where the next get permissions invocation should pick up to get the next page of results.
     * The contents of this object are entirely of your choosing. Get permissions formulas are called repeatedly
     * until there is no continuation returned.
     */
    continuation?: Continuation;
}
/**
 * Type definition for a single row passed to the {@link executeGetPermissions} function of a sync table.
 *
 * TODO(sam): Unhide this
 * @hidden
 */
export interface ExecuteGetPermissionsRequestRow<K extends string, L extends string, SchemaT extends ObjectSchemaDefinition<K, L>> {
    /**
     * A row for which to fetch permissions. This rows has been retrieved from the {@link execute} function
     */
    row: ObjectSchemaDefinitionType<K, L, SchemaT>;
}
/**
 * Type definition for the data passed to the {@link executeGetPermissions} function of a sync table.
 *
 * TODO(sam): Unhide this
 * @hidden
 */
export interface ExecuteGetPermissionsRequest<K extends string, L extends string, SchemaT extends ObjectSchemaDefinition<K, L>, PermissionsContextT extends SyncPassthroughData> {
    /**
     * The list of rows for which to fetch permissions.
     */
    rows: Array<ExecuteGetPermissionsRequestRow<K, L, SchemaT>>;
    permissionsContext?: PermissionsContextT[];
}
/**
 * Generic type definition for the data passed to the {@link executeGetPermissions} function of a sync table.
 *
 * @hidden
 */
export type GenericExecuteGetPermissionsRequest = ExecuteGetPermissionsRequest<any, any, any, any>;
/**
 * Inputs for creating the formula that implements a sync table.
 */
export interface SyncFormulaDef<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchemaDefinition<K, L>, ContextT extends SyncExecutionContext<any, any>, PermissionsContextT extends SyncPassthroughData> extends CommonPackFormulaDef<ParamDefsT>, OnErrorFormulaOptions {
    /**
     * The JavaScript function that implements this sync.
     *
     * This function takes in parameters and a sync context which may have a continuation
     * from a previous invocation, and fetches and returns one page of results, as well
     * as another continuation if there are more result to fetch.
     */
    execute<ContextReturnT extends ContextT>(params: ParamValues<ParamDefsT>, context: ContextT): Promise<SyncFormulaResult<K, L, SchemaT, ContextReturnT, PermissionsContextT>>;
    /**
     * If the table supports object updates, the maximum number of objects that will be sent to the pack
     * in a single batch. Defaults to 1 if not specified.
     */
    maxUpdateBatchSize?: number;
    /**
     * The JavaScript function that implements this sync update if the table supports updates.
     *
     * This function takes in parameters, updated sync table objects, and a sync context,
     * and is responsible for pushing those updated objects to the external system then returning
     * the new state of each object.
     */
    executeUpdate?(params: ParamValues<ParamDefsT>, updates: Array<SyncUpdate<K, L, SchemaT>>, context: UpdateSyncExecutionContext): Promise<SyncUpdateResult<K, L, SchemaT>>;
    /**
     * Options that only apply {@link executeUpdate} but not {@link execute}.
     *
     * This is useful for specifying OAuth scopes that are only necessary for 2-way writes
     * but not for reads.
     * @hidden
     */
    updateOptions?: Pick<CommonPackFormulaDef<ParamDefsT>, 'extraOAuthScopes'>;
    /**
     * The JavaScript function that implements fetching permissions for a set of objects
     * if the objects in this sync table have permissions in the external system.
     *
     * TODO(sam): Unhide this
     * @hidden
     */
    executeGetPermissions?(params: ParamValues<ParamDefsT>, request: ExecuteGetPermissionsRequest<K, L, SchemaT, PermissionsContextT>, context: GetPermissionExecutionContext): Promise<GetPermissionsResult>;
    /**
     * If the table implements {@link executeGetPermissions} the maximum number of rows that will be sent to that
     * function in a single batch. Defaults to 10 if not specified.
     *
     * TODO(sam): Unhide this
     * @hidden
     */
    maxPermissionBatchSize?: number;
    /**
     * The JavaScript function that implements parameter validation.
     * For sync tables, the execution context will include a `sync` field.
     */
    validateParameters?: MetadataFormula<SyncExecutionContext, ParameterValidationResult>;
}
/**
 * The result of defining the formula that implements a sync table.
 *
 * There is no need to use this type directly. You provide a {@link SyncFormulaDef} as an
 * input to {@link makeSyncTable} which outputs definitions of this type.
 */
export type SyncFormula<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>, ContextT extends SyncExecutionContext<any, any>, PermissionsContextT extends SyncPassthroughData> = SyncFormulaDef<K, L, ParamDefsT, SchemaT, ContextT, PermissionsContextT> & {
    resultType: TypeOf<SchemaType<SchemaT>>;
    isSyncFormula: true;
    schema?: ArraySchema;
    supportsUpdates?: boolean;
    /**
     * TODO(sam): Unhide this
     * @hidden
     */
    supportsGetPermissions?: boolean;
};
/**
 * @deprecated
 *
 * Helper for returning the definition of a formula that returns a number. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a number.
 */
export declare function makeNumericFormula<ParamDefsT extends ParamDefs>(definition: FormulaOptions<ParamDefsT, PackFormulaDef<ParamDefsT, number>>): NumericPackFormula<ParamDefsT>;
/**
 * @deprecated
 *
 * Helper for returning the definition of a formula that returns a string. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a string.
 */
export declare function makeStringFormula<ParamDefsT extends ParamDefs>(definition: FormulaOptions<ParamDefsT, StringFormulaDefLegacy<ParamDefsT>>): StringPackFormula<ParamDefsT>;
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
export declare function makeFormula<ParamDefsT extends ParamDefs, ResultT extends ValueType, SchemaT extends Schema = Schema>(fullDefinition: FormulaDefinitionOptions<ParamDefsT, ResultT, SchemaT>): Formula<ParamDefsT, ResultT, SchemaT>;
export interface OnErrorFormulaOptions {
    /**
     * If specified, will catch errors in the {@link execute} function and call this
     * function with the error, instead of letting them throw and the formula failing.
     *
     * This is helpful for writing common error handling into a singular helper function
     * that can then be applied to many different formulas in a pack.
     */
    onError?(error: Error): any;
}
/**
 * Base type for formula definitions accepted by {@link makeFormula}.
 */
export interface BaseFormulaDef<ParamDefsT extends ParamDefs, ResultT extends string | number | boolean | object> extends PackFormulaDef<ParamDefsT, ResultT>, OnErrorFormulaOptions {
}
/**
 * A definition accepted by {@link makeFormula} for a formula that returns a string.
 */
export type StringFormulaDef<ParamDefsT extends ParamDefs> = BaseFormulaDef<ParamDefsT, string> & {
    resultType: ValueType.String;
    execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<string> | string;
};
/**
 * A definition accepted by {@link makeFormula} for a formula that returns a number.
 */
export type NumericFormulaDef<ParamDefsT extends ParamDefs> = BaseFormulaDef<ParamDefsT, number> & {
    resultType: ValueType.Number;
    execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<number> | number;
};
/**
 * A definition accepted by {@link makeFormula} for a formula that returns a boolean.
 */
export type BooleanFormulaDef<ParamDefsT extends ParamDefs> = BaseFormulaDef<ParamDefsT, boolean> & {
    resultType: ValueType.Boolean;
    execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<boolean> | boolean;
};
/**
 * A definition accepted by {@link makeFormula} for a formula that returns an array.
 */
export type ArrayFormulaDef<ParamDefsT extends ParamDefs, SchemaT extends Schema> = BaseFormulaDef<ParamDefsT, SchemaType<ArraySchema<SchemaT>>> & {
    resultType: ValueType.Array;
    items: SchemaT;
};
/**
 * A definition accepted by {@link makeFormula} for a formula that returns an object.
 */
export type ObjectFormulaDef<ParamDefsT extends ParamDefs, SchemaT extends Schema> = BaseFormulaDef<ParamDefsT, SchemaType<SchemaT>> & {
    resultType: ValueType.Object;
    schema: SchemaT;
};
/**
 * A wrapper type that allows you to specify a formula definition where the `validateParameters`
 * function may be a function definition or a metadata formula definition.
 */
export type FormulaOptions<ParamDefsT extends ParamDefs, DefT extends CommonPackFormulaDef<ParamDefsT>> = Omit<DefT, 'validateParameters'> & {
    validateParameters?: MetadataFormulaDef<ExecutionContext, ParameterValidationResult>;
};
/**
 * A formula definition accepted by {@link makeFormula}.
 */
export type FormulaDefinitionOptions<ParamDefsT extends ParamDefs, ResultT extends ValueType, SchemaT extends Schema> = ResultT extends ValueType.String ? FormulaOptions<ParamDefsT, StringFormulaDef<ParamDefsT>> & ({
    schema?: StringSchema;
} | {
    codaType?: StringHintTypes;
}) : ResultT extends ValueType.Number ? FormulaOptions<ParamDefsT, NumericFormulaDef<ParamDefsT>> & ({
    schema?: NumberSchema;
} | {
    codaType?: NumberHintTypes;
}) : ResultT extends ValueType.Boolean ? FormulaOptions<ParamDefsT, BooleanFormulaDef<ParamDefsT>> : ResultT extends ValueType.Array ? FormulaOptions<ParamDefsT, ArrayFormulaDef<ParamDefsT, SchemaT>> : FormulaOptions<ParamDefsT, ObjectFormulaDef<ParamDefsT, SchemaT>>;
/**
 * The return type for a metadata formula that should return a different display to the user
 * than is used internally.
 */
export interface MetadataFormulaObjectResultType {
    /** The value displayed to the user in the UI. */
    display: string;
    /** The value used for the formula argument when the user selects this option. */
    value: string | number;
    /**
     * If true, indicates that this result has child results nested underneath it.
     * This option only applies to {@link DynamicSyncTableOptions.listDynamicUrls}.
     * When fetching options for entities that can be used as dynamic URLs for a dynamic sync table,
     * some APIs may return data in a hierarchy rather than a flat list of options.
     *
     * For example, if your dynamic sync table synced data from a Google Drive file,
     * you might return a list of folders, and then a user could click on a folder
     * to view the files within it. When returning folder results, you would set
     * `hasChildren: true` on them, but omit that on the file results.
     *
     * Leaf nodes, that is those without `hasChildren: true`, are ultimately selectable
     * to create a table. Selecting a result with `hasChildren: true` will invoke
     * `listDynamicUrls` again with `value` as the second argument.
     *
     * That is, your dynamic sync table definition might include:
     *
     * ```
     * listDynamicUrls: async function(context, parentValue) {
     *   ...
     * }
     * ```
     *
     * `parentValue` will be undefined the initial time that `listDynamicUrls`
     * is invoked, but if you return a result with `hasChildren: true` and the user
     * clicks on it, `listDynamicUrls` will be invoked again, with `parentValue`
     * as the `value` of the result that was clicked on.
     */
    hasChildren?: boolean;
}
/**
 * A context object that is provided to a metadata formula at execution time.
 * For example, an autocomplete metadata formula for a parameter value may need
 * to know the value of parameters that have already been selected. Those parameter
 * values are provided in this context object.
 */
export type MetadataContext = Record<string, any> & {
    __brand: 'MetadataContext';
};
/**
 * The type of values that can be returned from a {@link MetadataFormula}.
 */
export type MetadataFormulaResultType = string | number | MetadataFormulaObjectResultType;
/**
 * A formula that returns metadata relating to a core pack building block, like a sync table,
 * a formula parameter, or a user account. Examples include {@link DynamicOptions.getSchema},
 * {@link BaseAuthentication.getConnectionName}, and {@link ParamDef.autocomplete}.
 *
 * Many pack building blocks make use of supporting features that often require JavaScript
 * or an API request to implement. For example, fetching the list of available autocomplete
 * options for a formula parameter often requires making an API call. The logic to implement this
 * and the context required, like a {@link Fetcher} is very similar to that of a pack formula itself,
 * so metadata formulas intentionally resemble regular formulas.
 *
 * A variety of tasks like those mentioned above can all be accomplished with formulas that
 * share the same structure, so all of these supporting features are defined as `MetadataFormulas`.
 * You typically do not need to define a `MetadataFormula` explicitly, but rather can simply define
 * the JavaScript function that implements the formula. Coda will wrap this function with the necessary
 * formula boilerplate to make it look like a complete Coda formula.
 *
 * All metadata functions are passed an {@link ExecutionContext} as the first parameter,
 * and the optional second parameter is a string whose purpose and value varies depending on
 * the use case. For example, a metadata formula that implements parameter autocomplete will
 * be passed the user's current search if the user has started typing to search for a result.
 * Not all metadata formulas make use of this second parameter.
 *
 * Autocomplete metadata functions are also passed a third parameter, which is a dictionary
 * that has the values the user has specified for each of the other parameters in the formula
 * (if any), so that the autocomplete options for one parameter can depend on the current
 * values of the others. This is dictionary mapping the names of each parameter to its
 * current value.
 */
export type MetadataFormula<ContextT extends ExecutionContext = ExecutionContext, ResultT extends PackFormulaResult = LegacyDefaultMetadataReturnType> = BaseFormula<[ParamDef<Type.string>, ParamDef<Type.string>], ResultT, ContextT> & {
    schema?: any;
};
type GenericMetadataFormula = BaseFormula<ParamDefs, any> & {
    schema?: any;
};
/**
 * These will be created with a helper function.
 */
interface PropertyOptionsFormattedResult {
    __brand: 'PropertyOptionsSimpleResult';
    /** Text that will be displayed to the user in UI for this option. */
    display: string;
    /** The actual value for this option */
    value: any;
}
/**
 * @hidden
 */
export type PropertyOptionsResults = PropertyOptionsMetadataResult<any | PropertyOptionsFormattedResult>;
interface PropertyOptionsNormalizedResults {
    cacheTtlSecs?: number;
    results: Array<{
        display: string | undefined;
        value: any;
    }>;
    unusedProperties?: string[];
}
export declare function normalizePropertyOptionsResults(results: PropertyOptionsResults): PropertyOptionsNormalizedResults;
/**
 * @hidden
 */
export interface PropertyOptionsAnnotatedResult {
    packResult: PropertyOptionsNormalizedResults;
    propertiesUsed: string[];
    searchUsed?: boolean;
}
/**
 * Formula implementing property options.
 * These are constructed by {@link makePropertyOptionsFormula}.
 * @hidden
 */
export type PropertyOptionsMetadataFormula<SchemaT extends Schema> = ObjectPackFormula<[], ArraySchema<SchemaT>> & {
    execute(params: ParamValues<[]>, context: PropertyOptionsExecutionContext): Promise<object> | object;
};
export type MetadataFormulaMetadata<ContextT extends ExecutionContext = ExecutionContext, ResultT extends PackFormulaResult = LegacyDefaultMetadataReturnType> = Omit<MetadataFormula<ContextT, ResultT>, 'execute' | 'validateParameters'>;
/**
 * @hidden
 */
export declare type GenericMetadataFormulaMetadata = Omit<GenericMetadataFormula, 'execute' | 'validateParameters'>;
/**
 * Historically, metadata formulas could return a variety of types.
 * This type is used to represent the legacy return types.
 * Metadata formulas now work with generics and in the future, will
 * be updated to declare a more precise return type for each formula.
 */
export type LegacyDefaultMetadataReturnType = MetadataFormulaResultType | MetadataFormulaResultType[] | ArraySchema | ObjectSchema<any, any>;
/**
 * A JavaScript function that can implement a {@link MetadataFormulaDef}.
 */
export type MetadataFunction<ContextT extends ExecutionContext = ExecutionContext, ReturnT = LegacyDefaultMetadataReturnType> = (context: ContextT, search: string, formulaContext?: MetadataContext) => Promise<ReturnT>;
/**
 * The type of values that will be accepted as a metadata formula definition. This can either
 * be the JavaScript function that implements a metadata formula (strongly recommended)
 * or a full metadata formula definition (mostly supported for legacy code).
 */
export type MetadataFormulaDef<ContextT extends ExecutionContext = ExecutionContext, ReturnT extends PackFormulaResult = LegacyDefaultMetadataReturnType> = MetadataFormula<ContextT, ReturnT> | MetadataFunction<ContextT, ReturnT>;
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
export declare function makeMetadataFormula<ContextT extends ExecutionContext, ReturnT extends PackFormulaResult = LegacyDefaultMetadataReturnType>(execute: MetadataFunction<ContextT, ReturnT>, options?: {
    connectionRequirement?: ConnectionRequirement;
}): MetadataFormula<ContextT, ReturnT>;
/**
 * Builds a formula to store in {@link SyncTablePropertyOptions}.
 * @hidden
 */
export declare function makePropertyOptionsFormula<SchemaT extends Schema>({ execute, schema, name, }: {
    execute: PropertyOptionsMetadataFunction<Array<SchemaType<SchemaT>>>;
    schema: SchemaT;
    name: string;
}): PropertyOptionsMetadataFormula<SchemaT>;
/**
 * A result from a parameter autocomplete function that pairs a UI display value with
 * the underlying option that will be used in the formula when selected.
 */
export interface SimpleAutocompleteOption<T extends AutocompleteParameterTypes> {
    /** Text that will be displayed to the user in UI for this option. */
    display: string;
    /** The actual value that will get used in the formula if this option is selected. */
    value: TypeMap[AutocompleteParameterTypeMapping[T]];
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
export declare function simpleAutocomplete<T extends AutocompleteParameterTypes>(search: string | undefined, options: Array<TypeMap[AutocompleteParameterTypeMapping[T]] | SimpleAutocompleteOption<T>>): Promise<MetadataFormulaObjectResultType[]>;
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
export declare function autocompleteSearchObjects<T>(search: string, objs: T[], displayKey: {
    [K in keyof T]: T[K] extends string ? K : never;
}[keyof T], valueKey: {
    [K in keyof T]: T[K] extends string | number ? K : never;
}[keyof T]): Promise<MetadataFormulaObjectResultType[]>;
/**
 * @deprecated If you have a hardcoded array of autocomplete options, simply include that array
 * as the value of the `autocomplete` property in your parameter definition. There is no longer
 * any needed to wrap a value with this formula.
 */
export declare function makeSimpleAutocompleteMetadataFormula<T extends AutocompleteParameterTypes>(options: Array<TypeMap[AutocompleteParameterTypeMapping[T]] | SimpleAutocompleteOption<T>>): MetadataFormula;
/** @deprecated */
export declare function makeObjectFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema>({ response, ...definition }: FormulaOptions<ParamDefsT, ObjectResultFormulaDef<ParamDefsT, SchemaT>>): ObjectPackFormula<ParamDefsT, SchemaT>;
/**
 * A set of options used internally by {@link makeDynamicSyncTable}, or for static
 * sync tables that have a dynamic schema.
 */
export interface DynamicOptions {
    /**
     * A formula that returns the schema for this table.
     *
     * For a dynamic sync table, the value of {@link DynamicSyncTableOptions.getSchema}
     * is passed through here. For a non-dynamic sync table, you may still implement
     * this if you table has a schema that varies based on the user account, but
     * does not require a {@link SyncBase.dynamicUrl}.
     */
    getSchema?: MetadataFormulaDef;
    /** See {@link DynamicSyncTableOptions.entityName} */
    entityName?: string;
    /** See {@link DynamicSyncTableOptions.defaultAddDynamicColumns} */
    defaultAddDynamicColumns?: boolean;
    /**
     * See {@link DynamicSyncTableOptions.propertyOptions}
     */
    propertyOptions?: PropertyOptionsMetadataFunction<any>;
}
/**
 * Input options for defining a sync table. See {@link makeSyncTable}.
 */
export interface SyncTableOptions<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchemaDefinition<K, L>, ContextT extends SyncExecutionContext<any, any>, PermissionsContextT extends SyncPassthroughData> {
    /**
     * The name of the sync table. This is shown to users in the Coda UI if displayName is not present.
     * This should describe the entities being synced. For example, a sync table that syncs products
     * from an e-commerce platform should be called 'Products'. This name must not contain spaces.
     *
     * Important: This value acts as a unique ID for the table, and updating it later is a breaking change.
     * If you want to change the value shown to the users, set `displayName` instead.
     */
    name: string;
    /**
     * This is the name shown to users in the Coda UI. If not present, {@link SyncTableOptions.name} will be used.
     * Changing this value will not affect existing tables and only affects newly created tables.
     */
    displayName?: string;
    /**
     * The description of the sync table. This is shown to users in the Coda UI.
     * This should describe what the sync table does in more detailed language. For example, the
     * description for a 'Products' sync table could be: 'Returns products from the e-commerce platform.'
     */
    description?: string;
    /**
     * The "unique identifier" for the entity being synced. This will serve as the unique id for this
     * table, and must be unique across other sync tables for your pack. This is often the singular
     * form of the table name, e.g. if your table name was 'Products' you might choose 'Product'
     * as the identity name.
     *
     * When returning objects from other syncs or formulas, you may create Coda references to objects
     * in this table by defining an {@link Identity} in that schema that refers to this identity name.
     *
     * For example, if your identity name was 'Product', another formula or sync could return
     * shell objects that reference rows in this table, so long as they contain the id
     * of the object, and the schema is declared as `{identity: {name: 'Products'}}`.
     */
    identityName: string;
    /**
     * The definition of the schema that describes a single response object. For example, the
     * schema for a single product. The sync formula will return an array of objects that fit this schema.
     */
    schema: SchemaT;
    /**
     * The definition of the formula that implements this sync. This is a Coda packs formula
     * that returns an array of objects fitting the given schema and optionally a {@link Continuation}.
     * (The {@link SyncFormulaDef.name} is redundant and should be the same as the `name` parameter here.
     * These will eventually be consolidated.)
     */
    formula: FormulaOptions<ParamDefsT, SyncFormulaDef<K, L, ParamDefsT, SchemaT, ContextT, PermissionsContextT>>;
    /**
     * A {@link ConnectionRequirement} that will be used for all formulas contained within
     * this sync table (including autocomplete formulas).
     */
    connectionRequirement?: ConnectionRequirement;
    /**
     * A set of options used internally by {@link makeDynamicSyncTable}, or for static
     * sync tables that have a dynamic schema.
     */
    dynamicOptions?: DynamicOptions;
    /**
     * Used to indicate that the entities in this table have a specific semantic meaning,
     * for example, that the rows being synced each represent a user.
     *
     * @hidden
     */
    role?: TableRole;
}
/**
 * Options provided when defining a dynamic sync table.
 */
export interface DynamicSyncTableOptions<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchemaDefinition<K, L>, ContextT extends SyncExecutionContext<any, any>, PermissionsContextT extends SyncPassthroughData> {
    /**
     * The name of the dynamic sync table. This is shown to users in the Coda UI
     * when listing what build blocks are contained within this pack.
     * This should describe the category of entities being synced. The actual
     * table name once added to the doc will be dynamic, it will be whatever value
     * is returned by the `getName` formula.
     */
    name: string;
    /**
     * The description of the dynamic sync table. This is shown to users in the Coda UI
     * when listing what build blocks are contained within this pack.
     * This should describe what the dynamic sync table does in a more detailed language.
     */
    description?: string;
    /**
     * A formula that returns the name of this table.
     */
    getName: MetadataFormulaDef<ContextT>;
    /**
     * See {@link SyncTableOptions.identityName} for an introduction.
     *
     * Every dynamic schema generated from this dynamic sync table definition should all use the same name
     * for their identity. Code that refers to objects in these tables will use the dynamicUrl to
     * differentiate which exact table to use.
     */
    identityName: string;
    /**
     * A formula that returns the schema for this table.
     */
    getSchema: MetadataFormulaDef<ContextT>;
    /**
     * A formula that that returns a browser-friendly url representing the
     * resource being synced. The Coda UI links to this url as the source
     * of the table data. This is typically a browser-friendly form of the
     * `dynamicUrl`, which is typically an API url.
     */
    getDisplayUrl: MetadataFormulaDef<ContextT>;
    /**
     * A formula that returns a list of available dynamic urls that can be
     * used to create an instance of this dynamic sync table.
     */
    listDynamicUrls?: MetadataFormulaDef;
    /**
     * A formula that returns a list of available dynamic urls that match a given
     * search query that can be used to create an instance of this dynamic sync table.
     */
    searchDynamicUrls?: MetadataFormulaDef;
    /**
     * The definition of the formula that implements this sync. This is a Coda packs formula
     * that returns an array of objects fitting the given schema and optionally a {@link Continuation}.
     * (The {@link SyncFormulaDef.name} is redundant and should be the same as the `name` parameter here.
     * These will eventually be consolidated.)
     */
    formula: FormulaOptions<ParamDefsT, SyncFormulaDef<K, L, ParamDefsT, SchemaT, ContextT, PermissionsContextT>>;
    /**
     * A label for the kind of entities that you are syncing. This label is used in a doc to identify
     * the column in this table that contains the synced data. If you don't provide an `entityName`, the value
     * of `identity.name` from your schema will be used instead, so in most cases you don't need to provide this.
     */
    entityName?: string;
    /**
     * A {@link ConnectionRequirement} that will be used for all formulas contained within
     * this sync table (including autocomplete formulas).
     */
    connectionRequirement?: ConnectionRequirement;
    /**
     * Default is true.
     *
     * If false, when subsequent syncs discover new schema properties, these properties will not automatically be
     * added as new columns on the table. The user can still manually add columns for these new properties.
     * This only applies to tables that use dynamic schemas.
     *
     * When tables with dynamic schemas are synced, the {@link getSchema} formula is run each time,
     * which may return a schema that is different than that from the last sync. The default behavior
     * is that any schema properties that are new in this sync are automatically added as new columns,
     * so they are apparent to the user. However, in rare cases when schemas change frequently,
     * this can cause the number of columns to grow quickly and become overwhelming. Setting this
     * value to false leaves the columns unchanged and puts the choice of what columns to display
     * into the hands of the user.
     */
    defaultAddDynamicColumns?: boolean;
    /**
     * Optional placeholder schema before the dynamic schema is retrieved.
     *
     * If `defaultAddDynamicColumns` is false, only featured columns
     * in placeholderSchema will be rendered by default after the sync.
     */
    placeholderSchema?: SchemaT;
    /**
     * An options function to use for any dynamic schema properties.
     * The name of the property that's being modified by the doc editor
     * is available in the option function's context parameter.
     *
     * @example
     * ```
     * coda.makeDynamicSyncTable({
     *   name: "MySyncTable",
     *   getSchema: async function (context) => {
     *     return coda.makeObjectSchema({
     *       properties: {
     *         dynamicPropertyName: {
     *           type: coda.ValueType.String,
     *           codaType: coda.ValueHintType.SelectList,
     *           mutable: true,
     *           options: coda.OptionsType.Dynamic,
     *         },
     *       },
     *     });
     *   },
     *   propertyOptions: async function (context) => {
     *     if (context.propertyName === "dynamicPropertyName") {
     *       return ["Dynamic Value 1", "Dynamic value 2"];
     *     }
     *     throw new coda.UserVisibleError(
     *       `Cannot generate options for property ${context.propertyName}`
     *     );
     *   },
     *   ...
     * ```
     */
    propertyOptions?: PropertyOptionsMetadataFunction<any>;
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
 * See [Normalization](https://coda.io/packs/build/latest/guides/advanced/schemas/#normalization) for more information about schema normalization.
 */
export declare function makeSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaDefT extends ObjectSchemaDefinition<K, L>, SchemaT extends SchemaDefT & {
    identity?: Identity;
}, ContextT extends SyncExecutionContext<any, any>, PermissionsContextT extends SyncPassthroughData>({ name, displayName, description, identityName, schema: inputSchema, formula, connectionRequirement, dynamicOptions, role, }: SyncTableOptions<K, L, ParamDefsT, SchemaDefT, ContextT, PermissionsContextT>): SyncTableDef<K, L, ParamDefsT, SchemaT, ContextT, PermissionsContextT>;
/** @deprecated */
export declare function makeSyncTableLegacy<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>, ContextT extends SyncExecutionContext<any, any>, PermissionsContextT extends SyncPassthroughData>(name: string, schema: SchemaT, formula: FormulaOptions<ParamDefsT, SyncFormulaDef<K, L, ParamDefsT, SchemaT, ContextT, PermissionsContextT>>, connectionRequirement?: ConnectionRequirement, dynamicOptions?: {
    getSchema?: MetadataFormula;
    entityName?: string;
}, displayName?: string): SyncTableDef<K, L, ParamDefsT, SchemaT, ContextT, PermissionsContextT>;
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
export declare function makeDynamicSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchemaDefinition<K, L>, ContextT extends SyncExecutionContext<any, any>, PermissionsContextT extends SyncPassthroughData>({ name, displayName, description, getName: getNameDef, getSchema: getSchemaDef, identityName, getDisplayUrl: getDisplayUrlDef, formula, listDynamicUrls: listDynamicUrlsDef, searchDynamicUrls: searchDynamicUrlsDef, entityName, connectionRequirement, defaultAddDynamicColumns, placeholderSchema: placeholderSchemaInput, propertyOptions, }: {
    name: string;
    displayName?: string;
    description?: string;
    getName: MetadataFormulaDef<ContextT>;
    getSchema: MetadataFormulaDef<ContextT>;
    identityName: string;
    formula: FormulaOptions<ParamDefsT, SyncFormulaDef<K, L, ParamDefsT, any, ContextT, PermissionsContextT>>;
    getDisplayUrl: MetadataFormulaDef<ContextT>;
    listDynamicUrls?: MetadataFormulaDef;
    searchDynamicUrls?: MetadataFormulaDef;
    entityName?: string;
    connectionRequirement?: ConnectionRequirement;
    defaultAddDynamicColumns?: boolean;
    placeholderSchema?: SchemaT;
    propertyOptions?: PropertyOptionsMetadataFunction<any>;
}): DynamicSyncTableDef<K, L, ParamDefsT, any, ContextT, PermissionsContextT>;
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
export declare function makeTranslateObjectFormula<ParamDefsT extends ParamDefs, ResultT extends Schema>({ response, ...definition }: FormulaOptions<ParamDefsT, ObjectArrayFormulaDef<ParamDefsT, ResultT>>): {
    name: string;
    description: string;
    instructions?: string | undefined;
    parameters: ParamDefsT;
    varargParameters?: ParamDefs | undefined;
    examples?: {
        params: (import("./api_types").PackFormulaValue | undefined)[];
        result: PackFormulaResult;
    }[] | undefined;
    isAction?: boolean | undefined;
    connectionRequirement?: ConnectionRequirement | undefined;
    network?: import("./api_types").Network | undefined;
    cacheTtlSecs?: number | undefined;
    isExperimental?: boolean | undefined;
    isSystem?: boolean | undefined;
    extraOAuthScopes?: string[] | undefined;
    allowedAuthenticationNames?: string[] | undefined;
    validateParameters?: MetadataFormulaDef<ExecutionContext, ParameterValidationResult> | undefined;
} & {
    execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<SchemaType<ResultT>>;
    resultType: Type.object;
    schema: ResultT | undefined;
    validateParameters: MetadataFormula<ExecutionContext, ParameterValidationResult> | undefined;
};
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
export declare function makeEmptyFormula<ParamDefsT extends ParamDefs>(definition: FormulaOptions<ParamDefsT, EmptyFormulaDef<ParamDefsT>>): {
    name: string;
    description: string;
    instructions?: string | undefined;
    parameters: ParamDefsT;
    varargParameters?: ParamDefs | undefined;
    examples?: {
        params: (import("./api_types").PackFormulaValue | undefined)[];
        result: PackFormulaResult;
    }[] | undefined;
    isAction?: boolean | undefined;
    connectionRequirement?: ConnectionRequirement | undefined;
    network?: import("./api_types").Network | undefined;
    cacheTtlSecs?: number | undefined;
    isExperimental?: boolean | undefined;
    isSystem?: boolean | undefined;
    extraOAuthScopes?: string[] | undefined;
    allowedAuthenticationNames?: string[] | undefined;
    validateParameters?: MetadataFormulaDef<ExecutionContext, ParameterValidationResult> | undefined;
} & {
    execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<string>;
    resultType: Type.string;
    validateParameters: MetadataFormula<ExecutionContext, ParameterValidationResult> | undefined;
};
export declare function maybeRewriteConnectionForNamedPropertyOptions(namedPropertyOptions: SyncTablePropertyOptions | undefined, connectionRequirement: ConnectionRequirement | undefined): SyncTablePropertyOptions | undefined;
export declare function maybeRewriteConnectionForFormula<ParamDefsT extends ParamDefs, T extends FormulaOptions<ParamDefsT, CommonPackFormulaDef<ParamDefsT>> | undefined>(formula: T, connectionRequirement: ConnectionRequirement | undefined): T;
