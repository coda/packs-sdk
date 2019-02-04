import {GetConnectionNameFormula} from './api';
import {PackFormulas} from './api';

export enum PackCategory {
  CRM = 'CRM',
  Calendar = 'Calendar',
  Communication = 'Communication',
  DataStorage = 'DataStorage',
  Design = 'Design',
  Financial = 'Financial',
  Fun = 'Fun',
  Geo = 'Geo',
  Mathematics = 'Mathematics',
  Organization = 'Organization',
  Recruiting = 'Recruiting',
  Shopping = 'Shopping',
  Social = 'Social',
  Sports = 'Sports',
  Travel = 'Travel',
  Weather = 'Weather',
}

export enum PackId {
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
}

export enum ProviderId {
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
}

export enum AuthenticationType {
  None = 'None',
  HeaderBearerToken = 'HeaderBearerToken',
  CustomHeaderToken = 'CustomHeaderToken',
  QueryParamToken = 'QueryParamToken',
  MultiQueryParamToken = 'MultiQueryParamToken',
  OAuth2 = 'OAuth2',
  WebBasic = 'WebBasic',
  AWSSignature4 = 'AWSSignature4',
}

export enum DefaultConnectionType {
  SharedDataOnly = 1,
  Shared,
  ProxyActionsOnly,
}

/**
 * A pack or formula which uses no authentication mechanism
 */
export interface NoAuthentication {
  type: AuthenticationType.None;
}

interface BaseAuthentication {
  getConnectionNameFormula?: GetConnectionNameFormula;

  // Specifies a set of defaults for allowing pack authors to decide what the "normal"
  // configuration of authentication for this pack should look like.
  defaultConnectionType?: DefaultConnectionType;

  // link to help article, etc. if more instructions needed explaining how to install the pack
  instructionsUrl?: string;

  // Does this authentication instance require a custom endpoint url?
  requiresEndpointUrl?: boolean;

  // Root endpoint domain for multi-tenant services - for example set to "example.com" for "https://mysite.example.com"
  endpointDomain?: string;
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
  additionalParams?: {[key: string]: any};
  // TODO(oleg): store secrets somewhere better, like in AWS Secrets Manager.
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

    // Some auth providers pass apiKeys in the username and do not require a password
    usernameOnly?: boolean;
  };
}

export type Authentication =
  | NoAuthentication
  | HeaderBearerTokenAuthentication
  | CustomHeaderTokenAuthentication
  | QueryParamTokenAuthentication
  | MultiQueryParamTokenAuthentication
  | OAuth2Authentication
  | WebBasicAuthentication;

export type SystemAuthentication =
  | HeaderBearerTokenAuthentication
  | CustomHeaderTokenAuthentication
  | QueryParamTokenAuthentication
  | MultiQueryParamTokenAuthentication
  | WebBasicAuthentication;

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
  gettingStartedImage?: string;
  gettingStartedText?: string;
  /**
   * If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
   * explicit connection is specified by the user.
   */
  systemConnectionAuthentication?: SystemAuthentication;

  // User-facing components
  formulas?: PackFormulas;
  formats?: Format[];
  policies?: Policy[];
}

export interface ProviderDefinition {
  id: ProviderId;
  name: string;
  logoPath: string;
}
