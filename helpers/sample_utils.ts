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
  const {formulas: originalFormulas, legacyFormulasLoader, formats: originalFormats, ...packMetadata} = def;

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

  return {formulas, formats, ...packMetadata};
}
