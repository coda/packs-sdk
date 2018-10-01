import { Authentication, Format } from './types';
import { PackDefinition } from './types';
import { TypedPackFormula } from './api';
export declare type PackFormulaMetadata = $Omit<TypedPackFormula, 'execute'>;
export interface PackFormatMetadata extends $Omit<Format, 'matchers'> {
    matchers: string[];
}
export interface PackFormulasMetadata {
    [namespace: string]: PackFormulaMetadata[];
}
export declare type PackMetadata = $Omit<PackDefinition, 'formulas' | 'formats' | 'defaultAuthentication' | 'legacyFormulasLoader'> & {
    formulas: PackFormulasMetadata;
    formats: PackFormatMetadata[];
    defaultAuthentication?: $OmitNested<Authentication, 'getConnectionNameFormula', 'execute'>;
};
