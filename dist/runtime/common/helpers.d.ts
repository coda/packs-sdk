import type { BasicPackDefinition } from '../../types';
import type { Formula } from '../../api';
import type { GenericSyncFormula } from '../../api';
export declare function findFormula(packDef: BasicPackDefinition, formulaNameWithNamespace: string): Formula;
export declare function findSyncFormula(packDef: BasicPackDefinition, syncFormulaName: string): GenericSyncFormula;
export declare function tryFindFormula(packDef: BasicPackDefinition, formulaNameWithNamespace: string): Formula | undefined;
export declare function tryFindSyncFormula(packDef: BasicPackDefinition, syncFormulaName: string): GenericSyncFormula | undefined;
