/** Returns the codomain for a map-like type. */
export declare type $Values<S> = S[keyof S];
/** Omits properties over a union type, only if the union member has that property. */
export declare type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
/**
 * The set of primitive value types that can be used as return values for formulas
 * or in object schemas.
 */
export declare enum ValueType {
	Boolean = "boolean",
	Number = "number",
	String = "string",
	Array = "array",
	Object = "object"
}
/**
 * Synthetic types that instruct Coda how to coerce values from primitives at ingestion time.
 */
export declare enum ValueHintType {
	Date = "date",
	Time = "time",
	DateTime = "datetime",
	Duration = "duration",
	Person = "person",
	Percent = "percent",
	Currency = "currency",
	ImageReference = "image",
	ImageAttachment = "imageAttachment",
	Url = "url",
	Markdown = "markdown",
	Html = "html",
	Embed = "embed",
	Reference = "reference",
	Attachment = "attachment",
	Slider = "slider",
	Scale = "scale"
}
declare const StringHintValueTypes: readonly [
	ValueHintType.Attachment,
	ValueHintType.Date,
	ValueHintType.Time,
	ValueHintType.DateTime,
	ValueHintType.Duration,
	ValueHintType.Embed,
	ValueHintType.Html,
	ValueHintType.ImageReference,
	ValueHintType.ImageAttachment,
	ValueHintType.Markdown,
	ValueHintType.Url
];
declare const NumberHintValueTypes: readonly [
	ValueHintType.Date,
	ValueHintType.Time,
	ValueHintType.DateTime,
	ValueHintType.Percent,
	ValueHintType.Currency,
	ValueHintType.Slider,
	ValueHintType.Scale
];
declare const ObjectHintValueTypes: readonly [
	ValueHintType.Person,
	ValueHintType.Reference
];
export declare type StringHintTypes = typeof StringHintValueTypes[number];
export declare type NumberHintTypes = typeof NumberHintValueTypes[number];
export declare type ObjectHintTypes = typeof ObjectHintValueTypes[number];
export interface BaseSchema {
	description?: string;
}
export interface BooleanSchema extends BaseSchema {
	type: ValueType.Boolean;
}
export interface NumberSchema extends BaseSchema {
	type: ValueType.Number;
	codaType?: NumberHintTypes;
}
export interface NumericSchema extends NumberSchema {
	codaType?: ValueHintType.Percent;
	precision?: number;
	useThousandsSeparator?: boolean;
}
export declare enum CurrencyFormat {
	Currency = "currency",
	Accounting = "accounting",
	Financial = "financial"
}
export interface CurrencySchema extends NumberSchema {
	codaType: ValueHintType.Currency;
	precision?: number;
	currencyCode?: string;
	format?: CurrencyFormat;
}
export interface SliderSchema extends NumberSchema {
	codaType: ValueHintType.Slider;
	minimum?: number | string;
	maximum?: number | string;
	step?: number | string;
}
export interface ScaleSchema extends NumberSchema {
	codaType: ValueHintType.Scale;
	maximum: number;
	icon: string;
}
export interface BaseDateSchema extends BaseSchema {
	type: ValueType.Number | ValueType.String;
}
export interface DateSchema extends BaseDateSchema {
	codaType: ValueHintType.Date;
	format?: string;
}
export interface TimeSchema extends BaseDateSchema {
	codaType: ValueHintType.Time;
	format?: string;
}
export interface DateTimeSchema extends BaseDateSchema {
	codaType: ValueHintType.DateTime;
	dateFormat?: string;
	timeFormat?: string;
}
export declare enum DurationUnit {
	Days = "days",
	Hours = "hours",
	Minutes = "minutes",
	Seconds = "seconds"
}
export interface DurationSchema extends StringSchema<ValueHintType.Duration> {
	precision?: number;
	maxUnit?: DurationUnit;
}
export interface StringSchema<T extends StringHintTypes = StringHintTypes> extends BaseSchema {
	type: ValueType.String;
	codaType?: T;
}
export interface ArraySchema<T extends Schema = Schema> extends BaseSchema {
	type: ValueType.Array;
	items: T;
}
export interface ObjectSchemaProperty {
	fromKey?: string;
	required?: boolean;
}
export declare type ObjectSchemaProperties<K extends string = never> = {
	[K2 in K | string]: Schema & ObjectSchemaProperty;
};
export declare type GenericObjectSchema = ObjectSchema<string, string>;
export interface IdentityDefinition {
	name: string;
	dynamicUrl?: string;
	attribution?: AttributionNode[];
	packId?: PackId;
}
export interface Identity extends IdentityDefinition {
	packId: PackId;
}
export interface ObjectSchemaDefinition<K extends string, L extends string> extends BaseSchema {
	type: ValueType.Object;
	properties: ObjectSchemaProperties<K | L>;
	id?: K;
	primary?: K;
	codaType?: ObjectHintTypes;
	featured?: L[];
	identity?: IdentityDefinition;
}
export interface ObjectSchema<K extends string, L extends string> extends ObjectSchemaDefinition<K, L> {
	identity?: Identity;
}
declare enum AttributionNodeType {
	Text = 1,
	Link = 2,
	Image = 3
}
export interface TextAttributionNode {
	type: AttributionNodeType.Text;
	text: string;
}
export interface LinkAttributionNode {
	type: AttributionNodeType.Link;
	anchorUrl: string;
	anchorText: string;
}
export interface ImageAttributionNode {
	type: AttributionNodeType.Image;
	anchorUrl: string;
	imageUrl: string;
}
export declare type AttributionNode = TextAttributionNode | LinkAttributionNode | ImageAttributionNode;
export declare type Schema = BooleanSchema | NumberSchema | StringSchema | ArraySchema | GenericObjectSchema;
export declare type PickOptional<T, K extends keyof T> = Partial<T> & {
	[P in K]: T[P];
};
export interface StringHintTypeToSchemaTypeMap {
	[ValueHintType.Date]: Date;
}
export declare type StringHintTypeToSchemaType<T extends StringHintTypes | undefined> = T extends keyof StringHintTypeToSchemaTypeMap ? StringHintTypeToSchemaTypeMap[T] : string;
export declare type SchemaType<T extends Schema> = T extends BooleanSchema ? boolean : T extends NumberSchema ? number : T extends StringSchema ? StringHintTypeToSchemaType<T["codaType"]> : T extends ArraySchema ? Array<SchemaType<T["items"]>> : T extends GenericObjectSchema ? PickOptional<{
	[K in keyof T["properties"]]: SchemaType<T["properties"][K]>;
}, $Values<{
	[K in keyof T["properties"]]: T["properties"][K] extends {
		required: true;
	} ? K : never;
}>> : never;
export declare type ValidTypes = boolean | number | string | object | boolean[] | number[] | string[] | object[];
export declare function generateSchema(obj: ValidTypes): Schema;
export declare function makeSchema<T extends Schema>(schema: T): T;
export declare function makeObjectSchema<K extends string, L extends string, T extends ObjectSchemaDefinition<K, L>>(schemaDef: T): ObjectSchema<K, L>;
/**
 * Convenience for creating a reference object schema from an existing schema for the
 * object. Copies over the identity, id, and primary from the schema, and the subset of
 * properties indicated by the id and primary.
 * A reference schema can always be defined directly, but if you already have an object
 * schema it provides better code reuse to derive a reference schema instead.
 */
