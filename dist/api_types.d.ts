/// <reference types="node" />
import type { $Values } from './type_utils';
import type { ArraySchema } from './schema';
import type { AuthenticationDef } from './types';
import type { Continuation } from './api';
import type { MetadataContext } from './api';
import type { MetadataFormula } from './api';
import type { ObjectSchemaProperty } from './schema';
import type { Schema } from './schema';
/**
 * Markers used internally to represent data types for parameters and return values.
 * It should not be necessary to ever use these values directly.
 *
 * When defining a parameter, use {@link ParameterType}. When defining
 * a formula return value, or properties within an object return value,
 * use {@link ValueType}.
 */
export declare enum Type {
    string = 0,
    number = 1,
    object = 2,
    boolean = 3,
    date = 4,
    html = 5,
    image = 6,
    file = 7,
    markdown = 8
}
export type ParamType = Exclude<Type, Type.object>;
/**
 * The type of a parameter or return value that is an array.
 */
export interface ArrayType<T extends Type> {
    /** Identifies this type as an array. */
    type: 'array';
    /** The type of the items in this array. */
    items: T;
    /** If true, this array will accept empty or unrecognized values as `undefined`. */
    allowEmpty?: boolean;
}
export interface SparseArrayType<T extends Type> extends ArrayType<T> {
    allowEmpty: true;
}
export declare function isArrayType(obj: any): obj is ArrayType<any>;
export type UnionType = ArrayType<Type> | Type;
/** @deprecated */
export declare const stringArray: ArrayType<Type.string>;
/** @deprecated */
export declare const numberArray: ArrayType<Type.number>;
/** @deprecated */
export declare const booleanArray: ArrayType<Type.boolean>;
/** @deprecated */
export declare const dateArray: ArrayType<Type.date>;
/** @deprecated */
export declare const htmlArray: ArrayType<Type.html>;
/** @deprecated */
export declare const imageArray: ArrayType<Type.image>;
/** @deprecated */
export declare const fileArray: ArrayType<Type.file>;
export interface TypeMap {
    [Type.number]: number;
    [Type.string]: string;
    [Type.object]: object;
    [Type.boolean]: boolean;
    [Type.date]: Date;
    [Type.html]: string;
    [Type.image]: string;
    [Type.file]: string;
    [Type.markdown]: string;
}
/**
 * The union of types for arguments to the `execute` function for a formula.
 */
export type PackFormulaValue = $Values<Omit<TypeMap, Type.object>> | PackFormulaValue[];
/**
 * The union of types that can be returned by the `execute` function for a formula.
 */
export type PackFormulaResult = $Values<TypeMap> | PackFormulaResult[];
export type TypeOf<T extends PackFormulaResult> = T extends number ? Type.number : T extends string ? Type.string : T extends boolean ? Type.boolean : T extends Date ? Type.date : T extends object ? Type.object : never;
/**
 * Enumeration of types of formula parameters. These describe Coda value types (as opposed to JavaScript value types).
 */
