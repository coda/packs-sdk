import {ArraySchema, StringHintTypes} from './schema';
import {ArrayType} from './api_types';
import {CommonPackFormulaDef} from './api_types';
import {ExecutionContext} from './api_types';
import {NumberSchema} from './schema';
import {PackFormulaResult} from './api_types';
import {ParamArgs} from './api_types';
import {ParamDefs} from './api_types';
import {ParamDef} from './api_types';
import {ParamValues} from './api_types';
import {RequestHandlerTemplate} from './handler_templates';
import {ResponseHandlerTemplate} from './handler_templates';
import {SchemaType} from './schema';
import {Schema} from './schema';
import {StringSchema} from './schema';
import {SyncExecutionContext} from './api_types';
import {ObjectSchema} from './schema';
import {Type} from './api_types';
import {TypeOf} from './api_types';
import {ValueType} from './schema';
import {booleanArray} from './api_types';
import {dateArray} from './api_types';
import {ensureExists} from './helpers/ensure';
import {generateObjectResponseHandler} from './handler_templates';
import {generateRequestHandler} from './handler_templates';
import {htmlArray} from './api_types';
import {imageArray} from './api_types';
import {makeObjectSchema} from './schema';
import {normalizeSchema} from './schema';
import {numberArray} from './api_types';
import {stringArray} from './api_types';

export {ExecutionContext};
export {FetchRequest} from './api_types';

export class UserVisibleError extends Error {
  readonly isUserVisible = true;
  constructor(message?: string) {
    super(message);
  }
}

export class StatusCodeError extends Error {
  statusCode: number;
  constructor(statusCode: number) {
    super(`statusCode: ${statusCode}`);
    this.statusCode = statusCode;
  }
}

export interface SyncTableDef<
  K extends string,
  L extends string,
  ParamDefsT extends ParamDefs,
  SchemaT extends ObjectSchema<K, L>
> {
  name: string;
  schema: SchemaT;
  getter: SyncFormula<K, L, ParamDefsT, SchemaT>;
  getSchema?: MetadataFormula;
  entityName?: string;
}

export interface DynamicSyncTableDef<
  K extends string,
  L extends string,
  ParamDefsT extends ParamDefs,
  SchemaT extends ObjectSchema<K, L>
> extends SyncTableDef<K, L, ParamDefsT, SchemaT> {
  isDynamic: true;
  getSchema: MetadataFormula;
  getName: MetadataFormula;
  getDisplayUrl: MetadataFormula;
  listDynamicUrls?: MetadataFormula;
}

export interface Continuation {
  [key: string]: string | number;
}
export type GenericSyncFormula = SyncFormula<any, any, ParamDefs, any>;
export type GenericSyncFormulaResult = SyncFormulaResult<any>;
export type GenericSyncTable = SyncTableDef<any, any, ParamDefs, any>;
export type GenericDynamicSyncTable = DynamicSyncTableDef<any, any, ParamDefs, any>;
export type SyncTable = GenericSyncTable | GenericDynamicSyncTable;

export function isUserVisibleError(error: Error): error is UserVisibleError {
  return 'isUserVisible' in error && (error as any).isUserVisible;
}

export function isDynamicSyncTable(syncTable: SyncTable): syncTable is GenericDynamicSyncTable {
  return 'isDynamic' in syncTable;
}

// NOTE[roger] remove once not needed.
export const PARAM_DESCRIPTION_DOES_NOT_EXIST =
  'NO PARAMETER DESCRIPTION HAS BEEN ADDED. For guidance, see https://coda.link/param-docs';

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

export interface PackFormulas {
  readonly [namespace: string]: TypedStandardFormula[];
}

export interface PackFormulaDef<ParamsT extends ParamDefs, ResultT extends PackFormulaResult>
  extends CommonPackFormulaDef<ParamsT> {
  execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<ResultT> | ResultT;
}

