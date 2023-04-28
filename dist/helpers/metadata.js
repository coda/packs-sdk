"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compilePackMetadata = void 0;
const types_1 = require("../types");
const api_1 = require("../api");
function compilePackMetadata(manifest) {
    const { formats, formulas, formulaNamespace, syncTables, defaultAuthentication, ...definition } = manifest;
    const compiledFormats = compileFormatsMetadata(formats || []);
    const compiledFormulas = (formulas && compileFormulasMetadata(formulas)) || [];
    // Note: we do not need to compile systemConnectionAuthentication metadata because it doesn't contain formulas,
    // so we can pass it through directly as metadata.
    const defaultAuthenticationMetadata = compileDefaultAuthenticationMetadata(defaultAuthentication);
    const metadata = {
        ...definition,
        defaultAuthentication: defaultAuthenticationMetadata,
        formulaNamespace,
        formats: compiledFormats,
        formulas: compiledFormulas,
        syncTables: (syncTables || []).map(compileSyncTable),
    };
    return metadata;
}
exports.compilePackMetadata = compilePackMetadata;
function compileFormatsMetadata(formats) {
    return formats.map(format => {
        return {
            ...format,
            matchers: (format.matchers || []).map(matcher => matcher.toString()),
        };
    });
}
function compileFormulasMetadata(formulas) {
    return formulas.map(compileFormulaMetadata);
}
function compileFormulaMetadata(formula) {
    const { execute, ...rest } = formula;
    return rest;
}
function compileSyncTable(syncTable) {
    if ((0, api_1.isDynamicSyncTable)(syncTable)) {
        const { getter, getName, getSchema, getDisplayUrl, listDynamicUrls, searchDynamicUrls, ...rest } = syncTable;
        const { execute, executeUpdate, ...getterRest } = getter;
        return {
            ...rest,
            getName: compileMetadataFormulaMetadata(getName),
            getSchema: compileMetadataFormulaMetadata(getSchema),
            getDisplayUrl: compileMetadataFormulaMetadata(getDisplayUrl),
            listDynamicUrls: compileMetadataFormulaMetadata(listDynamicUrls),
            searchDynamicUrls: compileMetadataFormulaMetadata(searchDynamicUrls),
            getter: {
                supportsUpdates: Boolean(executeUpdate),
                ...getterRest,
            },
        };
    }
    const { getter, ...rest } = syncTable;
    const { execute, executeUpdate, ...getterRest } = getter;
    return {
        ...rest,
        getter: {
            supportsUpdates: Boolean(executeUpdate),
            ...getterRest,
        },
    };
}
function compileDefaultAuthenticationMetadata(authentication) {
    if (!authentication) {
        return;
    }
    if (authentication.type === types_1.AuthenticationType.None || authentication.type === types_1.AuthenticationType.Various) {
        return authentication;
    }
    const { getConnectionName, getConnectionUserId, postSetup, ...rest } = authentication;
    return {
        ...rest,
        getConnectionName: compileMetadataFormulaMetadata(getConnectionName),
        getConnectionUserId: compileMetadataFormulaMetadata(getConnectionUserId),
        postSetup: postSetup ? postSetup.map(compilePostSetupStepMetadata) : undefined,
    };
}
function compileMetadataFormulaMetadata(formula) {
    if (!formula) {
        return;
    }
    const { execute, ...rest } = formula;
    return rest;
}
function compilePostSetupStepMetadata(step) {
    const { getOptions, getOptionsFormula, ...rest } = step;
    return {
        ...rest,
        getOptions: step.getOptions ? compileMetadataFormulaMetadata(step.getOptions) : undefined,
        getOptionsFormula: step.getOptionsFormula ? compileMetadataFormulaMetadata(step.getOptionsFormula) : undefined,
    };
}
