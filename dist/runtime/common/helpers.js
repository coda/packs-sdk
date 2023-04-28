"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryFindSyncFormula = exports.tryFindFormula = exports.findSyncFormula = exports.findFormula = void 0;
function findFormula(packDef, formulaNameWithNamespace) {
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
            return formula;
        }
    }
    throw new Error(`Pack definition has no formula "${name}"${namespace !== null && namespace !== void 0 ? namespace : ` in namespace "${namespace}"`}.`);
}
exports.findFormula = findFormula;
function findSyncFormula(packDef, syncFormulaName) {
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
exports.findSyncFormula = findSyncFormula;
function tryFindFormula(packDef, formulaNameWithNamespace) {
    try {
        return findFormula(packDef, formulaNameWithNamespace);
    }
    catch (_err) { }
}
exports.tryFindFormula = tryFindFormula;
function tryFindSyncFormula(packDef, syncFormulaName) {
    try {
        return findSyncFormula(packDef, syncFormulaName);
    }
    catch (_err) { }
}
exports.tryFindSyncFormula = tryFindSyncFormula;