interface StringFormulaDef<ParamsT extends ParamDefs> extends CommonPackFormulaDef<ParamsT> {
  execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<string> | string;
  response?: {
    schema: StringSchema;
  };
}

interface ObjectResultFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema>
  extends PackFormulaDef<ParamsT, SchemaType<SchemaT> | Array<SchemaType<SchemaT>>> {
  response?: ResponseHandlerTemplate<SchemaT>;
}

interface ObjectArrayFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema>
  extends Omit<PackFormulaDef<ParamsT, SchemaType<SchemaT>>, 'execute'> {
  request: RequestHandlerTemplate;
  response: ResponseHandlerTemplate<SchemaT>;
}

export interface EmptyFormulaDef<ParamsT extends ParamDefs> extends Omit<PackFormulaDef<ParamsT, string>, 'execute'> {
  request: RequestHandlerTemplate;
}

type Formula<ParamDefsT extends ParamDefs, ResultT extends PackFormulaResult> = PackFormulaDef<ParamDefsT, ResultT> & {
  resultType: TypeOf<ResultT>;
};

type NumericPackFormula<ParamDefsT extends ParamDefs> = Formula<ParamDefsT, number> & {schema?: NumberSchema};
type StringPackFormula<ParamDefsT extends ParamDefs, ResultT extends StringHintTypes = StringHintTypes> = Formula<
  ParamDefsT,
  SchemaType<StringSchema<ResultT>>
> & {
  schema?: StringSchema<ResultT>;
};

export type ObjectPackFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema> = Formula<
  ParamDefsT,
  SchemaType<SchemaT>
> & {
  schema?: SchemaT;
};

export type TypedStandardFormula =
  | NumericPackFormula<ParamDefs>
  | StringPackFormula<ParamDefs, any>
  | ObjectPackFormula<ParamDefs, Schema>;

export type TypedPackFormula = TypedStandardFormula | GenericSyncFormula;

type TypedObjectPackFormula = ObjectPackFormula<ParamDefs, Schema>;
export type PackFormulaMetadata = Omit<TypedPackFormula, 'execute'>;
export type ObjectPackFormulaMetadata = Omit<TypedObjectPackFormula, 'execute'>;
export function isObjectPackFormula(fn: PackFormulaMetadata): fn is ObjectPackFormulaMetadata {
  return fn.resultType === Type.object;
}

export function isStringPackFormula(fn: Formula<ParamDefs, any>): fn is StringPackFormula<ParamDefs> {
  return fn.resultType === Type.string;
}

export function isSyncPackFormula(fn: Formula<ParamDefs, any>): fn is GenericSyncFormula {
  return Boolean((fn as GenericSyncFormula).isSyncFormula);
}

interface SyncFormulaResult<ResultT extends object> {
  result: ResultT[];
  continuation?: Continuation;
}

interface SyncFormulaDef<
  K extends string,
  L extends string,
  ParamsT extends ParamDefs,
  SchemaT extends ObjectSchema<K, L>
> extends CommonPackFormulaDef<ParamsT> {
  execute(
    params: ParamValues<ParamsT>,
    context: SyncExecutionContext,
    continuation?: Continuation,
    schema?: string,
  ): Promise<SyncFormulaResult<SchemaType<SchemaT>>>;
}

export type SyncFormula<
  K extends string,
  L extends string,
  ParamDefsT extends ParamDefs,
  SchemaT extends ObjectSchema<K, L>
> = SyncFormulaDef<K, L, ParamDefsT, SchemaT> & {
  resultType: TypeOf<SchemaType<SchemaT>>;
  isSyncFormula: true;
  schema?: ArraySchema;
};

export function makeNumericFormula<ParamDefsT extends ParamDefs>(
  definition: PackFormulaDef<ParamDefsT, number>,
): NumericPackFormula<ParamDefsT> {
  return Object.assign({}, definition, {resultType: Type.number as Type.number}) as NumericPackFormula<ParamDefsT>;
}

