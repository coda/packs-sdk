import type { ArraySchema } from './schema';
import type { ArrayType } from './api_types';
import type { BooleanSchema } from './schema';
import type { CommonPackFormulaDef } from './api_types';
import { ConnectionRequirement } from './api_types';
import type { ExecutionContext } from './api_types';
import type { FetchRequest } from './api_types';
import type { NumberHintTypes } from './schema';
import type { NumberSchema } from './schema';
import type { ObjectSchema } from './schema';
import type { ObjectSchemaDefinition } from './schema';
import type { PackFormulaResult } from './api_types';
import type { ParamArgs } from './api_types';
import type { ParamDef } from './api_types';
import type { ParamDefs } from './api_types';
import type { ParamValues } from './api_types';
import type { ParameterType } from './api_types';
import type { ParameterTypeMap } from './api_types';
import type { RequestHandlerTemplate } from './handler_templates';
import type { ResponseHandlerTemplate } from './handler_templates';
import type { Schema } from './schema';
import type { SchemaType } from './schema';
import type { StringHintTypes } from './schema';
import type { StringSchema } from './schema';
import type { SyncExecutionContext } from './api_types';
import { Type } from './api_types';
import type { TypeOf } from './api_types';
import { ValueType } from './schema';
export { ExecutionContext };
export { FetchRequest } from './api_types';
export { Logger } from './api_types';
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
interface StatusCodeErrorResponse {
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
export declare function wrapMetadataFunction(fnOrFormula: MetadataFormula | MetadataFunction | undefined): MetadataFormula | undefined;
declare type ParameterOptions<T extends ParameterType> = Omit<ParamDef<ParameterTypeMap[T]>, 'type' | 'autocomplete'> & {
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
    readonly [namespace: string]: Formula[];
}
export interface PackFormulaDef<ParamsT extends ParamDefs, ResultT extends PackFormulaResult> extends CommonPackFormulaDef<ParamsT> {
    execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<ResultT> | ResultT;
}
export interface StringFormulaDef<ParamsT extends ParamDefs> extends CommonPackFormulaDef<ParamsT> {
    execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<string> | string;
    response?: {
        schema: StringSchema;
    };
}
export interface ObjectResultFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema> extends PackFormulaDef<ParamsT, object | object[]> {
    execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<object> | object;
    response?: ResponseHandlerTemplate<SchemaT>;
}
export interface ObjectArrayFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema> extends Omit<PackFormulaDef<ParamsT, SchemaType<SchemaT>>, 'execute'> {
    request: RequestHandlerTemplate;
    response: ResponseHandlerTemplate<SchemaT>;
}
export interface EmptyFormulaDef<ParamsT extends ParamDefs> extends Omit<PackFormulaDef<ParamsT, string>, 'execute'> {
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
export declare type PackFormulaMetadata = Omit<TypedPackFormula, 'execute'>;
export declare type ObjectPackFormulaMetadata = Omit<TypedObjectPackFormula, 'execute'>;
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
export declare type SyncFormula<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> = Omit<SyncFormulaDef<ParamDefsT>, 'execute'> & {
    execute(params: ParamValues<ParamDefsT>, context: SyncExecutionContext): Promise<SyncFormulaResult<SchemaType<SchemaT>>>;
    resultType: TypeOf<SchemaType<SchemaT>>;
    isSyncFormula: true;
    schema?: ArraySchema;
};
/**
 * Helper for returning the definition of a formula that returns a number. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a number.
 */
export declare function makeNumericFormula<ParamDefsT extends ParamDefs>(definition: PackFormulaDef<ParamDefsT, number>): NumericPackFormula<ParamDefsT>;
/**
 * Helper for returning the definition of a formula that returns a string. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a string.
 */
export declare function makeStringFormula<ParamDefsT extends ParamDefs>(definition: StringFormulaDef<ParamDefsT>): StringPackFormula<ParamDefsT>;
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
interface BaseFormulaDefV2<ParamDefsT extends ParamDefs, ResultT extends string | number | boolean | object> extends PackFormulaDef<ParamDefsT, ResultT> {
    onError?(error: Error): any;
}
declare type StringFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, string> & {
    resultType: ValueType.String;
    codaType?: StringHintTypes;
    execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<string> | string;
};
declare type NumericFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, number> & {
    resultType: ValueType.Number;
    codaType?: NumberHintTypes;
    execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<number> | number;
};
declare type BooleanFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, boolean> & {
    resultType: ValueType.Boolean;
    execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<boolean> | boolean;
};
declare type ArrayFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, object> & {
    resultType: ValueType.Array;
    items: Schema;
    execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<object> | object;
};
declare type ObjectFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, object> & {
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
export declare type MetadataFormula = ObjectPackFormula<[ParamDef<Type.string>, ParamDef<Type.string>], any>;
export declare type MetadataFormulaMetadata = Omit<MetadataFormula, 'execute'>;
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
export declare function makeObjectFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema>({ response, ...definition }: ObjectResultFormulaDef<ParamDefsT, SchemaT>): ObjectPackFormula<ParamDefsT, SchemaT>;
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
export declare function makeSyncTableLegacy<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>>(name: string, schema: SchemaT, formula: SyncFormulaDef<ParamDefsT>, connectionRequirement?: ConnectionRequirement, dynamicOptions?: {
    getSchema?: MetadataFormula;
    entityName?: string;
}): SyncTableDef<K, L, ParamDefsT, SchemaT>;
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
        params: import("./api_types").PackFormulaValue[];
        result: PackFormulaResult;
    }[] | undefined;
    isAction?: boolean | undefined;
    connectionRequirement?: ConnectionRequirement | undefined;
    network?: import("./api_types").Network | undefined;
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
        params: import("./api_types").PackFormulaValue[];
        result: PackFormulaResult;
    }[] | undefined;
    isAction?: boolean | undefined;
    connectionRequirement?: ConnectionRequirement | undefined;
    network?: import("./api_types").Network | undefined;
    cacheTtlSecs?: number | undefined;
    isExperimental?: boolean | undefined;
    isSystem?: boolean | undefined;
    extraOAuthScopes?: string[] | undefined;
} & {
    execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<string>;
    resultType: Type.string;
};
export declare function maybeRewriteConnectionForFormula<T extends ParamDefs, U extends CommonPackFormulaDef<T>, V extends U | undefined>(formula: V, connectionRequirement: ConnectionRequirement | undefined): V;
