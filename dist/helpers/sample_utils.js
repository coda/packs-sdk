"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeDefinitionToMetadata = exports.fakeDefinitionToDefinition = void 0;
const metadata_1 = require("./metadata");
const api_1 = require("../api");
function fakeDefinitionToDefinition(def) {
    return def;
}
exports.fakeDefinitionToDefinition = fakeDefinitionToDefinition;
function fakeDefinitionToMetadata(def) {
    const { formulas: originalFormulas, defaultAuthentication: originalDefaultAuthentication, formats: originalFormats, syncTables: originalSyncTables, ...packMetadata } = def;
    const formulas = originalFormulas.map(formula => {
        const { execute, validateParameters, ...formulaMetadata } = formula;
        return {
            ...formulaMetadata,
            validateParameters: (0, metadata_1.compileMetadataFormulaMetadata)((0, api_1.wrapMetadataFunction)(validateParameters)),
        };
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
        const { execute, executeUpdate, validateParameters, ...otherGetter } = getter;
        const validateParametersAsFormula = (0, api_1.wrapMetadataFunction)(validateParameters);
        syncTables.push({
            getter: {
                ...otherGetter,
                validateParameters: (0, metadata_1.compileMetadataFormulaMetadata)(validateParametersAsFormula),
            },
            getSchema,
            ...others,
        });
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
