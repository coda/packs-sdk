import type { ExecutionContext } from '../api';
import type { PackDefinition } from '../types';
import type { TypedStandardFormula } from '../api';
export declare function executeFormulaWithRawParams(manifest: PackDefinition, formulaName: string, rawParams: string[], context: ExecutionContext): Promise<any>;
export declare function findFormula(packDef: PackDefinition, formulaNameWithNamespace: string): TypedStandardFormula;
export declare function wrapError(err: Error): Error;
