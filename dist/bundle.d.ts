/** Returns the codomain for a map-like type. */
export type $Values<S> = S[keyof S];
/** Omits properties over a union type, only if the union member has that property. */
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
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
/**
 * The type of a parameter or return value that is an array.
 */
export interface ArrayType<T extends Type> {
	/** Identifies this type as an array. */
	type: "array";
	/** The type of the items in this array. */
	items: T;
	/** If true, this array will accept empty or unrecognized values as `undefined`. */
	allowEmpty?: boolean;
}
export interface SparseArrayType<T extends Type> extends ArrayType<T> {
	allowEmpty: true;
}
export type UnionType = ArrayType<Type> | Type;
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
/**
 * The type for the complete set of parameter definitions for a formula.
 */
export type ParamDefs = [
	ParamDef<UnionType>,
	...Array<ParamDef<UnionType>>
] | [
];
/** @hidden */
export type ParamsList = Array<ParamDef<UnionType>>;
export type TypeOfMap<T extends UnionType> = T extends Type ? TypeMap[T] : T extends ArrayType<infer V> ? T extends SparseArrayType<infer V> ? Array<TypeMap[V] | undefined> : Array<TypeMap[V]> : never;
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
export declare const ValidFetchMethods: readonly [
	"GET",
	"PATCH",
	"POST",
	"PUT",
	"DELETE",
	"HEAD"
];
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
	}, fetchOpts?: Pick<FetchRequest, "disableAuthentication">): Promise<string>;
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
export type UpdateSync = Omit<Sync, "continuation">;
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
	__brand: "OptionsRef";
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
/**
 * The set of primitive value types that can be used as return values for formulas
 * or in object schemas.
 */
export declare enum ValueType {
	/**
	 * Indicates a JavaScript boolean (true/false) should be returned.
	 */
	Boolean = "boolean",
	/**
	 * Indicates a JavaScript number should be returned.
	 */
	Number = "number",
	/**
	 * Indicates a JavaScript string should be returned.
	 */
	String = "string",
	/**
	 * Indicates a JavaScript array should be returned. The schema of the array items must also be specified.
	 */
	Array = "array",
	/**
	 * Indicates a JavaScript object should be returned. The schema of each object property must also be specified.
	 */
	Object = "object"
}
/**
 * Synthetic types that instruct Coda how to coerce values from primitives at ingestion time.
 */
export declare enum ValueHintType {
	/**
	 * Indicates to interpret the value as a date (e.g. March 3, 2021).
	 */
	Date = "date",
	/**
	 * Indicates to interpret the value as a time (e.g. 5:24pm).
	 */
	Time = "time",
	/**
	 * Indicates to interpret the value as a datetime (e.g. March 3, 2021 at 5:24pm).
	 */
	DateTime = "datetime",
	/**
	 * Indicates to interpret the value as a duration (e.g. 3 hours).
	 */
	Duration = "duration",
	/**
	 * Indicates to interpret the value as an email address (e.g. joe@foo.com).
	 */
	Email = "email",
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
	Person = "person",
	/**
	 * Indicates to interpret and render the value as a percentage.
	 */
	Percent = "percent",
	/**
	 * Indicates to interpret and render the value as a currency value.
	 */
	Currency = "currency",
	/**
	 * Indicates to interpret and render the value as an image. The provided value should be a URL that
	 * points to an image. Coda will hotlink to the image when rendering it a doc.
	 *
	 * Using {@link ImageAttachment} is recommended instead, so that the image is always accessible
	 * and won't appear as broken if the source image is later deleted.
	 */
	ImageReference = "image",
	/**
	 * Indicates to interpret and render the value as an image. The provided value should be a URL that
	 * points to an image. Coda will ingest the image and host it from Coda infrastructure.
	 */
	ImageAttachment = "imageAttachment",
	/**
	 * Indicates to interpret and render the value as a URL link.
	 */
	Url = "url",
	/**
	 * Indicates to interpret a text value as Markdown, which will be converted and rendered as Coda rich text.
	 */
	Markdown = "markdown",
	/**
	 * Indicates to interpret a text value as HTML, which will be converted and rendered as Coda rich text.
	 */
	Html = "html",
	/**
	 * Indicates to interpret and render a value as an embed. The provided value should be a URL pointing
	 * to an embeddable web page.
	 */
	Embed = "embed",
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
	Reference = "reference",
	/**
	 * Indicates to interpret and render a value as a file attachment. The provided value should be a URL
	 * pointing to a file of a Coda-supported type. Coda will ingest the file and host it from Coda infrastructure.
	 */
	Attachment = "attachment",
	/**
	 * Indicates to render a numeric value as a slider UI component.
	 */
	Slider = "slider",
	/**
	 * Indicates to render a numeric value as a scale UI component (e.g. a star rating).
	 */
	Scale = "scale",
	/**
	 * Indicates to render a numeric value as a progress bar UI component.
	 */
	ProgressBar = "progressBar",
	/**
	 * Indicates to render a boolean value as a toggle.
	 */
	Toggle = "toggle",
	/** @hidden */
	CodaInternalRichText = "codaInternalRichText",
	/**
	 * Indicates to render a value as a select list.
	 */
	SelectList = "selectList"
}
declare const StringHintValueTypes: readonly [
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
	ValueHintType.SelectList
];
declare const NumberHintValueTypes: readonly [
	ValueHintType.Date,
	ValueHintType.Time,
	ValueHintType.DateTime,
	ValueHintType.Duration,
	ValueHintType.Percent,
	ValueHintType.Currency,
	ValueHintType.Slider,
	ValueHintType.ProgressBar,
	ValueHintType.Scale
];
declare const BooleanHintValueTypes: readonly [
	ValueHintType.Toggle
];
declare const ObjectHintValueTypes: readonly [
	ValueHintType.Person,
	ValueHintType.Reference,
	ValueHintType.SelectList
];
/** The subset of {@link ValueHintType} that can be used with a string value. */
export type StringHintTypes = (typeof StringHintValueTypes)[number];
/** The subset of {@link ValueHintType} that can be used with a number value. */
export type NumberHintTypes = (typeof NumberHintValueTypes)[number];
/** The subset of {@link ValueHintType} that can be used with a boolean value. */
export type BooleanHintTypes = (typeof BooleanHintValueTypes)[number];
/** The subset of {@link ValueHintType} that can be used with an object value. */
export type ObjectHintTypes = (typeof ObjectHintValueTypes)[number];
/**
 * A function or set of values to return for property options.
 */
export type PropertySchemaOptions<T extends PackFormulaResult> = PropertyOptionsMetadataFunction<T[]> | T[] | OptionsType | OptionsReference;
/**
 * A property with a list of valid options for its value.
 */
export interface PropertyWithOptions<T extends PackFormulaResult> {
	/**
	 * A list of values or a formula that returns a list of values to suggest when someone
	 * edits this property.
	 *
	 * @example
	 * ```
	 * properties: {
	 *   color: {
	 *      type: coda.ValueType.String,
	 *      codaType: coda.ValueHintType.SelectList,
	 *      mutable: true,
	 *      options: ['red', 'green', 'blue'],
	 *   },
	 *   user: {
	 *      type: coda.ValueType.String,
	 *      codaType: coda.ValueHintType.SelectList,
	 *      mutable: true,
	 *      options: async function (context) {
	 *        let url = coda.withQueryParams("https://example.com/userSearch", { name: context.search });
	 *        let response = await context.fetcher.fetch({ method: "GET", url: url });
	 *        let results = response.body.users;
	 *        return results.map(user => {display: user.name, value: user.id})
	 *      },
	 *   },
	 * }
	 * ```
	 */
	options?: PropertySchemaOptions<T>;
}
export type PropertyWithAutocompleteWithOptionalDisplay<T extends PackFormulaResult> = PropertyWithOptions<T | {
	display: string;
	value: T;
}>;
export interface BaseSchema {
	/**
	 * A explanation of this object schema property shown to the user in the UI.
	 *
	 * If your pack has an object schema with many properties, it may be useful to
	 * explain the purpose or contents of any property that is not self-evident.
	 */
	description?: string;
}
/**
 * A schema representing a return value or object property that is a boolean.
 */
export interface BooleanSchema extends BaseSchema {
	/** Identifies this schema as relating to a boolean value. */
	type: ValueType.Boolean;
	/** Indicates how to render values in a table. If not specified, renders a checkbox. */
	codaType?: BooleanHintTypes;
}
/**
 * The union of all schemas that can represent number values.
 */
export type NumberSchema = CurrencySchema | SliderSchema | ProgressBarSchema | ScaleSchema | NumericSchema | NumericDateSchema | NumericTimeSchema | NumericDateTimeSchema | NumericDurationSchema;
export interface BaseNumberSchema<T extends NumberHintTypes = NumberHintTypes> extends BaseSchema {
	/** Identifies this schema as relating to a number value. */
	type: ValueType.Number;
	/** An optional type hint instructing Coda about how to interpret or render this value. */
	codaType?: T;
}
/**
 * A schema representing a return value or object property that is a numeric value,
 * i.e. a raw number with an optional decimal precision.
 */
export interface NumericSchema extends BaseNumberSchema {
	/** If specified, instructs Coda to render this value as a percentage. */
	codaType?: ValueHintType.Percent;
	/** The decimal precision. The number will be rounded to this precision when rendered. */
	precision?: number;
	/** If specified, will render thousands separators for large numbers, e.g. `1,234,567.89`. */
	useThousandsSeparator?: boolean;
}
/**
 * A schema representing a return value or object property that is provided as a number,
 * which Coda should interpret as a date. The given number should be in seconds since the Unix epoch.
 */
export interface NumericDateSchema extends BaseNumberSchema<ValueHintType.Date> {
	/** Instructs Coda to render this value as a date. */
	codaType: ValueHintType.Date;
	/**
	 * A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format,
	 * used when rendering the value.
	 *
	 * Only applies when this is used as a sync table property.
	 */
	format?: string;
}
/**
 * A schema representing a return value or object property that is provided as a number,
 * which Coda should interpret as a time. The given number should be in seconds since the Unix epoch.
 * While this is a full datetime, only the time component will be rendered, so the date used is irrelevant.
 */
export interface NumericTimeSchema extends BaseNumberSchema<ValueHintType.Time> {
	/** Instructs Coda to render this value as a time. */
	codaType: ValueHintType.Time;
	/**
	 * A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
	 * used when rendering the value.
	 *
	 * Only applies when this is used as a sync table property.
	 */
	format?: string;
}
/**
 * A schema representing a return value or object property that is provided as a number,
 * which Coda should interpret as a datetime. The given number should be in seconds since the Unix epoch.
 */
export interface NumericDateTimeSchema extends BaseNumberSchema<ValueHintType.DateTime> {
	/** Instructs Coda to render this value as a datetime. */
	codaType: ValueHintType.DateTime;
	/**
	 * A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format.
	 *
	 * Only applies when this is used as a sync table property.
	 */
	dateFormat?: string;
	/**
	 * A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
	 * used when rendering the value.
	 *
	 * Only applies when this is used as a sync table property.
	 */
	timeFormat?: string;
}
/**
 * A schema representing a return value or object property that is provided as a number,
 * which Coda should interpret as a duration. The given number should be an amount of days
 * (fractions allowed).
 */
export interface NumericDurationSchema extends BaseNumberSchema<ValueHintType.Duration> {
	/** Instructs Coda to render this value as a duration. */
	codaType: ValueHintType.Duration;
	/**
	 * A refinement of {@link DurationSchema.maxUnit} to use for rounding the duration when rendering.
	 * Currently only `1` is supported, which is the same as omitting a value.
	 */
	precision?: number;
	/**
	 * The unit to use for rounding the duration when rendering. For example, if using `DurationUnit.Days`,
	 * and a value of 273600 is provided (3 days 4 hours) is provided, it will be rendered as "3 days".
	 */
	maxUnit?: DurationUnit;
}
/**
 * Enumeration of formats supported by schemas that use {@link ValueHintType.Currency}.
 *
 * These affect how a numeric value is rendered in docs.
 */
export declare enum CurrencyFormat {
	/**
	 * Indicates the value should be rendered as a number with a currency symbol as a prefix, e.g. `$2.50`.
	 */
	Currency = "currency",
	/**
	 * Indicates the value should be rendered as a number with a currency symbol as a prefix, but padded
	 * to allow the numeric values to line up vertically, e.g.
	 *
	 * ```
	 * $       2.50
	 * $      29.99
	 * ```
	 */
	Accounting = "accounting",
	/**
	 * Indicates the value should be rendered as a number without a currency symbol, e.g. `2.50`.
	 */
	Financial = "financial"
}
/**
 * A schema representing a return value or object property that is an amount of currency.
 */
export interface CurrencySchema extends BaseNumberSchema<ValueHintType.Currency> {
	/** Instructs Coda to render this value as a currency amount. */
	codaType: ValueHintType.Currency;
	/** The decimal precision. The value is rounded to this precision when rendered. */
	precision?: number;
	/**
	 * A three-letter ISO 4217 currency code, e.g. USD or EUR.
	 * If the currency code is not supported by Coda, the value will be rendered using USD.
	 */
	currencyCode?: string;
	/** A render format for further refining how the value is rendered. */
	format?: CurrencyFormat;
}
/**
 * A schema representing a return value or object property that is a number that should
 * be rendered as a slider.
 */
export interface SliderSchema extends BaseNumberSchema<ValueHintType.Slider> {
	/** Instructs Coda to render this value as a slider. */
	codaType: ValueHintType.Slider;
	/** The minimum value selectable by this slider. */
	minimum?: number | string;
	/** The maximum value selectable by this slider. */
	maximum?: number | string;
	/** The minimum amount the slider can be moved when dragged. */
	step?: number | string;
	/** Whether to display the underlying numeric value in addition to the slider. */
	showValue?: boolean;
}
/**
 * A schema representing a return value or object property that is a number that should
 * be rendered as a progress bar.
 */
