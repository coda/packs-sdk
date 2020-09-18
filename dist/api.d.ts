import { ArraySchema, GenericObjectSchema, StringHintTypes } from './schema';
import { ArrayType } from './api_types';
import { CommonPackFormulaDef } from './api_types';
import { ExecutionContext } from './api_types';
import { NumberSchema } from './schema';
import { PackFormulaResult } from './api_types';
import { ParamArgs } from './api_types';
import { ParamDefs } from './api_types';
import { ParamDef } from './api_types';
import { ParamValues } from './api_types';
import { RequestHandlerTemplate } from './handler_templates';
import { ResponseHandlerTemplate } from './handler_templates';
import { SchemaType } from './schema';
import { Schema } from './schema';
import { StringSchema } from './schema';
import { SyncExecutionContext } from './api_types';
import { ObjectSchema } from './schema';
import { Type } from './api_types';
import { TypeOf } from './api_types';
export { ExecutionContext };
export { FetchRequest } from './api_types';
export declare class UserVisibleError extends Error {
    internalError?: Error | undefined;
    readonly isUserVisible = true;
    constructor(message?: string, internalError?: Error | undefined);
}
export declare class StatusCodeError extends Error {
    statusCode: number;
    constructor(statusCode: number);
}
export interface SyncTableDef<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> {
    name: string;
    schema: SchemaT;
    getter: SyncFormula<K, L, ParamDefsT, SchemaT>;
    getSchema?: MetadataFormula;
    entityName?: string;
}
export interface DynamicSyncTableDef<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> extends SyncTableDef<K, L, ParamDefsT, SchemaT> {
    isDynamic: true;
    getSchema: MetadataFormula;
    getName: MetadataFormula;
    getDisplayUrl: MetadataFormula;
    listDynamicUrls?: MetadataFormula;
}
export interface Continuation {
    [key: string]: string | number;
}
export declare type GenericSyncFormula = SyncFormula<any, any, ParamDefs, any>;
export declare type GenericSyncFormulaResult = SyncFormulaResult<any>;
export declare type GenericSyncTable = SyncTableDef<any, any, ParamDefs, any>;
export declare type GenericDynamicSyncTable = DynamicSyncTableDef<any, any, ParamDefs, any>;
export declare type SyncTable = GenericSyncTable | GenericDynamicSyncTable;
export declare function isUserVisibleError(error: Error): error is UserVisibleError;
export declare function isDynamicSyncTable(syncTable: SyncTable): syncTable is GenericDynamicSyncTable;
export declare const PARAM_DESCRIPTION_DOES_NOT_EXIST = "NO PARAMETER DESCRIPTION HAS BEEN ADDED. For guidance, see https://coda.link/param-docs";
export declare function makeStringParameter(name: string, description: string, args?: ParamArgs<Type.string>): ParamDef<Type.string>;
export declare function makeStringArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.string>>): ParamDef<ArrayType<Type.string>>;
export declare function makeNumericParameter(name: string, description: string, args?: ParamArgs<Type.number>): ParamDef<Type.number>;
export declare function makeNumericArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.number>>): ParamDef<ArrayType<Type.number>>;
export declare function makeBooleanParameter(name: string, description: string, args?: ParamArgs<Type.boolean>): ParamDef<Type.boolean>;
export declare function makeBooleanArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.boolean>>): ParamDef<ArrayType<Type.boolean>>;
export declare function makeDateParameter(name: string, description: string, args?: ParamArgs<Type.date>): ParamDef<Type.date>;
export declare function makeDateArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.date>>): ParamDef<ArrayType<Type.date>>;
export declare function makeHtmlParameter(name: string, description: string, args?: ParamArgs<Type.html>): ParamDef<Type.html>;
export declare function makeHtmlArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.html>>): ParamDef<ArrayType<Type.html>>;
export declare function makeImageParameter(name: string, description: string, args?: ParamArgs<Type.image>): ParamDef<Type.image>;
export declare function makeImageArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.image>>): ParamDef<ArrayType<Type.image>>;
export declare function makeUserVisibleError(msg: string): UserVisibleError;
export declare function check(condition: boolean, msg: string): void;
export interface PackFormulas {
    readonly [namespace: string]: TypedPackFormula[];
}
export interface PackFormulaDef<ParamsT extends ParamDefs, ResultT extends PackFormulaResult> extends CommonPackFormulaDef<ParamsT> {
    execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<ResultT> | ResultT;
}
interface StringFormulaDef<ParamsT extends ParamDefs> extends CommonPackFormulaDef<ParamsT> {
    execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<string> | string;
    response?: {
        schema: StringSchema;
    };
}
interface ObjectResultFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema> extends PackFormulaDef<ParamsT, SchemaType<SchemaT> | Array<SchemaType<SchemaT>>> {
    response?: ResponseHandlerTemplate<SchemaT>;
}
interface ObjectArrayFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema> extends Omit<PackFormulaDef<ParamsT, SchemaType<SchemaT>>, 'execute'> {
    request: RequestHandlerTemplate;
    response: ResponseHandlerTemplate<SchemaT>;
}
export interface EmptyFormulaDef<ParamsT extends ParamDefs> extends Omit<PackFormulaDef<ParamsT, string>, 'execute'> {
    request: RequestHandlerTemplate;
}
declare type Formula<ParamDefsT extends ParamDefs, ResultT extends PackFormulaResult> = PackFormulaDef<ParamDefsT, ResultT> & {
    resultType: TypeOf<ResultT>;
};
declare type NumericPackFormula<ParamDefsT extends ParamDefs> = Formula<ParamDefsT, number> & {
    schema?: NumberSchema;
};
declare type StringPackFormula<ParamDefsT extends ParamDefs, ResultT extends StringHintTypes = StringHintTypes> = Formula<ParamDefsT, SchemaType<StringSchema<ResultT>>> & {
    schema?: StringSchema<ResultT>;
};
export declare type ObjectPackFormula<ParamDefsT extends ParamDefs, SchemaT extends GenericObjectSchema> = Formula<ParamDefsT, SchemaType<SchemaT>> & {
    schema?: SchemaT;
};
export declare type TypedPackFormula = NumericPackFormula<ParamDefs> | StringPackFormula<ParamDefs, any> | ObjectPackFormula<ParamDefs, GenericObjectSchema> | GenericSyncFormula;
export declare type TypedObjectPackFormula = ObjectPackFormula<ParamDefs, GenericObjectSchema>;
export declare type PackFormulaMetadata = Omit<TypedPackFormula, 'execute'>;
export declare type ObjectPackFormulaMetadata = Omit<TypedObjectPackFormula, 'execute'>;
export declare function isObjectPackFormula(fn: PackFormulaMetadata): fn is ObjectPackFormulaMetadata;
export declare function isStringPackFormula(fn: Formula<ParamDefs, any>): fn is StringPackFormula<ParamDefs>;
export declare function isSyncPackFormula(fn: Formula<ParamDefs, any>): fn is GenericSyncFormula;
interface SyncFormulaResult<ResultT extends object> {
    result: ResultT[];
    continuation?: Continuation;
}
interface SyncFormulaDef<K extends string, L extends string, ParamsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> extends CommonPackFormulaDef<ParamsT> {
    execute(params: ParamValues<ParamsT>, context: SyncExecutionContext, continuation?: Continuation, schema?: string): Promise<SyncFormulaResult<SchemaType<SchemaT>>>;
}
export declare type SyncFormula<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> = SyncFormulaDef<K, L, ParamDefsT, SchemaT> & {
    resultType: TypeOf<SchemaType<SchemaT>>;
    isSyncFormula: true;
    schema?: ArraySchema;
};
export declare function makeNumericFormula<ParamDefsT extends ParamDefs>(definition: PackFormulaDef<ParamDefsT, number>): NumericPackFormula<ParamDefsT>;
export declare function makeStringFormula<ParamDefsT extends ParamDefs>(definition: StringFormulaDef<ParamDefsT>): StringPackFormula<ParamDefsT>;
export declare type GetConnectionNameFormula = StringPackFormula<[ParamDef<Type.string>, ParamDef<Type.string>]>;
export declare function makeGetConnectionNameFormula(execute: (context: ExecutionContext, codaUserName: string) => Promise<string> | string): GetConnectionNameFormula;
export interface MetadataFormulaObjectResultType {
    display: string;
    value: string | number;
    hasChildren?: boolean;
}
export declare type MetadataContext = Record<string, any>;
export declare type MetadataFormulaResultType = string | number | MetadataFormulaObjectResultType;
export declare type MetadataFormula = ObjectPackFormula<[ParamDef<Type.string>, ParamDef<Type.string>], any>;
export declare function makeMetadataFormula(execute: (context: ExecutionContext, search: string, formulaContext?: MetadataContext) => Promise<MetadataFormulaResultType | MetadataFormulaResultType[] | ArraySchema>): MetadataFormula;
export interface SimpleAutocompleteOption {
    display: string;
    value: string | number;
}
export declare function simpleAutocomplete(search: string | undefined, options: Array<string | SimpleAutocompleteOption>): Promise<MetadataFormulaObjectResultType[]>;
export declare function autocompleteSearchObjects<T>(search: string, objs: T[], displayKey: keyof T, valueKey: keyof T): Promise<MetadataFormulaObjectResultType[]>;
export declare function makeSimpleAutocompleteMetadataFormula(options: Array<string | SimpleAutocompleteOption>): MetadataFormula;
export declare function makeObjectFormula<ParamDefsT extends ParamDefs, SchemaT extends GenericObjectSchema>({ response, ...definition }: ObjectResultFormulaDef<ParamDefsT, SchemaT>): ObjectPackFormula<ParamDefsT, SchemaT>;
export declare function makeSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>>(name: string, schema: SchemaT, { execute: wrappedExecute, ...definition }: SyncFormulaDef<K, L, ParamDefsT, SchemaT>, getSchema?: MetadataFormula, entityName?: string): SyncTableDef<K, L, ParamDefsT, SchemaT>;
export declare function makeDynamicSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs>({ packId, name, getName, getSchema, getDisplayUrl, formula, listDynamicUrls, entityName, }: {
    packId: number;
    name: string;
    getName: MetadataFormula;
    getSchema: MetadataFormula;
    formula: SyncFormulaDef<K, L, ParamDefsT, any>;
    getDisplayUrl: MetadataFormula;
    listDynamicUrls?: MetadataFormula;
    entityName?: string;
}): DynamicSyncTableDef<K, L, ParamDefsT, any>;
export declare function makeTranslateObjectFormula<ParamDefsT extends ParamDefs, ResultT extends Schema>({ response, ...definition }: ObjectArrayFormulaDef<ParamDefsT, ResultT>): {
    request: RequestHandlerTemplate;
    description: string;
    name: string;
    examples: {
        params: import("./api_types").PackFormulaValue[];
        result: PackFormulaResult;
    }[];
    parameters: ParamDefsT;
    varargParameters?: [] | [ParamDef<any>, ...ParamDef<any>[]] | undefined;
    network?: import("./api_types").Network | undefined;
    cacheTtlSecs?: number | undefined;
    isExperimental?: boolean | undefined;
    isSystem?: boolean | undefined;
} & {
    execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<SchemaType<ResultT>>;
    resultType: Type.object;
    schema: ResultT | undefined;
};
export declare function makeEmptyFormula<ParamDefsT extends ParamDefs>(definition: EmptyFormulaDef<ParamDefsT>): EmptyFormulaDef<ParamDefsT> & {
    execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<string>;
    resultType: Type.string;
};
