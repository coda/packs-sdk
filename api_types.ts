import {$Values} from './type_utils';
import {MetadataFormula} from './api';
import {Continuation} from './api';
import {ArraySchema} from './schema';

export enum Type {
  string,
  number,
  object,
  boolean,
  date,
  html,
  image,
}

export interface ArrayType<T extends Type> {
  type: 'array';
  items: T;
}

export function isArrayType(obj: any): obj is ArrayType<any> {
  return obj && obj.type === 'array' && typeof obj.items === 'number';
}

type UnionType = ArrayType<Type> | Type;

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

export interface ParamDef<T extends UnionType> {
  name: string;
  type: T;
  description: string;
  optional?: boolean;
  hidden?: boolean;
  autocomplete?: MetadataFormula;
  defaultValue?: DefaultValueType<T>;
}

export type ParamArgs<T extends UnionType> = Omit<ParamDef<T>, 'description' | 'name' | 'type'>;

export type ParamDefs = [ParamDef<any>, ...Array<ParamDef<any>>] | [];

export type ParamsList = Array<ParamDef<UnionType>>;

type TypeOfMap<T extends UnionType> = T extends Type
  ? TypeMap[T]
  : T extends ArrayType<infer V>
  ? Array<TypeMap[V]>
  : never;

export type ParamValues<ParamDefsT extends ParamDefs> = {
  [K in keyof ParamDefsT]: ParamDefsT[K] extends ParamDef<infer T> ? TypeOfMap<T> : never;
} &
  any[]; // NOTE(oleg): we need this to avoid "must have a '[Symbol.iterator]()' method that returns an iterator."

export type DefaultValueType<T extends UnionType> = T extends ArrayType<Type.date>
  ? TypeOfMap<T> | PrecannedDateRange
  : TypeOfMap<T>;

export interface CommonPackFormulaDef<T extends ParamDefs> {
  readonly name: string;
  readonly description: string;
  readonly examples: Array<{params: PackFormulaValue[]; result: PackFormulaResult}>;
  readonly parameters: T;
  readonly varargParameters?: ParamDefs;
  readonly network?: Network;
  /**
   * How long formulas running with the same values should cache their results for. By default, 1 second.
   */
  readonly cacheTtlSecs?: number;
  readonly isExperimental?: boolean;
  /**
   * Whether this is a formula that will be used by Coda internally and not exposed directly to users.
   */
  readonly isSystem?: boolean;
}

export interface Network {
  readonly hasSideEffect: boolean;
  readonly hasConnection?: boolean;
  readonly requiresConnection?: boolean;
}

// Fetcher APIs

// Copied from https://developer.mozilla.org/en-US/docs/Web/API/Request
export interface FetchRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  body?: string;
  form?: {[key: string]: string};
  headers?: {[header: string]: string};
  // Allows explicit caching of the results of this request.
  cacheTtlSecs?: number;
  // Allows binary responses.
  isBinaryResponse?: boolean;
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

export interface Sync {
  continuation?: Continuation;
  schema?: ArraySchema;
  dynamicUrl?: string;
}

export interface ExecutionContext {
  readonly fetcher?: Fetcher;
  readonly endpoint?: string;
  readonly invocationLocation: {
    protocolAndHost: string;
    docId?: string;
  };
  readonly timezone: string;
  readonly sync?: Sync;
}

export interface SyncExecutionContext extends ExecutionContext {
  readonly sync: Sync;
}

// A mapping exists in experimental that allows these to show up in the UI.
// If adding new values here, add them to that mapping and vice versa.
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

  Everything = 'everything',
}