export interface ProgressBarSchema extends BaseNumberSchema<ValueHintType.ProgressBar> {
	/** Instructs Coda to render this value as a progress bar. */
	codaType: ValueHintType.ProgressBar;
	/** The minimum value selectable by this progress bar. */
	minimum?: number | string;
	/** The maximum value selectable by this progress bar. */
	maximum?: number | string;
	/** The minimum amount the progress bar can be moved when dragged. */
	step?: number | string;
	/** Whether to display the underlying numeric value in addition to the progress bar. */
	showValue?: boolean;
}
/**
 * Icons that can be used with a {@link ScaleSchema}.
 *
 * For example, to render a star rating, use a {@link ScaleSchema} with `icon: coda.ScaleIconSet.Star`.
 */
export declare enum ScaleIconSet {
	Star = "star",
	Circle = "circle",
	Fire = "fire",
	Bug = "bug",
	Diamond = "diamond",
	Bell = "bell",
	ThumbsUp = "thumbsup",
	Heart = "heart",
	Chili = "chili",
	Smiley = "smiley",
	Lightning = "lightning",
	Currency = "currency",
	Coffee = "coffee",
	Person = "person",
	Battery = "battery",
	Cocktail = "cocktail",
	Cloud = "cloud",
	Sun = "sun",
	Checkmark = "checkmark",
	LightBulb = "lightbulb"
}
/**
 * A schema representing a return value or object property that is a number that should
 * be rendered as a scale.
 *
 * A scale is a widget with a repeated set of icons, where the number of shaded represents
 * a numeric value. The canonical example of a scale is a star rating, which might show
 * 5 star icons, with 3 of them shaded, indicating a value of 3.
 */
export interface ScaleSchema extends BaseNumberSchema<ValueHintType.Scale> {
	/** Instructs Coda to render this value as a scale. */
	codaType: ValueHintType.Scale;
	/** The number of icons to render. */
	maximum?: number;
	/** The icon to render. */
	icon?: ScaleIconSet;
}
/**
 * Display types that can be used with an {@link EmailSchema}.
 */
export declare enum EmailDisplayType {
	/**
	 * Display both icon and email (default).
	 */
	IconAndEmail = "iconAndEmail",
	/**
	 * Display icon only.
	 */
	IconOnly = "iconOnly",
	/**
	 * Display email address only.
	 */
	EmailOnly = "emailOnly"
}
/**
 * A schema representing a return value or object property that is an email address.
 *
 * An email address can be represented visually as an icon, an icon plus the email address, or
 * the just the email address.  Autocomplete against previously typed domain names is
 * also an option in the user interface.
 */
export interface EmailSchema extends BaseStringSchema<ValueHintType.Email> {
	/** Instructs Coda to render this value as an email address. */
	codaType: ValueHintType.Email;
	/** How the email should be displayed in the UI. */
	display?: EmailDisplayType;
}
/**
 * Display types that can be used with a {@link LinkSchema}.
 */
export declare enum LinkDisplayType {
	/**
	 * Display icon only.
	 */
	IconOnly = "iconOnly",
	/**
	 * Display URL.
	 */
	Url = "url",
	/**
	 * Display web page title.
	 */
	Title = "title",
	/**
	 * Display the referenced web page as a card.
	 */
	Card = "card",
	/**
	 * Display the referenced web page as an embed.
	 */
	Embed = "embed"
}
/**
 * A schema representing a return value or object property that is a hyperlink.
 *
 * The link can be displayed in the UI in multiple ways, as per the above enumeration.
 */
