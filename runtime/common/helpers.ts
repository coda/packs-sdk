import type {BasicPackDefinition} from '../../types';
import type {Formula} from '../../api';
import type {GenericSyncFormula} from '../../api';

function verifyFormulaSupportsAuthenticationName(formula: Formula, authenticationName: string | undefined) {
  const {allowedAuthenticationNames, name: formulaName} = formula;
  if (!allowedAuthenticationNames) {
    return;
  }

  if (!authenticationName) {
    throw new Error(`Formula ${formulaName} requires an authentication but none was provided`);
  }

  if (!allowedAuthenticationNames.includes(authenticationName)) {
    throw new Error(`Formula ${formulaName} is not allowed for connection with authentication ${authenticationName}`);
  }
}

export function findFormula(
  packDef: BasicPackDefinition,
  formulaNameWithNamespace: string,
  authenticationName: string | undefined,
  {verifyFormulaForAuthenticationName}: {verifyFormulaForAuthenticationName: boolean} = {
    verifyFormulaForAuthenticationName: true,
  },
): Formula {
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
      if (verifyFormulaForAuthenticationName) {
        verifyFormulaSupportsAuthenticationName(formula, authenticationName);
      }
      return formula;
    }
  }
  throw new Error(`Pack definition has no formula "${name}"${namespace ?? ` in namespace "${namespace}"`}.`);
}

export function findSyncFormula(
  packDef: BasicPackDefinition,
  syncFormulaName: string,
  authenticationName: string | undefined,
  {verifyFormulaForAuthenticationName}: {verifyFormulaForAuthenticationName: boolean} = {
    verifyFormulaForAuthenticationName: true,
  },
): GenericSyncFormula {
  if (!packDef.syncTables) {
    throw new Error(`Pack definition has no sync tables.`);
  }

  for (const syncTable of packDef.syncTables) {
    const syncFormula = syncTable.getter;
    if (syncTable.name === syncFormulaName) {
      if (verifyFormulaForAuthenticationName) {
        verifyFormulaSupportsAuthenticationName(syncFormula, authenticationName);
      }
      return syncFormula;
    }
  }

  throw new Error(`Pack definition has no sync formula "${syncFormulaName}" in its sync tables.`);
}

export function tryFindFormula(packDef: BasicPackDefinition, formulaNameWithNamespace: string): Formula | undefined {
  try {
    return findFormula(packDef, formulaNameWithNamespace, undefined, {verifyFormulaForAuthenticationName: false});
  } catch (_err) {}
}

export function tryFindSyncFormula(
  packDef: BasicPackDefinition,
  syncFormulaName: string,
): GenericSyncFormula | undefined {
  try {
    return findSyncFormula(packDef, syncFormulaName, undefined, {verifyFormulaForAuthenticationName: false});
  } catch (_err) {}
}
