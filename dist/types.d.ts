import type { $Values } from './type_utils';
import type { Formula } from './api';
import type { MetadataFormula } from './api';
import type { MetadataFormulaDef } from './api';
import type { PackFormulas } from './api';
import type { SyncTable } from './api';
export declare type PackId = number;
export declare enum PackCategory {
    CRM = "CRM",
    Calendar = "Calendar",
    Communication = "Communication",
    DataStorage = "DataStorage",
    Design = "Design",
    Financial = "Financial",
    Fun = "Fun",
    Geo = "Geo",
    IT = "IT",
    Mathematics = "Mathematics",
    Organization = "Organization",
    Recruiting = "Recruiting",
    Shopping = "Shopping",
    Social = "Social",
    Sports = "Sports",
    Travel = "Travel",
    Weather = "Weather"
}
export declare enum AuthenticationType {
    None = "None",
    HeaderBearerToken = "HeaderBearerToken",
    CustomHeaderToken = "CustomHeaderToken",
    QueryParamToken = "QueryParamToken",
    MultiQueryParamToken = "MultiQueryParamToken",
    OAuth2 = "OAuth2",
    WebBasic = "WebBasic",
    AWSSignature4 = "AWSSignature4",
    CodaApiHeaderBearerToken = "CodaApiHeaderBearerToken",
    Various = "Various"
}
export declare enum DefaultConnectionType {
    SharedDataOnly = 1,
    Shared = 2,
    ProxyActionsOnly = 3
}
/**
 * A pack or formula which uses no authentication mechanism
 */
export interface NoAuthentication {
    type: AuthenticationType.None;
}
export interface SetEndpoint {
    type: PostSetupType.SetEndpoint;
    name: string;
    description: string;
    getOptionsFormula: MetadataFormula;
}
export declare enum PostSetupType {
    SetEndpoint = "SetEndPoint"
}
export declare type PostSetup = SetEndpoint;
interface BaseAuthentication {
    getConnectionName?: MetadataFormula;
    getConnectionUserId?: MetadataFormula;
    defaultConnectionType?: DefaultConnectionType;
    instructionsUrl?: string;
    requiresEndpointUrl?: boolean;
    endpointDomain?: string;
    postSetup?: PostSetup[];
}
/**
 * A pack or formula which uses standard bearer token header authentication:
 * {"Authorization": "Bearer <token here>"}
 */
export interface HeaderBearerTokenAuthentication extends BaseAuthentication {
    type: AuthenticationType.HeaderBearerToken;
}
/**
 * A pack or formula that uses the Coda API bearer token. We will
 * use this to provide a better authentication experience.
 * {"Authorization": "Bearer <token here>"}
 */
export interface CodaApiBearerTokenAuthentication extends BaseAuthentication {
    type: AuthenticationType.CodaApiHeaderBearerToken;
    deferConnectionSetup?: boolean;
    shouldAutoAuthSetup?: boolean;
}
/**
 * A pack or formula which uses standard bearer token header authentication:
 * {"HeaderNameHere": "OptionalTokenPrefixHere <token here>"}
 */
export interface CustomHeaderTokenAuthentication extends BaseAuthentication {
    type: AuthenticationType.CustomHeaderToken;
    headerName: string;
    tokenPrefix?: string;
}
/**
 * A pack or formula which includes a token in a query parameter (bad for security).
 * https://foo.com/apis/dosomething?token=<token here>
 */
export interface QueryParamTokenAuthentication extends BaseAuthentication {
    type: AuthenticationType.QueryParamToken;
    paramName: string;
}
/**
 * A pack or formula which includes multiple tokens in a query parameter (bad for security).
 * https://foo.com/apis/dosomething?param1=<param1 value>&param2=<param2 value>
 */