export interface LinkSchema extends BaseStringSchema<ValueHintType.Url> {
	/** Instructs Coda to render this value as a hyperlink. */
	codaType: ValueHintType.Url;
	/** How the URL should be displayed in the UI. */
	display?: LinkDisplayType;
	/** Whether to force client embedding (only for LinkDisplayType.Embed) - for example, if user login required. */
	force?: boolean;
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as a date. Coda is able to flexibly parse a number of formal
 * and informal string representations of dates. For maximum accuracy, consider using an
 * ISO 8601 date string (e.g. 2021-10-29): https://en.wikipedia.org/wiki/ISO_8601.
 */
export interface StringDateSchema extends BaseStringSchema<ValueHintType.Date> {
	/** Instructs Coda to render this value as a date. */
	codaType: ValueHintType.Date;
	/**
	 * A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format,
	 * used when rendering the value.
	 *
	 * Only applies when this is used as a sync table property.
	 */
	format?: string;
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as an embed value (e.g. a URL). Coda uses an external provider (iframely)
 * to handle all embeds by default. If there is no support for a given embed that you want to use,
 * you will need to use the `force` option which falls back to a generic iframe.
 */
export interface StringEmbedSchema extends BaseStringSchema<ValueHintType.Embed> {
	/** Instructs Coda to render this value as an embed. */
	codaType: ValueHintType.Embed;
	/**
	 * Toggle whether to try to force embed the content in Coda. Should be kept to false for most cases.
	 *
	 * By default, we use an external provider (iframely) that supports and normalizes embeds for different sites.
	 * If you are trying to embed an uncommon site or one that is not supported by them,
	 * you can set this to `true` to tell Coda to force render the embed. This renders a sandboxed iframe for the embed
	 * but requires user consent per-domain to actually display the embed.
	 */
	force?: boolean;
}
/**
 * A schema representing a return value or object property that is provided as a string, which Coda should
 * interpret as its internal rich text value. For "canvas column" types, `isCanvas` should be set to `true`.
 * @hidden
 */
export interface CodaInternalRichTextSchema extends BaseStringSchema<ValueHintType.CodaInternalRichText> {
	/**
	 * Instructs Coda to render this value as internal rich text.
	 * @hidden
	 */
	codaType: ValueHintType.CodaInternalRichText;
	/**
	 * Whether this is a embedded canvas column type vs. a "normal" text column type.
	 * @hidden
	 */
	isCanvas?: boolean;
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as a time.
 */
export interface StringTimeSchema extends BaseStringSchema<ValueHintType.Time> {
	/** Instructs Coda to render this value as a date. */
	codaType: ValueHintType.Time;
	/**
	 * A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
	 * used when rendering the value.
	 *
	 * Only applies when this is used as a sync table property.
	 */
	format?: string;
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as a datetime. Coda is able to flexibly a parse number of formal
 * and informal string representations of dates. For maximum accuracy, consider using an
 * ISO 8601 datetime string (e.g. 2021-11-03T19:43:58): https://en.wikipedia.org/wiki/ISO_8601.
 */
export interface StringDateTimeSchema extends BaseStringSchema<ValueHintType.DateTime> {
	/** Instructs Coda to render this value as a date. */
	codaType: ValueHintType.DateTime;
	/**
	 * A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format,
	 * used when rendering the value.
	 *
	 * Only applies when this is used as a sync table property.
	 */
	dateFormat?: string;
	/**
	 * A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
	 * used when rendering the value.
	 *
	 * Only applies when this is used as a sync table property.
	 */
	timeFormat?: string;
}
/**
 * State of outline on images that can be used with a {@link ImageSchema}.
 */
export declare enum ImageOutline {
	/** Image is rendered without outline. */
	Disabled = "disabled",
	/** Image is rendered with outline. */
	Solid = "solid"
}
/**
 * State of corners on images that can be used with a {@link ImageSchema}.
 */
export declare enum ImageCornerStyle {
	/** Image is rendered with rounded corners. */
	Rounded = "rounded",
	/** Image is rendered with square corners. */
	Square = "square"
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as an image.
 */
export interface ImageSchema extends BaseStringSchema<ValueHintType.ImageReference | ValueHintType.ImageAttachment> {
	/** Instructs Coda to render this value as an Image. */
	codaType: ValueHintType.ImageReference | ValueHintType.ImageAttachment;
	/** ImageOutline type specifying style of outline on images. If unspecified, default is Solid. */
	imageOutline?: ImageOutline;
	/** ImageCornerStyle type specifying style of corners on images. If unspecified, default is Rounded. */
	imageCornerStyle?: ImageCornerStyle;
}
/**
 * Enumeration of units supported by duration schemas. See {@link DurationSchema.maxUnit}.
 */
export declare enum DurationUnit {
	/**
	 * Indications a duration as a number of days.
	 */
	Days = "days",
	/**
	 * Indications a duration as a number of hours.
	 */
	Hours = "hours",
	/**
	 * Indications a duration as a number of minutes.
	 */
	Minutes = "minutes",
	/**
	 * Indications a duration as a number of seconds.
	 */
	Seconds = "seconds"
}
/**
 * A schema representing a return value or object property that represents a duration. The value
 * should be provided as a string like "3 days" or "40 minutes 30 seconds".
 */
export interface DurationSchema extends BaseStringSchema<ValueHintType.Duration> {
	/**
	 * A refinement of {@link DurationSchema.maxUnit} to use for rounding the duration when rendering.
	 * Currently only `1` is supported, which is the same as omitting a value.
	 */
	precision?: number;
	/**
	 * The unit to use for rounding the duration when rendering. For example, if using `DurationUnit.Days`,
	 * and a value of "3 days 4 hours" is provided, it will be rendered as "3 days".
	 */
	maxUnit?: DurationUnit;
}
/**
 * A schema representing a value with selectable options.
 */
export interface StringWithOptionsSchema extends BaseStringSchema<ValueHintType.SelectList>, PropertyWithAutocompleteWithOptionalDisplay<string> {
	/** Instructs Coda to render this value as a select list. */
	codaType: ValueHintType.SelectList;
	/** Allow custom, user-entered strings in addition to {@link PropertyWithOptions.options}. */
	allowNewValues?: boolean;
}
export interface BaseStringSchema<T extends StringHintTypes = StringHintTypes> extends BaseSchema {
	/** Identifies this schema as a string. */
	type: ValueType.String;
	/** An optional type hint instructing Coda about how to interpret or render this value. */
	codaType?: T;
}
declare const SimpleStringHintValueTypes: readonly [
	ValueHintType.Attachment,
	ValueHintType.Html,
	ValueHintType.Markdown,
	ValueHintType.Url,
	ValueHintType.Email,
	ValueHintType.CodaInternalRichText
];
export type SimpleStringHintTypes = (typeof SimpleStringHintValueTypes)[number];
/**
 * A schema whose underlying value is a string, along with an optional hint about how Coda
 * should interpret that string.
 */
export interface SimpleStringSchema<T extends SimpleStringHintTypes = SimpleStringHintTypes> extends BaseStringSchema<T> {
}
/**
 * The union of schema definition types whose underlying value is a string.
 */
export type StringSchema = StringDateSchema | StringTimeSchema | StringDateTimeSchema | CodaInternalRichTextSchema | DurationSchema | EmailSchema | ImageSchema | LinkSchema | StringEmbedSchema | SimpleStringSchema | StringWithOptionsSchema;
/**
 * A schema representing a return value or object property that is an array (list) of items.
 * The items are themselves schema definitions, which may refer to scalars or other objects.
 */
export interface ArraySchema<T extends Schema = Schema> extends BaseSchema {
	/** Identifies this schema as an array. */
	type: ValueType.Array;
	/** A schema for the items of this array. */
	items: T;
}
/**
 * Fields that may be set on a schema property in the {@link ObjectSchemaDefinition.properties} definition
 * of an object schema.
 */
export interface ObjectSchemaProperty {
	/**
	 * The name of a field in a return value object that should be re-mapped to this property.
	 * This provides a way to rename fields from API responses without writing code.
	 *
	 * Suppose that you're fetching an object from an API that has a property called "duration".
	 * But in your pack, you'd like the value to be called "durationSeconds" to be more precise.
	 * You could write code in your `execute` function to relabel the field, but you could
	 * also use `fromKey` and Coda will do it for you.
	 *
	 * Suppose your `execute` function looked like this:
	 * ```
	 * execute: async function(context) {
	 *   const response = await context.fetcher.fetch({method: "GET", url: "/api/some-entity"});
	 *   // Suppose the body of the response looks like {duration: 123, name: "foo"}.
	 *   return response.body;
	 * }
	 * ```
	 *
	 * You can define your schema like this:
	 * ```
	 * coda.makeObjectSchema({
	 *   properties: {
	 *     name: {type: coda.ValueType.String},
	 *     durationSeconds: {type: coda.ValueType.Number, fromKey: "duration"},
	 *   },
	 * });
	 * ```
	 *
	 * This tells Coda to transform your formula's return value, creating a field "durationSeconds"
	 * whose value comes another field called "duration".
	 */
	fromKey?: string;
	/**
	 * When true, indicates that an object return value for a formula that has this schema must
	 * include a non-empty value for this property.
	 */
	required?: boolean;
	/**
	 * Whether this object schema property is editable by the user in the UI.
	 */
	mutable?: boolean;
	/**
	 * Optional fixed id for this property, used to support renames of properties over time. If specified,
	 * changes to the name of this property will not cause the property to be treated as a new property.
	 * Only supported for top-level properties of a sync table.
	 * Note that fixedIds must already be present on the existing schema prior to rolling out a name change in a
	 * new schema; adding fixedId and a name change in a single schema version change will not work.
	 */
	fixedId?: string;
	/**
	 * For internal use only, Pack makers cannot set this. It is auto-populated at build time
	 * and if somehow there were a value here it would be overwritten.
	 * Coda table schemas use a normalized version of a property key, so this field is used
	 * internally to track what the Pack maker used as the property key, verbatim.
	 * E.g., if a sync table schema had `properties: { 'foo-bar': {type: coda.ValueType.String} }`,
	 * then the resulting column name would be "FooBar", but 'foo-bar' will be persisted as
	 * the `originalKey`.
	 * When we distinguish schema definitions from runtime schemas, this should be non-optional in the
	 * runtime interface.
	 * @hidden
	 */
	originalKey?: string;
}
/**
 * The type of the {@link ObjectSchemaDefinition.properties} in the definition of an object schema.
 * This is essentially a dictionary mapping the name of a property to a schema
 * definition for that property.
 */
export type ObjectSchemaProperties<K extends string = never> = {
	[K2 in K | string]: Schema & ObjectSchemaProperty;
};
/** @hidden */
export type GenericObjectSchema = ObjectSchema<string, string>;
/**
 * An identifier for a schema, allowing other schemas to reference it.
 *
 * You may optionally specify an {@link ObjectSchemaDefinition.identity} when defining an object schema.
 * This signals that this schema represents an important named entity in the context of your pack.
 * Schemas with identities may be referenced by other schemas, in which case Coda
 * will render such values as @-references in the doc, allowing you to create relationships
 * between entities.
 *
 * Every sync table's top-level schema is required to have an identity. However, an identity
 * will be created on your behalf using the {@link SyncTableOptions.identityName} that you provide in the sync
 * table definition, so you needn't explicitly create one unless desired.
 */
export interface IdentityDefinition {
	/**
	 * The name of this entity. This is an arbitrary name but should be unique within your pack.
	 * For example, if you are defining a schema that represents a user object, "User" would be a good identity name.
	 */
	name: string;
	/**
	 * The dynamic URL, if this is a schema for a dynamic sync table. When returning a schema from the
	 * {@link DynamicSyncTableOptions.getSchema} formula of a dynamic sync table, you must include
	 * the dynamic URL of that table, so that rows
	 * in this table may be distinguished from rows in another dynamic instance of the same table.
	 *
	 * When creating a reference to a dynamic sync table, you must include the dynamic URL of the table
	 * you wish to reference, again to distinguish which table instance you are trying to reference.
	 */
	dynamicUrl?: string;
	/** The ID of another pack, if you are trying to reference a value from different pack. */
	packId?: number;
	/** @deprecated See {@link ObjectSchemaDefinition.attribution} */
	attribution?: AttributionNode[];
}
/**
 * The runtime version of {@link IdentityDefinition} with the current Pack ID injected if a different
 * one isn't set by the maker.
 */
export interface Identity extends IdentityDefinition {
	packId: number;
}
/**
 * An identifier for a schema property for specifying labels along with the reference to the property.
 * This is useful for specifying a label for a property reference that uses a json path, where the
 * label of the underlying property might not be descriptive enough at the top-level object.
 */
export interface PropertyIdentifierDetails {
	/**
	 * An optional label for the property. This will be used in locations where the label appears with the property.
	 *
	 * If set to '', the label will be omitted.
	 */
	label?: string;
	/**
	 * An optional placeholder value, which will be rendered when the property value is an empty value
	 * (null, undefined, "", [], \{\}). This will be used in the Pack card title, subtitle, and snippet.
	 * Not accessible within the Coda formula language.
	 */
	placeholder?: string;
	/**
	 * The value of the property to reference. Can be either an exact property name or a json path.
	 */
	property: string;
}
/**
 * An identifier for the value of a property for use in the {@link PropertyIdentifierDetails.label} field.
 * When used, this will be substituted with the value of the property for the final output of the label.
 *
 * If not present, the label will be used as-is in the default label format of '\{label\}: \{VALUE\}'.
 */
export declare const PropertyLabelValueTemplate = "{VALUE}";
/**
 * An identifier for an object schema property that is comprised of either an exact property match with the top-level
 * `properties or a json path (https://github.com/json-path/JsonPath) to a nested property.
 */
export type PropertyIdentifier<K extends string = string> = K | string | PropertyIdentifierDetails;
/**
 * A schema definition for an object value (a value with key-value pairs).
 */
export interface ObjectSchemaDefinition<K extends string, L extends string> extends BaseSchema, PropertyWithOptions<{}> {
	/** Identifies this schema as an object schema. */
	type: ValueType.Object;
	/** Definition of the key-value pairs in this object. */
	properties: ObjectSchemaProperties<K | L>;
	/** @deprecated Use {@link ObjectSchemaDefinition.idProperty} */
	id?: K;
	/**
	 * The name of a property within {@link ObjectSchemaDefinition.properties} that represents a unique id for this
	 * object. Sync table schemas must specify an id property, which uniquely identify each synced row.
	 */
	idProperty?: K;
	/** @deprecated Use {@link ObjectSchemaDefinition.displayProperty} */
	primary?: K;
	/**
	 * The name of a property within {@link ObjectSchemaDefinition.properties} that be used to label this object in the
	 * UI.
	 * Object values can contain many properties and the Coda UI will display them as a "chip"
	 * with only the value of the "displayProperty" property used as the chip's display label.
	 * The other properties can be seen when hovering over the chip.
	 */
	displayProperty?: K;
	/**
	 * A hint for how Coda should interpret and render this object value.
	 *
	 * For example, an object can represent a person (user) in a Coda doc, with properties for the
	 * email address of the person and their name. Using `ValueHintType.Person` tells Coda to
	 * render such a value as an @-reference to that person, rather than a basic object chip.
	 */
	codaType?: ObjectHintTypes;
	/** @deprecated Use {@link ObjectSchemaDefinition.featuredProperties} */
	featured?: L[];
	/**
	 * A list of property names from within {@link ObjectSchemaDefinition.properties} for the "featured" properties
	 * of this object, used in sync tables. When a sync table is first added to a document,
	 * columns are created for each of the featured properties. The user can easily add additional
	 * columns for any other properties, as desired. All featured properties need to be top-level.
	 * If you can't or don't want to change the received data format, consider changing the
	 * received object after fetching and before returning and assigning it to the schema.
	 *
	 * This distinction exists for cases where a sync table may include dozens of properties,
	 * which would create a very wide table that is difficult to use. Featuring properties
	 * allows a sync table to be created with the most useful columns created by default,
	 * and the user can add additional columns as they find them useful.
	 *
	 * Non-featured properties can always be referenced in formulas regardless of whether column
	 * projections have been created for them.
	 */
	featuredProperties?: L[];
	/**
	 * An identity for this schema, if this schema is important enough to be named and referenced.
	 * See {@link IdentityDefinition}.
	 */
	identity?: IdentityDefinition;
	/**
	 * Attribution text, images, and/or links that should be rendered along with this value.
	 *
	 * See {@link makeAttributionNode}.
	 */
	attribution?: AttributionNode[];
	/**
	 * Specifies that object instances with this schema can contain additional properties not defined
	 * in the schema, and that the packs infrastructure should retain these unknown properties
	 * rather than stripping them.
	 *
	 * Properties not declared in the schema will not work properly in Coda: they cannot be
	 * used natively in the formula language and will not have correct types in Coda. But, in certain
	 * scenarios they can be useful.
	 */
	includeUnknownProperties?: boolean;
	/**
	 * The name of a property within {@link properties} that will be used as a title of a rich card preview
	 * for formulas that return this object.
	 * Defaults to the value of {@link ObjectSchemaDefinition.displayProperty} if not specified
	 *
	 * Must be a {@link ValueType.String} property
	 */
	titleProperty?: PropertyIdentifier<K>;
	/**
	 * The name of a property within {@link ObjectSchemaDefinition.properties} that will
	 * navigate users to more details about this object
	 *
	 * Must be a {@link ValueType.String} property with a {@link ValueHintType.Url}
	 * {@link ObjectSchemaDefinition.codaType}.
	 */
	linkProperty?: PropertyIdentifier<K>;
	/**
	 * A list of property names from within {@link ObjectSchemaDefinition.properties} for the properties of the object
	 * to be shown in the subtitle of a rich card preview for formulas that return this object.
	 * Defaults to the value of {@link ObjectSchemaDefinition.featuredProperties} if not specified.
	 */
	subtitleProperties?: Array<PropertyIdentifier<K>>;
	/**
	 * The name of a property within {@link ObjectSchemaDefinition.properties} that be used as a textual summary
	 * of the object.
	 *
	 * Must be a {@link ValueType.String} property or {@link ValueType.Array} of {@link ValueType.String}s.
	 */
	snippetProperty?: PropertyIdentifier<K>;
	/**
	 * The name of a property within {@link ObjectSchemaDefinition.properties} that can be used as a rich image preview of
	 * the object.
	 *
	 * Must be a {@link ValueType.String} property with the
	 * {@link ValueHintType.ImageAttachment} or {@link ValueHintType.ImageReference} hints
	 */
	imageProperty?: PropertyIdentifier<K>;
}
export type ObjectSchemaDefinitionType<K extends string, L extends string, T extends ObjectSchemaDefinition<K, L>> = ObjectSchemaType<T>;
/** @hidden */
export interface ObjectSchema<K extends string, L extends string> extends ObjectSchemaDefinition<K, L> {
	/**
	 * This overrides the `identity` field of ObjectSchemaDefinition with a type that also includes packId.
	 */
	identity?: Identity;
	/**
	 * Pack makers should never need to interact with this, it's just present for Coda's internal plumbing.
	 */
	__packId?: number;
}
/**
 * The type of content in this attribution node.
 *
 * Multiple attribution nodes can be rendered all together, for example to have
 * attribution that contains both text and a logo image.
 *
 * @see [Structuring data with schemas - Data attribution](https://coda.io/packs/build/latest/guides/advanced/schemas/#attribution)
 */
export declare enum AttributionNodeType {
	/**
	 * Text attribution content.
	 */
	Text = 1,
	/**
	 * A hyperlink pointing to the data source.
	 */
	Link = 2,
	/**
	 * An image, often a logo of the data source.
	 */
	Image = 3
}
/**
 * An attribution node that simply renders some text.
 *
 * This might be used to attribute the data source.
 *
 * @example
 * ```
 * coda.makeAttributionNode({
 *   type: coda.AttributionNodeType.Text,
 *   text: "Data provided by ExampleCorp.",
 * });
 * ```
 */
export interface TextAttributionNode {
	/** Identifies this as a text attribution node. */
	type: AttributionNodeType.Text;
	/** The text to render with the pack value. */
	text: string;
}
/**
 * An attribution node that renders a hyperlink.
 *
 * This might be used to attribute the data source and link back to the home page
 * of the data source or directly to the source data.
 *
 * @example
 * ```
 * coda.makeAttributionNode({
 *   type: coda.AttributionNodeType.Link,
 *   anchorUrl: "https://example.com",
 *   anchorText: "Data provided by ExampleCorp.",
 * });
 * ```
 */
export interface LinkAttributionNode {
	/** Identifies this as a link attribution node. */
	type: AttributionNodeType.Link;
	/** The URL to link to. */
	anchorUrl: string;
	/** The text of the hyperlink. */
	anchorText: string;
}
/**
 * An attribution node that renders as a hyperlinked image.
 *
 * This is often the logo of the data source along with a link back to the home page
 * of the data source or directly to the source data.
 *
 * @example
 * ```
 * coda.makeAttributionNode({
 *   type: coda.AttributionNodeType.Image,
 *   anchorUrl: "https://example.com",
 *   imageUrl: "https://example.com/assets/logo.png",
 * });
 * ```
 */
export interface ImageAttributionNode {
	/** Identifies this as an image attribution node. */
	type: AttributionNodeType.Image;
	/** The URL to link to. */
	anchorUrl: string;
	/** The URL of the image to render. */
	imageUrl: string;
}
/**
 * Union of attribution node types for rendering attribution for a pack value. See {@link makeAttributionNode}.
 */
export type AttributionNode = TextAttributionNode | LinkAttributionNode | ImageAttributionNode;
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
export declare function makeAttributionNode<T extends AttributionNode>(node: T): T;
/**
 * The union of all of the schema types supported for return values and object properties.
 */
export type Schema = BooleanSchema | NumberSchema | StringSchema | ArraySchema | GenericObjectSchema;
export type PickOptional<T, K extends keyof T> = Partial<T> & {
	[P in K]: T[P];
};
export interface StringHintTypeToSchemaTypeMap {
	[ValueHintType.Date]: Date | string | number;
}
export type StringHintTypeToSchemaType<T extends StringHintTypes | undefined> = T extends keyof StringHintTypeToSchemaTypeMap ? StringHintTypeToSchemaTypeMap[T] : string;
export type SchemaWithNoFromKey<T extends ObjectSchemaDefinition<any, any>> = {
	[K in keyof T["properties"] as T["properties"][K] extends {
		fromKey: string;
	} ? never : K]: T["properties"][K];
};
export type SchemaFromKeyWildCard<T extends ObjectSchemaDefinition<any, any>> = {
	[K in keyof T["properties"] as T["properties"][K] extends {
		fromKey: string;
	} ? string : never]: any;
};
export type ObjectSchemaNoFromKeyType<T extends ObjectSchemaDefinition<any, any>, P extends SchemaWithNoFromKey<T> = SchemaWithNoFromKey<T>> = PickOptional<{
	[K in keyof P]: SchemaType<P[K]>;
}, $Values<{
	[K in keyof P]: P[K] extends {
		required: true;
	} ? K : never;
}>>;
export type ObjectSchemaType<T extends ObjectSchemaDefinition<any, any>> = ObjectSchemaNoFromKeyType<T> & SchemaFromKeyWildCard<T>;
/**
 * A TypeScript helper that parses the expected `execute` function return type from a given schema.
 * That is, given a schema, this utility will produce the type that an `execute` function should return
 * in order to fulfill the schema.
 *
 * For example, `SchemaType<NumberSchema>` produces the type `number`.
 *
 * For an object schema, this will for the most part return an object matching the schema
 * but if the schema uses {@link ObjectSchemaProperty.fromKey} then this utility will be unable to infer
 * that the return value type should use the property names given in the `fromKey`
 * attribute, and will simply relax any property name type-checking in such a case.
 *
 * This utility is very optional and only useful for advanced cases of strong typing.
 * It can be helpful for adding type-checking for the return value of an `execute` function
 * to ensure that it matches the schema you have declared for that formula.
 */
export type SchemaType<T extends Schema> = T extends BooleanSchema ? boolean : T extends NumberSchema ? number : T extends StringSchema ? StringHintTypeToSchemaType<T["codaType"]> : T extends ArraySchema ? Array<SchemaType<T["items"]>> : T extends GenericObjectSchema ? ObjectSchemaType<T> : never;
/** Primitive types for which {@link generateSchema} can infer a schema. */
export type InferrableTypes = boolean | number | string | object | boolean[] | number[] | string[] | object[];
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
export declare function generateSchema(obj: InferrableTypes): Schema;
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
export declare function makeSchema<T extends Schema>(schema: T): T;
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
export declare function makeObjectSchema<K extends string, L extends string, T extends Omit<ObjectSchemaDefinition<K, L>, "type">>(schemaDef: T & {
	type?: ValueType.Object;
}): T & {
	identity?: Identity;
	type: ValueType.Object;
};
/**
 * Convenience for creating a reference object schema from an existing schema for the
 * object. Copies over the identity, idProperty, and displayProperty from the schema,
 * and the subset of properties indicated by the idProperty and displayProperty.
 * A reference schema can always be defined directly, but if you already have an object
 * schema it provides better code reuse to derive a reference schema instead.
 */
export declare function makeReferenceSchemaFromObjectSchema(schema: ObjectSchemaDefinition<string, string> & ObjectSchemaProperty, identityName?: string): GenericObjectSchema & ObjectSchemaProperty;
/**
 * Convenience for defining the result schema for an action. The identity enables Coda to
 * update the corresponding sync table row, if it exists.
 * You could add the identity directly, but that would make the schema less re-usable.
 */
export declare function withIdentity(schema: GenericObjectSchema, identityName: string): GenericObjectSchema;
/**
 * Configuration for how to construct an HTTP request for a code-free formula definition
 * created using {@link makeTranslateObjectFormula}.
 *
 * @example
 * ```
 * coda.makeTranslateObjectFormula({
 *   name: "FetchWidget",
 *   description: "Fetches a widget.",
 *   parameters: [
 *     coda.makeParameter({type: coda.ParameterType.String, name: "id"}),
 *     coda.makeParameter({type: coda.ParameterType.String, name: "outputFormat"}),
 *   ],
 *   request: {
 *     method: "GET",
 *     url: "https://example.com/api/widgets/{id}",
 *     nameMapping: {outputFormat: "format"},
 *     transforms: {
 *       format: function(value) {
 *         return value.toLowerCase();
 *       },
 *     },
 *     queryParams: ["format"],
 *   },
 * });
 * ```
 *
 * If the user calls this formula as `FetchWidget("abc123", "JSON")`, this will make a `GET` request to
 * `https://example.com/api/widgets/abc123?format=json`.
 */
export interface RequestHandlerTemplate {
	/**
	 * The URL to fetch.
	 *
	 * The path of the URL can include strong formatting directives that can be replaced with
	 * formula parameters, e.g. "https://example.com/api/\{name\}".
	 */
	url: string;
	/**
	 * The HTTP method (verb) to use, e.g. "GET".
	 *
	 * If making a POST request or any request that uses a body payload, the body is
	 * assumed to be JSON.
	 */
	method: FetchMethodType;
	/** Any HTTP headers to include in the request. */
	headers?: {
		[header: string]: string;
	};
	/**
	 * An optional mapping from the name of a formula parameter to the name of a URL parameter
	 * or template substitution variable in the body or URL path.
	 *
	 * Fetcher requests are constructed by inserting the user's parameter values into the URL
	 * or body. You may use the formula parameter names to in your insertion templates or
	 * as URL parameter names, but you may also use this mapping to rename the formula
	 * parameters, if you wish to refer to them differently in your implementation
	 * than how you present them to users.
	 */
	nameMapping?: {
		[functionParamName: string]: string;
	};
	/**
	 * Optional transformations to apply to formula parameters. By default formula parameters
	 * are passed through as-is to wherever you indicate in the fetcher request. However, if
	 * you wish to tweak their values before constructing the request, you can apply transformations here.
	 * The key is the name of the field, which is either the name of the formula parameter, or
	 * the mapped name for that parameter if you specified a {@link nameMapping}.
	 * The value is a JavaScript function that takes a user-provided parameter value and returns the value
	 * that should be used in the request.
	 */
	transforms?: {
		[name: string]: (val: any) => any;
	};
	/**
	 * The names of parameters that should be included in the request URL.
	 *
	 * That is, if some of the formula parameters should go into the URL and others should go into the body,
	 * specify the subset of parameters here that should go into the URL. If all of the formula parameters
	 * should become URL parameters, list all of the parameter names here.
	 *
	 * These are the mapped names if you are using {@link nameMapping}.
	 */
	queryParams?: string[];
	/**
	 * A base JavaScript object to be used as the body payload. Any parameters named in {@link bodyParams}
	 * will be merged into this object, and the resulting object will be stringified and sent as the body.
	 */
	bodyTemplate?: object;
	/**
	 * The names of parameters that should be included in the request body, if applicable.
	 *
	 * That is, if some of the formula parameters should go into the URL and others should go into the body,
	 * specify the subset of parameters here that should go into the body. If all of the formula parameters
	 * should go into the body, list all of the parameter names here.
	 *
	 * These are the mapped names if you are using {@link nameMapping}.
	 */
	bodyParams?: string[];
}
/**
 * Configuration for how to handle the response for a code-free formula definition
 * created using {@link makeTranslateObjectFormula}.
 */
export interface ResponseHandlerTemplate<T extends Schema> {
	/** The schema of the objects being returned. */
	schema?: T;
	/**
	 * The key in the response body that indicates the objects of interest.
	 *
	 * Sometimes the response body is itself an array of objects, allowing you
	 * to return the body as-is, but more commonly, the response body is
	 * an object where one of its properties is the array of objects of interest,
	 * with other properties containing metadata about the response.
	 *
	 * This allows you to specify a response property name to "project" out
	 * the relevant part of the response body.
	 *
	 * For example, suppose the response body looks like:
	 * ```
	 * {
	 *   items: [{name: "Alice"}, {name: "Bob"}],
	 *   nextPageUrl: "/users?page=2",
	 * }
	 * ```
	 *
	 * You would set `projectKey: "items"` and the generated formula implementation
	 * will return `response.body.items`.
	 */
	projectKey?: string;
	/**
	 * If specified, will catch HTTP errors and call this function with the error,
	 * instead of letting them throw and the formula failing.
	 */
	onError?(error: Error): any;
}
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
 * A map of named property options methods for a particular sync table. The names need to match
 * the values stored in the object schema. For the name, we use the property's name so that
 * it'll be consistent across pack versions. In the future if we want to support packs
 * being able to rename an existing property, we could try to set the names to the old
 * property names. Alternatively, we could just say that property options will briefly stop
 * working until the sync table is refereshed so its schema matches the current pack release's
 * schema.
 */
export interface SyncTablePropertyOptions {
	[name: string]: PropertyOptionsMetadataFormula<any>;
}
/**
 * The result of defining a sync table. Should not be necessary to use directly,
 * instead, define sync tables using {@link makeSyncTable}.
 */
export interface SyncTableDef<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> {
	/** See {@link SyncTableOptions.name} */
	name: string;
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
	getter: SyncFormula<K, L, ParamDefsT, SchemaT>;
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
}
/**
 * Type definition for a Dynamic Sync Table. Should not be necessary to use directly,
 * instead, define dynamic sync tables using {@link makeDynamicSyncTable}.
 */
export interface DynamicSyncTableDef<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> extends SyncTableDef<K, L, ParamDefsT, SchemaT> {
	/** Identifies this sync table as dynamic. */
	isDynamic: true;
	/** See {@link DynamicSyncTableOptions.getSchema} */
	getSchema: MetadataFormula;
	/** See {@link DynamicSyncTableOptions.getName} */
	getName: MetadataFormula;
	/** See {@link DynamicSyncTableOptions.getDisplayUrl} */
	getDisplayUrl: MetadataFormula;
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
 * Type definition for the formula that implements a sync table.
 * Should not be necessary to use directly, see {@link makeSyncTable}
 * for defining a sync table.
 */
export type GenericSyncFormula = SyncFormula<any, any, ParamDefs, any>;
/**
 * Type definition for the return value of a sync table.
 * Should not be necessary to use directly, see {@link makeSyncTable}
 * for defining a sync table.
 */
export type GenericSyncFormulaResult = SyncFormulaResult<any, any, any>;
/**
 * Type definition for a static (non-dynamic) sync table.
 * Should not be necessary to use directly, see {@link makeSyncTable}
 * for defining a sync table.
 */
export type GenericSyncTable = SyncTableDef<any, any, ParamDefs, any>;
/**
 * Type definition for a dynamic sync table.
 * Should not be necessary to use directly, see {@link makeDynamicSyncTable}
 * for defining a sync table.
 */
export type GenericDynamicSyncTable = DynamicSyncTableDef<any, any, ParamDefs, any>;
/**
 * Union of type definitions for sync tables..
 * Should not be necessary to use directly, see {@link makeSyncTable} or {@link makeDynamicSyncTable}
 * for defining a sync table.
 */
export type SyncTable = GenericSyncTable | GenericDynamicSyncTable;
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
export type ParameterOptions<T extends ParameterType> = Omit<ParamDef<ParameterTypeMap[T]>, "type" | "autocomplete"> & {
	type: T;
	autocomplete?: T extends AutocompleteParameterTypes ? MetadataFormulaDef | Array<TypeMap[AutocompleteParameterTypeMapping[T]] | SimpleAutocompleteOption<T>> : undefined;
};
/**
 * Equivalent to {@link ParamDef}. A helper type to generate a param def based
 * on the inputs to {@link makeParameter}.
 */
export type ParamDefFromOptionsUnion<T extends ParameterType, O extends ParameterOptions<T>> = Omit<O, "type" | "autocomplete"> & {
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
/**
 * Base type for the inputs for creating a pack formula.
 */
export interface PackFormulaDef<ParamsT extends ParamDefs, ResultT extends PackFormulaResult> extends CommonPackFormulaDef<ParamsT> {
	/** The JavaScript function that implements this formula */
	execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<ResultT> | ResultT;
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
export interface ObjectArrayFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema> extends Omit<PackFormulaDef<ParamsT, SchemaType<SchemaT>>, "execute"> {
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
export interface EmptyFormulaDef<ParamsT extends ParamDefs> extends Omit<PackFormulaDef<ParamsT, string>, "execute"> {
	/** A definition of the request and any parameter transformations to make in order to implement this formula. */
	request: RequestHandlerTemplate;
}
/** The base class for pack formula descriptors. Subclasses vary based on the return type of the formula. */
export type BaseFormula<ParamDefsT extends ParamDefs, ResultT extends PackFormulaResult> = PackFormulaDef<ParamDefsT, ResultT> & {
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
export type ObjectPackFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema> = Omit<BaseFormula<ParamDefsT, SchemaType<SchemaT>>, "execute"> & {
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
export type PackFormulaMetadata = Omit<TypedPackFormula, "execute" | "executeUpdate">;
/** @hidden */
export type ObjectPackFormulaMetadata = Omit<TypedObjectPackFormula, "execute">;
/**
 * The return value from the formula that implements a sync table. Each sync formula invocation
 * returns one reasonable size page of results. The formula may also return a continuation, indicating
 * that the sync formula should be invoked again to get a next page of results. Sync functions
 * are called repeatedly until there is no continuation returned.
 */
export interface SyncFormulaResult<K extends string, L extends string, SchemaT extends ObjectSchemaDefinition<K, L>> {
	/** The list of results from this page. */
	result: Array<ObjectSchemaDefinitionType<K, L, SchemaT>>;
	/**
	 * A marker indicating where the next sync formula invocation should pick up to get the next page of results.
	 * The contents of this object are entirely of your choosing. Sync formulas are called repeatedly
	 * until there is no continuation returned.
	 */
	continuation?: Continuation;
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
 * Inputs for creating the formula that implements a sync table.
 */
export interface SyncFormulaDef<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchemaDefinition<K, L>> extends CommonPackFormulaDef<ParamDefsT> {
	/**
	 * The JavaScript function that implements this sync.
	 *
	 * This function takes in parameters and a sync context which may have a continuation
	 * from a previous invocation, and fetches and returns one page of results, as well
	 * as another continuation if there are more result to fetch.
	 */
	execute(params: ParamValues<ParamDefsT>, context: SyncExecutionContext): Promise<SyncFormulaResult<K, L, SchemaT>>;
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
	updateOptions?: Pick<CommonPackFormulaDef<ParamDefsT>, "extraOAuthScopes">;
}
/**
 * The result of defining the formula that implements a sync table.
 *
 * There is no need to use this type directly. You provide a {@link SyncFormulaDef} as an
 * input to {@link makeSyncTable} which outputs definitions of this type.
 */
export type SyncFormula<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> = SyncFormulaDef<K, L, ParamDefsT, SchemaT> & {
	resultType: TypeOf<SchemaType<SchemaT>>;
	isSyncFormula: true;
	schema?: ArraySchema;
	supportsUpdates?: boolean;
};
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
export declare function makeFormula<ParamDefsT extends ParamDefs, ResultT extends ValueType, SchemaT extends Schema = Schema>(fullDefinition: FormulaDefinition<ParamDefsT, ResultT, SchemaT>): Formula<ParamDefsT, ResultT, SchemaT>;
/**
 * Base type for formula definitions accepted by {@link makeFormula}.
 */
export interface BaseFormulaDef<ParamDefsT extends ParamDefs, ResultT extends string | number | boolean | object> extends PackFormulaDef<ParamDefsT, ResultT> {
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
 * A definition accepted by {@link makeFormula} for a formula that returns a string.
 */
export type StringFormulaDef<ParamDefsT extends ParamDefs> = BaseFormulaDef<ParamDefsT, string> & {
	resultType: ValueType.String;
	execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<string> | string;
} & ({
	schema?: StringSchema;
} | {
	codaType?: StringHintTypes;
});
/**
 * A definition accepted by {@link makeFormula} for a formula that returns a number.
 */
export type NumericFormulaDef<ParamDefsT extends ParamDefs> = BaseFormulaDef<ParamDefsT, number> & {
	resultType: ValueType.Number;
	execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<number> | number;
} & ({
	schema?: NumberSchema;
} | {
	codaType?: NumberHintTypes;
});
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
 * A formula definition accepted by {@link makeFormula}.
 */
export type FormulaDefinition<ParamDefsT extends ParamDefs, ResultT extends ValueType, SchemaT extends Schema> = ResultT extends ValueType.String ? StringFormulaDef<ParamDefsT> : ResultT extends ValueType.Number ? NumericFormulaDef<ParamDefsT> : ResultT extends ValueType.Boolean ? BooleanFormulaDef<ParamDefsT> : ResultT extends ValueType.Array ? ArrayFormulaDef<ParamDefsT, SchemaT> : ObjectFormulaDef<ParamDefsT, SchemaT>;
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
	__brand: "MetadataContext";
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
export type MetadataFormula = BaseFormula<[
	ParamDef<Type.string>,
	ParamDef<Type.string>
], any> & {
	schema?: any;
};
/**
 * Formula implementing property options.
 * These are constructed by {@link makePropertyOptionsFormula}.
 * @hidden
 */
export type PropertyOptionsMetadataFormula<SchemaT extends Schema> = ObjectPackFormula<[
], ArraySchema<SchemaT>> & {
	execute(params: ParamValues<[
	]>, context: PropertyOptionsExecutionContext): Promise<object> | object;
};
export type MetadataFormulaMetadata = Omit<MetadataFormula, "execute">;
/**
 * A JavaScript function that can implement a {@link MetadataFormulaDef}.
 */
export type MetadataFunction = (context: ExecutionContext, search: string, formulaContext?: MetadataContext) => Promise<MetadataFormulaResultType | MetadataFormulaResultType[] | ArraySchema | ObjectSchema<any, any>>;
/**
 * The type of values that will be accepted as a metadata formula definition. This can either
 * be the JavaScript function that implements a metadata formula (strongly recommended)
 * or a full metadata formula definition (mostly supported for legacy code).
 */
export type MetadataFormulaDef = MetadataFormula | MetadataFunction;
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
export declare function makeMetadataFormula(execute: MetadataFunction, options?: {
	connectionRequirement?: ConnectionRequirement;
}): MetadataFormula;
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
	 * does not require a {@link Sync.dynamicUrl}.
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
export interface SyncTableOptions<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchemaDefinition<K, L>> {
	/**
	 * The name of the sync table. This is shown to users in the Coda UI.
	 * This should describe the entities being synced. For example, a sync table that syncs products
	 * from an e-commerce platform should be called 'Products'. This name must not contain spaces.
	 */
	name: string;
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
	formula: SyncFormulaDef<K, L, ParamDefsT, SchemaT>;
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
}
/**
 * Options provided when defining a dynamic sync table.
 */
export interface DynamicSyncTableOptions<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchemaDefinition<K, L>> {
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
	getName: MetadataFormulaDef;
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
	getSchema: MetadataFormulaDef;
	/**
	 * A formula that that returns a browser-friendly url representing the
	 * resource being synced. The Coda UI links to this url as the source
	 * of the table data. This is typically a browser-friendly form of the
	 * `dynamicUrl`, which is typically an API url.
	 */
	getDisplayUrl: MetadataFormulaDef;
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
	formula: SyncFormulaDef<K, L, ParamDefsT, SchemaT>;
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
}>({ name, description, identityName, schema: inputSchema, formula, connectionRequirement, dynamicOptions, }: SyncTableOptions<K, L, ParamDefsT, SchemaDefT>): SyncTableDef<K, L, ParamDefsT, SchemaT>;
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
export declare function makeDynamicSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchemaDefinition<K, L>>({ name, description, getName: getNameDef, getSchema: getSchemaDef, identityName, getDisplayUrl: getDisplayUrlDef, formula, listDynamicUrls: listDynamicUrlsDef, searchDynamicUrls: searchDynamicUrlsDef, entityName, connectionRequirement, defaultAddDynamicColumns, placeholderSchema: placeholderSchemaInput, propertyOptions, }: {
	name: string;
	description?: string;
	getName: MetadataFormulaDef;
	getSchema: MetadataFormulaDef;
	identityName: string;
	formula: SyncFormulaDef<K, L, ParamDefsT, any>;
	getDisplayUrl: MetadataFormulaDef;
	listDynamicUrls?: MetadataFormulaDef;
	searchDynamicUrls?: MetadataFormulaDef;
	entityName?: string;
	connectionRequirement?: ConnectionRequirement;
	defaultAddDynamicColumns?: boolean;
	placeholderSchema?: SchemaT;
	propertyOptions?: PropertyOptionsMetadataFunction<any>;
}): DynamicSyncTableDef<K, L, ParamDefsT, any>;
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
export declare function makeTranslateObjectFormula<ParamDefsT extends ParamDefs, ResultT extends Schema>({ response, ...definition }: ObjectArrayFormulaDef<ParamDefsT, ResultT>): {
	description: string;
	name: string;
	cacheTtlSecs?: number | undefined;
	parameters: ParamDefsT;
	varargParameters?: ParamDefs | undefined;
	examples?: {
		params: (PackFormulaValue | undefined)[];
		result: PackFormulaResult;
	}[] | undefined;
	isAction?: boolean | undefined;
	connectionRequirement?: ConnectionRequirement | undefined;
	network?: Network | undefined;
	isExperimental?: boolean | undefined;
	isSystem?: boolean | undefined;
	extraOAuthScopes?: string[] | undefined;
} & {
	execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<SchemaType<ResultT>>;
	resultType: Type.object;
	schema: ResultT | undefined;
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
export declare function makeEmptyFormula<ParamDefsT extends ParamDefs>(definition: EmptyFormulaDef<ParamDefsT>): {
	description: string;
	name: string;
	cacheTtlSecs?: number | undefined;
	parameters: ParamDefsT;
	varargParameters?: ParamDefs | undefined;
	examples?: {
		params: (PackFormulaValue | undefined)[];
		result: PackFormulaResult;
	}[] | undefined;
	isAction?: boolean | undefined;
	connectionRequirement?: ConnectionRequirement | undefined;
	network?: Network | undefined;
	isExperimental?: boolean | undefined;
	isSystem?: boolean | undefined;
	extraOAuthScopes?: string[] | undefined;
} & {
	execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<string>;
	resultType: Type.string;
};
/**
 * @deprecated Use `number` in new code.
 */
export type PackId = number;
declare enum PackCategory {
	CRM = "CRM",
	Calendar = "Calendar",
	Communication = "Communication",
	DataStorage = "DataStorage",
	Design = "Design",
	Financial = "Financial",
	Fun = "Fun",
	Geo = "Geo",
	IT = "IT",
	Mathematics = "Mathematics",
	Organization = "Organization",
	Recruiting = "Recruiting",
	Shopping = "Shopping",
	Social = "Social",
	Sports = "Sports",
	Travel = "Travel",
	Weather = "Weather"
}
/**
 * Authentication types supported by Coda Packs.
 *
 * @see [Authenticating with other services](https://coda.io/packs/build/latest/guides/basics/authentication/)
 * @see [Authentication samples](https://coda.io/packs/build/latest/samples/topic/authentication/)
 */
export declare enum AuthenticationType {
	/**
	 * Indicates this pack does not use authentication. You may also omit an authentication declaration entirely.
	 */
	None = "None",
	/**
	 * Authenticate using an HTTP header of the form `Authorization: Bearer <token>`.
	 *
	 * @see {@link HeaderBearerTokenAuthentication}
	 */
	HeaderBearerToken = "HeaderBearerToken",
	/**
	 * Authenticate using an HTTP header with a custom name and token prefix that you specify.
	 *
	 * @see {@link CustomHeaderTokenAuthentication}
	 */
	CustomHeaderToken = "CustomHeaderToken",
	/**
	 * Authenticate using multiple HTTP headers that you specify.
	 *
	 * @see {@link MultiHeaderTokenAuthentication}
	 */
	MultiHeaderToken = "MultiHeaderToken",
	/**
	 * Authenticate using a token that is passed as a URL parameter with each request, e.g.
	 * `https://example.com/api?paramName=token`.
	 *
	 * @see {@link QueryParamTokenAuthentication}
	 */
	QueryParamToken = "QueryParamToken",
	/**
	 * Authenticate using multiple tokens, each passed as a different URL parameter, e.g.
	 * `https://example.com/api?param1=token1&param2=token2`
	 *
	 * @see {@link MultiQueryParamTokenAuthentication}
	 */
	MultiQueryParamToken = "MultiQueryParamToken",
	/**
	 * Authenticate using OAuth2. This is the most common type of OAuth2, which involves the user approving access to
	 * their account before being granted a token.
	 * The API must use a (largely) standards-compliant implementation of OAuth2.
	 *
	 * @see {@link OAuth2Authentication}
	 */
	OAuth2 = "OAuth2",
	/**
	 * Authenticate using OAuth2 client credentials. This is a less common type of OAuth2,
	 * which involves exchanging a client ID and secret for a temporary access token.
	 *
	 * @see [OAuth2 client credentials spec](https://oauth.net/2/grant-types/client-credentials/)
	 * @see {@link OAuth2ClientCredentials}
	 */
	OAuth2ClientCredentials = "OAuth2ClientCredentials",
	/**
	 * Authenticate using HTTP Basic authorization. The user provides a username and password
	 * (sometimes optional) which are included as an HTTP header according to the Basic auth standard.
	 *
	 * @see {@link WebBasicAuthentication}
	 */
	WebBasic = "WebBasic",
	/**
	 * Authenticate in a custom way by having one or more arbitrary secret values inserted into the request URL, body,
	 * headers, or the form data using template replacement. Approval from Coda is required.
	 *
	 * @see {@link CustomAuthentication}
	 */
	Custom = "Custom",
	/**
	 * Authenticate to Amazon Web Services using an IAM access key id & secret access key pair.
	 *
	 * @see {@link AWSAccessKeyAuthentication}
	 */
	AWSAccessKey = "AWSAccessKey",
	/**
	 * Authenticate to Amazon Web Services by assuming an IAM role. This is not yet supported.
	 *
	 * @see {@link AWSAssumeRoleAuthentication}
	 * @hidden
	 */
	AWSAssumeRole = "AWSAssumeRole",
	/**
	 * Authenticate using a Coda REST API token, sent as an HTTP header.
	 *
	 * @see {@link CodaApiBearerTokenAuthentication}
	 */
	CodaApiHeaderBearerToken = "CodaApiHeaderBearerToken",
	/**
	 * Only for use by Coda-authored packs.
	 *
	 * @see {@link VariousAuthentication}
	 * @hidden
	 */
	Various = "Various"
}
/**
 * A pack or formula which does not use authentication.
 */
export interface NoAuthentication {
	/** Identifies this as not using authentication. You may also omit any definition to achieve the same result. */
	type: AuthenticationType.None;
}
/**
 * Configuration for a step that will run after the user sets up a new account
 * that fetches a set of endpoint domains that the user has access to and prompts
 * the user to select the one that should apply to this account.
 *
 * The selected endpoint domain is bound to this account and used as the root domain
 * of HTTP requests made by the fetcher. (Whenever an endpoint is associated with
 * an account, it is available at execution time as `context.endpoint`, and alternatively
 * can make fetcher requests using relative URLs and the fetcher will apply the endpoint
 * to the URL automatically.)
 *
 * As an example, we use this in the Jira pack to set up the Jira instance endpoint
 * to use with the user's account. A Jira account may have access to multiple
 * Jira instances; after authorizing the user account, this step makes an API call to
 * fetch all of the Jira instances that the user has access to, which are rendered as
 * options for the user, and the endpoint domain of the select option
 * (of the form <instance>.atlassian.net) is stored along with this account.
 */
export interface SetEndpoint {
	/** Identifies this as a SetEndpoint step. */
	type: PostSetupType.SetEndpoint;
	/**
	 * An arbitrary name for this step, to distinguish from other steps of the same type
	 * (exceedingly rare).
	 */
	name: string;
	/**
	 * A description to render to the user describing the selection they should be making,
	 * for example, "Choose an instance to use with this account".
	 */
	description: string;
	/**
	 * The formula that fetches endpoints for the user
	 * to select from. Like any {@link MetadataFormula}, this formula should return
	 * an array of options, either strings or objects of the form
	 * `{display: '<display name>', value: '<endpoint>'}` if wanting to render a display
	 * label to the user rather than rendering the underlying value directly.
	 */
	getOptions?: MetadataFormula;
	/** @deprecated Use {@link getOptions} */
	getOptionsFormula?: MetadataFormula;
}
/**
 * Simplified configuration for {@link SetEndpoint} that a pack developer can specify when calling
 * {@link PackDefinitionBuilder.setUserAuthentication} or {@link PackDefinitionBuilder.setSystemAuthentication}.
 */
export type SetEndpointDef = Omit<SetEndpoint, "getOptions" | "getOptionsFormula"> & {
	/** See {@link SetEndpoint.getOptions} */
	getOptions?: MetadataFormulaDef;
	/** @deprecated Use {@link getOptions} */
	getOptionsFormula?: MetadataFormulaDef;
};
/**
 * Enumeration of post-account-setup step types. See {@link PostSetup}.
 */
export declare enum PostSetupType {
	/**
	 * See {@link SetEndpoint}.
	 */
	SetEndpoint = "SetEndPoint"
}
/**
 * Definitions for optional steps that can happen upon a user completing setup
 * for a new account for this pack.
 *
 * This addresses only a highly-specific use case today but may grow to other
 * use cases and step types in the future.
 */
export type PostSetup = SetEndpoint;
/**
 * Simplified configuration for {@link PostSetup} that a pack developer can specify when calling
 * {@link PackDefinitionBuilder.setUserAuthentication} or {@link PackDefinitionBuilder.setSystemAuthentication}.
 */
export type PostSetupDef = SetEndpointDef;
/**
 * Base interface for authentication definitions.
 */
export interface BaseAuthentication {
	/**
	 * A function that is called when a user sets up a new account, that returns a name for
	 * the account to label that account in the UI. The users credentials are applied to any
	 * fetcher requests that this function makes. Typically, this function makes an API call
	 * to an API's "who am I" endpoint and returns a username.
	 *
	 * If omitted, or if the function returns an empty value, the account will be labeled
	 * with the creating user's Coda username.
	 */
	getConnectionName?: MetadataFormula;
	/**
	 * A function that is called when a user sets up a new account, that returns the ID of
	 * that account in the third-party system being called.
	 *
	 * This ID is not yet subsequently exposed to pack developers and is mostly for Coda
	 * internal use.
	 *
	 * @ignore
	 */
	getConnectionUserId?: MetadataFormula;
	/**
	 * A link to a help article or other page with more instructions about how to set up an account for this pack.
	 */
	instructionsUrl?: string;
	/**
	 * If true, indicates this has pack has a specific endpoint domain for each account, that is used
	 * as the basis of HTTP requests. For example, API requests are made to <custom-subdomain>.example.com
	 * rather than example.com. If true, the user will be prompted to provide their specific endpoint domain
	 * when creating a new account.
	 */
	requiresEndpointUrl?: boolean;
	/**
	 * When requiresEndpointUrl is set to true this should be the root domain that all endpoints share.
	 * For example, this value would be "example.com" if specific endpoints looked like \{custom-subdomain\}.example.com.
	 *
	 * For packs that make requests to multiple domains (uncommon), this should be the domain within
	 * {@link PackVersionDefinition.networkDomains} that this configuration applies to.
	 */
	endpointDomain?: string;
	/**
	 * One or more setup steps to run after the user has set up the account, before completing installation of the pack.
	 * This is not common.
	 */
	postSetup?: PostSetup[];
	/**
	 * Which domain(s) should get auth credentials, when a pack is configured with multiple domains.
	 * Packs configured with only one domain or with requiresEndpointUrl set to true can omit this.
	 *
	 * Using multiple authenticated network domains is uncommon and requires Coda approval.
	 */
	networkDomain?: string | string[];
}
/**
 * Authenticate using an HTTP header of the form `Authorization: Bearer <token>`.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.HeaderBearerToken,
 * });
 * ```
 *
 * @see [Authenticating with other services - Simple tokens](https://coda.io/packs/build/latest/guides/basics/authentication/#simple-tokens)
 * @see [Authentication samples - Authorization header](https://coda.io/packs/build/latest/samples/topic/authentication/#authorization-header)
 */
export interface HeaderBearerTokenAuthentication extends BaseAuthentication {
	/** Identifies this as HeaderBearerToken authentication. */
	type: AuthenticationType.HeaderBearerToken;
}
/**
 * Authenticate using a Coda REST API token, sent as an HTTP header.
 *
 * This is identical to {@link AuthenticationType.HeaderBearerToken} except the user wil be presented
 * with a UI to generate an API token rather than needing to paste an arbitrary API
 * token into a text input.
 *
 * This is primarily for use by Coda-authored packs, as it is only relevant for interacting with the
 * Coda REST API.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.CodaApiHeaderBearerToken,
 * });
 * ```
 *
 * @see [Authenticating with other services - Coda API token](https://coda.io/packs/build/latest/guides/basics/authentication/#coda-api-token)
 * @see [Authentication samples - Coda API token](https://coda.io/packs/build/latest/samples/topic/authentication/#coda-api-token)
 */
export interface CodaApiBearerTokenAuthentication extends BaseAuthentication {
	/** Identifies this as CodaApiHeaderBearerToken authentication. */
	type: AuthenticationType.CodaApiHeaderBearerToken;
	/**
	 * @deprecated
	 */
	deferConnectionSetup?: boolean;
	/**
	 * If true, automatically creates and configures an account with a Coda API token with
	 * default settings when installing the pack: a read-write token, added to the doc
	 * as a shared account that allows actions.
	 */
	shouldAutoAuthSetup?: boolean;
}
/**
 * Authenticate using an HTTP header with a custom name and token prefix that you specify.
 * The header name is defined in the {@link headerName} property.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.CustomHeaderToken,
 *   headerName: "X-API-Key",
 * });
 * ```
 *
 * @see [Authenticating with other services - Simple tokens](https://coda.io/packs/build/latest/guides/basics/authentication/#simple-tokens)
 * @see [Authentication samples - Custom header](https://coda.io/packs/build/latest/samples/topic/authentication/#custom-header)
 */
export interface CustomHeaderTokenAuthentication extends BaseAuthentication {
	/** Identifies this as CustomHeaderToken authentication. */
	type: AuthenticationType.CustomHeaderToken;
	/**
	 * The name of the HTTP header.
	 */
	headerName: string;
	/**
	 * An optional prefix in the HTTP header value before the actual token. Omit this
	 * if the token is the entirety of the header value.
	 *
	 * The HTTP header will be of the form `<headerName>: <tokenPrefix> <token>`
	 */
	tokenPrefix?: string;
}
/**
 * Authenticate using multiple HTTP headers that you specify.
 * Each header is specified with a name and an optional token prefix.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.MultiHeaderToken,
 *   headers: [
 *     {name: 'Header1', description: 'Enter the value for Header1',  tokenPrefix: 'prefix1'},
 *     {name: 'Header2', description: 'Enter value for Header2'},
 *   ],
 * });
 * ```
 */
export interface MultiHeaderTokenAuthentication extends BaseAuthentication {
	/** Identifies this as MultiHeaderToken authentication. */
	type: AuthenticationType.MultiHeaderToken;
	/**
	 * Names and descriptions of the headers used for authentication.
	 */
	headers: Array<{
		/**
		 * The name of the HTTP header.
		 */
		name: string;
		/**
		 * A description shown to the user indicating what value they should provide for this header.
		 */
		description: string;
		/**
		 * An optional prefix in the HTTP header value before the actual token. Omit this
		 * if the token is the entirety of the header value.
		 *
		 * The HTTP header will be of the form `<headerName>: <tokenPrefix> <token>`
		 */
		tokenPrefix?: string;
	}>;
}
/**
 * Authenticate using a token that is passed as a URL parameter with each request, e.g.
 * `https://example.com/api?paramName=token`.
 *
 * The parameter name is defined in the {@link paramName} property.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.QueryParamToken,
 *   paramName: "key",
 * });
 * ```
 *
 * @see [Authenticating with other services - Simple tokens](https://coda.io/packs/build/latest/guides/basics/authentication/#simple-tokens)
 * @see [Authentication samples - Query parameters](https://coda.io/packs/build/latest/samples/topic/authentication/#query-parameter)
 */
export interface QueryParamTokenAuthentication extends BaseAuthentication {
	/** Identifies this as QueryParamToken authentication. */
	type: AuthenticationType.QueryParamToken;
	/**
	 * The name of the query parameter that will include the token,
	 * e.g. "foo" if a token is passed as "foo=bar".
	 */
	paramName: string;
}
/**
 * Authenticate using multiple tokens, each passed as a different URL parameter, e.g.
 * `https://example.com/api?param1=token1&param2=token2`.
 *
 * The parameter names are defined in the {@link params} array property.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.MultiQueryParamToken,
 *   params: [
 *     { name: "key", description: "The key." },
 *     { name: "secret", description: "The secret." },
 *   ],
 * });
 * ```
 *
 * @see [Authenticating with other services - Simple tokens](https://coda.io/packs/build/latest/guides/basics/authentication/#simple-tokens)
 * @see [Authentication samples - Multiple query parameters](https://coda.io/packs/build/latest/samples/topic/authentication/#multiple-query-parameters)
 */
export interface MultiQueryParamTokenAuthentication extends BaseAuthentication {
	/** Identifies this as MultiQueryParamToken authentication. */
	type: AuthenticationType.MultiQueryParamToken;
	/**
	 * Names and descriptions of the query parameters used for authentication.
	 */
	params: Array<{
		/**
		 * The name of the query parameter, e.g. "foo" if a token is passed as "foo=bar".
		 */
		name: string;
		/**
		 * A description shown to the user indicating what value they should provide for this parameter.
		 */
		description: string;
	}>;
}
export interface BaseOAuthAuthentication extends BaseAuthentication {
	/**
	 * Scopes that are required to use this pack.
	 *
	 * Each API defines its own list of scopes, or none at all. You should consult
	 * the documentation for the API you are connecting to.
	 */
	scopes?: string[];
	/**
	 * In rare cases, OAuth providers may want the permission scopes in a different query parameter
	 * than `scope`.
	 */
	scopeParamName?: string;
	/**
	 * The delimiter to use when joining {@link scopes} when generating authorization URLs.
	 *
	 * The OAuth2 standard is to use spaces to delimit scopes, and Coda will do that by default.
	 * If the API you are using requires a different delimiter, say a comma, specify it here.
	 */
	scopeDelimiter?: " " | "," | ";";
	/**
	 * The URL that Coda will hit in order to exchange the temporary code for an access token.
	 */
	tokenUrl: string;
	/**
	 * In rare cases, OAuth providers send back access tokens nested inside another object in
	 * their authentication response.
	 */
	nestedResponseKey?: string;
	/**
	 * When making the token exchange request, where to pass the client credentials (client ID and
	 * client secret). The default is {@link TokenExchangeCredentialsLocation#Automatic}, which should
	 * work for most providers. Pick a more specific option if the provider invalidates authorization
	 * codes when there is an error in the token exchange.
	 */
	credentialsLocation?: TokenExchangeCredentialsLocation;
	/**
	 * A custom prefix to be used when passing the access token in the HTTP Authorization
	 * header when making requests. Typically this prefix is `Bearer` which is what will be
	 * used if this value is omitted. However, some services require a different prefix.
	 * When sending authenticated requests, a HTTP header of the form
	 * `Authorization: <tokenPrefix> <token>` will be used.
	 */
	tokenPrefix?: string;
	/**
	 * In rare cases, OAuth providers ask that a token is passed as a URL parameter
	 * rather than an HTTP header. If so, this is the name of the URL query parameter
	 * that should contain the token.
	 */
	tokenQueryParam?: string;
}
/**
 * Authenticate using OAuth2. You must specify the authorization URL, token exchange URL, and
 * scopes here as part of the pack definition. You'll provide the application's client ID and
 * client secret in the pack management UI, so that these can be stored securely.
 *
 * The API must use a (largely) standards-compliant implementation of OAuth2.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.OAuth2,
 *   // These URLs come from the API's developer documentation.
 *   authorizationUrl: "https://example.com/authorize",
 *   tokenUrl: "https://api.example.com/token",
 * });
 * ```
 *
 * @see [Authenticating using OAuth](https://coda.io/packs/build/latest/guides/basics/authentication/oauth2/)
 * @see [Authentication samples - OAuth2](https://coda.io/packs/build/latest/samples/topic/authentication/#oauth2)
 */
export interface OAuth2Authentication extends BaseOAuthAuthentication {
	/** Identifies this as OAuth2 authentication. */
	type: AuthenticationType.OAuth2;
	/**
	 * The URL to which the user will be redirected in order to authorize this pack.
	 * This is typically just a base url with no parameters. Coda will append the `scope`
	 * parameter automatically. If the authorization flow requires additional parameters,
	 * they may be specified using {@link additionalParams}.
	 */
	authorizationUrl: string;
	/**
	 * Option custom URL parameters and values that should be included when redirecting the
	 * user to the {@link authorizationUrl}.
	 */
	additionalParams?: {
		[key: string]: any;
	};
	/**
	 * In rare cases, OAuth providers will return the specific API endpoint domain for the user as
	 * part of the OAuth token exchange response. If so, this is the property in the OAuth
	 * token exchange response JSON body that points to the endpoint.
	 *
	 * The endpoint will be saved along with the account and will be available during execution
	 * as {@link ExecutionContext.endpoint}.
	 */
	endpointKey?: string;
	/**
	 * Option to apply PKCE (Proof Key for Code Exchange) OAuth2 extension. With PKCE extension,
	 * a `code_challenge` parameter and a `code_challenge_method` parameter will be sent to the
	 * authorization page. A `code_verifier` parameter will be sent to the token exchange API as
	 * well.
	 *
	 * `code_challenge_method` defaults to SHA256 and can be configured with {@link pkceChallengeMethod}.
	 *
	 * See https://datatracker.ietf.org/doc/html/rfc7636 for more details.
	 */
	useProofKeyForCodeExchange?: boolean;
	/**
	 * See {@link useProofKeyForCodeExchange}
	 */
	pkceChallengeMethod?: "plain" | "S256";
}
/**
 * Authenticate using OAuth2 client credentials.
 * You must specify the token exchange URL here as part of the pack definition.
 * You'll provide the application's client ID and client secret when authenticating.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.OAuth2ClientCredentials,
 *   // This URL comes from the API's developer documentation.
 *   tokenUrl: "https://api.example.com/token",
 * });
 * ```
 */
export interface OAuth2ClientCredentialsAuthentication extends BaseOAuthAuthentication {
	/** Identifies this as OAuth2 client credentials authentication. */
	type: AuthenticationType.OAuth2ClientCredentials;
}
/**
 * Where to pass the client credentials (client ID and client secret) when making the OAuth2 token
 * exchange request. Used in {@link OAuth2Authentication.credentialsLocation}.
 */
export declare enum TokenExchangeCredentialsLocation {
	/**
	 * Allow Coda to determine this automatically. Currently that means Coda tries passing the
	 * credentials in the body first, and if that fails then tries passing them in the Authorization
	 * header.
	 */
	Automatic = "Automatic",
	/**
	 * The credentials are passed in the body of the request, encoded as
	 * `application/x-www-form-urlencoded` along with the other parameters.
	 */
	Body = "Body",
	/**
	 * The credentials are passed in the Authorization header using the `Basic` scheme.
	 */
	AuthorizationHeader = "AuthorizationHeader"
}
/**
 * Authenticate using HTTP Basic authorization. The user provides a username and password
 * (sometimes optional) which are included as an HTTP header according to the Basic auth standard.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.MultiQueryParamToken,
 *   params: [
 *     { name: "key", description: "The key." },
 *     { name: "secret", description: "The secret." },
 *   ],
 * });
 * ```
 *
 * @see [Authenticating with other services - Username and password](https://coda.io/packs/build/latest/guides/basics/authentication/#username-and-password)
 * @see [Authentication samples - Username and password](https://coda.io/packs/build/latest/samples/topic/authentication/#username-and-password)
 * @see [Wikipedia - Basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)
 */
export interface WebBasicAuthentication extends BaseAuthentication {
	/** Identifies this as WebBasic authentication. */
	type: AuthenticationType.WebBasic;
	/**
	 * Configuration for labels to show in the UI when the user sets up a new account.
	 */
	uxConfig?: {
		/**
		 * A placeholder value for the text input where the user will enter a username.
		 */
		placeholderUsername?: string;
		/**
		 * A placeholder value for the text input where the user will enter a password.
		 */
		placeholderPassword?: string;
		/**
		 * If true, only a username input will be shown to the user.
		 * Some services pass API keys in the username field and do not require a password.
		 */
		usernameOnly?: boolean;
	};
}
/**
 * Parameters for the {@link CustomAuthentication} authentication type.
 */
export interface CustomAuthParameter {
	/**
	 * The name used to refer to this parameter and to generate the template replacement string.
	 */
	name: string;
	/**
	 * A description shown to the user indicating what value they should provide for this parameter.
	 */
	description: string;
}
/**
 * Authenticate for custom, non-standard API authentication schemes by inserting one or more arbitrary secret values
 * into the request (the body, URL, headers, or form data) using template replacement. Approval from Coda is required.
 *
 * Some APIs use non-standard authentication schemes which often require secret credentials to be put in specific places
 * in the request URL or request body. Custom authentication supports many of these cases by allowing you as the pack
 * author to define one or more secret values that the user or you as the pack author must provide (depending on
 * user or system authentication). When constructing a network request, you may indicate where these values should
 * be inserted by our fetcher service using the syntax described below (similar to templating engines).
 *
 * \{% raw %\}
 * To insert the credentials, simply put `{{<paramName>-<invocationToken>}}` as a string anywhere in your request,
 * where `<paramName>` is the name of the parameter defined in the params mapping and `<invocationToken>` is the
 * secret invocation-specific token provided within the {@link ExecutionContext}. The invocation
 * token is required for security reasons.
 * \{% endraw %\}
 *
 * @example
 * ```
 * {% raw %}
 * // Suppose you're using an API that requires a secret id in the request URL,
 * // and a different secret value in the request body. You can define a Custom
 * // authentication configuration with two params:
 * // params: [{name: "secretId", description: "Secret id"},
 * //          {name: "secretValue", description: "Secret value"}])
 * // The user or the pack author will be prompted to specify a value for each
 * // of these when setting up an account.
 * // In the `execute` body of your formula, you can specify where those values
 * // are inserted in the request using the template replacement syntax shown
 * // above.
 * //
 * // A real-world example of an API that would require this is the Plaid API
 * // (https://plaid.com/docs/api/products/#auth).
 * // See the use of `secret`, `client_id`, and `access_token` parameters in the
 * // body.
 * execute: async function([], context) {
 *   let secretIdTemplateName = "secretId-" + context.invocationToken;
 *   let urlWithSecret = "/api/entities/{{" + secretIdTemplateName + "}}"
 *   let secretValueTemplateName = "secretValue-" + context.invocationToken;
 *   let secretHeader = "Authorization  {{" + secretValueTemplateName + "}}";
 *   let bodyWithSecret = JSON.stringify({
 *     key: "{{" + secretValueTemplateName + "}}",
 *     otherBodyParam: "foo",
 *   });
 *
 *   let response = await context.fetcher.fetch({
 *     method: "GET",
 *     url: urlWithSecret,
 *     body: bodyWithSecret,
 *     headers: {
 *       "X-Custom-Authorization-Header": secretHeader,
 *     },
 *   });
 *   // ...
 * }
 * {% endraw %}
 * ```
 *
 * @see [Authenticating with other services - Custom tokens](https://coda.io/packs/build/latest/guides/basics/authentication/#custom-tokens)
 * @see [Authentication samples - Custom tokens](https://coda.io/packs/build/latest/samples/topic/authentication/#custom-tokens)
 */
export interface CustomAuthentication extends BaseAuthentication {
	/** Identifies this as Custom authentication. */
	type: AuthenticationType.Custom;
	/**
	 * An array of parameters that must be provided for new connection accounts to authenticate this pack.
	 * These parameters can then be referenced via the {@link CustomAuthParameter.name} property for template
	 * replacement inside the constructed network request.
	 */
	params: CustomAuthParameter[];
}
/**
 * Authenticate to Amazon Web Services using an IAM access key id & secret access key pair.
 *
 * @see [Amazon - AWS Signature Version 4](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)
 */
export interface AWSAccessKeyAuthentication extends BaseAuthentication {
	/** Identifies this as AWSAccessKey authentication. */
	type: AuthenticationType.AWSAccessKey;
	/** The AWS service to authenticate with, like "s3", "iam", or "route53". */
	service: string;
}
/**
 * Authenticate to Amazon Web Services by assuming an IAM role. This is not yet supported.
 *
 * @see [Amazon - AWS Signature Version 4](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)
 * @hidden
 */
export interface AWSAssumeRoleAuthentication extends BaseAuthentication {
	/** Identifies this as AWSAssumeRole authentication. */
	type: AuthenticationType.AWSAssumeRole;
	/** The AWS service to authenticate with, like "s3", "iam", or "route53". */
	service: string;
}
/**
 * Only for use by Coda-authored packs.
 *
 * @hidden
 */
export interface VariousAuthentication {
	/** Identifies this as Various authentication. */
	type: AuthenticationType.Various;
}
/**
 * The union of supported authentication methods.
 */
export type Authentication = NoAuthentication | VariousAuthentication | HeaderBearerTokenAuthentication | CodaApiBearerTokenAuthentication | CustomHeaderTokenAuthentication | MultiHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | OAuth2Authentication | OAuth2ClientCredentialsAuthentication | WebBasicAuthentication | AWSAccessKeyAuthentication | AWSAssumeRoleAuthentication | CustomAuthentication;
export type AsAuthDef<T extends BaseAuthentication> = Omit<T, "getConnectionName" | "getConnectionUserId" | "postSetup"> & {
	/** See {@link BaseAuthentication.getConnectionName} */
	getConnectionName?: MetadataFormulaDef;
	/** See {@link BaseAuthentication.getConnectionUserId} @ignore */
	getConnectionUserId?: MetadataFormulaDef;
	/** {@link BaseAuthentication.postSetup} */
	postSetup?: PostSetupDef[];
};
/**
 * The union of supported authentication definitions. These represent simplified configurations
 * a pack developer can specify when calling {@link PackDefinitionBuilder.setUserAuthentication} when using
 * a pack definition builder. The builder massages these definitions into the form of
 * an {@link Authentication} value, which is the value Coda ultimately cares about.
 */
export type AuthenticationDef = NoAuthentication | VariousAuthentication | AsAuthDef<HeaderBearerTokenAuthentication> | AsAuthDef<CodaApiBearerTokenAuthentication> | AsAuthDef<CustomHeaderTokenAuthentication> | AsAuthDef<MultiHeaderTokenAuthentication> | AsAuthDef<QueryParamTokenAuthentication> | AsAuthDef<MultiQueryParamTokenAuthentication> | AsAuthDef<OAuth2Authentication> | AsAuthDef<OAuth2ClientCredentialsAuthentication> | AsAuthDef<WebBasicAuthentication> | AsAuthDef<AWSAccessKeyAuthentication> | AsAuthDef<AWSAssumeRoleAuthentication> | AsAuthDef<CustomAuthentication>;
/**
 * The union of authentication methods that are supported for system authentication,
 * where the pack author provides credentials used in HTTP requests rather than the user.
 */
export type SystemAuthentication = HeaderBearerTokenAuthentication | CustomHeaderTokenAuthentication | MultiHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | WebBasicAuthentication | AWSAccessKeyAuthentication | AWSAssumeRoleAuthentication | CustomAuthentication | OAuth2ClientCredentialsAuthentication;
/**
 * The union of supported system authentication definitions. These represent simplified
 * configurations a pack developer can specify when calling {@link PackDefinitionBuilder.setSystemAuthentication}
 * when using a pack definition builder. The builder massages these definitions into the form of
 * an {@link SystemAuthentication} value, which is the value Coda ultimately cares about.
 */
export type SystemAuthenticationDef = AsAuthDef<HeaderBearerTokenAuthentication> | AsAuthDef<CustomHeaderTokenAuthentication> | AsAuthDef<MultiHeaderTokenAuthentication> | AsAuthDef<QueryParamTokenAuthentication> | AsAuthDef<MultiQueryParamTokenAuthentication> | AsAuthDef<WebBasicAuthentication> | AsAuthDef<AWSAccessKeyAuthentication> | AsAuthDef<AWSAssumeRoleAuthentication> | AsAuthDef<CustomAuthentication> | AsAuthDef<OAuth2ClientCredentialsAuthentication>;
/**
 * @ignore
 */
export type VariousSupportedAuthentication = NoAuthentication | HeaderBearerTokenAuthentication | CustomHeaderTokenAuthentication | MultiHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | WebBasicAuthentication;
/**
 * Definition for a custom column type that users can apply to any column in any Coda table.
 * A column format tells Coda to interpret the value in a cell by executing a formula
 * using that value, typically looking up data related to that value from a third-party API.
 * For example, the Weather pack has a column format "Current Weather"; when applied to a column,
 * if you type a city or address into a cell in that column, that location will be used as the input
 * to a formula that fetches the current weather at that location, and the resulting object with
 * weather info will be shown in the cell.
 *
 * A column format is just a wrapper around a formula defined in the {@link PackVersionDefinition.formulas} section
 * of your pack definition. It tells Coda to execute that particular formula using the value
 * of the cell as input.
 *
 * The formula referenced by a format must have exactly one required parameter.
 *
 * You may optionally specify one or more {@link matchers}, which are regular expressions
 * that can be matched against values that users paste into table cells, to determine if
 * this Format is applicable to that value. Matchers help users realize that there is a pack
 * format that may augment their experience of working with such values.
 *
 * For example, if you're building a Wikipedia pack, you may write a matcher regular expression
 * that looks for Wikipedia article URLs, if you have a formula that can fetch structured data
 * given an article URL. This would help users discover that there is a pack that can fetch
 * structured data given only a url.
 *
 * At present, matchers will only be run on URLs and not other text values.
 */
export interface Format {
	/**
	 * The name of this column format. This will show to users in the column type chooser.
	 */
	name: string;
	/** @deprecated Namespaces are being removed from the product. */
	formulaNamespace?: string;
	/**
	 * The name of the formula to invoke for values in columns using this format.
	 * This must correspond to the name of a regular, public formula defined in this pack.
	 */
	formulaName: string;
	/** @deprecated No longer needed, will be inferred from the referenced formula. */
	hasNoConnection?: boolean;
	/**
	 * A brief, optional explanation of how users should use this format, for example, what kinds
	 * of values they should put in columns using this format.
	 */
	instructions?: string;
	/**
	 * A list of regular expressions that match URLs that the formula implementing this format
	 * is capable of handling. As described in {@link Format}, this is a discovery mechanism.
	 */
	matchers?: RegExp[];
	/**
	 * @deprecated Currently unused.
	 */
	placeholder?: string;
}
declare enum FeatureSet {
	Basic = "Basic",
	Pro = "Pro",
	Team = "Team",
	Enterprise = "Enterprise"
}
declare enum QuotaLimitType {
	Action = "Action",
	Getter = "Getter",
	Sync = "Sync",
	Metadata = "Metadata"
}
declare enum SyncInterval {
	Manual = "Manual",
	Daily = "Daily",
	Hourly = "Hourly",
	EveryTenMinutes = "EveryTenMinutes"
}
/**
 * @ignore
 * @deprecated
 */
export interface SyncQuota {
	maximumInterval?: SyncInterval;
	maximumRowCount?: number;
}
/**
 * @ignore
 * @deprecated
 */
export interface Quota {
	monthlyLimits?: Partial<{
		[quotaLimitType in QuotaLimitType]: number;
	}>;
	maximumSyncInterval?: SyncInterval;
	sync?: SyncQuota;
}
/**
 * @deprecated Define these in the pack management UI instead.
 */
export interface RateLimit {
	operationsPerInterval: number;
	intervalSeconds: number;
}
/**
 * @deprecated Define these in the pack management UI instead.
 */
export interface RateLimits {
	overall?: RateLimit;
	perConnection?: RateLimit;
}
/**
 * A pack definition without an author-defined semantic version, for use in the web
 * editor where Coda will manage versioning on behalf of the pack author.
 */
export type BasicPackDefinition = Omit<PackVersionDefinition, "version">;
/**
 * The definition of the contents of a Pack at a specific version. This is the
 * heart of the implementation of a Pack.
 */
export interface PackVersionDefinition {
	/**
	 * The semantic version of the pack. This must be valid semantic version of the form `1`, `1.2`, or `1.2.3`.
	 * When uploading a pack version, the semantic version must be greater than any previously uploaded version.
	 */
	version: string;
	/**
	 * If specified, the user must provide personal authentication credentials before using the pack.
	 */
	defaultAuthentication?: Authentication;
	/**
	 * If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
	 * explicit connection is specified by the user.
	 */
	systemConnectionAuthentication?: SystemAuthentication;
	/**
	 * Any domain(s) to which this pack makes fetcher requests. The domains this pack connects to must be
	 * declared up front here, both to clearly communicate to users what a pack is capable of connecting to,
	 * and for security reasons. These network domains are enforced at execution time: any fetcher request
	 * to a domain not listed here will be rejected.
	 *
	 * Only one network domain is allowed by default. If your pack has needs to connect to multiple domains
	 * contact Coda support for approval.
	 */
	networkDomains?: string[];
	/**
	 * @deprecated
	 */
	formulaNamespace?: string;
	/**
	 * Definitions of this pack's formulas. See {@link Formula}.
	 *
	 * Note that button actions are also defined here. Buttons are simply formulas
	 * with `isAction: true`.
	 *
	 */
	formulas?: Formula[];
	/**
	 * Definitions of this pack's column formats. See {@link Format}.
	 */
	formats?: Format[];
	/**
	 * Definitions of this pack's sync tables. See {@link SyncTable}.
	 */
	syncTables?: SyncTable[];
}
/**
 * @deprecated use `#PackVersionDefinition`
 *
 * The legacy complete definition of a Pack including un-versioned metadata.
 * This should only be used by legacy Coda pack implementations.
 */
export interface PackDefinition extends PackVersionDefinition {
	id: PackId;
	name: string;
	shortDescription: string;
	description: string;
	permissionsDescription?: string;
	category?: PackCategory;
	logoPath: string;
	exampleImages?: string[];
	exampleVideoIds?: string[];
	minimumFeatureSet?: FeatureSet;
	quotas?: Partial<{
		[featureSet in FeatureSet]: Quota;
	}>;
	rateLimits?: RateLimits;
	/**
	 * Whether this is a pack that will be used by Coda internally and not exposed directly to users.
	 */
	isSystem?: boolean;
}
/**
 * Creates a new skeleton pack definition that can be added to.
 *
 * @example
 * ```
 * export const pack = newPack();
 * pack.addFormula({resultType: ValueType.String, name: 'MyFormula', ...});
 * pack.addSyncTable('MyTable', ...);
 * pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
 * ```
 */
export declare function newPack(definition?: Partial<PackVersionDefinition>): PackDefinitionBuilder;
/**
 * A class that assists in constructing a pack definition. Use {@link newPack} to create one.
 */
export declare class PackDefinitionBuilder implements BasicPackDefinition {
	/**
	 * See {@link PackVersionDefinition.formulas}.
	 */
	formulas: Formula[];
	/**
	 * See {@link PackVersionDefinition.formats}.
	 */
	formats: Format[];
	/**
	 * See {@link PackVersionDefinition.syncTables}.
	 */
	syncTables: SyncTable[];
	/**
	 * See {@link PackVersionDefinition.networkDomains}.
	 */
	networkDomains: string[];
	/**
	 * See {@link PackVersionDefinition.defaultAuthentication}.
	 */
	defaultAuthentication?: Authentication;
	/**
	 * See {@link PackVersionDefinition.systemConnectionAuthentication}.
	 */
	systemConnectionAuthentication?: SystemAuthentication;
	/**
	 * See {@link PackVersionDefinition.version}.
	 */
	version?: string;
	/** @deprecated */
	formulaNamespace?: string;
	private _defaultConnectionRequirement;
	/**
	 * Constructs a {@link PackDefinitionBuilder}. However, `coda.newPack()` should be used instead
	 * rather than constructing a builder directly.
	 */
	constructor(definition?: Partial<PackVersionDefinition>);
	/**
	 * Adds a formula definition to this pack.
	 *
	 * In the web editor, the `/Formula` shortcut will insert a snippet of a skeleton formula.
	 *
	 * @example
	 * ```
	 * pack.addFormula({
	 *   resultType: ValueType.String,
	 *    name: 'MyFormula',
	 *    description: 'My description.',
	 *    parameters: [
	 *      makeParameter({
	 *        type: ParameterType.String,
	 *        name: 'myParam',
	 *        description: 'My param description.',
	 *      }),
	 *    ],
	 *    execute: async ([param]) => {
	 *      return `Hello ${param}`;
	 *    },
	 * });
	 * ```
	 */
	addFormula<ParamDefsT extends ParamDefs, ResultT extends ValueType, SchemaT extends Schema>(definition: {
		resultType: ResultT;
	} & FormulaDefinition<ParamDefsT, ResultT, SchemaT>): this;
	/**
	 * Adds a sync table definition to this pack.
	 *
	 * In the web editor, the `/SyncTable` shortcut will insert a snippet of a skeleton sync table.
	 *
	 * @example
	 * ```
	 * pack.addSyncTable({
	 *   name: 'MySyncTable',
	 *   identityName: 'EntityName',
	 *   schema: coda.makeObjectSchema({
	 *     ...
	 *   }),
	 *   formula: {
	 *     ...
	 *   },
	 * });
	 * ```
	 */
	addSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>>({ name, description, identityName, schema, formula, connectionRequirement, dynamicOptions, }: SyncTableOptions<K, L, ParamDefsT, SchemaT>): this;
	/**
	 * Adds a dynamic sync table definition to this pack.
	 *
	 * In the web editor, the `/DynamicSyncTable` shortcut will insert a snippet of a skeleton sync table.
	 *
	 * @example
	 * ```
	 * pack.addDynamicSyncTable({
	 *   name: "MySyncTable",
	 *   getName: async funciton (context) => {
	 *     const response = await context.fetcher.fetch({method: "GET", url: context.sync.dynamicUrl});
	 *     return response.body.name;
	 *   },
	 *   getName: async function (context) => {
	 *     const response = await context.fetcher.fetch({method: "GET", url: context.sync.dynamicUrl});
	 *     return response.body.browserLink;
	 *   },
	 *   ...
	 * });
	 * ```
	 */
	addDynamicSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchemaDefinition<K, L>>(definition: DynamicSyncTableOptions<K, L, ParamDefsT, SchemaT>): this;
	/**
	 * Adds a column format definition to this pack.
	 *
	 * In the web editor, the `/ColumnFormat` shortcut will insert a snippet of a skeleton format.
	 *
	 * @example
	 * ```
	 * pack.addColumnFormat({
	 *   name: 'MyColumn',
	 *   formulaName: 'MyFormula',
	 * });
	 * ```
	 */
	addColumnFormat(format: Format): this;
	/**
	 * Sets this pack to use authentication for individual users, using the
	 * authentication method is the given definition.
	 *
	 * Each user will need to register an account in order to use this pack.
	 *
	 * In the web editor, the `/UserAuthentication` shortcut will insert a snippet of a skeleton
	 * authentication definition.
	 *
	 * By default, this will set a default connection (account) requirement, making a user account
	 * required to invoke all formulas in this pack unless you specify differently on a particular
	 * formula. To change the default, you can pass a `defaultConnectionRequirement` option into
	 * this method.
	 *
	 * @example
	 * ```
	 * pack.setUserAuthentication({
	 *   type: AuthenticationType.HeaderBearerToken,
	 * });
	 * ```
	 */
	setUserAuthentication(authDef: UserAuthenticationDef): this;
	/**
	 * Sets this pack to use authentication provided by you as the maker of this pack.
	 *
	 * You will need to register credentials to use with this pack. When users use the
	 * pack, their requests will be authenticated with those system credentials, they need
	 * not register their own account.
	 *
	 * In the web editor, the `/SystemAuthentication` shortcut will insert a snippet of a skeleton
	 * authentication definition.
	 *
	 * @example
	 * ```
	 * pack.setSystemAuthentication({
	 *   type: AuthenticationType.HeaderBearerToken,
	 * });
	 * ```
	 */
	setSystemAuthentication(systemAuthentication: SystemAuthenticationDef): this;
	/**
	 * Adds the domain that this pack makes HTTP requests to.
	 * For example, if your pack makes HTTP requests to "api.example.com",
	 * use "example.com" as your network domain.
	 *
	 * If your pack make HTTP requests, it must declare a network domain,
	 * for security purposes. Coda enforces that your pack cannot make requests to
	 * any undeclared domains.
	 *
	 * You are allowed one network domain per pack by default. If your pack needs
	 * to connect to multiple domains, contact Coda Support for approval.
	 *
	 * @example
	 * ```
	 * pack.addNetworkDomain('example.com');
	 * ```
	 */
	addNetworkDomain(...domain: string[]): this;
	/**
	 * Sets the semantic version of this pack version, e.g. `'1.2.3'`.
	 *
	 * This is optional, and you only need to provide a version if you are manually doing
	 * semantic versioning, or using the CLI. If using the web editor, you can omit this
	 * and the web editor will automatically provide an appropriate semantic version
	 * each time you build a version.
	 *
	 * @example
	 * ```
	 * pack.setVersion('1.2.3');
	 * ```
	 */
	setVersion(version: string): this;
	private _setDefaultConnectionRequirement;
}
/** @hidden */
export type PackSyncTable = Omit<SyncTable, "getter" | "getName" | "getSchema" | "listDynamicUrls" | "searchDynamicUrls" | "getDisplayUrl"> & {
	getter: PackFormulaMetadata;
	isDynamic?: boolean;
	hasDynamicSchema?: boolean;
	getSchema?: MetadataFormulaMetadata;
	getName?: MetadataFormulaMetadata;
	getDisplayUrl?: MetadataFormulaMetadata;
	listDynamicUrls?: MetadataFormulaMetadata;
	searchDynamicUrls?: MetadataFormulaMetadata;
};
/** @hidden */
export interface PackFormatMetadata extends Omit<Format, "matchers"> {
	matchers: string[];
}
/** @hidden */
export type PostSetupMetadata = Omit<PostSetup, "getOptions" | "getOptionsFormula"> & {
	getOptions?: MetadataFormulaMetadata;
	getOptionsFormula?: MetadataFormulaMetadata;
};
/** @hidden */
export type AuthenticationMetadata = DistributiveOmit<Authentication, "getConnectionName" | "getConnectionUserId" | "postSetup"> & {
	getConnectionName?: MetadataFormulaMetadata;
	getConnectionUserId?: MetadataFormulaMetadata;
	postSetup?: PostSetupMetadata[];
};
/** @hidden */
export type PackVersionMetadata = Omit<PackVersionDefinition, "formulas" | "formats" | "defaultAuthentication" | "syncTables"> & {
	formulas: PackFormulaMetadata[];
	formats: PackFormatMetadata[];
	syncTables: PackSyncTable[];
	defaultAuthentication?: AuthenticationMetadata;
};
/** @hidden */
export type PackMetadata = PackVersionMetadata & Pick<PackDefinition, "id" | "name" | "shortDescription" | "description" | "permissionsDescription" | "category" | "logoPath" | "exampleImages" | "exampleVideoIds" | "minimumFeatureSet" | "quotas" | "rateLimits" | "isSystem">;
/** @hidden */
export type ExternalPackAuthenticationType = AuthenticationType;
/** @hidden */
export type ExternalPackFormulas = PackFormulaMetadata[];
/** @hidden */
export type ExternalObjectPackFormula = ObjectPackFormulaMetadata;
/** @hidden */
export type ExternalPackFormula = PackFormulaMetadata;
/** @hidden */
export type ExternalPackFormat = Omit<Format, "matchers"> & {
	matchers?: string[];
};
/** @hidden */
export type ExternalPackFormatMetadata = PackFormatMetadata;
/** @hidden */
export type ExternalSyncTable = PackSyncTable;
export type BasePackVersionMetadata = Omit<PackVersionMetadata, "defaultAuthentication" | "systemConnectionAuthentication" | "formulas" | "formats" | "syncTables">;
/** @hidden */
export interface ExternalPackVersionMetadata extends BasePackVersionMetadata {
	authentication: {
		type: ExternalPackAuthenticationType;
		params?: Array<{
			name: string;
			description: string;
		}>;
		requiresEndpointUrl: boolean;
		endpointDomain?: string;
		postSetup?: PostSetupMetadata[];
		deferConnectionSetup?: boolean;
		shouldAutoAuthSetup?: boolean;
		oauthScopes?: string[];
		oauthAuthorizationUrl?: string;
		oauthTokenUrl?: string;
		networkDomain?: string | string[];
		endpointKey?: string;
	};
	instructionsUrl?: string;
	formulas?: ExternalPackFormulas;
	formats?: ExternalPackFormat[];
	syncTables?: ExternalSyncTable[];
}
/** @hidden */
export type ExternalPackMetadata = ExternalPackVersionMetadata & Pick<PackMetadata, "id" | "name" | "shortDescription" | "description" | "permissionsDescription" | "category" | "logoPath" | "exampleImages" | "exampleVideoIds" | "minimumFeatureSet" | "quotas" | "rateLimits" | "isSystem">;
/**
 * Helper to create a new URL by appending parameters to a base URL.
 *
 * The input URL may or may not having existing parameters.
 *
 * @example
 * ```
 * // Returns `"/someApi/someEndpoint?token=asdf&limit=5"`
 * let url = withQueryParams("/someApi/someEndpoint", {token: "asdf", limit: 5});
 * ```
 */
export declare function withQueryParams(url: string, params?: {
	[key: string]: any;
}): string;
/**
 * Helper to take a URL string and return the parameters (if any) as a JavaScript object.
 *
 * @example
 * ```
 * // Returns `{token: "asdf", limit: "5"}`
 * let params = getQueryParams("/someApi/someEndpoint?token=asdf&limit=5");
 * ```
 */
export declare function getQueryParams(url: string): {
	[key: string]: any;
};
declare function join(...tokens: string[]): string;
/**
 * A helper to extract properties fromKeys from a schema object. This is mostly useful
 * in processing the context.sync.schema in a sync formula, where the schema would only
 * include a subset of properties which were manually selected by the Pack user.
 */
export declare function getEffectivePropertyKeysFromSchema(schema: Schema): string[] | undefined;
/** Constants for working with SVG images. */
export declare namespace SvgConstants {
	/** ID of the node in a returned SVG file that is targeted when Dark Mode is enabled in Coda. */
	const DarkModeFragmentId = "DarkMode";
	/** Prefix to use for base-64 encoded SVGs returned by formulas. */
	const DataUrlPrefix = "data:image/svg+xml;base64,";
	/** Prefix to use for base-64 encoded SVGs (that support Dark Mode) returned by formulas. */
	const DataUrlPrefixWithDarkModeSupport = "data:image/svg+xml;supportsDarkMode=1;base64,";
}
/**
 * Helper for TypeScript to make sure that handling of code forks is exhaustive,
 * most commonly with a `switch` statement.
 *
 * @example
 * ```
 * enum MyEnum {
 *   Foo = 'Foo',
 *   Bar = 'Bar',
 * }
 *
 * function handleEnum(value: MyEnum) {
 *   switch(value) {
 *     case MyEnum.Foo:
 *       return 'foo';
 *     case MyEnum.Bar:
 *       return 'bar';
 *     default:
 *       // This code is unreachable since the two cases above are exhaustive.
 *       // However, if a third value were added to MyEnum, TypeScript would flag
 *       // an error at this line, informing you that you need to update this piece of code.
 *       return ensureUnreachable(value);
 *   }
 * }
 * ```
 */
export declare function ensureUnreachable(value: never, message?: string): never;
/**
 * Helper to check that a given value is a string, and is not the empty string.
 * If the value is not a string or is empty, an error will be raised at runtime.
 */
export declare function ensureNonEmptyString(value: string | null | undefined, message?: string): string;
/**
 * Helper to check that a given value is defined, that is, is neither `undefined` nor `null`.
 * If the value is `undefined` or `null`, an error will be raised at runtime.
 *
 * This is typically used to inform TypeScript that you expect a given value to always exist.
 * Calling this function refines a type that can otherwise be null or undefined.
 */
export declare function ensureExists<T>(value: T | null | undefined, message?: string): T;
/**
 * Helper to apply a TypeScript assertion to subsequent code. TypeScript can infer
 * type information from many expressions, and this helper applies those inferences
 * to all code that follows call to this function.
 *
 * See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
 *
 * @example
 * ```
 * function foo(value: string | number) {
 *   assertCondtion(typeof value === 'string');
 *   // TypeScript would otherwise compalin, because `value` could have been number,
 *   // but the above assertion refines the type based on the `typeof` expression.
 *   return value.toUpperCase();
 * }
 * ```
 */
export declare function assertCondition(condition: any, message?: string): asserts condition;

export {
	join as joinUrl,
};

export {};
