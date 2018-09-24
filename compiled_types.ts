import {Format} from './types';
import {PackDefinition} from './types';
import {TypedPackFormula} from './api';

export type PackFormulaMetadata = $Omit<TypedPackFormula, 'execute'>;

export interface PackFormatMetadata extends $Omit<Format, 'matchers'> {
  matchers: string[];
}

export interface PackFormulasMetadata {
  [namespace: string]: PackFormulaMetadata[];
}

export type PackMetadata = $Omit<PackDefinition, 'formulas' | 'formats'> & {
  formulas: PackFormulasMetadata;
  formats: PackFormatMetadata[];
};
