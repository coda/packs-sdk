import { $OmitNested } from './type_utils';
import { Authentication } from './types';
import { AuthenticationType } from './types';
import { Format } from './types';
import { GenericObjectSchema } from './schema';
import { MetadataFormula } from './api';
import { PackDefinition } from './types';
import { TypedPackFormula } from './api';
import { SyncTable } from './api';
import { Trigger } from './api_types';
export declare type PackFormulaMetadata = Omit<TypedPackFormula, 'execute'>;
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
    formulas: PackFormulasMetadata;
    formats: PackFormatMetadata[];
    syncTables: PackSyncTable[];
    defaultAuthentication?: $OmitNested<$OmitNested<Authentication, 'getConnectionNameFormula', 'execute'>, 'getConnectionName', 'execute'>;
};
export declare type ExternalPackAuthenticationType = AuthenticationType;
export declare type ExternalPackFormulas = PackFormulasMetadata;
export declare type ExternalPackFormula = PackFormulaMetadata;
export declare type ExternalPackFormat = Format;
export declare type ExternalPackFormatMetadata = PackFormatMetadata;
export declare type ExternalPackTrigger = Trigger<GenericObjectSchema>;
export declare type ExternalSyncTable = PackSyncTable;
declare type BasePackMetadata = Omit<PackMetadata, 'enabledConfigName' | 'defaultAuthentication' | 'systemConnectionAuthentication' | 'formulas' | 'formats' | 'triggers' | 'syncTables'>;
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
    };
    instructionsUrl?: string;
    formulas?: ExternalPackFormulas;
    formats?: ExternalPackFormat[];
    triggers?: ExternalPackTrigger[];
    syncTables?: ExternalSyncTable[];
}
export {};
