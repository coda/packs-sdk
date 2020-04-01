import { GetConnectionNameFormula } from './api';
import { MetadataFormula } from './api';
import { PackFormulas } from './api';
import { SyncTable } from './api';
export declare enum PackCategory {
    CRM = "CRM",
    Calendar = "Calendar",
    Communication = "Communication",
    DataStorage = "DataStorage",
    Design = "Design",
    Financial = "Financial",
    Fun = "Fun",
    Geo = "Geo",
    Mathematics = "Mathematics",
    Organization = "Organization",
    Recruiting = "Recruiting",
    Shopping = "Shopping",
    Social = "Social",
    Sports = "Sports",
    Travel = "Travel",
    Weather = "Weather"
}
export declare enum PackId {
    Slack = 1000,
    Airtable = 1001,
    Intercom = 1002,
    GoogleCalendar = 1003,
    Gmail = 1004,
    Notion = 1005,
    CodaTrigonometry = 1006,
    Twitter = 1007,
    Giphy = 1008,
    CodaDebug = 1009,
    Figma = 1010,
    GoogleContacts = 1011,
    GoogleNaturalLanguage = 1014,
    GoogleTasks = 1012,
    GitHub = 1013,
    Weather = 1015,
    Twilio = 1016,
    Zoom = 1017,
    Spotify = 1018,
    FullContact = 1019,
    GoogleDirections = 1020,
    Coda = 1021,
    Greenhouse = 1022,
    Lob = 1023,
    Stocks = 1024,
    Discourse = 1025,
    WalmartShopping = 1026,
    GooglePlaces = 1027,
    Unused = 1028,
    Instagram = 1029,
    YouTube = 1030,
    Wikipedia = 1031,
    Dropbox = 1032,
    Quickbooks = 1033,
    Shopify = 1034,
    HubSpot = 1035,
    Phabricator = 1036,
    Stripe = 1037,
    MLB = 1038,
    NBA = 1039,
    NFL = 1040,
    GoogleMaps = 1041,
    Imgur = 1042,
    Fitbit = 1043,
    Pinterest = 1044,
    Reddit = 1045,
    Flights = 1046,
    Cryptocurrency = 1047,
    S3 = 1048,
    GoogleSearchConsole = 1049,
    OMDB = 1050,
    PubNub = 1051,
    Jira = 1052,
    Barcode = 1053,
    CodaDoc = 1054,
    GoogleSheets = 1055,
    GoogleDocs = 1056,
    Mode = 1057,
    LaTeX = 1058,
    GoogleDrive = 1059,
    Lever = 1060,
    Unsplash = 1061,
    Typeform = 1062,
    GoogleTranslate = 1063,
    CodaStats = 1064,
    Trello = 1065,
    Asana = 1066
}
export declare enum ProviderId {
    Airtable = 2001,
    Coda = 2002,
    Figma = 2003,
    Giphy = 2004,
    Google = 2005,
    Intercom = 2006,
    Notion = 2007,
    Slack = 2008,
    Twitter = 2009,
    GitHub = 2010,
    Weather = 2011,
    Twilio = 2012,
    Zoom = 2013,
    Spotify = 2014,
    FullContact = 2015,
    Greenhouse = 2016,
    Lob = 2017,
    Stocks = 2018,
    Discourse = 2019,
    Walmart = 2020,
    Instagram = 2021,
    Wikipedia = 2022,
    Dropbox = 2023,
    Intuit = 2024,
    Shopify = 2025,
    HubSpot = 2026,
    Phacility = 2027,
    Stripe = 2028,
    MLB = 2029,
    NBA = 2030,
    NFL = 2031,
    Imgur = 2032,
    Fitbit = 2033,
    Pinterest = 2034,
    Reddit = 2035,
    Flights = 2036,
    Cryptocurrency = 2037,
    AWS = 2038,
    OMDB = 2039,
    PubNub = 2040,
    Atlassian = 2041,
    Barcode = 2042,
    Mode = 2043,
    LaTeX = 2044,
    Lever = 2045,
    Unsplash = 2046,
    Typeform = 2047,
    Trello = 2048,
    Asana = 2049
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
export interface PostSetup {
    name: 'endpoint' | string;
    description: string;
    getOptionsFormula: MetadataFormula;
}
interface BaseAuthentication {
    getConnectionNameFormula?: GetConnectionNameFormula;
    getConnectionName?: MetadataFormula;
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
}
/**
 * A pack or formula which uses standard bearer token header authentication:
 * {"Authorization": "Bearer <token here>"}
 */
export interface CustomHeaderTokenAuthentication extends BaseAuthentication {
    type: AuthenticationType.CustomHeaderToken;
    headerName: string;
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
    appIdEnvVarName?: string;
    clientIdEnvVarName: string;
    clientSecretEnvVarName: string;
    signingSecretEnvVarName?: string;
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
export interface Policy {
    name: string;
    url: string;
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
    /**
     * If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
     * explicit connection is specified by the user.
     */
    systemConnectionAuthentication?: SystemAuthentication;
    formulas?: PackFormulas;
    formats?: Format[];
    policies?: Policy[];
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