export declare function makeReferenceSchemaFromObjectSchema(schema: GenericObjectSchema, identityName?: string): GenericObjectSchema;
export declare enum Type {
	string = 0,
	number = 1,
	object = 2,
	boolean = 3,
	date = 4,
	html = 5,
	image = 6
}
export interface ArrayType<T extends Type> {
	type: "array";
	items: T;
}
export declare function isArrayType(obj: any): obj is ArrayType<any>;
export declare type UnionType = ArrayType<Type> | Type;
export interface TypeMap {
	[Type.number]: number;
	[Type.string]: string;
	[Type.object]: object;
	[Type.boolean]: boolean;
	[Type.date]: Date;
	[Type.html]: string;
	[Type.image]: string;
}
export declare type PackFormulaValue = $Values<Omit<TypeMap, Type.object>> | PackFormulaValue[];
export declare type PackFormulaResult = $Values<TypeMap> | PackFormulaResult[];
export declare type TypeOf<T extends PackFormulaResult> = T extends number ? Type.number : T extends string ? Type.string : T extends boolean ? Type.boolean : T extends Date ? Type.date : T extends object ? Type.object : never;
export declare enum ParameterType {
	String = "string",
	Number = "number",
	Boolean = "boolean",
	Date = "date",
	Html = "html",
	Image = "image",
	StringArray = "stringArray",
	NumberArray = "numberArray",
	BooleanArray = "booleanArray",
	DateArray = "dateArray",
	HtmlArray = "htmlArray`",
	ImageArray = "imageArray"
}
export interface ParameterTypeMap {
	[ParameterType.String]: Type.string;
	[ParameterType.Number]: Type.number;
	[ParameterType.Boolean]: Type.boolean;
	[ParameterType.Date]: Type.date;
	[ParameterType.Html]: Type.html;
	[ParameterType.Image]: Type.image;
	[ParameterType.StringArray]: ArrayType<Type.string>;
	[ParameterType.NumberArray]: ArrayType<Type.number>;
	[ParameterType.BooleanArray]: ArrayType<Type.boolean>;
	[ParameterType.DateArray]: ArrayType<Type.date>;
	[ParameterType.HtmlArray]: ArrayType<Type.html>;
	[ParameterType.ImageArray]: ArrayType<Type.image>;
}
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
	hidden?: boolean;
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
	 * The default value to be used for this parameter if it is not specified by the user.
	 */
	defaultValue?: DefaultValueType<T>;
}
export declare type ParamDefs = [
	ParamDef<UnionType>,
	...Array<ParamDef<UnionType>>
] | [
];
export declare type ParamsList = Array<ParamDef<UnionType>>;
export declare type TypeOfMap<T extends UnionType> = T extends Type ? TypeMap[T] : T extends ArrayType<infer V> ? Array<TypeMap[V]> : never;
export declare type ParamValues<ParamDefsT extends ParamDefs> = {
	[K in keyof ParamDefsT]: ParamDefsT[K] extends ParamDef<infer T> ? TypeOfMap<T> : never;
} & any[];
export declare type DefaultValueType<T extends UnionType> = T extends ArrayType<Type.date> ? TypeOfMap<T> | PrecannedDateRange : TypeOfMap<T>;
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
		params: PackFormulaValue[];
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
export declare enum ConnectionRequirement {
	None = "none",
	Optional = "optional",
	Required = "required"
}
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
declare const ValidFetchMethods: readonly [
	"GET",
	"PATCH",
	"POST",
	"PUT",
	"DELETE"
];
export declare type FetchMethodType = typeof ValidFetchMethods[number];
export interface FetchRequest {
	method: FetchMethodType;
	url: string;
	body?: string;
	form?: {
		[key: string]: string;
	};
	headers?: {
		[header: string]: string;
	};
	cacheTtlSecs?: number;
	isBinaryResponse?: boolean;
	disableAuthentication?: boolean;
}
export interface FetchResponse<T extends any = any> {
	status: number;
	body?: T;
	headers: {
		[header: string]: string | string[] | undefined;
	};
}
export interface Fetcher {
	fetch<T = any>(request: FetchRequest): Promise<FetchResponse<T>>;
}
export interface TemporaryBlobStorage {
	storeUrl(url: string, opts?: {
		expiryMs?: number;
	}): Promise<string>;
	storeBlob(blobData: Buffer, contentType: string, opts?: {
		expiryMs?: number;
	}): Promise<string>;
}
export interface Sync {
	continuation?: Continuation;
	schema?: ArraySchema;
	dynamicUrl?: string;
}
export declare type LoggerParamType = string | number | boolean | Record<any, any>;
export interface Logger {
	trace(message: string, ...args: LoggerParamType[]): void;
	debug(message: string, ...args: LoggerParamType[]): void;
	info(message: string, ...args: LoggerParamType[]): void;
	warn(message: string, ...args: LoggerParamType[]): void;
	error(message: string, ...args: LoggerParamType[]): void;
}
export interface InvocationLocation {
	protocolAndHost: string;
	docId?: string;
}
export interface ExecutionContext {
	readonly fetcher: Fetcher;
	readonly temporaryBlobStorage: TemporaryBlobStorage;
	readonly logger: Logger;
	readonly endpoint?: string;
	readonly invocationLocation: InvocationLocation;
	readonly timezone: string;
	readonly invocationToken: string;
	readonly sync?: Sync;
}
export interface SyncExecutionContext extends ExecutionContext {
	readonly sync: Sync;
}
export declare enum PrecannedDateRange {
	Yesterday = "yesterday",
	Last7Days = "last_7_days",
	Last30Days = "last_30_days",
	LastWeek = "last_week",
	LastMonth = "last_month",
	Last3Months = "last_3_months",
	Last6Months = "last_6_months",
	LastYear = "last_year",
	Today = "today",
	ThisWeek = "this_week",
	ThisWeekStart = "this_week_start",
	ThisMonth = "this_month",
	ThisMonthStart = "this_month_start",
	ThisYearStart = "this_year_start",
	YearToDate = "year_to_date",
	ThisYear = "this_year",
	Tomorrow = "tomorrow",
	Next7Days = "next_7_days",
	Next30Days = "next_30_days",
	NextWeek = "next_week",
	NextMonth = "next_month",
	Next3Months = "next_3_months",
	Next6Months = "next_6_months",
	NextYear = "next_year",
	Everything = "everything"
}
export declare type ParamMapper<T> = (val: T) => T;
export interface RequestHandlerTemplate {
	url: string;
	method: FetchMethodType;
	headers?: {
		[header: string]: string;
	};
	nameMapping?: {
		[functionParamName: string]: string;
	};
	transforms?: {
		[name: string]: ParamMapper<any>;
	};
	queryParams?: string[];
	bodyTemplate?: object;
	bodyParams?: string[];
}
export interface ResponseHandlerTemplate<T extends Schema> {
	schema?: T;
	projectKey?: string;
	onError?(error: Error): any;
}
/**
 * An error whose message will be shown to the end user in the UI when it occurs.
 * If an error is encountered in a formula and you want to describe the error
 * to the end user, throw a UserVisibleError with a user-friendly message
 * and the Coda UI will display the message.
 */
