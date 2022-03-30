import type {BasicPackDefinition} from '../../types';
import type {Formula} from '../../api';
import type {GenericSyncFormula} from '../../api';

export function findFormula(packDef: BasicPackDefinition, formulaNameWithNamespace: string): Formula {
  const packFormulas = packDef.formulas;
  if (!packFormulas) {
    throw new Error(`Pack definition has no formulas.`);
  }

  const [namespace, name] = formulaNameWithNamespace.includes('::')
    ? formulaNameWithNamespace.split('::')
    : ['', formulaNameWithNamespace];

  if (namespace) {
    // eslint-disable-next-line no-console
    console.log(
      `Warning: formula was invoked with a namespace (${formulaNameWithNamespace}), but namespaces are now deprecated.`,
    );
  }

  const formulas: Formula[] = Array.isArray(packFormulas) ? packFormulas : packFormulas[namespace];
  if (!formulas || !formulas.length) {
    throw new Error(`Pack definition has no formulas${namespace ?? ` for namespace "${namespace}"`}.`);
  }
  for (const formula of formulas) {
    if (formula.name === name) {
      return formula;
    }
  }
  throw new Error(`Pack definition has no formula "${name}"${namespace ?? ` in namespace "${namespace}"`}.`);
}

export function findSyncFormula(packDef: BasicPackDefinition, syncFormulaName: string): GenericSyncFormula {
  if (!packDef.syncTables) {
    throw new Error(`Pack definition has no sync tables.`);
  }

  for (const syncTable of packDef.syncTables) {
    const syncFormula = syncTable.getter;
    if (syncTable.name === syncFormulaName) {
      return syncFormula;
    }
  }

  throw new Error(`Pack definition has no sync formula "${syncFormulaName}" in its sync tables.`);
}

export function tryFindFormula(packDef: BasicPackDefinition, formulaNameWithNamespace: string): Formula | undefined {
  try {
    return findFormula(packDef, formulaNameWithNamespace);
  } catch (_err) {}
}

export function tryFindSyncFormula(
  packDef: BasicPackDefinition,
  syncFormulaName: string,
): GenericSyncFormula | undefined {
  try {
    return findSyncFormula(packDef, syncFormulaName);
  } catch (_err) {}
}
