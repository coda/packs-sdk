import type { Authentication } from './types';
import type { AuthenticationType } from './types';
import type { DistributiveOmit } from './type_utils';
import type { Format } from './types';
import type { MetadataFormulaMetadata } from './api';
import type { ObjectPackFormulaMetadata } from './api';
import type { PackDefinition } from './types';
import type { PackFormulaMetadata } from './api';
import type { PackVersionDefinition } from './types';
import type { PostSetup } from './types';
import type { SyncTable } from './api';
/** @hidden */
export declare type PackSyncTable = Omit<SyncTable, 'getter' | 'getName' | 'getSchema' | 'listDynamicUrls' | 'getDisplayUrl'> & {
    getter: PackFormulaMetadata;
    isDynamic?: boolean;
    hasDynamicSchema?: boolean;
    getSchema?: MetadataFormulaMetadata;
    getName?: MetadataFormulaMetadata;
    getDisplayUrl?: MetadataFormulaMetadata;
    listDynamicUrls?: MetadataFormulaMetadata;
};
/** @hidden */
export interface PackFormatMetadata extends Omit<Format, 'matchers'> {
    matchers: string[];
}
/** @hidden */
export interface PackFormulasMetadata {
    [namespace: string]: PackFormulaMetadata[];
}
/** @hidden */
export declare type PostSetupMetadata = Omit<PostSetup, 'getOptionsFormula'> & {
    getOptionsFormula: MetadataFormulaMetadata;
};
/** @hidden */
export declare type AuthenticationMetadata = DistributiveOmit<Authentication, 'getConnectionName' | 'getConnectionUserId' | 'postSetup'> & {
    getConnectionName?: MetadataFormulaMetadata;
    getConnectionUserId?: MetadataFormulaMetadata;
    postSetup?: PostSetupMetadata[];
};
/** @hidden */
export declare type PackVersionMetadata = Omit<PackVersionDefinition, 'formulas' | 'formats' | 'defaultAuthentication' | 'syncTables'> & {
    formulas: PackFormulasMetadata | PackFormulaMetadata[];
    formats: PackFormatMetadata[];
    syncTables: PackSyncTable[];
    defaultAuthentication?: AuthenticationMetadata;
};
/** @hidden */
export declare type PackMetadata = PackVersionMetadata & Pick<PackDefinition, 'id' | 'name' | 'shortDescription' | 'description' | 'permissionsDescription' | 'category' | 'logoPath' | 'exampleImages' | 'exampleVideoIds' | 'minimumFeatureSet' | 'quotas' | 'rateLimits' | 'enabledConfigName' | 'isSystem'>;
/** @hidden */
export declare type ExternalPackAuthenticationType = AuthenticationType;
/** @hidden */
export declare type ExternalPackFormulas = PackFormulasMetadata | PackFormulaMetadata[];
/** @hidden */
export declare type ExternalObjectPackFormula = ObjectPackFormulaMetadata;
/** @hidden */
export declare type ExternalPackFormula = PackFormulaMetadata;
/** @hidden */
export declare type ExternalPackFormat = Format;
/** @hidden */
export declare type ExternalPackFormatMetadata = PackFormatMetadata;
/** @hidden */
export declare type ExternalSyncTable = PackSyncTable;
declare type BasePackVersionMetadata = Omit<PackVersionMetadata, 'defaultAuthentication' | 'systemConnectionAuthentication' | 'formulas' | 'formats' | 'syncTables'>;
/** @hidden */
export interface ExternalPackVersionMetadata extends BasePackVersionMetadata {
    authentication: {
        type: ExternalPackAuthenticationType;
        params?: Array<{
            name: string;
            description: string;
        }>;
        requiresEndpointUrl: boolean;
        endpointDomain?: string;
        postSetup?: PostSetupMetadata[];
        deferConnectionSetup?: boolean;
        shouldAutoAuthSetup?: boolean;
    };
    instructionsUrl?: string;
    formulas?: ExternalPackFormulas;
    formats?: ExternalPackFormat[];
    syncTables?: ExternalSyncTable[];
}
/** @hidden */
export declare type ExternalPackMetadata = ExternalPackVersionMetadata & Pick<PackMetadata, 'id' | 'name' | 'shortDescription' | 'description' | 'permissionsDescription' | 'category' | 'logoPath' | 'exampleImages' | 'exampleVideoIds' | 'minimumFeatureSet' | 'quotas' | 'rateLimits' | 'isSystem'>;
/** @hidden */
export interface PackUpload {
    metadata: PackVersionMetadata | PackMetadata;
    sdkVersion: string;
    bundle: string;
    sourceMap: string;
}
export {};
