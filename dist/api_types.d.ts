/// <reference types="node" />
import { $Values } from './type_utils';
import { MetadataFormula } from './api';
import { Continuation } from './api';
import { ArraySchema } from './schema';
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
    type: 'array';
    items: T;
}
export declare function isArrayType(obj: any): obj is ArrayType<any>;
declare type UnionType = ArrayType<Type> | Type;
export declare const stringArray: ArrayType<Type.string>;
export declare const numberArray: ArrayType<Type.number>;
export declare const booleanArray: ArrayType<Type.boolean>;
export declare const dateArray: ArrayType<Type.date>;
export declare const htmlArray: ArrayType<Type.html>;
export declare const imageArray: ArrayType<Type.image>;
interface TypeMap {
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
export interface ParamDef<T extends UnionType> {
    name: string;
    type: T;
    description: string;
    optional?: boolean;
    hidden?: boolean;
    autocomplete?: MetadataFormula;
    defaultValue?: DefaultValueType<T>;
}
export declare type ParamArgs<T extends UnionType> = Omit<ParamDef<T>, 'description' | 'name' | 'type'>;
export declare type ParamDefs = [ParamDef<any>, ...Array<ParamDef<any>>] | [];
export declare type ParamsList = Array<ParamDef<UnionType>>;
declare type TypeOfMap<T extends UnionType> = T extends Type ? TypeMap[T] : T extends ArrayType<infer V> ? Array<TypeMap[V]> : never;
export declare type ParamValues<ParamDefsT extends ParamDefs> = {
    [K in keyof ParamDefsT]: ParamDefsT[K] extends ParamDef<infer T> ? TypeOfMap<T> : never;
} & any[];
export declare type DefaultValueType<T extends UnionType> = T extends ArrayType<Type.date> ? TypeOfMap<T> | PrecannedDateRange : TypeOfMap<T>;
export interface CommonPackFormulaDef<T extends ParamDefs> {
    readonly name: string;
    readonly description: string;
    readonly examples: Array<{
        params: PackFormulaValue[];
        result: PackFormulaResult;
    }>;
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
export interface FetchRequest {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
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
export interface ExecutionContext {
    readonly fetcher: Fetcher;
    readonly temporaryBlobStorage: TemporaryBlobStorage;
    readonly endpoint?: string;
    readonly invocationLocation: {
        protocolAndHost: string;
        docId?: string;
    };
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
export {};
