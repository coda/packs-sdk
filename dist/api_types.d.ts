/// <reference types="node" />
import type { $Values } from './type_utils';
import type { ArraySchema } from './schema';
import type { Continuation } from './api';
import type { MetadataFormula } from './api';
export declare enum Type {
    string = 0,
    number = 1,
    object = 2,
    boolean = 3,
    date = 4,
    html = 5,
    image = 6
}
export declare type ParamType = Exclude<Type, Type.object>;
export interface ArrayType<T extends Type> {
    type: 'array';
    items: T;
}
export declare function isArrayType(obj: any): obj is ArrayType<any>;
export declare type UnionType = ArrayType<Type> | Type;
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
export declare const ParameterTypeInputMap: Record<ParameterType, UnionType>;
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
export declare type ParamArgs<T extends UnionType> = Omit<ParamDef<T>, 'description' | 'name' | 'type'>;
export declare type ParamDefs = [ParamDef<UnionType>, ...Array<ParamDef<UnionType>>] | [];
export declare type ParamsList = Array<ParamDef<UnionType>>;
declare type TypeOfMap<T extends UnionType> = T extends Type ? TypeMap[T] : T extends ArrayType<infer V> ? Array<TypeMap[V]> : never;
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
declare const ValidFetchMethods: readonly ["GET", "PATCH", "POST", "PUT", "DELETE"];
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
export {};
