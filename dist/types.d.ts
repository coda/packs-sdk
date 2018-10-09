import { GetConnectionNameFormula } from './api';
import { PackFormulas } from './api';
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
    CodaDoc = 1021,
    Greenhouse = 1022,
    Lob = 1023,
    Stocks = 1024,
    Discourse = 1025,
    WalmartShopping = 1026,
    GooglePlaces = 1027
}
export declare const HackathonPackIds: Set<number>;
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
    Walmart = 2020
}
export declare enum AuthenticationType {
    None = "None",
    HeaderBearerToken = "HeaderBearerToken",
    CustomHeaderToken = "CustomHeaderToken",
    QueryParamToken = "QueryParamToken",
    MultiQueryParamToken = "MultiQueryParamToken",
    OAuth2 = "OAuth2",
    WebBasic = "WebBasic"
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
interface BaseAuthentication {
    getConnectionNameFormula?: GetConnectionNameFormula;
    defaultConnectionType?: DefaultConnectionType;
    instructionsUrl?: string;
    requiresEndpointUrl?: boolean;
}
/**
 * A pack or formula which uses standard bearer token header authentication:
 * {"Authorization": "Bearer <token here>"}
 */
export interface HeaderBearerTokenAuthentication extends BaseAuthentication {
    type: AuthenticationType.HeaderBearerToken;
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
}
export declare type Authentication = NoAuthentication | HeaderBearerTokenAuthentication | CustomHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | OAuth2Authentication | WebBasicAuthentication;
export declare type SystemAuthentication = HeaderBearerTokenAuthentication | CustomHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication;
export declare type AsyncFormulasLoader = () => Promise<PackFormulas>;
export interface Format {
    name: string;
    formulaNamespace: string;
    formulaName: string;
    hasNoConnection?: boolean;
    logoPath?: string;
    matchers?: RegExp[];
}
export interface PackDefinition {
    id: PackId;
    name: string;
    shortDescription: string;
    description: string;
    version: string;
    providerId: ProviderId;
    category: PackCategory;
    logoPath: string;
    enabledConfigName?: string;
    defaultAuthentication?: Authentication;
    exampleImages?: string[];
    /**
     * If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
     * explicit connection is specified by the user.
     */
    systemConnectionAuthentication?: SystemAuthentication;
    formulas?: PackFormulas;
    legacyFormulasLoader?: AsyncFormulasLoader;
    formats?: Format[];
}
export interface ProviderDefinition {
    id: ProviderId;
    name: string;
    logoPath: string;
}
export {};
