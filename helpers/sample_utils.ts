import {$Omit} from '../type_utils';
import {PackDefinition} from '../types';
import {PackFormatMetadata} from '../compiled_types';
import {PackFormulasMetadata} from '../compiled_types';
import {PackFormulas} from '../api';
import {PackMetadata} from '../compiled_types';

// Used to avoid needing promises when exporting fake `PackMetadata`s.
export interface FakePackDefinition extends $Omit<PackDefinition, 'formulas'> {
  formulas?: PackFormulas;
}

export function fakeDefinitionToDefinition(def: FakePackDefinition): PackDefinition {
  const {formulas: originalFormulas, ...rest} = def;
  const formulas = originalFormulas && {loader: () => Promise.resolve(originalFormulas)};
  const legacyFormulasLoader = originalFormulas && (() => Promise.resolve(originalFormulas));

  return {formulas, legacyFormulasLoader, ...rest};
}

export function fakeDefinitionToMetadata(def: FakePackDefinition): PackMetadata {
  const {
    formulas: originalFormulas,
    defaultAuthentication: originalDefaultAuthentication,
    legacyFormulasLoader,
    formats: originalFormats,
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

  return {formulas, formats, ...(defaultAuthentication && {defaultAuthentication}), ...packMetadata};
}
