import { $JsonSerialized } from './type_utils';
import { $Omit } from './type_utils';
import { $OmitNested } from './type_utils';
import { Authentication } from './types';
import { AuthenticationType } from './types';
import { Format } from './types';
import { PackDefinition } from './types';
import { TypedPackFormula } from './api';
export declare type PackFormulaMetadata = $Omit<TypedPackFormula, 'execute'>;
export interface PackFormatMetadata extends $Omit<Format, 'matchers'> {
    matchers: string[];
}
export interface PackFormulasMetadata {
    [namespace: string]: PackFormulaMetadata[];
}
/** Stripped-down version of `PackDefinition` that doesn't contain formula definitions. */
export declare type PackMetadata = $Omit<PackDefinition, 'formulas' | 'formats' | 'defaultAuthentication'> & {
    formulas: PackFormulasMetadata;
    formats: PackFormatMetadata[];
    defaultAuthentication?: $OmitNested<Authentication, 'getConnectionNameFormula', 'execute'>;
};
export declare type ExternalPackAuthenticationType = AuthenticationType;
export declare type ExternalPackFormulas = PackFormulasMetadata;
export declare type ExternalPackFormula = PackFormulaMetadata;
export declare type ExternalPackFormat = Format;
declare type BasePackMetadata = $Omit<PackMetadata, 'enabledConfigName' | 'defaultAuthentication' | 'systemConnectionAuthentication' | 'formulas' | 'formats'>;
/** Further stripped-down version of `PackMetadata` that contains only what the browser needs. */
export interface ExternalPackMetadata extends BasePackMetadata {
    authentication: {
        type: ExternalPackAuthenticationType;
        params?: Array<{
            name: string;
            description: string;
        }>;
        requiresEndpointUrl: boolean;
        endpointDomain?: string;
    };
    instructionsUrl?: string;
    formulas?: ExternalPackFormulas;
    formats?: ExternalPackFormat[];
}
export declare type JsonExternalPackMetadata = $JsonSerialized<ExternalPackMetadata>;
export {};
