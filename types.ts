import type {$Values} from './type_utils';
import type {Formula} from './api';
import type {MetadataFormula} from './api';
import type {MetadataFormulaDef} from './api';
import type {PackFormulas} from './api';
import type {SyncTable} from './api';

export type PackId = number;

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
  Various = 'Various',
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

export interface SetEndpoint {
  type: PostSetupType.SetEndpoint;
  name: string;
  description: string;
  getOptionsFormula: MetadataFormula;
}

export enum PostSetupType {
  SetEndpoint = 'SetEndPoint',
}

export type PostSetup = SetEndpoint;

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

  // Some OAuth providers will return the API domain with the OAuth response.
  // This is the key in the OAuth response json body that points to the endpoint.
  endpointKey?: string;

  // Some OAuth providers require passing the token as a URL param.
  tokenQueryParam?: string;
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

export interface VariousAuthentication {
  type: AuthenticationType.Various;
}

export type Authentication =
  | NoAuthentication
  | VariousAuthentication
  | HeaderBearerTokenAuthentication
  | CodaApiBearerTokenAuthentication
  | CustomHeaderTokenAuthentication
  | QueryParamTokenAuthentication
  | MultiQueryParamTokenAuthentication
  | OAuth2Authentication
  | WebBasicAuthentication
  | AWSSignature4Authentication;

type AsAuthDef<T extends BaseAuthentication> = Omit<T, 'getConnectionName' | 'getConnectionUserId'> & {
  getConnectionName?: MetadataFormulaDef;
  getConnectionUserId?: MetadataFormulaDef;
};

export type AuthenticationDef =
  | NoAuthentication
  | VariousAuthentication
  | AsAuthDef<HeaderBearerTokenAuthentication>
  | AsAuthDef<CodaApiBearerTokenAuthentication>
  | AsAuthDef<CustomHeaderTokenAuthentication>
  | AsAuthDef<QueryParamTokenAuthentication>
  | AsAuthDef<MultiQueryParamTokenAuthentication>
  | AsAuthDef<OAuth2Authentication>
  | AsAuthDef<WebBasicAuthentication>
  | AsAuthDef<AWSSignature4Authentication>;

export type SystemAuthentication =
  | HeaderBearerTokenAuthentication
  | CustomHeaderTokenAuthentication
  | QueryParamTokenAuthentication
  | MultiQueryParamTokenAuthentication
  | WebBasicAuthentication
  | AWSSignature4Authentication;

export type SystemAuthenticationDef =
  | AsAuthDef<HeaderBearerTokenAuthentication>
  | AsAuthDef<CustomHeaderTokenAuthentication>
  | AsAuthDef<QueryParamTokenAuthentication>
  | AsAuthDef<MultiQueryParamTokenAuthentication>
  | AsAuthDef<WebBasicAuthentication>
  | AsAuthDef<AWSSignature4Authentication>;

export type SystemAuthenticationTypes = $Values<Pick<SystemAuthentication, 'type'>>;

export type VariousSupportedAuthentication =
  | NoAuthentication
  | HeaderBearerTokenAuthentication
  | CustomHeaderTokenAuthentication
  | QueryParamTokenAuthentication
  | MultiQueryParamTokenAuthentication
  | WebBasicAuthentication;

export type VariousSupportedAuthenticationTypes = $Values<Pick<VariousSupportedAuthentication, 'type'>>;

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

export type BasicPackDefinition = Omit<PackVersionDefinition, 'version'>;

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

  // User-facing components
  formulaNamespace?: string; // TODO: @alan-fang remove
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
  quotas?: Partial<{[featureSet in FeatureSet]: Quota}>;
  rateLimits?: RateLimits;
  /**
   * Whether this is a pack that will be used by Coda internally and not exposed directly to users.
   */
  isSystem?: boolean;
}
