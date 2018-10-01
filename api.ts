import {CommonPackFormulaDef} from './api_types';
import {ExecutionContext} from './api_types';
import {PackFormulaResult} from './api_types';
import {ParamArgs} from './api_types';
import {ParamDef} from './api_types';
import {ParamDefs} from './api_types';
import {ParamValues} from './api_types';
import {Schema} from './schema';
import {SchemaType} from './schema';
import {StringSchema} from './schema';
import {Type} from './api_types';
import {TypeOf} from './api_types';
import {RequestHandlerTemplate} from './handler_templates';
import {ResponseHandlerTemplate} from './handler_templates';
import {ensureExists} from './helpers/ensure';
import {generateRequestHandler} from './handler_templates';
import {generateObjectResponseHandler} from './handler_templates';
import {normalizeSchema} from './schema';

export {ExecutionContext};
export {FetchRequest} from './api_types';

export class UserVisibleError extends Error {}

export class StatusCodeError extends Error {
  statusCode: number;
  constructor(statusCode: number) {
    super(`statusCode: ${statusCode}`);
    this.statusCode = statusCode;
  }
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

export function makeNumericParameter(
  name: string,
  description: string,
  args: ParamArgs<Type.number> = {},
): ParamDef<Type.number> {
  return Object.freeze({...args, name, description, type: Type.number as Type.number});
}

export function makeBooleanParameter(
  name: string,
  description: string,
  args: ParamArgs<Type.boolean> = {},
): ParamDef<Type.boolean> {
  return Object.freeze({...args, name, description, type: Type.boolean as Type.boolean});
}

export function makeDateParameter(
  name: string,
  description: string,
  args: ParamArgs<Type.date> = {},
): ParamDef<Type.date> {
  return Object.freeze({...args, name, description, type: Type.date as Type.date});
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
  readonly [namespace: string]: TypedPackFormula[];
}

interface PackFormulaDef<ParamsT extends ParamDefs, ResultT extends PackFormulaResult>
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
  extends PackFormulaDef<ParamsT, SchemaType<SchemaT>> {
  response?: ResponseHandlerTemplate<SchemaT>;
}

interface ObjectArrayFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema>
  extends $Omit<PackFormulaDef<ParamsT, SchemaType<SchemaT>>, 'execute'> {
  request: RequestHandlerTemplate;
  response: ResponseHandlerTemplate<SchemaT>;
}

interface EmptyFormulaDef<ParamsT extends ParamDefs> extends $Omit<PackFormulaDef<ParamsT, string>, 'execute'> {
  request: RequestHandlerTemplate;
}

type Formula<ParamDefsT extends ParamDefs, ResultT extends PackFormulaResult> = PackFormulaDef<ParamDefsT, ResultT> & {
  resultType: TypeOf<ResultT>;
};

type NumericPackFormula<ParamDefsT extends ParamDefs> = Formula<ParamDefsT, number>;
type StringPackFormula<ParamDefsT extends ParamDefs> = Formula<ParamDefsT, string> & {
  schema?: StringSchema;
};

type ObjectPackFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema> = Formula<
  ParamDefsT,
  SchemaType<SchemaT>
> & {
  schema?: SchemaT;
};

export type TypedPackFormula = NumericPackFormula<any> | StringPackFormula<any> | ObjectPackFormula<any, any>;

export function isObjectPackFormula(fn: Formula<any, any>): fn is ObjectPackFormula<any, any> {
  return fn.resultType === Type.object;
}

export function isStringPackFormula(fn: Formula<any, any>): fn is StringPackFormula<any> {
  return fn.resultType === Type.string;
}

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
  execute: (context: ExecutionContext, codaUserName: string, authParams: string) => Promise<string> | string,
): GetConnectionNameFormula {
  return makeStringFormula({
    name: 'getConnectionName',
    description: 'Return name for new connection.',
    execute(args, context) {
      const [codaUserName, authParams] = args;
      return execute(context, codaUserName, authParams);
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

function isResponseHandlerTemplate(obj: any): obj is ResponseHandlerTemplate<any> {
  return obj && obj.schema;
}

function isResponseExampleTemplate(obj: any): obj is {example: SchemaType<any>} {
  return obj && obj.example;
}

export function makeObjectFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema>(
  definition: ObjectResultFormulaDef<ParamDefsT, SchemaT>,
): ObjectPackFormula<ParamDefsT, SchemaT> {
  const {response} = definition;
  let schema: Schema | undefined;
  if (response) {
    if (isResponseHandlerTemplate(response)) {
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
      let result: SchemaType<SchemaT>;
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

export function makeTranslateObjectFormula<ParamDefsT extends ParamDefs, ResultT extends Schema>(
  definition: ObjectArrayFormulaDef<ParamDefsT, ResultT>,
) {
  const {request, response, parameters} = definition;
  response.schema = normalizeSchema(response.schema) as ResultT;
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
    resultType: Type.object,
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
    resultType: Type.string,
  });
}