export declare enum ParameterType {
    /**
     * Indicates a parameter that is a Coda text value.
     */
    String = "string",
    /**
     * Indicates a parameter that is a Coda number value.
     */
    Number = "number",
    /**
     * Indicates a parameter that is a Coda boolean value.
     */
    Boolean = "boolean",
    /**
     * Indicates a parameter that is a Coda date value (which includes time and datetime values).
     */
    Date = "date",
    /**
     * Indicates a parameter that is a Coda rich text value that should be passed to the pack as HTML.
     */
    Html = "html",
    /**
     * Indicates a parameter that is a Coda image. The pack is passed an image URL.
     */
    Image = "image",
    /**
     * Indicates a parameter that is a Coda file. The pack is passed a file URL.
     */
    File = "file",
    /**
     * Indicates a parameter that is a Coda rich text value that should be passed to the pack as Markdown.
     */
    Markdown = "markdown",
    /**
     * Indicates a parameter that is a list of Coda text values.
     */
    StringArray = "stringArray",
    /**
     * {@link StringArray} that accepts unparsable values as `undefined`.
     */
    SparseStringArray = "sparseStringArray",
    /**
     * Indicates a parameter that is a list of Coda number values.
     */
    NumberArray = "numberArray",
    /**
     * {@link NumberArray} that accepts unparsable values as `undefined`.
     */
    SparseNumberArray = "sparseNumberArray",
    /**
     * Indicates a parameter that is a list of Coda boolean values.
     */
    BooleanArray = "booleanArray",
    /**
     * {@link BooleanArray} that accepts unparsable values as `undefined`.
     */
    SparseBooleanArray = "sparseBooleanArray",
    /**
     * Indicates a parameter that is a list of Coda date values (which includes time and datetime values).
     *
     * Currently, when such a parameter is used with a sync table formula or an action formula
     * ({@link BaseFormulaDef.isAction}), which will generate a builder UI for selecting parameters, a date array
     * parameter will always render as a date range selector. A date range will always be passed to a pack formula
     * as a list of two elements, the beginning of the range and the end of the range.
     */
    DateArray = "dateArray",
    /**
     * {@link DateArray} that accepts unparsable values as `undefined`.
     */
    SparseDateArray = "sparseDateArray",
    /**
     * Indicates a parameter that is a list of Coda rich text values that should be passed to the pack as HTML.
     */
    HtmlArray = "htmlArray`",
    /**
     * {@link HtmlArray} that accepts unparsable values as `undefined`.
     */
    SparseHtmlArray = "sparseHtmlArray",
    /**
     * Indicates a parameter that is a list of Coda image values. The pack is passed a list of image URLs.
     */
    ImageArray = "imageArray",
    /**
     * {@link ImageArray} that accepts unparsable values as `undefined`.
     */
    SparseImageArray = "sparseImageArray",
    /**
     * Indicates a parameter that is a list of Coda file values. The pack is passed a list of file URLs.
     */
    FileArray = "fileArray",
    /**
     * {@link FileArray} that accepts unparsable values as `undefined`.
     */
    SparseFileArray = "sparseFileArray",
    /**
     * Indicates a parameter that is a list of Coda rich text values that should be passed to the pack as Markdown.
     */
    MarkdownArray = "markdownArray`",
    /**
     * {@link MarkdownArray} that accepts unparsable values as `undefined`.
     */
    SparseMarkdownArray = "sparseMarkdownArray"
}
export interface ParameterTypeMap {
    [ParameterType.String]: Type.string;
    [ParameterType.Number]: Type.number;
    [ParameterType.Boolean]: Type.boolean;
    [ParameterType.Date]: Type.date;
    [ParameterType.Html]: Type.html;
    [ParameterType.Image]: Type.image;
    [ParameterType.File]: Type.file;
    [ParameterType.Markdown]: Type.markdown;
    [ParameterType.StringArray]: ArrayType<Type.string>;
    [ParameterType.NumberArray]: ArrayType<Type.number>;
    [ParameterType.BooleanArray]: ArrayType<Type.boolean>;
    [ParameterType.DateArray]: ArrayType<Type.date>;
    [ParameterType.HtmlArray]: ArrayType<Type.html>;
    [ParameterType.ImageArray]: ArrayType<Type.image>;
    [ParameterType.FileArray]: ArrayType<Type.file>;
    [ParameterType.MarkdownArray]: ArrayType<Type.markdown>;
    [ParameterType.SparseStringArray]: SparseArrayType<Type.string>;
    [ParameterType.SparseNumberArray]: SparseArrayType<Type.number>;
    [ParameterType.SparseBooleanArray]: SparseArrayType<Type.boolean>;
    [ParameterType.SparseDateArray]: SparseArrayType<Type.date>;
    [ParameterType.SparseHtmlArray]: SparseArrayType<Type.html>;
    [ParameterType.SparseImageArray]: SparseArrayType<Type.image>;
    [ParameterType.SparseFileArray]: SparseArrayType<Type.file>;
    [ParameterType.SparseMarkdownArray]: SparseArrayType<Type.markdown>;
}
export declare const ParameterTypeInputMap: Record<ParameterType, UnionType>;
/**
 * The definition of a formula parameter.
 */
