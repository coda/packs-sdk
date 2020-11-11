import type { ParamDefs } from '../api_types';
import type { TypedStandardFormula } from '../api';
export declare function validateParams(formula: TypedStandardFormula, params: ParamDefs): void;
export declare function validateResult<ResultT extends any>(_formula: TypedStandardFormula, _result: ResultT): void;