export function makeStringFormula<ParamDefsT extends ParamDefs>(
  definition: StringFormulaDef<ParamDefsT>,
): StringPackFormula<ParamDefsT> {
  const {response} = definition;
  return Object.assign({}, definition, {
    resultType: Type.string as Type.string,
    ...(response && {schema: response.schema}),
  }) as StringPackFormula<ParamDefsT>;
}

export type GetConnectionNameFormula = StringPackFormula<[ParamDef<Type.string>, ParamDef<Type.string>]>;
export function makeGetConnectionNameFormula(
  execute: (context: ExecutionContext, codaUserName: string) => Promise<string> | string,
): GetConnectionNameFormula {
  return makeStringFormula({
    name: 'getConnectionName',
    description: 'Return name for new connection.',
    execute([codaUserName], context) {
      return execute(context, codaUserName);
    },
    parameters: [
      makeStringParameter('codaUserName', 'The username of the Coda account to use.'),
      makeStringParameter('authParams', 'The parameters to use for this connection.'),
    ],
    examples: [],
    network: {
      hasSideEffect: false,
      hasConnection: true,
      requiresConnection: true,
    },
  });
}

export interface MetadataFormulaObjectResultType {
  display: string;
  value: string | number;
  hasChildren?: boolean;
}

export type MetadataContext = Record<string, any>;

export type MetadataFormulaResultType = string | number | MetadataFormulaObjectResultType;
export type MetadataFormula = ObjectPackFormula<[ParamDef<Type.string>, ParamDef<Type.string>], any>;
export function makeMetadataFormula(
  execute: (
    context: ExecutionContext,
    search: string,
    formulaContext?: MetadataContext,
  ) => Promise<MetadataFormulaResultType | MetadataFormulaResultType[] | ArraySchema>,
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
      } catch (err) {
        //  Ignore.
      }
      return execute(context, search, formulaContext) as any;
    },
    parameters: [
      makeStringParameter('search', 'Metadata to search for', {optional: true}),
      makeStringParameter('formulaContext', 'Serialized JSON for metadata', {optional: true}),
    ],
    examples: [],
    network: {
      hasSideEffect: false,
      hasConnection: true,
      requiresConnection: true,
    },
  });
}

export interface SimpleAutocompleteOption {
  display: string;
  value: string | number;
}

export function simpleAutocomplete(
  search: string | undefined,
  options: Array<string | SimpleAutocompleteOption>,
): Promise<MetadataFormulaObjectResultType[]> {
  const normalizedSearch = (search || '').toLowerCase();
  const filtered = options.filter(option => {
    const display = typeof option === 'string' ? option : option.display;
    return display.toLowerCase().includes(normalizedSearch);
  });
  const metadataResults = filtered.map(option => {
    if (typeof option === 'string') {
      return {
        value: option,
        display: option,
      };
    }
    return option;
  });
  return Promise.resolve(metadataResults);
}

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

export function makeSimpleAutocompleteMetadataFormula(
  options: Array<string | SimpleAutocompleteOption>,
): MetadataFormula {
  return makeMetadataFormula((context, [search]) => simpleAutocomplete(search, options));
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
      let result: SchemaType<SchemaT> | Array<SchemaType<SchemaT>>;
      try {
        result = await wrappedExecute(params, context);
      } catch (err) {
        if (onError) {
          result = onError(err);
        } else {
          throw err;
        }
      }
      return responseHandler({body: ensureExists(result), status: 200, headers: {}});
    };
  }

  return Object.assign({}, definition, {
    resultType: Type.object,
    execute,
    schema,
  }) as ObjectPackFormula<ParamDefsT, SchemaT>;
}

export function makeSyncTable<
  K extends string,
  L extends string,
  ParamDefsT extends ParamDefs,
  SchemaT extends ObjectSchema<K, L>
