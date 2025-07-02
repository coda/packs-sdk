import type {ExecutionContext} from '../api';
import type {Formula} from '../api';
import type {PackDefinition} from '../types';
import type {PackFormatMetadata} from '../compiled_types';
import type {PackMetadata} from '../compiled_types';
import type {PackSyncTable} from '../compiled_types';
import type {ParameterValidationResult} from '../api';
import {compileMetadataFormulaMetadata} from './metadata';
import {wrapMetadataFunction} from '../api';

// Used to avoid needing promises when exporting fake `PackMetadata`s.
export interface FakePackDefinition extends Omit<PackDefinition, 'formulas'> {
  formulas?: Formula[];
}

export function fakeDefinitionToDefinition(def: FakePackDefinition): PackDefinition {
  return def;
}

export function fakeDefinitionToMetadata(def: FakePackDefinition): PackMetadata {
  const {
    formulas: originalFormulas,
    defaultAuthentication: originalDefaultAuthentication,
    formats: originalFormats,
    syncTables: originalSyncTables,
    ...packMetadata
  } = def;
  const formulas = originalFormulas!.map(formula => {
    const {execute, validateParameters, ...formulaMetadata} = formula;
    return {
      ...formulaMetadata,
      validateParameters: compileMetadataFormulaMetadata<ExecutionContext, ParameterValidationResult>(
        wrapMetadataFunction<ExecutionContext, ParameterValidationResult>(validateParameters),
      ),
    };
  });

  const formats: PackFormatMetadata[] = [];
  for (const {matchers, ...format} of originalFormats || []) {
    formats.push({...format, matchers: (matchers || []).map(m => m.toString())});
  }

  let defaultAuthentication: PackMetadata['defaultAuthentication'] = originalDefaultAuthentication;
  if (
    originalDefaultAuthentication &&
    'getConnectionName' in originalDefaultAuthentication &&
    originalDefaultAuthentication.getConnectionName
  ) {
    const {execute, ...connNameFormula} = originalDefaultAuthentication.getConnectionName;
    defaultAuthentication = {
      ...originalDefaultAuthentication,
      getConnectionName: {...connNameFormula},
    };
  }
  const syncTables: PackSyncTable[] = [];
  for (const {getter, getSchema, ...others} of originalSyncTables || []) {
    const {execute, executeUpdate, validateParameters, ...otherGetter} = getter;
    const validateParametersAsFormula = wrapMetadataFunction(validateParameters);
    syncTables.push({
      getter: {
        ...otherGetter,
        validateParameters: compileMetadataFormulaMetadata(validateParametersAsFormula),
      },
      getSchema,
      ...others,
    });
  }
  return {
    formulas,
    formats,
    syncTables,
    ...(defaultAuthentication && {defaultAuthentication}),
    ...packMetadata,
  };
}
