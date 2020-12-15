import type { ParamDefs } from '../api_types';
import type { ParamValues } from '../api_types';
import type { TypedPackFormula } from '../api';
export declare function coerceParams(formula: TypedPackFormula, args: ParamValues<ParamDefs>): ParamValues<ParamDefs>;
