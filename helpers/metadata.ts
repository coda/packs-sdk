import type {Authentication} from '../types';
import type {AuthenticationMetadata} from '../compiled_types';
import {AuthenticationType} from '../types';
import type {Format} from '../types';
import type {Formula} from '../api';
import type {GenericSyncTable} from '../api';
import type {MetadataFormula} from '../api';
import type {MetadataFormulaMetadata} from '../api';
import type {PackDefinition} from '../types';
import type {PackFormatMetadata} from '../compiled_types';
import type {PackFormulaMetadata} from '../api';
import type {PackMetadata} from '../compiled_types';
import type {PackSyncTable} from '../compiled_types';
import type {PackVersionDefinition} from '../types';
import type {PackVersionMetadata} from '../compiled_types';
import type {PostSetup} from '../types';
import type {PostSetupMetadata} from '../compiled_types';
import type {TypedPackFormula} from '../api';
import {isDynamicSyncTable} from '../api';

// Legacy metadata compilation kept around until we migrate first-party packs.
export function compilePackMetadata(manifest: PackDefinition): PackMetadata;
export function compilePackMetadata(manifest: PackVersionDefinition): PackVersionMetadata;
export function compilePackMetadata(manifest: PackVersionDefinition): PackVersionMetadata {
  const {formats, formulas, formulaNamespace, syncTables, defaultAuthentication, ...definition} = manifest;
  const compiledFormats = compileFormatsMetadata(formats || []);
  const compiledFormulas = (formulas && compileFormulasMetadata(formulas)) || [];
  // Note: we do not need to compile systemConnectionAuthentication metadata because it doesn't contain formulas,
  // so we can pass it through directly as metadata.
  const defaultAuthenticationMetadata = compileDefaultAuthenticationMetadata(defaultAuthentication);
  const metadata: PackVersionMetadata = {
    ...definition,
    defaultAuthentication: defaultAuthenticationMetadata,
    formulaNamespace,
    formats: compiledFormats,
    formulas: compiledFormulas,
    syncTables: (syncTables || []).map(compileSyncTable),
  };

  return metadata;
}

function compileFormatsMetadata(formats: Format[]): PackFormatMetadata[] {
  return formats.map(format => {
    return {
      ...format,
      matchers: (format.matchers || []).map(matcher => matcher.toString()),
    };
  });
}

function compileFormulasMetadata(formulas: Formula[]): PackFormulaMetadata[] {
  return formulas.map(compileFormulaMetadata);
}

function compileFormulaMetadata(formula: TypedPackFormula): PackFormulaMetadata {
  const {execute, ...rest} = formula;
  return rest;
}

function compileSyncTable(syncTable: GenericSyncTable): PackSyncTable {
  if (isDynamicSyncTable(syncTable)) {
    const {getter, getName, getSchema, getDisplayUrl, listDynamicUrls, searchDynamicUrls, ...rest} = syncTable;
    const {execute, executeUpdate, ...getterRest} = getter;
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

  const {getter, ...rest} = syncTable;
  const {execute, executeUpdate, ...getterRest} = getter;
  return {
    ...rest,
    getter: {
      supportsUpdates: Boolean(executeUpdate),
      ...getterRest,
    },
  };
}

function compileDefaultAuthenticationMetadata(
  authentication: Authentication | undefined,
): AuthenticationMetadata | undefined {
  if (!authentication) {
    return;
  }
  if (authentication.type === AuthenticationType.None || authentication.type === AuthenticationType.Various) {
    return authentication;
  }
  const {getConnectionName, getConnectionUserId, postSetup, ...rest} = authentication;
  return {
    ...rest,
    getConnectionName: compileMetadataFormulaMetadata(getConnectionName),
    getConnectionUserId: compileMetadataFormulaMetadata(getConnectionUserId),
    postSetup: postSetup ? postSetup.map(compilePostSetupStepMetadata) : undefined,
  };
}

function compileMetadataFormulaMetadata(formula: MetadataFormula | undefined): MetadataFormulaMetadata | undefined {
  if (!formula) {
    return;
  }
  const {execute, ...rest} = formula;
  return rest;
}

function compilePostSetupStepMetadata(step: PostSetup): PostSetupMetadata {
  const {getOptions, getOptionsFormula, ...rest} = step;
  return {
    ...rest,
    getOptions: step.getOptions ? compileMetadataFormulaMetadata(step.getOptions) : undefined,
    getOptionsFormula: step.getOptionsFormula ? compileMetadataFormulaMetadata(step.getOptionsFormula) : undefined,
  };
}
