import type {MetadataFormula} from './api';
import type {SyncTable} from './api';
import type {TypedStandardFormula} from './api';

export type PackId = number;
export type ProviderId = number;

export enum PackCategory {
  CRM = 'CRM',
  Calendar = 'Calendar',
  Communication = 'Communication',
  DataStorage = 'DataStorage',
  Design = 'Design',
  Financial = 'Financial',
  Fun = 'Fun',
  Geo = 'Geo',
  IT = 'IT',
  Mathematics = 'Mathematics',
  Organization = 'Organization',
  Recruiting = 'Recruiting',
  Shopping = 'Shopping',
  Social = 'Social',
  Sports = 'Sports',
  Travel = 'Travel',
  Weather = 'Weather',
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
  CodaApiHeaderBearerToken = 'CodaApiHeaderBearerToken',
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

export interface PostSetup {
  name: 'endpoint' | string;
  description: string;
  getOptionsFormula: MetadataFormula;
}

interface BaseAuthentication {
  getConnectionName?: MetadataFormula;
  getConnectionUserId?: MetadataFormula;

  // Specifies a set of defaults for allowing pack authors to decide what the "normal"
  // configuration of authentication for this pack should look like.
  defaultConnectionType?: DefaultConnectionType;

  // link to help article, etc. if more instructions needed explaining how to install the pack
  instructionsUrl?: string;

  // Does this authentication instance require a custom endpoint url?
  requiresEndpointUrl?: boolean;

  // Root endpoint domain for multi-tenant services - for example set to "example.com" for "https://mysite.example.com"
  endpointDomain?: string;

  // Post auth completion steps
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
  // If specified, does not require a connection to be configured in
  // order to install the pack.
  deferConnectionSetup?: boolean;
  // If specified, auto configures the connection (full access token, shared, and allowing actions) when
  // installing the pack
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
  additionalParams?: {[key: string]: any};
  // TODO(oleg): store secrets somewhere better, like in AWS Secrets Manager.
  appIdEnvVarName?: string;
  clientIdEnvVarName: string;
  clientSecretEnvVarName: string;
  signingSecretEnvVarName?: string;

  // Some OAuth providers will return the API domain with the OAuth response.
  // This is the key in the OAuth response json body that points to the endpoint.
  endpointKey?: string;
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

export interface AWSSignature4Authentication extends BaseAuthentication {
  type: AuthenticationType.AWSSignature4;
  service: string;
}

export type Authentication =
  | NoAuthentication
  | HeaderBearerTokenAuthentication
  | CodaApiBearerTokenAuthentication
  | CustomHeaderTokenAuthentication
  | QueryParamTokenAuthentication
  | MultiQueryParamTokenAuthentication
  | OAuth2Authentication
  | WebBasicAuthentication
  | AWSSignature4Authentication;

export type SystemAuthentication =
  | HeaderBearerTokenAuthentication
  | CustomHeaderTokenAuthentication
  | QueryParamTokenAuthentication
  | MultiQueryParamTokenAuthentication
  | WebBasicAuthentication
  | AWSSignature4Authentication;

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

export enum FeatureSet {
  Basic = 'Basic',
  Pro = 'Pro',
  Team = 'Team',
  Enterprise = 'Enterprise',
}

export enum QuotaLimitType {
  Action = 'Action',
  Getter = 'Getter',
  Sync = 'Sync',
  Metadata = 'Metadata',
}

export enum SyncInterval {
  Manual = 'Manual',
  Daily = 'Daily',
  Hourly = 'Hourly',
  EveryTenMinutes = 'EveryTenMinutes',
}

export interface SyncQuota {
  maximumInterval?: SyncInterval;
  maximumRowCount?: number;
}

export interface Quota {
  monthlyLimits?: Partial<{[quotaLimitType in QuotaLimitType]: number}>;
  // TODO(alexd): Deprecate
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
  quotas?: Partial<{[featureSet in FeatureSet]: Quota}>;
  rateLimits?: RateLimits;
  formulaNamespace?: string;
  /**
   * If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
   * explicit connection is specified by the user.
   */
  systemConnectionAuthentication?: SystemAuthentication;

  // User-facing components
  formulas?: TypedStandardFormula[];
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
