import type { FetchRequest } from '../../api_types';
import type { FetchResponse } from '../../api_types';
import type { FormulaSpecification } from '../types';
import type { PackFormulaResult } from '../../api_types';
import type { ParamDefs } from '../../api_types';
import type { ParamValues } from '../../api_types';
import type { SyncFormulaResult } from '../../api';
/**
 * The thunk entrypoint - the first code that runs inside the v8 isolate once control is passed over.
 */
export declare function findAndExecutePackFunction(params: ParamValues<ParamDefs>, formulaSpec: FormulaSpecification): Promise<PackFormulaResult | SyncFormulaResult<any>>;
export declare function ensureSwitchUnreachable(value: never): never;
export declare function handleErrorAsync(func: () => Promise<any>): Promise<any>;
export declare function handleError(func: () => any): any;
export declare function handleFetcherStatusError(fetchResult: FetchResponse, fetchRequest: FetchRequest): void;
