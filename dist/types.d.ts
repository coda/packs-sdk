import type { MetadataFormula } from './api';
import type { PackFormulas } from './api';
import type { SyncTable } from './api';
import type { TypedStandardFormula } from './api';
export declare type PackId = number;
export declare type ProviderId = number;
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
    CodaApiHeaderBearerToken = "CodaApiHeaderBearerToken"
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
    clientIdEnvVarName: string;
    clientSecretEnvVarName: string;
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
export declare type Authentication = NoAuthentication | HeaderBearerTokenAuthentication | CodaApiBearerTokenAuthentication | CustomHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | OAuth2Authentication | WebBasicAuthentication | AWSSignature4Authentication;
export declare type SystemAuthentication = HeaderBearerTokenAuthentication | CustomHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | WebBasicAuthentication | AWSSignature4Authentication;
export interface Format {
    name: string;
    formulaNamespace: string;
    formulaName: string;
    hasNoConnection?: boolean;
    instructions?: string;
    logoPath?: string;
    matchers?: RegExp[];
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
export interface PackDefinition {
    id: PackId;
    name: string;
    shortDescription: string;
    description: string;
    permissionsDescription?: string;
    version: string;
    providerId: ProviderId;
    category: PackCategory;
    logoPath: string;
    enabledConfigName?: string;
    defaultAuthentication?: Authentication;
    exampleImages?: string[];
    exampleVideoIds?: string[];
    minimumFeatureSet?: FeatureSet;
    quotas?: Partial<{
        [featureSet in FeatureSet]: Quota;
    }>;
    rateLimits?: RateLimits;
    formulaNamespace?: string;
    /**
     * If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
     * explicit connection is specified by the user.
     */
    systemConnectionAuthentication?: SystemAuthentication;
    formulas?: PackFormulas | TypedStandardFormula[];
    formats?: Format[];
    syncTables?: SyncTable[];
    /**
     * Whether this is a pack that will be used by Coda internally and not exposed directly to users.
     */
    isSystem?: boolean;
}
export interface ProviderDefinition {
    id: ProviderId;
    name: string;
    logoPath: string;
}
export {};
