import type {$Values} from './type_utils';
import type {ArraySchema} from './schema';
import type {Continuation} from './api';
import type {MetadataFormula} from './api';

/**
 * Markers used internally to represent data types for parameters and return values.
 * It should not be necessary to ever use these values directly.
 *
 * When defining a parameter, use {@link ParameterType}. When defining
 * a formula return value, or properties within an object return value,
 * use {@link ValueType}.
 */
export enum Type {
  string,
  number,
  object,
  boolean,
  date,
  html,
  image,
}

export type ParamType = Exclude<Type, Type.object>;

export interface ArrayType<T extends Type> {
  type: 'array';
  items: T;
}

export function isArrayType(obj: any): obj is ArrayType<any> {
  return obj && obj.type === 'array' && typeof obj.items === 'number';
}

export type UnionType = ArrayType<Type> | Type;

export const stringArray: ArrayType<Type.string> = {
  type: 'array',
  items: Type.string,
};

export const numberArray: ArrayType<Type.number> = {
  type: 'array',
  items: Type.number,
};

export const booleanArray: ArrayType<Type.boolean> = {
  type: 'array',
  items: Type.boolean,
};

export const dateArray: ArrayType<Type.date> = {
  type: 'array',
  items: Type.date,
};

export const htmlArray: ArrayType<Type.html> = {
  type: 'array',
  items: Type.html,
};

export const imageArray: ArrayType<Type.image> = {
  type: 'array',
  items: Type.image,
};

// Mapping from our type enum to the JS types they are manifested as.
interface TypeMap {
  [Type.number]: number;
  [Type.string]: string;
  [Type.object]: object;
  [Type.boolean]: boolean;
  [Type.date]: Date;
  [Type.html]: string;
  [Type.image]: string;
}

export type PackFormulaValue = $Values<Omit<TypeMap, Type.object>> | PackFormulaValue[];
export type PackFormulaResult = $Values<TypeMap> | PackFormulaResult[];

export type TypeOf<T extends PackFormulaResult> = T extends number
  ? Type.number
  : T extends string
  ? Type.string
  : T extends boolean
  ? Type.boolean
  : T extends Date
  ? Type.date
  : T extends object
  ? Type.object
  : never;

/**
 * Enumeration of types of formula parameters. These describe Coda value types (as opposed to JavaScript value types).
 */
export enum ParameterType {
  /**
   * Indicates a parameter that is a Coda text value.
   */
  String = 'string',
  /**
   * Indicates a parameter that is a Coda number value.
   */
  Number = 'number',
  /**
   * Indicates a parameter that is a Coda boolean value.
   */
  Boolean = 'boolean',
  /**
   * Indicates a parameter that is a Coda date value (which includes time and datetime values).
   */
  Date = 'date',
  /**
   * Indicates a parameter that is a Coda rich text value that should be passed to the pack as HTML.
   */
  Html = 'html',
  /**
   * Indicates a parameter that is a Coda image. The pack is passed an image URL.
   */
  Image = 'image',

  /**
   * Indicates a parameter that is a list of Coda text values.
   */
  StringArray = 'stringArray',
  /**
   * Indicates a parameter that is a list of Coda number values.
   */
  NumberArray = 'numberArray',
  /**
   * Indicates a parameter that is a list of Coda boolean values.
   */
  BooleanArray = 'booleanArray',
  /**
   * Indicates a parameter that is a list of Coda date values (which includes time and datetime values).
   *
   * Currently, when such a parameter is used with a sync table formula or an action formula ({@link isAction}),
   * which will generate a builder UI for selecting parameters, a date array parameter will always render
   * as a date range selector. A date range will always be passed to a pack formula as a list of two
   * elements, the beginning of the range and the end of the range.
   */
  DateArray = 'dateArray',
  /**
   * Indicates a parameter that is a list of Coda rich text values that should be passed to the pack as HTML.
   */
  HtmlArray = 'htmlArray`',
  /**
   * Indicates a parameter that is a list of Coda image values. The pack is passed a list of image URLs.
   */
  ImageArray = 'imageArray',
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

export const ParameterTypeInputMap: Record<ParameterType, UnionType> = {
  [ParameterType.String]: Type.string,
  [ParameterType.Number]: Type.number,
  [ParameterType.Boolean]: Type.boolean,
  [ParameterType.Date]: Type.date,
  [ParameterType.Html]: Type.html,
  [ParameterType.Image]: Type.image,

  [ParameterType.StringArray]: {type: 'array', items: Type.string},
  [ParameterType.NumberArray]: {type: 'array', items: Type.number},
  [ParameterType.BooleanArray]: {type: 'array', items: Type.boolean},
  [ParameterType.DateArray]: {type: 'array', items: Type.date},
  [ParameterType.HtmlArray]: {type: 'array', items: Type.html},
  [ParameterType.ImageArray]: {type: 'array', items: Type.image},
};

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
  hidden?: boolean; // TODO: remove? Seems unused.
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
  // TODO: Allow authors to optionally specify an array of string or array of display/value pairs here
  // and we'll wrap this into an autocomplete formula on their behalf.
  autocomplete?: MetadataFormula;
  /**
   * The default value to be used for this parameter if it is not specified by the user.
   */
  defaultValue?: DefaultValueType<T>;
}

