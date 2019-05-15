import {$Omit} from '../type_utils';
import {PackDefinition} from '../types';
import {PackFormatMetadata} from '../compiled_types';
import {PackFormulasMetadata} from '../compiled_types';
import {PackFormulas} from '../api';
import {PackMetadata} from '../compiled_types';
import {PackSyncTable} from '../compiled_types';

// Used to avoid needing promises when exporting fake `PackMetadata`s.
export interface FakePackDefinition extends $Omit<PackDefinition, 'formulas'> {
  formulas?: PackFormulas;
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
    ...packMetadata // tslint:disable-line:trailing-comma
  } = def;

  const formulas: PackFormulasMetadata = {};
  for (const namespace of Object.keys(originalFormulas || {})) {
    formulas[namespace] = originalFormulas![namespace]!.map(formula => {
      const {execute, ...formulaMetadata} = formula;
      return formulaMetadata;
    });
  }

  const formats: PackFormatMetadata[] = [];
  for (const {matchers, ...format} of originalFormats || []) {
    formats.push({...format, matchers: (matchers || []).map(m => m.toString())});
  }

  let defaultAuthentication: PackMetadata['defaultAuthentication'] = originalDefaultAuthentication;
  if (
    originalDefaultAuthentication &&
    'getConnectionNameFormula' in originalDefaultAuthentication &&
    originalDefaultAuthentication.getConnectionNameFormula
  ) {
    const {execute, ...connNameFormula} = originalDefaultAuthentication.getConnectionNameFormula;
    defaultAuthentication = {
      ...originalDefaultAuthentication,
      getConnectionNameFormula: {...connNameFormula},
    };
  }

  const syncTables: PackSyncTable[] = [];
  for (const {getter, ...others} of originalSyncTables || []) {
    const {execute, ...otherGetter} = getter;
    syncTables.push({getter: {...otherGetter}, ...others});
  }
  return {
    formulas,
    formats,
    syncTables,
    ...(defaultAuthentication && {defaultAuthentication}),
    ...packMetadata,
  };
}
