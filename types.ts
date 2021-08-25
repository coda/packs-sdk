import type {$Values} from './type_utils';
import type {Formula} from './api';
import type {MetadataFormula} from './api';
import type {MetadataFormulaDef} from './api';
import type {PackFormulas} from './api';
import type {SyncTable} from './api';

export type PackId = number;

/**
 * @deprecated
 */
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

/**
 * Authentication types support by Coda Packs.
 */
export enum AuthenticationType {
  /**
   * Indicates this pack does not use authentication. You may also omit an authentication declaration entirely.
   */
  None = 'None',
  /**
   * Authenticate using an http header of the form `Authorization: Bearer <token>`.
   */
  HeaderBearerToken = 'HeaderBearerToken',
  /**
   * Authenticate using an http header with a custom name and token prefix that you specify.
   */
  CustomHeaderToken = 'CustomHeaderToken',
  /**
   * Authenticate using a token that is passed as a url parameter with each request, e.g.
   * https://example.com/api?paramName=token
   */
  QueryParamToken = 'QueryParamToken',
  /**
   * Authenticate using multiple tokens, each passed as a different url parameter, e.g.
   * https://example.com/api?param1=token1&param2=token2
   */
  MultiQueryParamToken = 'MultiQueryParamToken',
  /**
   * Authenticate using OAuth2. You must specify the authorization url, token exchange url, and
   * scopes here as part of the pack definition. You'll provide the application's client ID and
   * client secret in the pack management UI, so that these can be stored securely.
   *
   * The API must use a (largely) standards-compliant implementation of OAuth2.
   */
  OAuth2 = 'OAuth2',
  /**
   * Authenticate using HTTP Basic authorization. The user provides a username and password
   * (sometimes optional) where included as an http header according to the Basic auth standard.
   *
   * See https://en.wikipedia.org/wiki/Basic_access_authentication
   */
  WebBasic = 'WebBasic',
  /**
   * Authenticate with Amazon Web Services using AWS Signature Version 4.
   *
   * This is not yet supported.
   */
  AWSSignature4 = 'AWSSignature4',
  /**
   * Authenticate using a Coda REST API token, sent as an http header.
   *
   * This is identical to {@link HeaderBearerToken} except the user wil be presented
   * with a UI to generate an API token rather than needing to paste an arbitrary API
   * token into a text input.
   *
   * This is primarily for use by Coda-authored packs, as it is only relevant for interacting with the
   * Coda REST API.
   */
  CodaApiHeaderBearerToken = 'CodaApiHeaderBearerToken',
  /**
   * Only for use by Coda-authored packs.
   */
  Various = 'Various',
}

/**
 * Ways in which a user account can be used with a doc.
 */
export enum DefaultConnectionType {
  /**
   * An account can be used to invoke pack formulas by any user of a doc, but only
   * to retrieve data, not to take actions (i.e. push buttons).
   */
  SharedDataOnly = 1,
  /**
   * An account can be used by any user of a doc both to retrieve data and to take actions.
   */
  Shared,
  /**
   * An account can only be used by the Coda user who set up the account, as their "private account"
   * for taking actions. Private, aka "proxy", accounts can only be used to take actions, and not
   * to retrieve data, because all users of a doc must be able to retrieve the same data.
   */
  ProxyActionsOnly,
}

/**
 * A pack or formula which does not use authentication..
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

  /**
   * Indicates how a user's account is expected to be used by this pack, e.g. is this account
   * used for retrieving data, taking actions, or both.
   */
  defaultConnectionType?: DefaultConnectionType;

  /**
   * A link to a help article or other page with more instructions about how to set up an account for this pack.
   */
  instructionsUrl?: string;

  /**
   * Does this pack have a specific endpoint domain for each account, that is used as the basis of http requests?
   * For example, are API requests made to <custom-subdomain>.example.com rather than example.com?
   */
  requiresEndpointUrl?: boolean;

  /**
   * If this pack does require an account-specific endpoint domain, this is the root domain of all of those endpoints.
   * For example, this value would be "example.com" if specific endpoints looked like <custom-subdomain>.example.com.
   */
  endpointDomain?: string;

  /**
   * One or more setup steps to run after the user has set up the account, before completing installation of the pack.
   * This is not common.
   */
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
  /**
   * A function that is called when a user sets up a new account, that returns a name for
   * the account to label that account in the UI. The users credentials are applied to any
   * fetcher requests that this function makes. Typically, this function makes an API call
   * to an API's "who am I" endpoint and returns a username.
   *
   * If omitted, or if the function returns an empty value, the account will be labeled
   * with the creating user's Coda email address.
   */
  getConnectionName?: MetadataFormulaDef;
  /**
   * A function that is called when a user sets up a new account, that returns the id of
   * that account in the third-party system being called.
   *
   * This id is not yet subsequently exposed to pack developers and is mostly for Coda
   * internal use.
   */
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

/**
 * A pack definition without an author-defined semantic version, for use in the web
 * editor where Coda will manage versioning on behalf of the pack author.
 */
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
