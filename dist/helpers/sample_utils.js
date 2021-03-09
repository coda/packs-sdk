"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeDefinitionToMetadata = exports.fakeDefinitionToDefinition = void 0;
function fakeDefinitionToDefinition(def) {
    return def;
}
exports.fakeDefinitionToDefinition = fakeDefinitionToDefinition;
function fakeDefinitionToMetadata(def) {
    const { formulas: originalFormulas, defaultAuthentication: originalDefaultAuthentication, formats: originalFormats, syncTables: originalSyncTables, ...packMetadata } = def;
    let formulas;
    if (Array.isArray(originalFormulas)) {
        formulas = originalFormulas.map(formula => {
            const { execute, ...formulaMetadata } = formula;
            return formulaMetadata;
        });
    }
    else {
        // TODO: @alan-fang delete once all packs have been migrated to use formulaNamespace
        formulas = {};
        for (const namespace of Object.keys(originalFormulas || {})) {
            formulas[namespace] = originalFormulas[namespace].map(formula => {
                const { execute, ...formulaMetadata } = formula;
                return formulaMetadata;
            });
        }
    }
    const formats = [];
    for (const { matchers, ...format } of originalFormats || []) {
        formats.push({ ...format, matchers: (matchers || []).map(m => m.toString()) });
    }
    let defaultAuthentication = originalDefaultAuthentication;
    if (originalDefaultAuthentication &&
        'getConnectionName' in originalDefaultAuthentication &&
        originalDefaultAuthentication.getConnectionName) {
        const { execute, ...connNameFormula } = originalDefaultAuthentication.getConnectionName;
        defaultAuthentication = {
            ...originalDefaultAuthentication,
            getConnectionName: { ...connNameFormula },
        };
    }
    const syncTables = [];
    for (const { getter, getSchema, ...others } of originalSyncTables || []) {
        const { execute, ...otherGetter } = getter;
        syncTables.push({ getter: { ...otherGetter }, hasDynamicSchema: Boolean(getSchema), ...others });
    }
    return {
        formulas,
        formats,
        syncTables,
        ...(defaultAuthentication && { defaultAuthentication }),
        ...packMetadata,
    };
}
exports.fakeDefinitionToMetadata = fakeDefinitionToMetadata;
