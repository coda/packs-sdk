export function fakeDefinitionToDefinition(def) {
    return def;
}
export function fakeDefinitionToMetadata(def) {
    const { formulas: originalFormulas, defaultAuthentication: originalDefaultAuthentication, formats: originalFormats, syncTables: originalSyncTables, ...packMetadata } = def;
    const formulas = originalFormulas.map(formula => {
        const { execute, ...formulaMetadata } = formula;
        return formulaMetadata;
    });
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
        syncTables.push({ getter: { ...otherGetter }, getSchema, ...others });
    }
    return {
        formulas,
        formats,
        syncTables,
        ...(defaultAuthentication && { defaultAuthentication }),
        ...packMetadata,
    };
}
