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
    Weather = "Weather"
}
export declare enum PackId {
    Airtable = 1001,
    CodaDebug = 1009,
    CodaDoc = 1021,
    CodaTrigonometry = 1006,
    Discourse = 1022,
    Figma = 1010,
    FullContact = 1019,
    Giphy = 1008,
    GitHub = 1013,
    GoogleCalendar = 1003,
    GoogleContacts = 1011,
    GoogleDirections = 1020,
    GoogleNaturalLanguage = 1014,
    GoogleTasks = 1012,
    Gmail = 1004,
    Greenhouse = 1022,
    Intercom = 1002,
    Lob = 1023,
    Notion = 1005,
    Slack = 1000,
    Spotify = 1018,
    Stocks = 1024,
    Twilio = 1016,
    Twitter = 1007,
    Weather = 1015,
    Zoom = 1017
}
export declare enum ProviderId {
    Airtable = 2001,
    Coda = 2002,
    Discourse = 2018,
    Figma = 2003,
    FullContact = 2015,
    Giphy = 2004,
    GitHub = 2010,
    Google = 2005,
    Greenhouse = 2016,
    Intercom = 2006,
    Lob = 2017,
    Notion = 2007,
    Slack = 2008,
    Spotify = 2014,
    Stocks = 2017,
    Twilio = 2012,
    Twitter = 2009,
    Weather = 2011,
    Zoom = 2013
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
    type: AuthenticationType.QueryParamToken;
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