export declare class UserVisibleError extends Error {
	readonly isUserVisible = true;
	readonly internalError: Error | undefined;
	constructor(message?: string, internalError?: Error);
}
export interface StatusCodeErrorResponse {
	body?: any;
	headers?: {
		[key: string]: string | string[] | undefined;
	};
}
/**
 * StatusCodeError is a simple version of StatusCodeError in request-promise to keep backwards compatibility.
 */
export declare class StatusCodeError extends Error {
	statusCode: number;
	body: any;
	options: FetchRequest;
	response: StatusCodeErrorResponse;
	constructor(statusCode: number, body: any, options: FetchRequest, response: StatusCodeErrorResponse);
}
/**
 * Type definition for a Sync Table. Should not be necessary to use directly,
 * instead, define sync tables using {@link makeSyncTable}.
 */
export interface SyncTableDef<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> {
	name: string;
	schema: SchemaT;
	getter: SyncFormula<K, L, ParamDefsT, SchemaT>;
	getSchema?: MetadataFormula;
	entityName?: string;
}
/**
 * Type definition for a Dynamic Sync Table. Should not be necessary to use directly,
 * instead, define dynamic sync tables using {@link makeDynamicSyncTable}.
 */
export interface DynamicSyncTableDef<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> extends SyncTableDef<K, L, ParamDefsT, SchemaT> {
	isDynamic: true;
	getSchema: MetadataFormula;
	getName: MetadataFormula;
	getDisplayUrl: MetadataFormula;
	listDynamicUrls?: MetadataFormula;
}
/**
 * Container for arbitrary data about which page of data to retrieve in this sync invocation.
 *
 * Sync formulas fetch one reasonable size "page" of data per invocation such that the formula
 * can be invoked quickly. The end result of a sync is the concatenation of the results from
 * each individual invocation.
 *
 * To instruct the syncer to fetch a subsequent result page, return a `Continuation` that
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
	[key: string]: string | number;
}
/**
 * Type definition for the formula that implements a sync table.
 * Should not be necessary to use directly, see {@link makeSyncTable}
 * for defining a sync table.
 */