>(
  name: string,
  schema: SchemaT,
  {execute: wrappedExecute, ...definition}: SyncFormulaDef<K, L, ParamDefsT, SchemaT>,
  getSchema?: MetadataFormula,
  entityName?: string,
): SyncTableDef<K, L, ParamDefsT, SchemaT> {
  const formulaSchema = getSchema ? undefined : normalizeSchema({type: ValueType.Array, items: schema});
  const {identity, id, primary} = schema;
  if (!(primary && id && identity)) {
    throw new Error(`Sync table schemas should have defined properties for identity, id and primary`);
  }

  const responseHandler = generateObjectResponseHandler({schema: formulaSchema, excludeExtraneous: true});
  const execute = async function exec(
    params: ParamValues<ParamDefsT>,
    context: SyncExecutionContext,
    input: Continuation | undefined, // TODO(alexd): Remove
    runtimeSchema: string | undefined, // TODO(alexd): Remove
  ) {
    const {result, continuation} = await wrappedExecute(params, context, input);
    const appliedSchema = (context.sync && context.sync.schema) || (runtimeSchema && JSON.parse(runtimeSchema));
    return {
      result: responseHandler({body: ensureExists(result), status: 200, headers: {}}, appliedSchema) as Array<
        SchemaType<SchemaT>
      >,
      continuation,
    };
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
      resultType: Type.object as any,
    },
    getSchema,
    entityName,
  };
}

export function makeDynamicSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs>({
  packId,
  name,
  getName,
  getSchema,
  getDisplayUrl,
  formula,
  listDynamicUrls,
  entityName,
}: {
  packId: number;
  name: string;
  getName: MetadataFormula;
  getSchema: MetadataFormula;
  formula: SyncFormulaDef<K, L, ParamDefsT, any>;
  getDisplayUrl: MetadataFormula;
  listDynamicUrls?: MetadataFormula;
  entityName?: string;
}): DynamicSyncTableDef<K, L, ParamDefsT, any> {
  const fakeSchema = makeObjectSchema({
    // This schema is useless... just creating a stub here but the client will use
    // the dynamic one.
    type: ValueType.Object,
    id: 'id',
    primary: 'id',
    identity: {
      packId,
      name,
    },
    properties: {
      id: {type: ValueType.String},
    },
  });
  const table = makeSyncTable(name, fakeSchema, formula, getSchema, entityName);
  return {
    ...table,
    isDynamic: true,
    getDisplayUrl,
    listDynamicUrls,
    getName,
  } as DynamicSyncTableDef<K, L, ParamDefsT, any>;
}

export function makeTranslateObjectFormula<ParamDefsT extends ParamDefs, ResultT extends Schema>({
  response,
  ...definition
}: ObjectArrayFormulaDef<ParamDefsT, ResultT>) {
  const {request, parameters} = definition;
  response.schema = response.schema ? (normalizeSchema(response.schema) as ResultT) : undefined;
  const {onError} = response;
  const requestHandler = generateRequestHandler(request, parameters);
  const responseHandler = generateObjectResponseHandler(response);

  function execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<SchemaType<ResultT>> {
    return context
      .fetcher!.fetch(requestHandler(params))
      .catch(err => {
        if (onError) {
          return onError(err);
        }
        throw err;
      })
      .then(responseHandler);
  }

  return Object.assign({}, definition, {
    execute,
    resultType: Type.object as const,
    schema: response.schema,
  });
}

export function makeEmptyFormula<ParamDefsT extends ParamDefs>(definition: EmptyFormulaDef<ParamDefsT>) {
  const {request, parameters} = definition;
  const requestHandler = generateRequestHandler(request, parameters);

  function execute(params: ParamValues<ParamDefsT>, context: ExecutionContext): Promise<string> {
    return context.fetcher!.fetch(requestHandler(params)).then(() => '');
  }

  return Object.assign({}, definition, {
    execute,
    resultType: Type.string as const,
  });
}