export interface ParamDef<T extends UnionType> {
    /**
     * The name of the parameter, which will be shown to the user when invoking this formula.
     */
    name: string;
    /**
     * The data type of this parameter (string, number, etc).
     */
    type: T;
    /**
     * A brief description of what this parameter is used for, shown to the user when invoking the formula.
     */
    description: string;
    /**
     * Whether this parameter can be omitted when invoking the formula.
     * All optional parameters must come after all non-optional parameters.
     */
    optional?: boolean;
    /**
     * A {@link MetadataFormula} that returns valid values for this parameter, optionally matching a search
     * query. This can be useful both if there are a fixed number of valid values for the parameter,
     * or if the valid values from the parameter can be looked up from some API.
     * Use {@link makeMetadataFormula} to wrap a function that implements your autocomplete logic.
     * Typically once you have fetched the list of matching values, you'll use
     * {@link autocompleteSearchObjects} to handle searching over those values.
     * If you have a hardcoded list of valid values, you would only need to use
     * {@link makeSimpleAutocompleteMetadataFormula}.
     */
    autocomplete?: MetadataFormula;
    /**
     * @deprecated This will be removed in a future version of the SDK. Use {@link ParamDef.suggestedValue} instead.
     */
    defaultValue?: SuggestedValueType<T>;
    /**
     * The suggested value to be prepopulated for this parameter if it is not specified by the user.
     */
    suggestedValue?: SuggestedValueType<T>;
}
/**
 * Marker type for an optional {@link ParamDef}, used internally.
 */
export interface OptionalParamDef<T extends UnionType> extends ParamDef<T> {
    optional: true;
}
/**
 * Marker type for a Required {@link ParamDef}, used internally.
 */
export interface RequiredParamDef<T extends UnionType> extends ParamDef<T> {
    optional?: false;
}
/** @hidden */
export type ParamArgs<T extends UnionType> = Omit<ParamDef<T>, 'description' | 'name' | 'type'>;
/**
 * The type for the complete set of parameter definitions for a formula.
 */
export type ParamDefs = [ParamDef<UnionType>, ...Array<ParamDef<UnionType>>] | [];
/** @hidden */
export type ParamsList = Array<ParamDef<UnionType>>;
type TypeOfMap<T extends UnionType> = T extends Type ? TypeMap[T] : T extends ArrayType<infer V> ? T extends SparseArrayType<infer V> ? Array<TypeMap[V] | undefined> : Array<TypeMap[V]> : never;
/**
 * The type for the set of argument values that are passed to formula's `execute` function, based on
 * the parameter definition for that formula.
 */
export type ParamValues<ParamDefsT extends ParamDefs> = {
    [K in keyof ParamDefsT]: ParamDefsT[K] extends RequiredParamDef<infer S> ? TypeOfMap<S> : ParamDefsT[K] extends ParamDef<infer S> ? TypeOfMap<S> | undefined : never;
} & any[];
/**
 * The type of values that are allowable to be used as a {@link ParamDef.suggestedValue} for a parameter.
 */
export type SuggestedValueType<T extends UnionType> = T extends ArrayType<Type.date> ? TypeOfMap<T> | PrecannedDateRange : TypeOfMap<T>;
/**
 * Inputs for creating a formula that are common between regular formulas and sync table formulas.
 */
export interface CommonPackFormulaDef<T extends ParamDefs> {
    /**
     * The name of the formula, used to invoke it.
     */
    readonly name: string;
    /**
     * A brief description of what the formula does.
     */
    readonly description: string;
    /**
     * The parameter inputs to the formula, if any.
     */
    readonly parameters: T;
    /**
     * Variable argument parameters, used if this formula should accept arbitrary
     * numbers of inputs.
     */
    readonly varargParameters?: ParamDefs;
    /**
     * Sample inputs and outputs demonstrating usage of this formula.
     */
    readonly examples?: Array<{
        params: Array<PackFormulaValue | undefined>;
        result: PackFormulaResult;
    }>;
    /**
     * Does this formula take an action (vs retrieve data or make a calculation)?
     * Actions are presented as buttons in the Coda UI.
     */
    readonly isAction?: boolean;
    /**
     * Does this formula require a connection (aka an account)?
     */
    readonly connectionRequirement?: ConnectionRequirement;
    /** @deprecated use `isAction` and `connectionRequirement` instead */
    readonly network?: Network;
    /**
     * How long formulas running with the same values should cache their results for.
     */
    readonly cacheTtlSecs?: number;
    /**
     * If specified, the formula will not be suggested to users in Coda's formula autocomplete.
     * The formula can still be invoked by manually typing its full name.
     */
    readonly isExperimental?: boolean;
    /**
     * Whether this is a formula that will be used by Coda internally and not exposed directly to users.
     * Not for use by packs that are not authored by Coda.
     */
    readonly isSystem?: boolean;
    /**
     * OAuth scopes that the formula needs that weren't requested in the pack's overall authentication
     * config. For example, a Slack pack can have one formula that needs admin privileges, but non-admins
     * can use the bulk of the pack without those privileges. Coda will give users help in understanding
     * that they need additional authentication to use a formula with extra OAuth scopes. Note that
     * these scopes will always be requested in addition to the default scopes for the pack,
     * so an end user must have both sets of permissions.
     */
    readonly extraOAuthScopes?: string[];
}
/**
 * Enumeration of requirement states for whether a given formula or sync table requires
 * a connection (account) to use.
 */
