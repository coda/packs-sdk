import { $Omit } from './type_utils';
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
export declare function isUserVisibleError(error: Error): error is UserVisibleError;
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
export declare function makeUserVisibleError(msg: string): UserVisibleError;
export declare function check(condition: boolean, msg: string): void;
export interface PackFormulas {
    readonly [namespace: string]: TypedPackFormula[];
}
interface PackFormulaDef<ParamsT extends ParamDefs, ResultT extends PackFormulaResult> extends CommonPackFormulaDef<ParamsT> {
    execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<ResultT> | ResultT;
}
interface StringFormulaDef<ParamsT extends ParamDefs> extends CommonPackFormulaDef<ParamsT> {
    execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<string> | string;
    response?: {
        schema: StringSchema;
    };
}
interface ObjectResultFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema> extends PackFormulaDef<ParamsT, SchemaType<SchemaT>> {
    response?: ResponseHandlerTemplate<SchemaT>;
}
interface ObjectArrayFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema> extends $Omit<PackFormulaDef<ParamsT, SchemaType<SchemaT>>, 'execute'> {
    request: RequestHandlerTemplate;
    response: ResponseHandlerTemplate<SchemaT>;
}
interface EmptyFormulaDef<ParamsT extends ParamDefs> extends $Omit<PackFormulaDef<ParamsT, string>, 'execute'> {
    request: RequestHandlerTemplate;
}
declare type Formula<ParamDefsT extends ParamDefs, ResultT extends PackFormulaResult> = PackFormulaDef<ParamDefsT, ResultT> & {
    resultType: TypeOf<ResultT>;
};
declare type NumericPackFormula<ParamDefsT extends ParamDefs> = Formula<ParamDefsT, number> & {
    schema?: NumberSchema;
};
declare type StringPackFormula<ParamDefsT extends ParamDefs> = Formula<ParamDefsT, string> & {
    schema?: StringSchema;
};
declare type ObjectPackFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema> = Formula<ParamDefsT, SchemaType<SchemaT>> & {
    schema?: SchemaT;
};
export declare type TypedPackFormula = NumericPackFormula<any> | StringPackFormula<any> | ObjectPackFormula<any, any>;
export declare function isObjectPackFormula(fn: Formula<any, any>): fn is ObjectPackFormula<any, any>;
export declare function isStringPackFormula(fn: Formula<any, any>): fn is StringPackFormula<any>;
export declare function makeNumericFormula<ParamDefsT extends ParamDefs>(definition: PackFormulaDef<ParamDefsT, number>): NumericPackFormula<ParamDefsT>;
export declare function makeStringFormula<ParamDefsT extends ParamDefs>(definition: StringFormulaDef<ParamDefsT>): StringPackFormula<ParamDefsT>;
export declare type GetConnectionNameFormula = StringPackFormula<[ParamDef<Type.string>, ParamDef<Type.string>]>;
export declare function makeGetConnectionNameFormula(execute: (context: ExecutionContext, codaUserName: string, authParams: string) => Promise<string> | string): GetConnectionNameFormula;
export declare function makeObjectFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema>({ response, ...definition }: ObjectResultFormulaDef<ParamDefsT, SchemaT>): ObjectPackFormula<ParamDefsT, SchemaT>;
export declare function makeTranslateObjectFormula<ParamDefsT extends ParamDefs, ResultT extends Schema>({ response, ...definition }: ObjectArrayFormulaDef<ParamDefsT, ResultT>): {
    request: RequestHandlerTemplate;
    description: string;
    name: string;
    examples: {
        params: import("./api_types").PackFormulaValue[];
        result: PackFormulaResult;
    }[];
    parameters: ParamDefsT;
    varargParameters?: [ParamDef<any>, ...ParamDef<any>[]] | never[] | undefined;
    network?: import("./api_types").Network | undefined;
    cacheTtlSecs?: number | undefined;
    isExperimental?: boolean | undefined;
} & {
    execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<SchemaType<ResultT>>;
    resultType: Type;
    schema: ResultT;
};
export declare function makeEmptyFormula<ParamDefsT extends ParamDefs>(definition: EmptyFormulaDef<ParamDefsT>): EmptyFormulaDef<ParamDefsT> & {
    execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<string>;
    resultType: Type;
};
