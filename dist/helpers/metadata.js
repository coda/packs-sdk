import { AuthenticationType } from '../types';
import { isDynamicSyncTable } from '../api';
export function compilePackMetadata(manifest) {
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
    if (isDynamicSyncTable(syncTable)) {
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
    if (authentication.type === AuthenticationType.None || authentication.type === AuthenticationType.Various) {
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
