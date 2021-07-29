import type { Formula } from '../../api';
import type { GenericSyncFormula } from '../../api';
import type { PackVersionDefinition } from '../../types';
export declare function findFormula(packDef: PackVersionDefinition, formulaNameWithNamespace: string): Formula;
export declare function findSyncFormula(packDef: PackVersionDefinition, syncFormulaName: string): GenericSyncFormula;
export declare function tryFindFormula(packDef: PackVersionDefinition, formulaNameWithNamespace: string): Formula | undefined;
export declare function tryFindSyncFormula(packDef: PackVersionDefinition, syncFormulaName: string): GenericSyncFormula | undefined;