export declare enum ConnectionRequirement {
    /**
     * Indicates this building block does not make use of an account.
     */
    None = "none",
    /**
     * Indicates that this building block can be used with or without an account.
     *
     * An optional parameter will be added to the formula (or sync formula) for the calling user
     * to specify an account to use.
     */
    Optional = "optional",
    /**
     * Indicates that this building block must be used with an account.
     *
     * A required parameter will be added to the formula (or sync formula) for the calling user
     * to specify an account to use.
     */
    Required = "required"
}
/**
 * A full definition of a pack's user authentication settings, used in
 * {@link PackDefinitionBuilder.setUserAuthentication}.
 */
export type UserAuthenticationDef = AuthenticationDef & {
    /**
     * It can be annoying to set `connectionRequirement` on every building block in a Pack.
     * Use this setting in your Pack's auth settings to quickly say "every building block
     * in this Pack requires an account". Without a connectionRequirement, building blocks
     * will be assumed to not need account connections.
     */
    defaultConnectionRequirement?: ConnectionRequirement;
};
/** @deprecated use `ConnectionRequirement` instead */
export declare enum NetworkConnection {
    None = "none",
    Optional = "optional",
    Required = "required"
}
/** @deprecated use `isAction` and `connectionRequirement` on the formula definition instead. */
export interface Network {
    readonly hasSideEffect?: boolean;
    readonly requiresConnection?: boolean;
    readonly connection?: NetworkConnection;
}
/** The HTTP methods (verbs) supported by the fetcher. */
export declare const ValidFetchMethods: readonly ["GET", "PATCH", "POST", "PUT", "DELETE", "HEAD"];
/** The type of the HTTP methods (verbs) supported by the fetcher. */
export type FetchMethodType = (typeof ValidFetchMethods)[number];
/**
 * An HTTP request used with the {@link Fetcher}.
 *
 * The structure largely follows https://developer.mozilla.org/en-US/docs/Web/API/Request
 */
export interface FetchRequest {
    /** The HTTP method/verb (e.g. GET or POST). */
    method: FetchMethodType;
    /**
     * The URL to connect to. This is typically an absolute URL, but if your
     * pack uses authentication and {@link BaseAuthentication.requiresEndpointUrl} and so has a unique
     * endpoint per user account, you may also use a relative URL and Coda will
     * apply the user's endpoint automatically.
     */
    url: string;
    /**
     * The body of the HTTP request, if any.
     *
     * If you are sending a JSON payload, make sure to call `JSON.stringify()` on the object payload.
     */
    body?: string | Buffer;
    /**
     * Key-value form fields, if submitting to an endpoint expecting a URL-encoded form payload.
     */
    form?: {
        [key: string]: string;
    };
    /**
     * HTTP headers. You should NOT include authentication headers, as Coda will add them for you.
     */
    headers?: {
        [header: string]: string;
    };
    /**
     * A time in seconds that Coda should cache the result of this HTTP request.
     *
     * Any time that this pack makes the same FetchRequest, a cached value can be returned
     * instead of making the HTTP request. If left unspecified, Coda will automatically
     * cache all GET requests for approximately 5 minutes. To disable the default caching,
     * set this value to `0`.
     */
    cacheTtlSecs?: number;
    /**
     * Indicates that you expect the response to be binary data, instructing Coda
     * not to attempt to parse the response in any way. Otherwise, Coda may attempt
     * to parse the response as a JSON object. If true, {@link FetchResponse.body}
     * will be a NodeJS Buffer.
     */
    isBinaryResponse?: boolean;
    /**
     * If true, Coda will not apply authentication credentials even if this pack is
     * configured to use authentication. This is very rare, but sometimes you may
     * wish to make an unauthenticated supporting request as part of a formula implementation.
     */
    disableAuthentication?: boolean;
    /**
     * If true, will immediately return a response when encountering an HTTP 301
     * You may inspect the `Location` header of the response to observe the indicated redirect URL.
     */
    ignoreRedirects?: boolean;
}
/**
 * The response of a call to {@link Fetcher.fetch}.
 *
 * The structure largely follows https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
export interface FetchResponse<T extends any = any> {
    /** The HTTP status code, e.g. `200`. */
    status: number;
    /**
     * The body of the response.
     *
     * If the response contains JSON data, either because the Content-Type header is application/json
     * or if the data is JSON-parsable, this will be a parsed JavaScript object.
     * Similarly, if the response headers are text/xml or application/xml, this will be a parsed
     * JavaScript object using the `xml2js` library.
     *
     * If implicit parsing is undesirable, you may consider using {@link FetchRequest.isBinaryResponse} on the request
     * to disable any parsing. Note however that this will result in the body being a NodeJS Buffer.
     */
    body?: T;
    /**
     * HTTP response headers. The contents of many headers will be redacted for security reasons.
     */
    headers: {
        [header: string]: string | string[] | undefined;
    };
}
/**
 * A utility that allows you to make HTTP requests from a pack. The fetcher also
 * handles applying user authentication credentials to each request, if applicable.
 *
 * This is only way a pack is able to make HTTP requests, as using other libraries is unsupported.
 */