export declare type GenericSyncFormula = SyncFormula<any, any, ParamDefs, any>;
/**
 * Type definition for the return value of a sync table.
 * Should not be necessary to use directly, see {@link makeSyncTable}
 * for defining a sync table.
 */
export declare type GenericSyncFormulaResult = SyncFormulaResult<any>;
/**
 * Type definition for a static (non-dynamic) sync table.
 * Should not be necessary to use directly, see {@link makeSyncTable}
 * for defining a sync table.
 */
export declare type GenericSyncTable = SyncTableDef<any, any, ParamDefs, any>;
/**
 * Type definition for a dynamic sync table.
 * Should not be necessary to use directly, see {@link makeDynamicSyncTable}
 * for defining a sync table.
 */
export declare type GenericDynamicSyncTable = DynamicSyncTableDef<any, any, ParamDefs, any>;
/**
 * Union of type definitions for sync tables..
 * Should not be necessary to use directly, see {@link makeSyncTable} or {@link makeDynamicSyncTable}
 * for defining a sync table.
 */
export declare type SyncTable = GenericSyncTable | GenericDynamicSyncTable;
/**
 * Helper to determine if an error is considered user-visible and can be shown in the UI.
 * See {@link UserVisibleError}.
 * @param error Any error object.
 */
export declare function isUserVisibleError(error: Error): error is UserVisibleError;
export declare function isDynamicSyncTable(syncTable: SyncTable): syncTable is GenericDynamicSyncTable;
export declare type ParameterOptions<T extends ParameterType> = Omit<ParamDef<ParameterTypeMap[T]>, "type" | "autocomplete"> & {
	type: T;
	autocomplete?: MetadataFormulaDef | Array<string | SimpleAutocompleteOption>;
};
/**
 * Create a definition for a parameter for a formula or sync.
 *
 * @example
 * makeParameter({type: ParameterType.String, name: 'myParam', description: 'My description'});
 *
 * @example
 * makeParameter({type: ParameterType.StringArray, name: 'myArrayParam', description: 'My description'});
 */
