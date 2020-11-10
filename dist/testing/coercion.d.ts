import type { ParamDefs } from '../api_types';
import type { ParamValues } from '../api_types';
import type { TypedStandardFormula } from '../api';
export declare function coerceParams(formula: TypedStandardFormula, params: ParamValues<ParamDefs>): ParamValues<ParamDefs>;
