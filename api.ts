import type {ArraySchema} from './schema';
import type {ArrayType} from './api_types';
import type {BooleanSchema} from './schema';
import type {CommonPackFormulaDef} from './api_types';
import {ConnectionRequirement} from './api_types';
import type {ExecutionContext} from './api_types';
import type {FetchRequest} from './api_types';
import type {Identity} from './schema';
import type {NumberHintTypes} from './schema';
import type {NumberSchema} from './schema';
import type {ObjectSchema} from './schema';
import type {ObjectSchemaDefinition} from './schema';
import type {ObjectSchemaDefinitionType} from './schema';
import type {PackFormulaResult} from './api_types';
import type {ParamArgs} from './api_types';
import type {ParamDef} from './api_types';
import type {ParamDefs} from './api_types';
import type {ParamValues} from './api_types';
import type {ParameterType} from './api_types';
import {ParameterTypeInputMap} from './api_types';
import type {ParameterTypeMap} from './api_types';
import type {RequestHandlerTemplate} from './handler_templates';
import type {ResponseHandlerTemplate} from './handler_templates';
import type {Schema} from './schema';
import type {SchemaType} from './schema';
import type {StringHintTypes} from './schema';
import type {StringSchema} from './schema';
import type {SyncExecutionContext} from './api_types';
import {Type} from './api_types';
import type {TypeOf} from './api_types';
import type {UnionType} from './api_types';
import {ValueType} from './schema';
import {booleanArray} from './api_types';
import {dateArray} from './api_types';
import {ensureExists} from './helpers/ensure';
import {ensureUnreachable} from './helpers/ensure';
import {generateObjectResponseHandler} from './handler_templates';
import {generateRequestHandler} from './handler_templates';
import {htmlArray} from './api_types';
import {imageArray} from './api_types';
import {makeObjectSchema} from './schema';
import {normalizeSchema} from './schema';
import {numberArray} from './api_types';
import {stringArray} from './api_types';
import {transformBody} from './handler_templates';

export {ExecutionContext};
export {FetchRequest} from './api_types';

/**
 * An error whose message will be shown to the end user in the UI when it occurs.
 * If an error is encountered in a formula and you want to describe the error
 * to the end user, throw a UserVisibleError with a user-friendly message
 * and the Coda UI will display the message.
 */
export class UserVisibleError extends Error {
  /** @hidden */
  readonly isUserVisible = true;
  /** @hidden */
  readonly internalError: Error | undefined;

  /**
   * Use to construct a user-visible error.
   *
   * @example
   * ```
   * if (!url.startsWith("http")) {
   *   throw new coda.UserVisibleError("Please provide a valid url.");
   * }
   * ```
   */
  constructor(message?: string, internalError?: Error) {
    super(message);
    this.internalError = internalError;
  }
}

interface StatusCodeErrorResponse {
  body?: any;
  headers?: {[key: string]: string | string[] | undefined};
}

// StatusCodeError is a simple version of StatusCodeError in request-promise to keep backwards compatibility.
// This tries to replicate its exact structure, massaging as necessary to handle the various transforms
// in our stack.
//
// https://github.com/request/promise-core/blob/master/lib/errors.js#L22
/**
 * An error that will be thrown by {@link Fetcher.fetch} when the fetcher response has an
 * HTTP status code of 400 or greater.
 *
 * This class largely models the `StatusCodeError` from the (now deprecated) `request-promise` library,
 * which has a quirky structure.
 */
export class StatusCodeError extends Error {
  /**
   * The name of the error, for identiciation purposes.
   */
  override name: string = 'StatusCodeError';
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
  constructor(statusCode: number, body: any, options: FetchRequest, response: StatusCodeErrorResponse) {
    super(`${statusCode} - ${JSON.stringify(body)}`);
    this.statusCode = statusCode;
    this.body = body;
    this.error = body;
    this.options = options;

    let responseBody = response?.body;
    if (typeof responseBody === 'object') {
      // "request-promise"'s error.response.body is always the original, unparsed response body,
      // while our fetcher service may attempt a JSON.parse for any response body and alter the behavior.
      // Here we attempt to restore the original response body for a few v1 packs compatibility.
      responseBody = JSON.stringify(responseBody);
    }

    this.response = {...response, body: responseBody};
  }
}

/**
 * The result of defining a sync table. Should not be necessary to use directly,
 * instead, define sync tables using {@link makeSyncTable}.
 */
export interface SyncTableDef<
  K extends string,
  L extends string,
  ParamDefsT extends ParamDefs,
  SchemaT extends ObjectSchema<K, L>,
> {
  /** See {@link SyncTableOptions.name} */
  name: string;
  /** See {@link SyncTableOptions.schema} */
  schema: SchemaT;
  /** See {@link SyncTableOptions.formula} */
  getter: SyncFormula<K, L, ParamDefsT, SchemaT>;
  /** See {@link SyncTableOptions.dynamicOptions.getSchema} */
  getSchema?: MetadataFormula;
  /** See {@link SyncTableOptions.dynamicOptions.entityName} */
  entityName?: string;
}