export type ParamArgs<T extends UnionType> = Omit<ParamDef<T>, 'description' | 'name' | 'type'>;

export type ParamDefs = [ParamDef<UnionType>, ...Array<ParamDef<UnionType>>] | [];

export type ParamsList = Array<ParamDef<UnionType>>;

type TypeOfMap<T extends UnionType> = T extends Type
  ? TypeMap[T]
  : T extends ArrayType<infer V>
  ? Array<TypeMap[V]>
  : never;

export type ParamValues<ParamDefsT extends ParamDefs> = {
  [K in keyof ParamDefsT]: ParamDefsT[K] extends ParamDef<infer T> ? TypeOfMap<T> : never;
} & any[]; // NOTE(oleg): we need this to avoid "must have a '[Symbol.iterator]()' method that returns an iterator."

export type DefaultValueType<T extends UnionType> = T extends ArrayType<Type.date>
  ? TypeOfMap<T> | PrecannedDateRange
  : TypeOfMap<T>;

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
  readonly examples?: Array<{params: PackFormulaValue[]; result: PackFormulaResult}>;

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
export enum ConnectionRequirement {
  /**
   * Indicates this building block does not make use of an account.
   */
  None = 'none',
  /**
   * Indicates that this building block can be used with or without an account.
   *
   * An optional parameter will be added to the formula (or sync formula) for the calling user
   * to specify an account to use.
   */
  Optional = 'optional',
  /**
   * Indicates that this building block must be used with an account.
   *
   * A required parameter will be added to the formula (or sync formula) for the calling user
   * to specify an account to use.
   */
  Required = 'required',
}

/** @deprecated use `ConnectionRequirement` instead */
export enum NetworkConnection {
  None = 'none',
  Optional = 'optional',
  Required = 'required',
}

/** @deprecated use `isAction` and `connectionRequirement` on the formula definition instead. */
export interface Network {
  readonly hasSideEffect?: boolean;
  readonly requiresConnection?: boolean;
  readonly connection?: NetworkConnection;
}

// Fetcher APIs
const ValidFetchMethods = ['GET', 'PATCH', 'POST', 'PUT', 'DELETE'] as const;
export type FetchMethodType = typeof ValidFetchMethods[number];

// Copied from https://developer.mozilla.org/en-US/docs/Web/API/Request
export interface FetchRequest {
  method: FetchMethodType;
  url: string;
  body?: string;
  form?: {[key: string]: string};
  headers?: {[header: string]: string};
  // Allows explicit caching of the results of this request.
  cacheTtlSecs?: number;
  // Allows binary responses.
  isBinaryResponse?: boolean;
  // Disable authentication
  disableAuthentication?: boolean;
}

// Copied from https://developer.mozilla.org/en-US/docs/Web/API/Response
export interface FetchResponse<T extends any = any> {
  status: number;
  body?: T;
  headers: {[header: string]: string | string[] | undefined};
}

export interface Fetcher {
  fetch<T = any>(request: FetchRequest): Promise<FetchResponse<T>>;
}

export interface TemporaryBlobStorage {
  storeUrl(url: string, opts?: {expiryMs?: number}): Promise<string>;
  storeBlob(blobData: Buffer, contentType: string, opts?: {expiryMs?: number}): Promise<string>;
}

export interface Sync {
  continuation?: Continuation;
  schema?: ArraySchema;
  dynamicUrl?: string;
}

export type LoggerParamType = string | number | boolean | Record<any, any>;

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
  readonly endpoint?: string;
  readonly invocationLocation: InvocationLocation;
  readonly timezone: string;
  // An arbitrary token scoped to only this request invocation.readonly.
  // Used for things like naming template parameters that will be replaced
  // by the fetcher in secure way to prevent parameter injection attacks.
  readonly invocationToken: string;
  readonly sync?: Sync;
}

export interface SyncExecutionContext extends ExecutionContext {
  readonly sync: Sync;
}

// A mapping exists in coda that allows these to show up in the UI.
// If adding new values here, add them to that mapping and vice versa.
/**
 * Special "live" date range values that can be used as the {@link defaultValue}
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
export enum PrecannedDateRange {
  // Past
  Yesterday = 'yesterday',
  Last7Days = 'last_7_days',
  Last30Days = 'last_30_days',
  LastWeek = 'last_week',
  LastMonth = 'last_month',
  Last3Months = 'last_3_months',
  Last6Months = 'last_6_months',
  LastYear = 'last_year',

  // Present
  Today = 'today',
  ThisWeek = 'this_week',
  ThisWeekStart = 'this_week_start',
  ThisMonth = 'this_month',
  ThisMonthStart = 'this_month_start',
  ThisYearStart = 'this_year_start',
  YearToDate = 'year_to_date',
  ThisYear = 'this_year',

  // Future
  Tomorrow = 'tomorrow',
  Next7Days = 'next_7_days',
  Next30Days = 'next_30_days',
  NextWeek = 'next_week',
  NextMonth = 'next_month',
  Next3Months = 'next_3_months',
  Next6Months = 'next_6_months',
  NextYear = 'next_year',

  /**
   * Indicates a date range beginning in the very distant past (e.g. 1/1/1, aka 1 A.D.)
   * and ending in the distant future (e.g. 12/31/3999). Exact dates are subject to change.
   */
  Everything = 'everything',
}
