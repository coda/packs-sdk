import {$Omit} from './type_utils';
import {$Values} from './type_utils';

export enum Type {
  string,
  number,
  object,
  boolean,
  date,
  html,
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

// Concrete versions of these ArrayTypes
type ConcreteArrayTypes = string[] | number[] | boolean[] | Date[];

interface TypeMap {
  [Type.number]: number;
  [Type.string]: string;
  [Type.object]: object;
  [Type.boolean]: boolean;
  [Type.date]: Date;
  [Type.html]: string;
}

export type PackFormulaValue = $Values<$Omit<TypeMap, Type.object>> | ConcreteArrayTypes;
export type PackFormulaResult = $Values<TypeMap> | ConcreteArrayTypes;

export type TypeOf<T extends PackFormulaResult> = T extends number
  ? Type.number
  : (T extends string
      ? Type.string
      : (T extends boolean ? Type.boolean : (T extends Date ? Type.date : (T extends object ? Type.object : never))));

export interface ParamDef<T extends UnionType> {
  name: string;
  type: T;
  description: string;
  optional?: boolean;
  hidden?: boolean;
}

export type ParamArgs<T extends UnionType> = $Omit<ParamDef<T>, 'description' | 'name' | 'type'>;

export type ParamDefs = [ParamDef<any>, ...Array<ParamDef<any>>] | never[];

export type ParamsList = Array<ParamDef<UnionType>>;

type TypeOfMap<T extends UnionType> = T extends Type
  ? TypeMap[T]
  : (T extends ArrayType<infer V> ? Array<TypeMap[V]> : never);

export type ParamValues<ParamDefsT extends ParamDefs> = {
  [K in keyof ParamDefsT]: ParamDefsT[K] extends ParamDef<infer T> ? TypeOfMap<T> : never
} &
  any[]; // NOTE(oleg): we need this to avoid "must have a '[Symbol.iterator]()' method that returns an iterator."

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

export interface ExecutionContext {
  readonly fetcher?: Fetcher;
  readonly endpoint?: string;
  readonly docUrl?: string;
}
