<<<<<<< HEAD
import type { BasicPackDefinition } from '../../types';
import type { Formula } from '../../api';
import type { GenericSyncFormula } from '../../api';
export declare function findFormula(packDef: BasicPackDefinition, formulaNameWithNamespace: string): Formula;
export declare function findSyncFormula(packDef: BasicPackDefinition, syncFormulaName: string): GenericSyncFormula;
export declare function tryFindFormula(packDef: BasicPackDefinition, formulaNameWithNamespace: string): Formula | undefined;
export declare function tryFindSyncFormula(packDef: BasicPackDefinition, syncFormulaName: string): GenericSyncFormula | undefined;
=======
import type { Formula } from '../../api';
import type { GenericSyncFormula } from '../../api';
import type { PackVersionDefinition } from '../../types';
export declare function findFormula(packDef: PackVersionDefinition, formulaNameWithNamespace: string): Formula;
export declare function findSyncFormula(packDef: PackVersionDefinition, syncFormulaName: string): GenericSyncFormula;
export declare function tryFindFormula(packDef: PackVersionDefinition, formulaNameWithNamespace: string): Formula | undefined;
export declare function tryFindSyncFormula(packDef: PackVersionDefinition, syncFormulaName: string): GenericSyncFormula | undefined;
>>>>>>> 70ee3ea0 (make build again)