export declare function makeParameter<T extends ParameterType>(paramDefinition: ParameterOptions<T>): ParamDef<ParameterTypeMap[T]>;
export declare function makeUserVisibleError(msg: string): UserVisibleError;
export interface PackFormulas {
	readonly [namespace: string]: Formula[];
}
export interface PackFormulaDef<ParamsT extends ParamDefs, ResultT extends PackFormulaResult> extends CommonPackFormulaDef<ParamsT> {
	execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<ResultT> | ResultT;
}
export interface ObjectArrayFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema> extends Omit<PackFormulaDef<ParamsT, SchemaType<SchemaT>>, "execute"> {
	request: RequestHandlerTemplate;
	response: ResponseHandlerTemplate<SchemaT>;
}
export interface EmptyFormulaDef<ParamsT extends ParamDefs> extends Omit<PackFormulaDef<ParamsT, string>, "execute"> {
	request: RequestHandlerTemplate;
}
export declare type BaseFormula<ParamDefsT extends ParamDefs, ResultT extends PackFormulaResult> = PackFormulaDef<ParamDefsT, ResultT> & {
	resultType: TypeOf<ResultT>;
};
export declare type NumericPackFormula<ParamDefsT extends ParamDefs> = BaseFormula<ParamDefsT, number> & {
	schema?: NumberSchema;
};
export declare type BooleanPackFormula<ParamDefsT extends ParamDefs> = BaseFormula<ParamDefsT, boolean> & {
	schema?: BooleanSchema;
};
export declare type StringPackFormula<ParamDefsT extends ParamDefs, ResultT extends StringHintTypes = StringHintTypes> = BaseFormula<ParamDefsT, SchemaType<StringSchema<ResultT>>> & {
	schema?: StringSchema<ResultT>;
};
export declare type ObjectPackFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema> = BaseFormula<ParamDefsT, SchemaType<SchemaT>> & {
	schema?: SchemaT;
};
export declare type Formula<ParamDefsT extends ParamDefs = ParamDefs> = NumericPackFormula<ParamDefsT> | StringPackFormula<ParamDefsT, any> | BooleanPackFormula<ParamDefsT> | ObjectPackFormula<ParamDefsT, Schema>;
export declare type TypedPackFormula = Formula | GenericSyncFormula;
export declare type TypedObjectPackFormula = ObjectPackFormula<ParamDefs, Schema>;
export declare type PackFormulaMetadata = Omit<TypedPackFormula, "execute">;
export declare type ObjectPackFormulaMetadata = Omit<TypedObjectPackFormula, "execute">;
export declare function isObjectPackFormula(fn: PackFormulaMetadata): fn is ObjectPackFormulaMetadata;
export declare function isStringPackFormula(fn: BaseFormula<ParamDefs, any>): fn is StringPackFormula<ParamDefs>;
export declare function isSyncPackFormula(fn: BaseFormula<ParamDefs, any>): fn is GenericSyncFormula;
export interface SyncFormulaResult<ResultT extends object> {
	result: ResultT[];
	continuation?: Continuation;
}
export interface SyncFormulaDef<ParamsT extends ParamDefs> extends CommonPackFormulaDef<ParamsT> {
	execute(params: ParamValues<ParamsT>, context: SyncExecutionContext): Promise<SyncFormulaResult<object>>;
}
export declare type SyncFormula<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> = Omit<SyncFormulaDef<ParamDefsT>, "execute"> & {
	execute(params: ParamValues<ParamDefsT>, context: SyncExecutionContext): Promise<SyncFormulaResult<SchemaType<SchemaT>>>;
	resultType: TypeOf<SchemaType<SchemaT>>;
	isSyncFormula: true;
	schema?: ArraySchema;
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
export declare function makeFormula<ParamDefsT extends ParamDefs>(fullDefinition: FormulaDefinitionV2<ParamDefsT>): Formula<ParamDefsT>;
export interface BaseFormulaDefV2<ParamDefsT extends ParamDefs, ResultT extends string | number | boolean | object> extends PackFormulaDef<ParamDefsT, ResultT> {
	onError?(error: Error): any;
}
export declare type StringFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, string> & {
	resultType: ValueType.String;
	codaType?: StringHintTypes;
	execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<string> | string;
};
export declare type NumericFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, number> & {
	resultType: ValueType.Number;
	codaType?: NumberHintTypes;
	execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<number> | number;
};
export declare type BooleanFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, boolean> & {
	resultType: ValueType.Boolean;
	execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<boolean> | boolean;
};
export declare type ArrayFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, object> & {
	resultType: ValueType.Array;
	items: Schema;
	execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<object> | object;
};
export declare type ObjectFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, object> & {
	resultType: ValueType.Object;
	schema: Schema;
	execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<object> | object;
};
export declare type FormulaDefinitionV2<ParamDefsT extends ParamDefs> = StringFormulaDefV2<ParamDefsT> | NumericFormulaDefV2<ParamDefsT> | BooleanFormulaDefV2<ParamDefsT> | ArrayFormulaDefV2<ParamDefsT> | ObjectFormulaDefV2<ParamDefsT>;
/**
 * The return type for a metadata formula that should return a different display to the user
 * than is used internally.
 */
export interface MetadataFormulaObjectResultType {
	display: string;
	value: string | number;
	hasChildren?: boolean;
}
/**
 * A context object that is provided to a metadata formula at execution time.
 * For example, an autocomplete metadata formula for a parameter value may need
 * to know the value of parameters that have already been selected. Those parameter
 * values are provided in this context object.
 */
export declare type MetadataContext = Record<string, any>;
export declare type MetadataFormulaResultType = string | number | MetadataFormulaObjectResultType;
export declare type MetadataFormula = ObjectPackFormula<[
	ParamDef<Type.string>,
	ParamDef<Type.string>
], any>;
export declare type MetadataFormulaMetadata = Omit<MetadataFormula, "execute">;
export declare type MetadataFunction = (context: ExecutionContext, search: string, formulaContext?: MetadataContext) => Promise<MetadataFormulaResultType | MetadataFormulaResultType[] | ArraySchema>;
export declare type MetadataFormulaDef = MetadataFormula | MetadataFunction;
export declare function makeMetadataFormula(execute: MetadataFunction, options?: {
	connectionRequirement?: ConnectionRequirement;
}): MetadataFormula;
export interface SimpleAutocompleteOption {
	display: string;
	value: string | number;
}
export declare function simpleAutocomplete(search: string | undefined, options: Array<string | SimpleAutocompleteOption>): Promise<MetadataFormulaObjectResultType[]>;
export declare function autocompleteSearchObjects<T>(search: string, objs: T[], displayKey: keyof T, valueKey: keyof T): Promise<MetadataFormulaObjectResultType[]>;
export declare function makeSimpleAutocompleteMetadataFormula(options: Array<string | SimpleAutocompleteOption>): MetadataFormula;
export interface SyncTableOptions<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchemaDefinition<K, L>> {
	/**
	 * The name of the sync table. This is shown to users in the Coda UI.
	 * This should describe the entities being synced. For example, a sync table that syncs products
	 * from an e-commerce platform should be called 'Products'. This name must not contain spaces.
	 */
	name: string;
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
	formula: SyncFormulaDef<ParamDefsT>;
	/**
	 * A {@link ConnectionRequirement} that will be used for all formulas contained within
	 * this sync table (including autocomplete formulas).
	 */
	connectionRequirement?: ConnectionRequirement;
	/**
	 * A set of options used internally by {@link makeDynamicSyncTable}
	 */
	dynamicOptions?: {
		getSchema?: MetadataFormulaDef;
		entityName?: string;
	};
}
export interface DynamicSyncTableOptions<ParamDefsT extends ParamDefs> {
	/**
	 * The name of the dynamic sync table. This is shown to users in the Coda UI
	 * when listing what build blocks are contained within this pack.
	 * This should describe the category of entities being synced. The actual
	 * table name once added to the doc will be dynamic, it will be whatever value
	 * is returned by the `getName` formula.
	 */
	name: string;
	/**
	 * A formula that returns the name of this table.
	 */
	getName: MetadataFormulaDef;
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
	 * The definition of the formula that implements this sync. This is a Coda packs formula
	 * that returns an array of objects fitting the given schema and optionally a {@link Continuation}.
	 * (The {@link SyncFormulaDef.name} is redundant and should be the same as the `name` parameter here.
	 * These will eventually be consolidated.)
	 */
	formula: SyncFormulaDef<ParamDefsT>;
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
export declare function makeSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaDefT extends ObjectSchemaDefinition<K, L>, SchemaT extends ObjectSchema<K, L>>({ name, identityName, schema: schemaDef, formula, connectionRequirement, dynamicOptions, }: SyncTableOptions<K, L, ParamDefsT, SchemaDefT>): SyncTableDef<K, L, ParamDefsT, SchemaT>;
export declare function makeDynamicSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs>({ name, getName: getNameDef, getSchema: getSchemaDef, getDisplayUrl: getDisplayUrlDef, formula, listDynamicUrls: listDynamicUrlsDef, entityName, connectionRequirement, }: {
	name: string;
	getName: MetadataFormulaDef;
	getSchema: MetadataFormulaDef;
	formula: SyncFormulaDef<ParamDefsT>;
	getDisplayUrl: MetadataFormulaDef;
	listDynamicUrls?: MetadataFormulaDef;
	entityName?: string;
	connectionRequirement?: ConnectionRequirement;
}): DynamicSyncTableDef<K, L, ParamDefsT, any>;
export declare function makeTranslateObjectFormula<ParamDefsT extends ParamDefs, ResultT extends Schema>({ response, ...definition }: ObjectArrayFormulaDef<ParamDefsT, ResultT>): {
	request: RequestHandlerTemplate;
	description: string;
	name: string;
	parameters: ParamDefsT;
	varargParameters?: ParamDefs | undefined;
	examples?: {
		params: PackFormulaValue[];
		result: PackFormulaResult;
	}[] | undefined;
	isAction?: boolean | undefined;
	connectionRequirement?: ConnectionRequirement | undefined;
	network?: Network | undefined;
	cacheTtlSecs?: number | undefined;
	isExperimental?: boolean | undefined;
	isSystem?: boolean | undefined;
	extraOAuthScopes?: string[] | undefined;
} & {
	execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<SchemaType<ResultT>>;
	resultType: Type.object;
	schema: ResultT | undefined;
};
export declare function makeEmptyFormula<ParamDefsT extends ParamDefs>(definition: EmptyFormulaDef<ParamDefsT>): {
	description: string;
	name: string;
	parameters: ParamDefsT;
	varargParameters?: ParamDefs | undefined;
	examples?: {
		params: PackFormulaValue[];
		result: PackFormulaResult;
	}[] | undefined;
	isAction?: boolean | undefined;
	connectionRequirement?: ConnectionRequirement | undefined;
	network?: Network | undefined;
	cacheTtlSecs?: number | undefined;
	isExperimental?: boolean | undefined;
	isSystem?: boolean | undefined;
	extraOAuthScopes?: string[] | undefined;
} & {
	execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<string>;
	resultType: Type.string;
};
export declare type PackId = number;
export declare enum PackCategory {
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
export declare enum AuthenticationType {
	None = "None",
	HeaderBearerToken = "HeaderBearerToken",
	CustomHeaderToken = "CustomHeaderToken",
	QueryParamToken = "QueryParamToken",
	MultiQueryParamToken = "MultiQueryParamToken",
	OAuth2 = "OAuth2",
	WebBasic = "WebBasic",
	AWSSignature4 = "AWSSignature4",
	CodaApiHeaderBearerToken = "CodaApiHeaderBearerToken",
	Various = "Various"
}
export declare enum DefaultConnectionType {
	SharedDataOnly = 1,
	Shared = 2,
	ProxyActionsOnly = 3
}
/**
 * A pack or formula which uses no authentication mechanism
 */
export interface NoAuthentication {
	type: AuthenticationType.None;
}
export interface SetEndpoint {
	type: PostSetupType.SetEndpoint;
	name: string;
	description: string;
	getOptionsFormula: MetadataFormula;
}
export declare enum PostSetupType {
	SetEndpoint = "SetEndPoint"
}
export declare type PostSetup = SetEndpoint;
export interface BaseAuthentication {
	getConnectionName?: MetadataFormula;
	getConnectionUserId?: MetadataFormula;
	defaultConnectionType?: DefaultConnectionType;
	instructionsUrl?: string;
	requiresEndpointUrl?: boolean;
	endpointDomain?: string;
	postSetup?: PostSetup[];
}
/**
 * A pack or formula which uses standard bearer token header authentication:
 * {"Authorization": "Bearer <token here>"}
 */
export interface HeaderBearerTokenAuthentication extends BaseAuthentication {
	type: AuthenticationType.HeaderBearerToken;
}
/**
 * A pack or formula that uses the Coda API bearer token. We will
 * use this to provide a better authentication experience.
 * {"Authorization": "Bearer <token here>"}
 */
export interface CodaApiBearerTokenAuthentication extends BaseAuthentication {
	type: AuthenticationType.CodaApiHeaderBearerToken;
	deferConnectionSetup?: boolean;
	shouldAutoAuthSetup?: boolean;
}
/**
 * A pack or formula which uses standard bearer token header authentication:
 * {"HeaderNameHere": "OptionalTokenPrefixHere <token here>"}
 */
export interface CustomHeaderTokenAuthentication extends BaseAuthentication {
	type: AuthenticationType.CustomHeaderToken;
	headerName: string;
	tokenPrefix?: string;
}
/**
 * A pack or formula which includes a token in a query parameter (bad for security).
 * https://foo.com/apis/dosomething?token=<token here>
 */
export interface QueryParamTokenAuthentication extends BaseAuthentication {
	type: AuthenticationType.QueryParamToken;
	paramName: string;
}
/**
 * A pack or formula which includes multiple tokens in a query parameter (bad for security).
 * https://foo.com/apis/dosomething?param1=<param1 value>&param2=<param2 value>
 */
export interface MultiQueryParamTokenAuthentication extends BaseAuthentication {
	type: AuthenticationType.MultiQueryParamToken;
	params: Array<{
		name: string;
		description: string;
	}>;
}
export interface OAuth2Authentication extends BaseAuthentication {
	type: AuthenticationType.OAuth2;
	authorizationUrl: string;
	tokenUrl: string;
	scopes?: string[];
	tokenPrefix?: string;
	additionalParams?: {
		[key: string]: any;
	};
	endpointKey?: string;
	tokenQueryParam?: string;
}
export interface WebBasicAuthentication extends BaseAuthentication {
	type: AuthenticationType.WebBasic;
	uxConfig?: {
		placeholderUsername?: string;
		placeholderPassword?: string;
		usernameOnly?: boolean;
	};
}
export interface AWSSignature4Authentication extends BaseAuthentication {
	type: AuthenticationType.AWSSignature4;
	service: string;
}
export interface VariousAuthentication {
	type: AuthenticationType.Various;
}
export declare type Authentication = NoAuthentication | VariousAuthentication | HeaderBearerTokenAuthentication | CodaApiBearerTokenAuthentication | CustomHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | OAuth2Authentication | WebBasicAuthentication | AWSSignature4Authentication;
export declare type AsAuthDef<T extends BaseAuthentication> = Omit<T, "getConnectionName" | "getConnectionUserId"> & {
	getConnectionName?: MetadataFormulaDef;
	getConnectionUserId?: MetadataFormulaDef;
};
export declare type AuthenticationDef = NoAuthentication | VariousAuthentication | AsAuthDef<HeaderBearerTokenAuthentication> | AsAuthDef<CodaApiBearerTokenAuthentication> | AsAuthDef<CustomHeaderTokenAuthentication> | AsAuthDef<QueryParamTokenAuthentication> | AsAuthDef<MultiQueryParamTokenAuthentication> | AsAuthDef<OAuth2Authentication> | AsAuthDef<WebBasicAuthentication> | AsAuthDef<AWSSignature4Authentication>;
export declare type SystemAuthentication = HeaderBearerTokenAuthentication | CustomHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | WebBasicAuthentication | AWSSignature4Authentication;
export declare type SystemAuthenticationDef = AsAuthDef<HeaderBearerTokenAuthentication> | AsAuthDef<CustomHeaderTokenAuthentication> | AsAuthDef<QueryParamTokenAuthentication> | AsAuthDef<MultiQueryParamTokenAuthentication> | AsAuthDef<WebBasicAuthentication> | AsAuthDef<AWSSignature4Authentication>;
export declare type VariousSupportedAuthentication = NoAuthentication | HeaderBearerTokenAuthentication | CustomHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | WebBasicAuthentication;
export interface Format {
	name: string;
	formulaNamespace: string;
	formulaName: string;
	/** @deprecated No longer needed, will be inferred from the referenced formula. */
	hasNoConnection?: boolean;
	instructions?: string;
	matchers?: string[];
	placeholder?: string;
}
export declare enum FeatureSet {
	Basic = "Basic",
	Pro = "Pro",
	Team = "Team",
	Enterprise = "Enterprise"
}
export declare enum QuotaLimitType {
	Action = "Action",
	Getter = "Getter",
	Sync = "Sync",
	Metadata = "Metadata"
}
export declare enum SyncInterval {
	Manual = "Manual",
	Daily = "Daily",
	Hourly = "Hourly",
	EveryTenMinutes = "EveryTenMinutes"
}
export interface SyncQuota {
	maximumInterval?: SyncInterval;
	maximumRowCount?: number;
}
export interface Quota {
	monthlyLimits?: Partial<{
		[quotaLimitType in QuotaLimitType]: number;
	}>;
	maximumSyncInterval?: SyncInterval;
	sync?: SyncQuota;
}
export interface RateLimit {
	operationsPerInterval: number;
	intervalSeconds: number;
}
export interface RateLimits {
	overall?: RateLimit;
	perConnection?: RateLimit;
}
export declare type BasicPackDefinition = Omit<PackVersionDefinition, "version">;
/**
 * The definition of the contents of a Pack at a specific version. This is the
 * heart of the implementation of a Pack.
 */
export interface PackVersionDefinition {
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
	networkDomains?: string[];
	formulaNamespace?: string;
	formulas?: PackFormulas | Formula[];
	formats?: Format[];
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
	enabledConfigName?: string;
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
 * export const pack = newPack();
 * pack.addFormula({resultType: ValueType.String, name: 'MyFormula', ...});
 * pack.addSyncTable('MyTable', ...);
 * pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
 */
export declare function newPack(definition?: Partial<PackVersionDefinition>): PackDefinitionBuilder;
export declare class PackDefinitionBuilder implements BasicPackDefinition {
	formulas: Formula[];
	formats: Format[];
	syncTables: SyncTable[];
	networkDomains: string[];
	defaultAuthentication?: Authentication;
	systemConnectionAuthentication?: SystemAuthentication;
	version?: string;
	formulaNamespace?: string;
	private _defaultConnectionRequirement;
	constructor(definition?: Partial<PackVersionDefinition>);
	/**
	 * Adds a formula definition to this pack.
	 *
	 * In the web editor, the `/Formula` shortcut will insert a snippet of a skeleton formula.
	 *
	 * @example
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
	 */
	addFormula<ParamDefsT extends ParamDefs>(definition: FormulaDefinitionV2<ParamDefsT>): this;
	/**
	 * Adds a sync table definition to this pack.
	 *
	 * In the web editor, the `/SyncTable` shortcut will insert a snippet of a skeleton sync table.
	 *
	 * @example
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
	 */
	addSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>>({ name, identityName, schema, formula, connectionRequirement, dynamicOptions, }: SyncTableOptions<K, L, ParamDefsT, SchemaT>): this;
	/**
	 * Adds a dynamic sync table definition to this pack.
	 *
	 * In the web editor, the `/DynamicSyncTable` shortcut will insert a snippet of a skeleton sync table.
	 *
	 * @example
	 * pack.addDynamicSyncTable({
	 *   name: 'MySyncTable',
	 *   getName: async (context) => {
	 *     const response = await context.fetcher.fetch({method: 'GET', url: context.sync.dynamicUrl});
	 *     return response.body.name;
	 *   },
	 *   getName: async (context) => {
	 *     const response = await context.fetcher.fetch({method: 'GET', url: context.sync.dynamicUrl});
	 *     return response.body.browserLink;
	 *   },
	 *   ...
	 * });
	 */
	addDynamicSyncTable<ParamDefsT extends ParamDefs>(definition: DynamicSyncTableOptions<ParamDefsT>): this;
	/**
	 * Adds a column format definition to this pack.
	 *
	 * In the web editor, the `/ColumnFormat` shortcut will insert a snippet of a skeleton format.
	 *
	 * @example
	 * pack.addColumnFormat({
	 *   name: 'MyColumn',
	 *   formulaName: 'MyFormula',
	 * });
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
	 * pack.setUserAuthentication({
	 *   type: AuthenticationType.HeaderBearerToken,
	 * });
	 */
	setUserAuthentication(authDef: AuthenticationDef & {
		defaultConnectionRequirement?: ConnectionRequirement;
	}): this;
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
	 * pack.setSystemAuthentication({
	 *   type: AuthenticationType.HeaderBearerToken,
	 * });
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
	 * pack.addNetworkDomain('example.com');
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
	 * pack.setVersion('1.2.3');
	 */
	setVersion(version: string): this;
	private _setDefaultConnectionRequirement;
}
export declare type PackSyncTable = Omit<SyncTable, "getter" | "getName" | "getSchema" | "listDynamicUrls" | "getDisplayUrl"> & {
	getter: PackFormulaMetadata;
	isDynamic?: boolean;
	hasDynamicSchema?: boolean;
	getSchema?: MetadataFormulaMetadata;
	getName?: MetadataFormulaMetadata;
	getDisplayUrl?: MetadataFormulaMetadata;
	listDynamicUrls?: MetadataFormulaMetadata;
};
export interface PackFormatMetadata extends Omit<Format, "matchers"> {
	matchers: string[];
}
export interface PackFormulasMetadata {
	[namespace: string]: PackFormulaMetadata[];
}
export declare type PostSetupMetadata = Omit<PostSetup, "getOptionsFormula"> & {
	getOptionsFormula: MetadataFormulaMetadata;
};
export declare type AuthenticationMetadata = DistributiveOmit<Authentication, "getConnectionName" | "getConnectionUserId" | "postSetup"> & {
	getConnectionName?: MetadataFormulaMetadata;
	getConnectionUserId?: MetadataFormulaMetadata;
	postSetup?: PostSetupMetadata[];
};
/** Stripped-down version of `PackVersionDefinition` that doesn't contain formula definitions. */
export declare type PackVersionMetadata = Omit<PackVersionDefinition, "formulas" | "formats" | "defaultAuthentication" | "syncTables"> & {
	formulas: PackFormulasMetadata | PackFormulaMetadata[];
	formats: PackFormatMetadata[];
	syncTables: PackSyncTable[];
	defaultAuthentication?: AuthenticationMetadata;
};
/** Stripped-down version of `PackDefinition` that doesn't contain formula definitions. */
export declare type PackMetadata = PackVersionMetadata & Pick<PackDefinition, "id" | "name" | "shortDescription" | "description" | "permissionsDescription" | "category" | "logoPath" | "exampleImages" | "exampleVideoIds" | "minimumFeatureSet" | "quotas" | "rateLimits" | "enabledConfigName" | "isSystem">;
export declare type ExternalPackAuthenticationType = AuthenticationType;
export declare type ExternalPackFormulas = PackFormulasMetadata | PackFormulaMetadata[];
export declare type ExternalObjectPackFormula = ObjectPackFormulaMetadata;
export declare type ExternalPackFormula = PackFormulaMetadata;
export declare type ExternalPackFormat = Format;
export declare type ExternalPackFormatMetadata = PackFormatMetadata;
export declare type ExternalSyncTable = PackSyncTable;
export declare type BasePackVersionMetadata = Omit<PackVersionMetadata, "defaultAuthentication" | "systemConnectionAuthentication" | "formulas" | "formats" | "syncTables">;
/** Further stripped-down version of `PackVersionMetadata` that contains only what the browser needs. */
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
	};
	instructionsUrl?: string;
	formulas?: ExternalPackFormulas;
	formats?: ExternalPackFormat[];
	syncTables?: ExternalSyncTable[];
}
/** Further stripped-down version of `PackMetadata` that contains only what the browser needs. */
export declare type ExternalPackMetadata = ExternalPackVersionMetadata & Pick<PackMetadata, "id" | "name" | "shortDescription" | "description" | "permissionsDescription" | "category" | "logoPath" | "exampleImages" | "exampleVideoIds" | "minimumFeatureSet" | "quotas" | "rateLimits" | "isSystem">;
export declare function withQueryParams(url: string, params?: {
	[key: string]: any;
}): string;
export declare function getQueryParams(url: string): {
	[key: string]: any;
};
declare function join(...tokens: string[]): string;
export declare function ensureUnreachable(value: never, message?: string): never;
export declare function ensureNonEmptyString(value: string | null | undefined, message?: string): string;
export declare function ensureExists<T>(value: T | null | undefined, message?: string): T;
export declare function assertCondition(condition: any, message?: string): asserts condition;

export {
	join as joinUrl,
};

export {};