export interface Fetcher {
    /**
     * Makes an HTTP request.
     *
     * If authentication is used with this pack, the user's secret credentials will be
     * automatically applied to the request (whether in the HTTP headers, as a URL parameter,
     * or whatever the authentication type dictates). Your invocation of `fetch()` need not
     * deal with authentication in any way, Coda will handle that entirely on your behalf.
     */
    fetch<T = any>(request: FetchRequest): Promise<FetchResponse<T>>;
}
/**
 * A utility for temporarily storing files and images that either require authentication
 * or are too large to return inline.
 *
 * When syncing data from certain APIs, a response object may include the URL of a file or
 * image that can only be downloaded with the user's authentication credentials. Normally,
 * you can just return an image or file URL from a formula invocation, and if the schema
 * indicates that the value represents an attachment, Coda will ingest the data at that URL
 * and host it from Coda. However, if the URL requires authentication, Coda will be unable
 * to download the data since this ingestion does not happen within the packs execution
 * environment.
 *
 * The solution is for your pack code to fetch the data at the URL, since the pack
 * execution environment will apply the user's authentication, and then you can
 * stash the downloaded value in `TemporaryBlobStorage`, which will return a temporary
 * URL that you can return from the pack. Coda will be able to ingest the data from
 * that temporary URL.
 *
 * Similarly, suppose your formula generates a very large value like a dynamically-generated
 * image that you wish to return and have Coda render. Pack return values are meant to be
 * fairly small, representing human-readable data. Large values like images are meant to
 * be returned as URLs referencing that data. So rather than return the raw image data,
 * your pack should use {@link storeBlob} to upload that large data to temporary storage.
 * You will be returned a URL that you can then return with your formula response, and
 * Coda will ingest the data from that URL into permanent storage.
 */
export interface TemporaryBlobStorage {
    /**
     * Fetches the data at the given URL, applying user authentication credentials as appropriate,
     * and stores it in Coda-hosted temporary storage. Returns a URL for the temporary file
     * that you should return in your formula response.
     *
     * The URL expires after 15 minutes by default, but you may pass a custom expiry, however
     * Coda reserves the right to ignore long expirations.
     *
     * If the `downloadFilename` parameter is specified, when opened in the browser the file will
     * be downloaded with the file name provided.
     */
    storeUrl(url: string, opts?: {
        expiryMs?: number;
        downloadFilename?: string;
    }, fetchOpts?: Pick<FetchRequest, 'disableAuthentication'>): Promise<string>;
    /**
     * Stores the given data as a file with the given content type in Coda-hosted temporary storage.
     * Returns a URL for the temporary file that you should return in your formula response.
     *
     * The URL expires after 15 minutes by default, but you may pass a custom expiry, however
     * Coda reserves the right to ignore long expirations.
     *
     * If the `downloadFilename` parameter is specified, when opened in the browser the file will
     * be downloaded with the file name provided.
     */
    storeBlob(blobData: Buffer, contentType: string, opts?: {
        expiryMs?: number;
        downloadFilename?: string;
    }): Promise<string>;
}
/**
 * Information about the current sync, part of the {@link SyncExecutionContext} passed to the
 * `execute` function of every sync formula.
 */