/**
 * Type definition for a Dynamic Sync Table. Should not be necessary to use directly,
 * instead, define dynamic sync tables using {@link makeDynamicSyncTable}.
 */
export interface DynamicSyncTableDef<
  K extends string,
  L extends string,
  ParamDefsT extends ParamDefs,
  SchemaT extends ObjectSchema<K, L>,
> extends SyncTableDef<K, L, ParamDefsT, SchemaT> {
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
 * Helper to determine if an error is considered user-visible and can be shown in the UI.
 * See {@link UserVisibleError}.
 * @param error Any error object.
 */
export function isUserVisibleError(error: Error): error is UserVisibleError {
  return 'isUserVisible' in error && (error as any).isUserVisible;
}

export function isDynamicSyncTable(syncTable: SyncTable): syncTable is GenericDynamicSyncTable {
  return 'isDynamic' in syncTable;
}

export function wrapMetadataFunction(
  fnOrFormula: MetadataFormula | MetadataFunction | undefined,
): MetadataFormula | undefined {
  return typeof fnOrFormula === 'function' ? makeMetadataFormula(fnOrFormula) : fnOrFormula;
}

type ParameterOptions<T extends ParameterType> = Omit<ParamDef<ParameterTypeMap[T]>, 'type' | 'autocomplete'> & {
  type: T;
  autocomplete?: MetadataFormulaDef | Array<string | number | SimpleAutocompleteOption>;
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
export function makeParameter<T extends ParameterType>(
  paramDefinition: ParameterOptions<T>,
): ParamDef<ParameterTypeMap[T]> {
  const {type, autocomplete: autocompleteDefOrItems, ...rest} = paramDefinition;
  const actualType = ParameterTypeInputMap[type] as ParameterTypeMap[T];
  let autocompleteDef = autocompleteDefOrItems;
  if (Array.isArray(autocompleteDef)) {
    autocompleteDef = makeSimpleAutocompleteMetadataFormula(autocompleteDef);
  }
  const autocomplete = wrapMetadataFunction(autocompleteDef);
  return Object.freeze({...rest, autocomplete, type: actualType});
}

// Other parameter helpers below here are obsolete given the above generate parameter makers.

export function makeStringParameter(
  name: string,
  description: string,
  args: ParamArgs<Type.string> = {},
): ParamDef<Type.string> {
  return Object.freeze({...args, name, description, type: Type.string as Type.string});
}

export function makeStringArrayParameter(
  name: string,
  description: string,
  args: ParamArgs<ArrayType<Type.string>> = {},
): ParamDef<ArrayType<Type.string>> {
  return Object.freeze({...args, name, description, type: stringArray});
}

export function makeNumericParameter(
  name: string,
  description: string,
  args: ParamArgs<Type.number> = {},
): ParamDef<Type.number> {
  return Object.freeze({...args, name, description, type: Type.number as Type.number});
}

export function makeNumericArrayParameter(
  name: string,
  description: string,
  args: ParamArgs<ArrayType<Type.number>> = {},
): ParamDef<ArrayType<Type.number>> {
  return Object.freeze({...args, name, description, type: numberArray});
}

export function makeBooleanParameter(
  name: string,
  description: string,
  args: ParamArgs<Type.boolean> = {},
): ParamDef<Type.boolean> {
  return Object.freeze({...args, name, description, type: Type.boolean as Type.boolean});
}

export function makeBooleanArrayParameter(
  name: string,
  description: string,
  args: ParamArgs<ArrayType<Type.boolean>> = {},
): ParamDef<ArrayType<Type.boolean>> {
  return Object.freeze({...args, name, description, type: booleanArray});
}

export function makeDateParameter(
  name: string,
  description: string,
  args: ParamArgs<Type.date> = {},
): ParamDef<Type.date> {
  return Object.freeze({...args, name, description, type: Type.date as Type.date});
}

export function makeDateArrayParameter(
  name: string,
  description: string,
  args: ParamArgs<ArrayType<Type.date>> = {},
): ParamDef<ArrayType<Type.date>> {
  return Object.freeze({...args, name, description, type: dateArray});
}

export function makeHtmlParameter(
  name: string,
  description: string,
  args: ParamArgs<Type.html> = {},
): ParamDef<Type.html> {
  return Object.freeze({...args, name, description, type: Type.html as Type.html});
}

export function makeHtmlArrayParameter(
  name: string,
  description: string,
  args: ParamArgs<ArrayType<Type.html>> = {},
): ParamDef<ArrayType<Type.html>> {
  return Object.freeze({...args, name, description, type: htmlArray});
}

export function makeImageParameter(
  name: string,
  description: string,
  args: ParamArgs<Type.image> = {},
): ParamDef<Type.image> {
  return Object.freeze({...args, name, description, type: Type.image as Type.image});
}

export function makeImageArrayParameter(
  name: string,
  description: string,
  args: ParamArgs<ArrayType<Type.image>> = {},
): ParamDef<ArrayType<Type.image>> {
  return Object.freeze({...args, name, description, type: imageArray});
}

export function makeUserVisibleError(msg: string): UserVisibleError {
  return new UserVisibleError(msg);
}

export function check(condition: boolean, msg: string) {
  if (!condition) {
    throw makeUserVisibleError(msg);
  }
}

/**
 * @deprecated Formulas should now only be defined as an array, as namespaces are deprecated.
 */
export interface PackFormulas {
  readonly [namespace: string]: Formula[];
}

/**
 * Base type for the inputs for creating a pack formula.
 */
export interface PackFormulaDef<ParamsT extends ParamDefs, ResultT extends PackFormulaResult>
  extends CommonPackFormulaDef<ParamsT> {
  /** The JavaScript function that implements this formula */
  execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<ResultT> | ResultT;
}

export interface StringFormulaDef<ParamsT extends ParamDefs> extends CommonPackFormulaDef<ParamsT> {
  execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<string> | string;
  response?: {
    schema: StringSchema;
  };
}

export interface ObjectResultFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema>
  extends PackFormulaDef<ParamsT, object | object[]> {
  execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<object> | object;
  response?: ResponseHandlerTemplate<SchemaT>;
}

export interface ObjectArrayFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema>
  extends Omit<PackFormulaDef<ParamsT, SchemaType<SchemaT>>, 'execute'> {
  request: RequestHandlerTemplate;
  response: ResponseHandlerTemplate<SchemaT>;
}

/**
 * Inputs to define an "empty" formula, that is, a formula that uses a {@link RequestHandlerTemplate}
 * to define an implementation for the formula rather than implementing an actual `execute` function
 * in JavaScript.
 */
export interface EmptyFormulaDef<ParamsT extends ParamDefs> extends Omit<PackFormulaDef<ParamsT, string>, 'execute'> {
  /** A definition of the request and any transformations to make in order to implement this formula. */
  request: RequestHandlerTemplate;
}

export type BaseFormula<ParamDefsT extends ParamDefs, ResultT extends PackFormulaResult> = PackFormulaDef<
  ParamDefsT,
  ResultT
> & {
  resultType: TypeOf<ResultT>;
};

export type NumericPackFormula<ParamDefsT extends ParamDefs> = BaseFormula<ParamDefsT, number> & {
  schema?: NumberSchema;
};

export type BooleanPackFormula<ParamDefsT extends ParamDefs> = BaseFormula<ParamDefsT, boolean> & {
  schema?: BooleanSchema;
};

export type StringPackFormula<ParamDefsT extends ParamDefs> = BaseFormula<ParamDefsT, SchemaType<StringSchema>> & {
  schema?: StringSchema;
};

export type ObjectPackFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema> = Omit<
  BaseFormula<ParamDefsT, SchemaType<SchemaT>>,
  'execute'
> & {
  schema?: SchemaT;
  // object formula execute result property key will be normalized.
  execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<object> | object;
};

// can't use a map (e.g. ResultTypeToFormulaTypeMap<ParamDefs, SchemaT>[ResultT]) here since
// ParamDefsT isn't propagated correctly.
/**
 * A pack formula, complete with metadata about the formula like its name, description, and parameters,
 * as well as the implementation of that formula.
 *
 * This is the type for an actual user-facing formula, rather than other formula-shaped resources within a
 * pack, like an autocomplete metadata formula or a sync getter formula.
 */
export type Formula<
  ParamDefsT extends ParamDefs = ParamDefs,
  ResultT extends FormulaResultValueType = FormulaResultValueType,
  SchemaT extends Schema = Schema,
> = ResultT extends ValueType.String
  ? StringPackFormula<ParamDefsT>
  : ResultT extends ValueType.Number
  ? NumericPackFormula<ParamDefsT>
  : ResultT extends ValueType.Boolean
  ? BooleanPackFormula<ParamDefsT>
  : ResultT extends ValueType.Array
  ? ObjectPackFormula<ParamDefsT, ArraySchema<SchemaT>>
  : ObjectPackFormula<ParamDefsT, SchemaT>;

type V2PackFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema = Schema> =
  | StringPackFormula<ParamDefsT>
  | NumericPackFormula<ParamDefsT>
  | BooleanPackFormula<ParamDefsT>
  | ObjectPackFormula<ParamDefsT, ArraySchema<SchemaT>>
  | ObjectPackFormula<ParamDefsT, SchemaT>;

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
export type PackFormulaMetadata = Omit<TypedPackFormula, 'execute'>;
/** @hidden */
export type ObjectPackFormulaMetadata = Omit<TypedObjectPackFormula, 'execute'>;

export function isObjectPackFormula(fn: PackFormulaMetadata): fn is ObjectPackFormulaMetadata {
  return fn.resultType === Type.object;
}

export function isStringPackFormula(fn: BaseFormula<ParamDefs, any>): fn is StringPackFormula<ParamDefs> {
  return fn.resultType === Type.string;
}

export function isSyncPackFormula(fn: BaseFormula<ParamDefs, any>): fn is GenericSyncFormula {
  return Boolean((fn as GenericSyncFormula).isSyncFormula);
}

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
 * Inputs for creating the formula that implements a sync table.
 */
export interface SyncFormulaDef<
  K extends string,
  L extends string,
  ParamDefsT extends ParamDefs,
  SchemaT extends ObjectSchemaDefinition<K, L>,
> extends CommonPackFormulaDef<ParamDefsT> {
  /**
   * The JavaScript function that implements this sync.
   *
   * This function takes in parameters and a sync context which may have a continuation
   * from a previous invocation, and fetches and returns one page of results, as well
   * as another continuation if there are more result to fetch.
   */
  execute(params: ParamValues<ParamDefsT>, context: SyncExecutionContext): Promise<SyncFormulaResult<K, L, SchemaT>>;
}

export type SyncFormula<
  K extends string,
  L extends string,
  ParamDefsT extends ParamDefs,
  SchemaT extends ObjectSchema<K, L>,
> = SyncFormulaDef<K, L, ParamDefsT, SchemaT> & {
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
export function makeNumericFormula<ParamDefsT extends ParamDefs>(
  definition: PackFormulaDef<ParamDefsT, number>,
): NumericPackFormula<ParamDefsT> {
  return Object.assign({}, definition, {resultType: Type.number as Type.number}) as NumericPackFormula<ParamDefsT>;
}

/**
 * Helper for returning the definition of a formula that returns a string. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a string.
 */
export function makeStringFormula<ParamDefsT extends ParamDefs>(
  definition: StringFormulaDef<ParamDefsT>,
): StringPackFormula<ParamDefsT> {
  const {response} = definition;
  return Object.assign({}, definition, {
    resultType: Type.string as Type.string,
    ...(response && {schema: response.schema}),
  }) as StringPackFormula<ParamDefsT>;
}

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
export function makeFormula<
  ParamDefsT extends ParamDefs,
  ResultT extends FormulaResultValueType,
  SchemaT extends Schema = Schema,
>(fullDefinition: FormulaDefinitionV2<ParamDefsT, ResultT, SchemaT>): Formula<ParamDefsT, ResultT, SchemaT> {
  let formula: V2PackFormula<ParamDefsT, SchemaT>;
  switch (fullDefinition.resultType) {
    case ValueType.String: {
      // very strange ts knows that fullDefinition.codaType is StringHintTypes but doesn't know if
      // fullDefinition is StringFormulaDefV2.
      const def: StringFormulaDefV2<ParamDefsT> & {codaType?: StringHintTypes; formulaSchema?: StringSchema} = {
        ...fullDefinition,
        codaType: 'codaType' in fullDefinition ? fullDefinition.codaType : undefined,
        formulaSchema: 'schema' in fullDefinition ? fullDefinition.schema : undefined,
      };
      const {onError: _, resultType: unused, codaType, formulaSchema, ...rest} = def;
      const stringFormula: StringPackFormula<ParamDefsT> = {
        ...rest,
        resultType: Type.string,
        schema: formulaSchema || (codaType ? {type: ValueType.String, codaType} : undefined),
      };
      formula = stringFormula;
      break;
    }
    case ValueType.Number: {
      const def: NumericFormulaDefV2<ParamDefsT> & {codaType?: NumberHintTypes; formulaSchema?: NumberSchema} = {
        ...fullDefinition,
        codaType: 'codaType' in fullDefinition ? fullDefinition.codaType : undefined,
        formulaSchema: 'schema' in fullDefinition ? fullDefinition.schema : undefined,
      };
      const {onError: _, resultType: unused, codaType, formulaSchema, ...rest} = def;
      const numericFormula: NumericPackFormula<ParamDefsT> = {
        ...rest,
        resultType: Type.number,
        schema: formulaSchema || (codaType ? {type: ValueType.Number, codaType} : undefined),
      };
      formula = numericFormula;
      break;
    }
    case ValueType.Boolean: {
      const {onError: _, resultType: unused, ...rest} = fullDefinition as BooleanFormulaDefV2<ParamDefsT>;
      const booleanFormula: BooleanPackFormula<ParamDefsT> = {
        ...rest,
        resultType: Type.boolean,
      };
      formula = booleanFormula;
      break;
    }
    case ValueType.Array: {
      const {onError: _, resultType: unused, items, ...rest} = fullDefinition as ArrayFormulaDefV2<ParamDefsT, SchemaT>;
      const arrayFormula: ObjectPackFormula<ParamDefsT, ArraySchema<SchemaT>> = {
        ...rest,
        // TypeOf<SchemaType<ArraySchema<SchemaT>>> is always Type.object but TS can't infer this.
        resultType: Type.object as TypeOf<SchemaType<ArraySchema<SchemaT>>>,
        schema: normalizeSchema({type: ValueType.Array, items}),
      };
      formula = arrayFormula;
      break;
    }
    case ValueType.Object: {
      const {
        onError: _,
        resultType: unused,
        schema,
        ...rest
      } = fullDefinition as ObjectFormulaDefV2<ParamDefsT, SchemaT>;

      // need a force cast since execute has a different return value due to key normalization.
      const objectFormula = {
        ...rest,
        resultType: Type.object as TypeOf<SchemaType<SchemaT>>,
        schema: normalizeSchema(schema),
      } as ObjectPackFormula<ParamDefsT, SchemaT>;

      formula = objectFormula;
      break;
    }
    default:
      return ensureUnreachable(fullDefinition);
  }

  if ([ValueType.Object, ValueType.Array].includes(fullDefinition.resultType)) {
    const wrappedExecute = formula.execute;
    formula.execute = async function (params: ParamValues<ParamDefsT>, context: ExecutionContext) {
      const result = await wrappedExecute(params, context);
      return transformBody(result, ensureExists(formula.schema));
    };
  }

  const onError = fullDefinition.onError;
  if (onError) {
    const wrappedExecute = formula.execute;
    formula.execute = async function (params: ParamValues<ParamDefsT>, context: ExecutionContext) {
      try {
        return await wrappedExecute(params, context);
      } catch (err: any) {
        return onError(err);
      }
    };
  }

  return maybeRewriteConnectionForFormula(formula, fullDefinition.connectionRequirement) as Formula<
    ParamDefsT,
    ResultT,
    SchemaT
  >;
}

interface BaseFormulaDefV2<ParamDefsT extends ParamDefs, ResultT extends string | number | boolean | object>
  extends PackFormulaDef<ParamDefsT, ResultT> {
  onError?(error: Error): any;
}

type StringFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, string> & {
  resultType: ValueType.String;
  execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<string> | string;
} & ({schema?: StringSchema} | {codaType?: StringHintTypes});

type NumericFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, number> & {
  resultType: ValueType.Number;
  execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<number> | number;
} & ({schema?: NumberSchema} | {codaType?: NumberHintTypes});

type BooleanFormulaDefV2<ParamDefsT extends ParamDefs> = BaseFormulaDefV2<ParamDefsT, boolean> & {
  resultType: ValueType.Boolean;
  execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<boolean> | boolean;
};

type ArrayFormulaDefV2<ParamDefsT extends ParamDefs, SchemaT extends Schema> = BaseFormulaDefV2<
  ParamDefsT,
  SchemaType<ArraySchema<SchemaT>>
> & {
  resultType: ValueType.Array;
  items: SchemaT;
};

type ObjectFormulaDefV2<ParamDefsT extends ParamDefs, SchemaT extends Schema> = BaseFormulaDefV2<
  ParamDefsT,
  SchemaType<SchemaT>
> & {
  resultType: ValueType.Object;
  schema: SchemaT;
};

export type FormulaResultValueType =
  | ValueType.String
  | ValueType.Number
  | ValueType.Boolean
  | ValueType.Array
  | ValueType.Object;

// can't use a map here since ParamDefsT isn't propagated correctly.
export type FormulaDefinitionV2<
  ParamDefsT extends ParamDefs,
  ResultT extends FormulaResultValueType,
  SchemaT extends Schema,
> = ResultT extends ValueType.String
  ? StringFormulaDefV2<ParamDefsT>
  : ResultT extends ValueType.Number
  ? NumericFormulaDefV2<ParamDefsT>
  : ResultT extends ValueType.Boolean
  ? BooleanFormulaDefV2<ParamDefsT>
  : ResultT extends ValueType.Array
  ? ArrayFormulaDefV2<ParamDefsT, SchemaT>
  : ObjectFormulaDefV2<ParamDefsT, SchemaT>;

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
   * This option only applies to {@link listDynamicUrls}. When fetching options
   * for entities that can be used as dynamic URLs for a dynamic sync table,
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
export type MetadataContext = Record<string, any>;

/**
 * The type of values that can be returned from a {@link MetadataFormula}.
 */
export type MetadataFormulaResultType = string | number | MetadataFormulaObjectResultType;
/**
 * A formula that returns metadata relating to a core pack building block, like a sync table,
 * a formula parameter, or a user account. Examples include {@link getSchema}, {@link getConnectionName},
 * and {@link autocomplete}.
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
export type MetadataFormula = BaseFormula<[ParamDef<Type.string>, ParamDef<Type.string>], any> & {
  schema?: any;
};
export type MetadataFormulaMetadata = Omit<MetadataFormula, 'execute'>;
export type MetadataFunction = <K extends string, L extends string>(
  context: ExecutionContext,
  search: string,
  formulaContext?: MetadataContext,
) => Promise<MetadataFormulaResultType | MetadataFormulaResultType[] | ArraySchema | ObjectSchema<K, L>>;
export type MetadataFormulaDef = MetadataFormula | MetadataFunction;

/**
 * A wrapper that generates a formula definition from the function that implements a metadata formula.
 * It is uncommon to ever need to call this directly, normally you would just define the JavaScript
 * function implementation, and Coda will wrap it with this to generate a full metadata formula
 * definition.
 *
 * All function-like behavior in a pack is ultimately implemented using formulas, like you would
 * define using {@link makeFormula}. That is, a formula with a name, description, parameter list,
 * and an `execute` function body. This includes supporting utilities like paramter autocomplete functions.
 * This wrapper simply adds the surrounding boilerplate for a given JavaScript function so that
 * it is shaped like a Coda formula to be used at runtime.
 */
export function makeMetadataFormula(
  execute: MetadataFunction,
  options?: {connectionRequirement?: ConnectionRequirement},
): MetadataFormula {
  return makeObjectFormula({
    name: 'getMetadata',
    description: 'Gets metadata',
    // Formula context is serialized here because we do not want to pass objects into
    // regular pack functions (which this is)
    execute([search, serializedFormulaContext], context) {
      let formulaContext = {};
      try {
        formulaContext = JSON.parse(serializedFormulaContext);
      } catch (err: any) {
        //  Ignore.
      }
      return execute(context, search, formulaContext) as any;
    },
    parameters: [
      makeStringParameter('search', 'Metadata to search for', {optional: true}),
      makeStringParameter('formulaContext', 'Serialized JSON for metadata', {optional: true}),
    ],
    examples: [],
    connectionRequirement: options?.connectionRequirement || ConnectionRequirement.Required,
  });
}

/**
 * A result from a parameter autocomplete function that pairs a UI display value with
 * the underlying option that will be used in the formula when selected.
 */
export interface SimpleAutocompleteOption {
  /** Text that will be displayed to the user in UI for this option. */
  display: string;
  /** The actual value that will get used in the formula if this option is selected. */
  value: string | number;
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
export function simpleAutocomplete(
  search: string | undefined,
  options: Array<string | number | SimpleAutocompleteOption>,
): Promise<MetadataFormulaObjectResultType[]> {
  const normalizedSearch = (search || '').toLowerCase();
  const filtered = options.filter(option => {
    const display = typeof option === 'string' || typeof option === 'number' ? option : option.display;
    return display.toString().toLowerCase().includes(normalizedSearch);
  });
  const metadataResults = filtered.map(option => {
    if (typeof option === 'string') {
      return {
        value: option,
        display: option,
      };
    } else if (typeof option === 'number') {
      return {
        value: option,
        display: option.toString(),
      };
    }
    return option;
  });
  return Promise.resolve(metadataResults);
}

/**
 * A helper to search over a list of objects representing candidate search results,
 * filtering to only those that match a search string, and converting the matching
 * objects into the format needed for autocomplete results.
 *
 * A case-sensitive search is performed over each object's `displayKey` property.
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
export function autocompleteSearchObjects<T>(
  search: string,
  objs: T[],
  displayKey: keyof T,
  valueKey: keyof T,
): Promise<MetadataFormulaObjectResultType[]> {
  const normalizedSearch = search.toLowerCase();
  const filtered = objs.filter(o => (o[displayKey] as any).toLowerCase().includes(normalizedSearch));
  const metadataResults = filtered.map(o => {
    return {
      value: o[valueKey],
      display: o[displayKey],
    };
  });
  return Promise.resolve(metadataResults as any[]);
}

/**
 * @deprecated If you have a hardcoded array of autocomplete options, simply include that array
 * as the value of the `autocomplete` property in your parameter definition. There is no longer
 * any needed to wrap a value with this formula.
 */
export function makeSimpleAutocompleteMetadataFormula(
  options: Array<string | number | SimpleAutocompleteOption>,
): MetadataFormula {
  return makeMetadataFormula((context, [search]) => simpleAutocomplete(search, options), {
    // A connection won't be used here, but if the parent formula uses a connection
    // the execution code is going to try to pass it here. We should fix that.
    connectionRequirement: ConnectionRequirement.Optional,
  });
}

function isResponseHandlerTemplate(obj: any): obj is ResponseHandlerTemplate<any> {
  return obj && obj.schema;
}

function isResponseExampleTemplate(obj: any): obj is {example: SchemaType<any>} {
  return obj && obj.example;
}

export function makeObjectFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema>({
  response,
  ...definition
}: ObjectResultFormulaDef<ParamDefsT, SchemaT>): ObjectPackFormula<ParamDefsT, SchemaT> {
  let schema: Schema | undefined;
  if (response) {
    if (isResponseHandlerTemplate(response) && response.schema) {
      response.schema = normalizeSchema(response.schema) as SchemaT;
      schema = response.schema;
    } else if (isResponseExampleTemplate(response)) {
      // TODO(alexd): Figure out what to do with examples.
      // schema = generateSchema(response.example);
    }
  }

  let execute = definition.execute;
  if (isResponseHandlerTemplate(response)) {
    const {onError} = response;
    const wrappedExecute = execute;
    const responseHandler = generateObjectResponseHandler(response);
    execute = async function exec(params: ParamValues<ParamDefsT>, context: ExecutionContext) {
      let result: object;
      try {
        result = await wrappedExecute(params, context);
      } catch (err: any) {
        if (onError) {
          result = onError(err);
        } else {
          throw err;
        }
      }
      return responseHandler({body: ensureExists(result), status: 200, headers: {}}) as
        | SchemaType<SchemaT>
        | Array<SchemaType<SchemaT>>;
    };
  }

  return Object.assign({}, definition, {
    resultType: Type.object,
    execute,
    schema,
  }) as ObjectPackFormula<ParamDefsT, SchemaT>;
}

/**
 * Input options for defining a sync table. See {@link makeSyncTable}.
 */
export interface SyncTableOptions<
  K extends string,
  L extends string,
  ParamDefsT extends ParamDefs,
  SchemaT extends ObjectSchemaDefinition<K, L>,
> {
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
  formula: SyncFormulaDef<K, L, ParamDefsT, SchemaT>;
  /**
   * A {@link ConnectionRequirement} that will be used for all formulas contained within
   * this sync table (including autocomplete formulas).
   */
  connectionRequirement?: ConnectionRequirement;
  /**
   * A set of options used internally by {@link makeDynamicSyncTable}
   */
  dynamicOptions?: {
    /**
     * A formula that returns the schema for this table.
     *
     * For a dynamic sync table, the value of {@link DynamicSyncTableOptions.getSchema}
     * is passed through here. For a non-dynamic sync table, you may still implement
     * this if you table has a schema that varies based on the user account, but
     * does not require a {@link dynamicUrl}.
     */
    getSchema?: MetadataFormulaDef;
    /** See {@link DynamicSyncTableOptions.entityName} */
    entityName?: string;
  };
}

export interface DynamicSyncTableOptions<
  K extends string,
  L extends string,
  ParamDefsT extends ParamDefs,
  SchemaT extends ObjectSchemaDefinition<K, L>,
> {
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
export function makeSyncTable<
  K extends string,
  L extends string,
  ParamDefsT extends ParamDefs,
  SchemaDefT extends ObjectSchemaDefinition<K, L>,
  SchemaT extends SchemaDefT & {
    identity?: Identity;
  },
>({
  name,
  identityName,
  schema: schemaDef,
  formula,
  connectionRequirement,
  dynamicOptions = {},
}: SyncTableOptions<K, L, ParamDefsT, SchemaDefT>): SyncTableDef<K, L, ParamDefsT, SchemaT> {
  const {getSchema: getSchemaDef, entityName} = dynamicOptions;
  const {execute: wrappedExecute, ...definition} = maybeRewriteConnectionForFormula(formula, connectionRequirement);
  if (schemaDef.identity) {
    schemaDef.identity = {...schemaDef.identity, name: identityName || schemaDef.identity.name};
  } else if (identityName) {
    schemaDef.identity = {name: identityName};
  }
  const getSchema = wrapMetadataFunction(getSchemaDef);
  const schema = makeObjectSchema<K, L, SchemaDefT>(schemaDef) as SchemaT;
  const formulaSchema = getSchema
    ? undefined
    : normalizeSchema<ArraySchema<Schema>>({type: ValueType.Array, items: schema});
  const {identity, id, primary} = schema;
  if (!(primary && id && identity)) {
    throw new Error(`Sync table schemas should have defined properties for identity, id and primary`);
  }

  if (name.includes(' ')) {
    throw new Error('Sync table name should not include spaces');
  }

  const responseHandler = generateObjectResponseHandler({schema: formulaSchema});
  const execute = async function exec(params: ParamValues<ParamDefsT>, context: SyncExecutionContext) {
    const {result, continuation} = await wrappedExecute(params, context);
    const appliedSchema = context.sync.schema;
    return {
      result: responseHandler({body: ensureExists(result), status: 200, headers: {}}, appliedSchema),
      continuation,
    } as SyncFormulaResult<K, L, SchemaT>;
  };
  return {
    name,
    schema: normalizeSchema(schema),
    getter: {
      ...definition,
      cacheTtlSecs: 0,
      execute,
      schema: formulaSchema,
      isSyncFormula: true,
      connectionRequirement: definition.connectionRequirement || connectionRequirement,
      resultType: Type.object as any,
    },
    getSchema: maybeRewriteConnectionForFormula(getSchema, connectionRequirement),
    entityName,
  };
}

export function makeSyncTableLegacy<
  K extends string,
  L extends string,
  ParamDefsT extends ParamDefs,
  SchemaT extends ObjectSchema<K, L>,
>(
  name: string,
  schema: SchemaT,
  formula: SyncFormulaDef<K, L, ParamDefsT, SchemaT>,
  connectionRequirement?: ConnectionRequirement,
  dynamicOptions: {
    getSchema?: MetadataFormula;
    entityName?: string;
  } = {},
): SyncTableDef<K, L, ParamDefsT, SchemaT> {
  return makeSyncTable({name, identityName: '', schema, formula, connectionRequirement, dynamicOptions});
}

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
export function makeDynamicSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs>({
  name,
  getName: getNameDef,
  getSchema: getSchemaDef,
  getDisplayUrl: getDisplayUrlDef,
  formula,
  listDynamicUrls: listDynamicUrlsDef,
  entityName,
  connectionRequirement,
}: {
  name: string;
  getName: MetadataFormulaDef;
  getSchema: MetadataFormulaDef;
  formula: SyncFormulaDef<K, L, ParamDefsT, any>;
  getDisplayUrl: MetadataFormulaDef;
  listDynamicUrls?: MetadataFormulaDef;
  entityName?: string;
  connectionRequirement?: ConnectionRequirement;
}): DynamicSyncTableDef<K, L, ParamDefsT, any> {
  const fakeSchema: any = makeObjectSchema({
    // This schema is useless... just creating a stub here but the client will use
    // the dynamic one.
    type: ValueType.Object,
    id: 'id',
    primary: 'id',
    identity: {name},
    properties: {
      id: {type: ValueType.String},
    },
  });
  const getName = wrapMetadataFunction(getNameDef);
  const getSchema = wrapMetadataFunction(getSchemaDef);
  const getDisplayUrl = wrapMetadataFunction(getDisplayUrlDef);
  const listDynamicUrls = wrapMetadataFunction(listDynamicUrlsDef);
  const table = makeSyncTable({
    name,
    identityName: '',
    schema: fakeSchema,
    formula,
    connectionRequirement,
    dynamicOptions: {getSchema, entityName},
  });
  return {
    ...table,
    isDynamic: true,
    getDisplayUrl: maybeRewriteConnectionForFormula(getDisplayUrl, connectionRequirement),
    listDynamicUrls: maybeRewriteConnectionForFormula(listDynamicUrls, connectionRequirement),
    getName: maybeRewriteConnectionForFormula(getName, connectionRequirement),
  } as DynamicSyncTableDef<K, L, ParamDefsT, any>;
}

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
export function makeTranslateObjectFormula<ParamDefsT extends ParamDefs, ResultT extends Schema>({
  response,
  ...definition
}: ObjectArrayFormulaDef<ParamDefsT, ResultT>) {
  const {request, ...rest} = definition;
  const {parameters} = rest;
  response.schema = response.schema ? (normalizeSchema(response.schema) as ResultT) : undefined;
  const {onError} = response;
  const requestHandler = generateRequestHandler(request, parameters);
  const responseHandler = generateObjectResponseHandler(response);

  function execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<SchemaType<ResultT>> {
    return context.fetcher
      .fetch(requestHandler(params))
      .catch(err => {
        if (onError) {
          return onError(err);
        }
        throw err;
      })
      .then(responseHandler);
  }

  return Object.assign({}, rest, {
    execute,
    resultType: Type.object as const,
    schema: response.schema,
  });
}

// TODO(jonathan/ekoleda): Flesh out a guide for empty formulas if this is something we care to support.
// We probably also need the builder's addFormula() method to support empty formula defs if it doesn't already.
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
export function makeEmptyFormula<ParamDefsT extends ParamDefs>(definition: EmptyFormulaDef<ParamDefsT>) {
  const {request, ...rest} = definition;
  const {parameters} = rest;
  const requestHandler = generateRequestHandler(request, parameters);

  function execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<string> {
    return context.fetcher!.fetch(requestHandler(params)).then(() => '');
  }

  return Object.assign({}, rest, {
    execute,
    resultType: Type.string as const,
  });
}

export function maybeRewriteConnectionForFormula<
  ParamDefsT extends ParamDefs,
  T extends CommonPackFormulaDef<ParamDefsT> | undefined,
>(formula: T, connectionRequirement: ConnectionRequirement | undefined): T {
  if (formula && connectionRequirement) {
    return {
      ...formula,
      parameters: formula.parameters.map((param: ParamDef<UnionType>) => {
        return {
          ...param,
          autocomplete: param.autocomplete
            ? maybeRewriteConnectionForFormula(param.autocomplete, connectionRequirement)
            : undefined,
        };
      }) as ParamDefsT,
      varargParameters: formula.varargParameters?.map((param: ParamDef<UnionType>) => {
        return {
          ...param,
          autocomplete: param.autocomplete
            ? maybeRewriteConnectionForFormula(param.autocomplete, connectionRequirement)
            : undefined,
        };
      }) as ParamDefsT,
      connectionRequirement,
    };
  }
  return formula;
}
