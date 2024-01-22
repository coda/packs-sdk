import type { AWSAccessKeyAuthentication } from './types';
import type { AWSAssumeRoleAuthentication } from './types';
import type { Authentication } from './types';
import type { AuthenticationType } from './types';
import type { CodaApiBearerTokenAuthentication } from './types';
import type { CustomAuthentication } from './types';
import type { CustomHeaderTokenAuthentication } from './types';
import type { DistributiveOmit } from './type_utils';
import type { Format } from './types';
import type { HeaderBearerTokenAuthentication } from './types';
import type { MetadataFormulaMetadata } from './api';
import type { MultiHeaderTokenAuthentication } from './types';
import type { MultiQueryParamTokenAuthentication } from './types';
import type { NoAuthentication } from './types';
import type { OAuth2Authentication } from './types';
import type { OAuth2ClientCredentialsAuthentication } from './types';
import type { ObjectPackFormulaMetadata } from './api';
import type { PackDefinition } from './types';
import type { PackFormulaMetadata } from './api';
import type { PackVersionDefinition } from './types';
import type { PostSetup } from './types';
import type { QueryParamTokenAuthentication } from './types';
import type { SyncTable } from './api';
import type { VariousAuthentication } from './types';
import type { WebBasicAuthentication } from './types';
/** @hidden */
export type PackSyncTable = Omit<SyncTable, 'getter' | 'getName' | 'getSchema' | 'listDynamicUrls' | 'searchDynamicUrls' | 'getDisplayUrl'> & {
    getter: PackFormulaMetadata;
    isDynamic?: boolean;
    hasDynamicSchema?: boolean;
    getSchema?: MetadataFormulaMetadata;
    getName?: MetadataFormulaMetadata;
    getDisplayUrl?: MetadataFormulaMetadata;
    listDynamicUrls?: MetadataFormulaMetadata;
    searchDynamicUrls?: MetadataFormulaMetadata;
};
/** @hidden */
export interface PackFormatMetadata extends Omit<Format, 'matchers'> {
    matchers: string[];
}
/** @hidden */
export type PostSetupMetadata = Omit<PostSetup, 'getOptions' | 'getOptionsFormula'> & {
    getOptions?: MetadataFormulaMetadata;
    getOptionsFormula?: MetadataFormulaMetadata;
};
/** @hidden */
export type AuthenticationMetadata = DistributiveOmit<Authentication, 'getConnectionName' | 'getConnectionUserId' | 'postSetup'> & {
    getConnectionName?: MetadataFormulaMetadata;
    getConnectionUserId?: MetadataFormulaMetadata;
    postSetup?: PostSetupMetadata[];
};
/** @hidden */
type AuthenticationToMetadata<T extends Authentication> = DistributiveOmit<T, 'getConnectionName' | 'getConnectionUserId' | 'postSetup'> & {
    getConnectionName?: MetadataFormulaMetadata;
    getConnectionUserId?: MetadataFormulaMetadata;
    postSetup?: PostSetupMetadata[];
};
/** @hidden */
export interface AuthenticationMetadataTypeMap {
    [AuthenticationType.AWSAccessKey]: AuthenticationToMetadata<AWSAccessKeyAuthentication>;
    [AuthenticationType.AWSAssumeRole]: AuthenticationToMetadata<AWSAssumeRoleAuthentication>;
    [AuthenticationType.CodaApiHeaderBearerToken]: AuthenticationToMetadata<CodaApiBearerTokenAuthentication>;
    [AuthenticationType.CustomHeaderToken]: AuthenticationToMetadata<CustomHeaderTokenAuthentication>;
    [AuthenticationType.MultiHeaderToken]: AuthenticationToMetadata<MultiHeaderTokenAuthentication>;
    [AuthenticationType.Custom]: AuthenticationToMetadata<CustomAuthentication>;
    [AuthenticationType.HeaderBearerToken]: AuthenticationToMetadata<HeaderBearerTokenAuthentication>;
    [AuthenticationType.MultiQueryParamToken]: AuthenticationToMetadata<MultiQueryParamTokenAuthentication>;
    [AuthenticationType.None]: AuthenticationToMetadata<NoAuthentication>;
    [AuthenticationType.QueryParamToken]: AuthenticationToMetadata<QueryParamTokenAuthentication>;
    [AuthenticationType.Various]: AuthenticationToMetadata<VariousAuthentication>;
    [AuthenticationType.WebBasic]: AuthenticationToMetadata<WebBasicAuthentication>;
    [AuthenticationType.OAuth2]: AuthenticationToMetadata<OAuth2Authentication>;
    [AuthenticationType.OAuth2ClientCredentials]: AuthenticationToMetadata<OAuth2ClientCredentialsAuthentication>;
}
/** @hidden */
export type PackVersionMetadata = Omit<PackVersionDefinition, 'formulas' | 'formats' | 'defaultAuthentication' | 'syncTables'> & {
    formulas: PackFormulaMetadata[];
    formats: PackFormatMetadata[];
    syncTables: PackSyncTable[];
    defaultAuthentication?: AuthenticationMetadata;
};
/** @hidden */
export type PackMetadata = PackVersionMetadata & Pick<PackDefinition, 'id' | 'name' | 'shortDescription' | 'description' | 'permissionsDescription' | 'category' | 'logoPath' | 'exampleImages' | 'exampleVideoIds' | 'minimumFeatureSet' | 'quotas' | 'rateLimits' | 'isSystem'>;
/** @hidden */
export type ExternalPackAuthenticationType = AuthenticationType;
/** @hidden */
export type ExternalPackFormulas = PackFormulaMetadata[];
/** @hidden */
export type ExternalObjectPackFormula = ObjectPackFormulaMetadata;
/** @hidden */
export type ExternalPackFormula = PackFormulaMetadata;
/** @hidden */
export type ExternalPackFormat = Omit<Format, 'matchers'> & {
    matchers?: string[];
};
/** @hidden */
export type ExternalPackFormatMetadata = PackFormatMetadata;
/** @hidden */
export type ExternalSyncTable = PackSyncTable;
type BasePackVersionMetadata = Omit<PackVersionMetadata, 'defaultAuthentication' | 'systemConnectionAuthentication' | 'formulas' | 'formats' | 'syncTables'>;
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
        oauthScopes?: string[];
        oauthAuthorizationUrl?: string;
        oauthTokenUrl?: string;
        networkDomain?: string | string[];
        endpointKey?: string;
    };
    instructionsUrl?: string;
    formulas?: ExternalPackFormulas;
    formats?: ExternalPackFormat[];
    syncTables?: ExternalSyncTable[];
}
/** @hidden */
export type ExternalPackMetadata = ExternalPackVersionMetadata & Pick<PackMetadata, 'id' | 'name' | 'shortDescription' | 'description' | 'permissionsDescription' | 'category' | 'logoPath' | 'exampleImages' | 'exampleVideoIds' | 'minimumFeatureSet' | 'quotas' | 'rateLimits' | 'isSystem'>;
/** @hidden */
export interface PackUpload {
    metadata: PackVersionMetadata | PackMetadata;
    sdkVersion: string;
    bundle: string;
    sourceMap: string;
}
export {};