export interface Sync {
    /**
     * The continuation that was returned from the prior sync invocation. The is the exact
     * value returned in the `continuation` property of result of the prior sync.
     */
    continuation?: Continuation;
    /**
     * The schema of this sync table, if this is a dynamic sync table. It may be useful to have
     * access to the dynamically-generated schema of the table instance in order to construct
     * the response for a dynamic sync table's `execute` function.
     */
    schema?: ArraySchema;
    /**
     * The dynamic URL that backs this sync table, if this is a dynamic sync table.
     * The dynamic URL is likely necessary for determining which API resources to fetch.
     */
    dynamicUrl?: string;
    /**
     * {@link core.MetadataContext} The parameters of the sync formula for the sync table.
     */
    readonly parameters?: MetadataContext;
}
/**
 * Information about the current sync, part of the {@link UpdateSyncExecutionContext} passed to the
 * `executeUpdate` function of the sync formula.
 */
export type UpdateSync = Omit<Sync, 'continuation'>;
export type LoggerParamType = string | number | boolean | Record<any, any>;
export interface Logger {
    trace(message: string, ...args: LoggerParamType[]): void;
    debug(message: string, ...args: LoggerParamType[]): void;
    info(message: string, ...args: LoggerParamType[]): void;
    warn(message: string, ...args: LoggerParamType[]): void;
    error(message: string, ...args: LoggerParamType[]): void;
}
/**
 * Information about the Coda environment and doc this formula was invoked from, for Coda internal use.
 */
export interface InvocationLocation {
    /** The base URL of the Coda environment executing this formula. Only for Coda internal use. */
    protocolAndHost: string;
    /**
     * @deprecated This will be removed in a future version of the SDK.
     */
    docId?: string;
}
/**
 * An object passed to the `execute` function of every formula invocation
 * with information and utilities for handling the invocation. In particular,
 * this contains the {@link core.Fetcher}, which is used for making HTTP requests.
 */
export interface ExecutionContext {
    /**
     * The {@link core.Fetcher} used for making HTTP requests.
     */
    readonly fetcher: Fetcher;
    /**
     * A utility to fetch and store files and images that either require the pack user's authentication
     * or are too large to return inline. See {@link core.TemporaryBlobStorage}.
     */
    readonly temporaryBlobStorage: TemporaryBlobStorage;
    /**
     * The base endpoint URL for the user's account, only if applicable. See
     * {@link core.BaseAuthentication.requiresEndpointUrl}.
     *
     * If the API URLs are variable based on the user account, you will need this endpoint
     * to construct URLs to use with the fetcher. Alternatively, you can use relative URLs
     * (e.g. "/api/entity") and Coda will include the endpoint for you automatically.
     */
    readonly endpoint?: string;
    /**
     * Information about the Coda environment and doc this formula was invoked from.
     * This is mostly for Coda internal use and we do not recommend relying on it.
     */
    readonly invocationLocation: InvocationLocation;
    /**
     * The timezone of the doc from which this formula was invoked.
     */
    readonly timezone: string;
    /**
     * A random token scoped to only this request invocation.
     * This is a unique identifier for the invocation, and in particular used with
     * {@link core.AuthenticationType.Custom} for naming template parameters that will be
     * replaced by the fetcher in secure way.
     */
    readonly invocationToken: string;
    /**
     * Information about state of the current sync. Only populated if this is a sync table formula.
     */
    readonly sync?: Sync;
}
/**
 * Sub-class of {@link ExecutionContext} that is passed to the `execute` function of every
 * sync formula invocation. The only different is that the presence of the `sync` property
 */
export interface SyncExecutionContext extends ExecutionContext {
    /**
     * Information about state of the current sync.
     */
    readonly sync: Sync;
}
/**
 * Sub-class of {@link SyncExecutionContext} that is passed to the `options` function of
 * mutable sync tables for properties with `options` enabled.
 */
