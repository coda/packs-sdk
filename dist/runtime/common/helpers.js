"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryFindSyncFormula = exports.tryFindFormula = exports.findSyncFormula = exports.findFormula = void 0;
function verifyFormulaSupportsAuthenticationName(formula, authenticationName) {
    const { allowedAuthenticationNames, name: formulaName } = formula;
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
function findFormula(packDef, formulaNameWithNamespace, authenticationName, { verifyFormulaForAuthenticationName } = {
    verifyFormulaForAuthenticationName: true,
}) {
    const packFormulas = packDef.formulas;
    if (!packFormulas) {
        throw new Error(`Pack definition has no formulas.`);
    }
    const [namespace, name] = formulaNameWithNamespace.includes('::')
        ? formulaNameWithNamespace.split('::')
        : ['', formulaNameWithNamespace];
    if (namespace) {
        // eslint-disable-next-line no-console
        console.log(`Warning: formula was invoked with a namespace (${formulaNameWithNamespace}), but namespaces are now deprecated.`);
    }
    const formulas = Array.isArray(packFormulas) ? packFormulas : packFormulas[namespace];
    if (!formulas || !formulas.length) {
        throw new Error(`Pack definition has no formulas${namespace !== null && namespace !== void 0 ? namespace : ` for namespace "${namespace}"`}.`);
    }
    for (const formula of formulas) {
        if (formula.name === name) {
            if (verifyFormulaForAuthenticationName) {
                verifyFormulaSupportsAuthenticationName(formula, authenticationName);
            }
            return formula;
        }
    }
    throw new Error(`Pack definition has no formula "${name}"${namespace !== null && namespace !== void 0 ? namespace : ` in namespace "${namespace}"`}.`);
}
exports.findFormula = findFormula;
function findSyncFormula(packDef, syncFormulaName, authenticationName, { verifyFormulaForAuthenticationName } = {
    verifyFormulaForAuthenticationName: true,
}) {
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
exports.findSyncFormula = findSyncFormula;
function tryFindFormula(packDef, formulaNameWithNamespace) {
    try {
        return findFormula(packDef, formulaNameWithNamespace, undefined, { verifyFormulaForAuthenticationName: false });
    }
    catch (_err) { }
}
exports.tryFindFormula = tryFindFormula;
function tryFindSyncFormula(packDef, syncFormulaName) {
    try {
        return findSyncFormula(packDef, syncFormulaName, undefined, { verifyFormulaForAuthenticationName: false });
    }
    catch (_err) { }
}
exports.tryFindSyncFormula = tryFindSyncFormula;
