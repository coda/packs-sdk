"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compilePackMetadata = void 0;
const types_1 = require("../types");
const ensure_1 = require("./ensure");
const api_1 = require("../api");
function compilePackMetadata(manifest) {
    const { formats, formulas, formulaNamespace, syncTables, defaultAuthentication, ...definition } = manifest;
    const compiledFormats = compileFormatsMetadata(formats || []);
    const compiledFormulas = (formulas && compileFormulasMetadata(formulas)) || (Array.isArray(formulas) || !formulas ? [] : {});
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
    const formulasMetadata = Array.isArray(formulas) || !formulas ? [] : {};
    // TODO: @alan-fang delete once we move packs off of PackFormulas
    if (Array.isArray(formulas)) {
        formulasMetadata.push(...formulas.map(compileFormulaMetadata));
    }
    else {
        for (const namespace of Object.keys(formulas)) {
            formulasMetadata[namespace] = formulas[namespace].map(compileFormulaMetadata);
        }
    }
    return formulasMetadata;
}
function compileFormulaMetadata(formula) {
    const { execute, ...rest } = formula;
    return rest;
}
function compileSyncTable(syncTable) {
    if (api_1.isDynamicSyncTable(syncTable)) {
        const { getter, getName, getSchema, getDisplayUrl, listDynamicUrls, ...rest } = syncTable;
        const { execute, ...getterRest } = getter;
        return {
            ...rest,
            getName: compileMetadataFormulaMetadata(getName),
            getSchema: compileMetadataFormulaMetadata(getSchema),
            getDisplayUrl: compileMetadataFormulaMetadata(getDisplayUrl),
            listDynamicUrls: compileMetadataFormulaMetadata(listDynamicUrls),
            getter: getterRest,
        };
    }
    const { getter, ...rest } = syncTable;
    const { execute, ...getterRest } = getter;
    return {
        ...rest,
        getter: getterRest,
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
    const { getOptionsFormula, ...rest } = step;
    return {
        ...rest,
        getOptionsFormula: ensure_1.ensureExists(compileMetadataFormulaMetadata(getOptionsFormula)),
    };
}