export interface PropertyOptionsExecutionContext extends SyncExecutionContext {
    /**
     * Which property is being edited.
     */
    readonly propertyName: string;
    /**
     * Schema of the property being edited. See {@link Schema}.
     */
    readonly propertySchema: Schema & ObjectSchemaProperty;
    /**
     * Current values of other properties from the same row. Non-required properties may be missing
     * if the doc owner elected not to sync them, or if they have a type that's not yet supported
     * for options context. Properties referencing other sync tables may be missing some or
     * all of their sub-properties if the reference is broken because the other table is not
     * added to the doc or hasn't synced the referenced row.
     */
    readonly propertyValues: {
        [propertyValues: string]: any;
    };
    /**
     * What the user typed. For example, they may have type "Ja" while searching for a user named
     * "Jane".
     */
    readonly search: string;
}
export interface UpdateSyncExecutionContext extends ExecutionContext {
    /**
     * Information about state of the current sync.
     */
    readonly sync: UpdateSync;
}
/**
 * Special "live" date range values that can be used as the {@link ParamDef.suggestedValue}
 * for a date array parameter.
 *
 * Date array parameters are meant to represent date ranges. A date range can
 * be a fixed range, e.g. April 1, 2020 - May 15, 2020, or it can be a "live"
 * range, like "last 30 days".
 *
 * At execution time, a date range will always be passed to a pack as an
 * array of two specific dates, but for many use cases, it is necessary
 * to provide a default value that is a "live" range rather than hardcoded
 * one. For example, if your pack has a table that syncs recent emails,
 * you might want to have a date range parameter that default to
 * "last 7 days". Defaulting to a hardcoded date range would not be useful
 * and requiring the user to always specify a date range may be inconvenient.
 */
export declare enum PrecannedDateRange {
    Yesterday = "yesterday",
    Last7Days = "last_7_days",
    Last30Days = "last_30_days",
    Last90Days = "last_90_days",
    Last180Days = "last_180_days",
    Last365Days = "last_365_days",
    LastWeek = "last_week",
    LastMonth = "last_month",
    /** @deprecated */
    Last3Months = "last_3_months",
    /** @deprecated */
    Last6Months = "last_6_months",
    LastYear = "last_year",
    Today = "today",
    ThisWeek = "this_week",
    ThisMonth = "this_month",
    YearToDate = "year_to_date",
    ThisYear = "this_year",
    Last7AndNext7Days = "last_7_and_next_7_days",
    Last30AndNext30Days = "last_30_and_next_30_days",
    Tomorrow = "tomorrow",
    Next7Days = "next_7_days",
    Next30Days = "next_30_days",
    Next90Days = "next_90_days",
    Next180Days = "next_180_days",
    Next365Days = "next_365_days",
    NextWeek = "next_week",
    NextMonth = "next_month",
    /** @deprecated */
    Next3Months = "next_3_months",
    /** @deprecated */
    Next6Months = "next_6_months",
    NextYear = "next_year",
    /**
     * Indicates a date range beginning in the very distant past (e.g. 1/1/1, aka 1 A.D.)
     * and ending in the distant future (e.g. 12/31/3999). Exact dates are subject to change.
     */
    Everything = "everything"
}
/**
 * An enum defining special types options handling for properties.
 */
export declare enum OptionsType {
    /**
     * The property's options should be generated by the sync table's
     * {@link DynamicSyncTableOptions.propertyOptions} function.
     */
    Dynamic = "__coda_dynamic__"
}
/** @hidden */
export type OptionsReference = string & {
    __brand: 'OptionsRef';
};
/**
 * The result of a property options formula. This is either an array, or an array combined with
 * cacheTtlSecs to indicate how long the results can be cached for. The default cacheTtlSecs
 * is about 5 minutes, if unspecified.
 */
export type PropertyOptionsMetadataResult<ResultT extends PackFormulaResult[]> = ResultT | {
    result: ResultT;
    cacheTtlSecs?: number;
};
/**
 * A JavaScript function for property options.
 */
export type PropertyOptionsMetadataFunction<ResultT extends PackFormulaResult[]> = (context: PropertyOptionsExecutionContext) => Promise<PropertyOptionsMetadataResult<ResultT>> | PropertyOptionsMetadataResult<ResultT>;
export {};
