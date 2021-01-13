import type { $OmitNested } from './type_utils';
import type { Authentication } from './types';
import type { AuthenticationType } from './types';
import type { Format } from './types';
import type { MetadataFormula } from './api';
import type { ObjectPackFormulaMetadata } from './api';
import type { PackDefinition } from './types';
import type { PackFormulaMetadata } from './api';
import type { SyncTable } from './api';
export declare type PackSyncTable = Omit<SyncTable, 'getter' | 'getName'> & {
    getter: PackFormulaMetadata;
    isDynamic?: boolean;
    hasDynamicSchema?: boolean;
    getDisplayUrl?: MetadataFormula;
    listDynamicUrls?: MetadataFormula;
};
export interface PackFormatMetadata extends Omit<Format, 'matchers'> {
    matchers: string[];
}
export interface PackFormulasMetadata {
    [namespace: string]: PackFormulaMetadata[];
}
/** Stripped-down version of `PackDefinition` that doesn't contain formula definitions. */
export declare type PackMetadata = Omit<PackDefinition, 'formulas' | 'formats' | 'defaultAuthentication' | 'syncTables'> & {
    formulas: PackFormulasMetadata | PackFormulaMetadata[];
    formats: PackFormatMetadata[];
    syncTables: PackSyncTable[];
    defaultAuthentication?: $OmitNested<Authentication, 'getConnectionName', 'execute'>;
};
export declare type ExternalPackAuthenticationType = AuthenticationType;
export declare type ExternalPackFormulas = PackFormulasMetadata | PackFormulaMetadata[];
export declare type ExternalObjectPackFormula = ObjectPackFormulaMetadata;
export declare type ExternalPackFormula = PackFormulaMetadata;
export declare type ExternalPackFormat = Format;
export declare type ExternalPackFormatMetadata = PackFormatMetadata;
export declare type ExternalSyncTable = PackSyncTable;
declare type BasePackMetadata = Omit<PackMetadata, 'enabledConfigName' | 'defaultAuthentication' | 'systemConnectionAuthentication' | 'formulas' | 'formats' | 'syncTables'>;
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
        postSetup?: Array<{
            name: string;
            description: string;
            getOptionsFormula: PackFormulaMetadata;
        }>;
        deferConnectionSetup?: boolean;
        shouldAutoAuthSetup?: boolean;
    };
    instructionsUrl?: string;
    formulas?: ExternalPackFormulas;
    formats?: ExternalPackFormat[];
    syncTables?: ExternalSyncTable[];
}
export {};