export interface MultiQueryParamTokenAuthentication extends BaseAuthentication {
    type: AuthenticationType.MultiQueryParamToken;
    params: Array<{
        name: string;
        description: string;
    }>;
}
export interface OAuth2Authentication extends BaseAuthentication {
    type: AuthenticationType.OAuth2;
    authorizationUrl: string;
    tokenUrl: string;
    scopes?: string[];
    tokenPrefix?: string;
    additionalParams?: {
        [key: string]: any;
    };
    endpointKey?: string;
    tokenQueryParam?: string;
}
export interface WebBasicAuthentication extends BaseAuthentication {
    type: AuthenticationType.WebBasic;
    uxConfig?: {
        placeholderUsername?: string;
        placeholderPassword?: string;
        usernameOnly?: boolean;
    };
}
export interface AWSSignature4Authentication extends BaseAuthentication {
    type: AuthenticationType.AWSSignature4;
    service: string;
}
export interface VariousAuthentication {
    type: AuthenticationType.Various;
}
export declare type Authentication = NoAuthentication | VariousAuthentication | HeaderBearerTokenAuthentication | CodaApiBearerTokenAuthentication | CustomHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | OAuth2Authentication | WebBasicAuthentication | AWSSignature4Authentication;
declare type AsAuthDef<T extends BaseAuthentication> = Omit<T, 'getConnectionName' | 'getConnectionUserId'> & {
    getConnectionName?: MetadataFormulaDef;
    getConnectionUserId?: MetadataFormulaDef;
};
export declare type AuthenticationDef = NoAuthentication | VariousAuthentication | AsAuthDef<HeaderBearerTokenAuthentication> | AsAuthDef<CodaApiBearerTokenAuthentication> | AsAuthDef<CustomHeaderTokenAuthentication> | AsAuthDef<QueryParamTokenAuthentication> | AsAuthDef<MultiQueryParamTokenAuthentication> | AsAuthDef<OAuth2Authentication> | AsAuthDef<WebBasicAuthentication> | AsAuthDef<AWSSignature4Authentication>;
export declare type SystemAuthentication = HeaderBearerTokenAuthentication | CustomHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | WebBasicAuthentication | AWSSignature4Authentication;
export declare type SystemAuthenticationDef = AsAuthDef<HeaderBearerTokenAuthentication> | AsAuthDef<CustomHeaderTokenAuthentication> | AsAuthDef<QueryParamTokenAuthentication> | AsAuthDef<MultiQueryParamTokenAuthentication> | AsAuthDef<WebBasicAuthentication> | AsAuthDef<AWSSignature4Authentication>;
export declare type SystemAuthenticationTypes = $Values<Pick<SystemAuthentication, 'type'>>;
export declare type VariousSupportedAuthentication = NoAuthentication | HeaderBearerTokenAuthentication | CustomHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | WebBasicAuthentication;
export declare type VariousSupportedAuthenticationTypes = $Values<Pick<VariousSupportedAuthentication, 'type'>>;
export interface Format {
    name: string;
    formulaNamespace: string;
    formulaName: string;
    /** @deprecated No longer needed, will be inferred from the referenced formula. */
    hasNoConnection?: boolean;
    instructions?: string;
    matchers?: string[];
    placeholder?: string;
}
export declare enum FeatureSet {
    Basic = "Basic",
    Pro = "Pro",
    Team = "Team",
    Enterprise = "Enterprise"
}
export declare enum QuotaLimitType {
    Action = "Action",
    Getter = "Getter",
    Sync = "Sync",
    Metadata = "Metadata"
}
export declare enum SyncInterval {
    Manual = "Manual",
    Daily = "Daily",
    Hourly = "Hourly",
    EveryTenMinutes = "EveryTenMinutes"
}
export interface SyncQuota {
    maximumInterval?: SyncInterval;
    maximumRowCount?: number;
}
export interface Quota {
    monthlyLimits?: Partial<{
        [quotaLimitType in QuotaLimitType]: number;
    }>;
    maximumSyncInterval?: SyncInterval;
    sync?: SyncQuota;
}
export interface RateLimit {
    operationsPerInterval: number;
    intervalSeconds: number;
}
export interface RateLimits {
    overall?: RateLimit;
    perConnection?: RateLimit;
}
export declare type BasicPackDefinition = Omit<PackVersionDefinition, 'version'>;
/**
 * The definition of the contents of a Pack at a specific version. This is the
 * heart of the implementation of a Pack.
 */
export interface PackVersionDefinition {
    version: string;
    /**
     * If specified, the user must provide personal authentication credentials before using the pack.
     */
    defaultAuthentication?: Authentication;
    /**
     * If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
     * explicit connection is specified by the user.
     */
    systemConnectionAuthentication?: SystemAuthentication;
    networkDomains?: string[];
    formulaNamespace?: string;
    formulas?: PackFormulas | Formula[];
    formats?: Format[];
    syncTables?: SyncTable[];
}
/**
 * @deprecated use `#PackVersionDefinition`
 *
 * The legacy complete definition of a Pack including un-versioned metadata.
 * This should only be used by legacy Coda pack implementations.
 */
export interface PackDefinition extends PackVersionDefinition {
    id: PackId;
    name: string;
    shortDescription: string;
    description: string;
    permissionsDescription?: string;
    category?: PackCategory;
    logoPath: string;
    enabledConfigName?: string;
    exampleImages?: string[];
    exampleVideoIds?: string[];
    minimumFeatureSet?: FeatureSet;
    quotas?: Partial<{
        [featureSet in FeatureSet]: Quota;
    }>;
    rateLimits?: RateLimits;
    /**
     * Whether this is a pack that will be used by Coda internally and not exposed directly to users.
     */
    isSystem?: boolean;
}
export {};
