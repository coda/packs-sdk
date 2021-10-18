import type { ParamDefs } from '../api_types';
import type { ParamValues } from '../api_types';
import type { TypedPackFormula } from '../api';
export declare function validateParams(formula: TypedPackFormula, args: ParamValues<ParamDefs>): void;
export declare function validateResult<ResultT extends any>(formula: TypedPackFormula, result: ResultT): void;
