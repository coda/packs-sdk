import type {$Values} from './type_utils';
import type {Formula} from './api';
import type {MetadataFormula} from './api';
import type {MetadataFormulaDef} from './api';
import type {SyncTable} from './api';

/**
 * @deprecated Use `number` in new code.
 */
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
 * Authentication types supported by Coda Packs.
 *
 * @see [Authenticating with other services](https://coda.io/packs/build/latest/guides/basics/authentication/)
 * @see [Authentication samples](https://coda.io/packs/build/latest/samples/topic/authentication/)
 */
export enum AuthenticationType {
  /**
   * Indicates this pack does not use authentication. You may also omit an authentication declaration entirely.
   */
  None = 'None',
  /**
   * Authenticate using an HTTP header of the form `Authorization: Bearer <token>`.
   *
   * @see {@link HeaderBearerTokenAuthentication}
   */
  HeaderBearerToken = 'HeaderBearerToken',
  /**
   * Authenticate using an HTTP header with a custom name and token prefix that you specify.
   *
   * @see {@link CustomHeaderTokenAuthentication}
   */
  CustomHeaderToken = 'CustomHeaderToken',
  /**
   * Authenticate using multiple HTTP headers that you specify.
   *
   * @see {@link MultiHeaderTokenAuthentication}
   */
  MultiHeaderToken = 'MultiHeaderToken',
  /**
   * Authenticate using a token that is passed as a URL parameter with each request, e.g.
   * `https://example.com/api?paramName=token`.
   *
   * @see {@link QueryParamTokenAuthentication}
   */
  QueryParamToken = 'QueryParamToken',
  /**
   * Authenticate using multiple tokens, each passed as a different URL parameter, e.g.
   * `https://example.com/api?param1=token1&param2=token2`
   *
   * @see {@link MultiQueryParamTokenAuthentication}
   */
  MultiQueryParamToken = 'MultiQueryParamToken',
  /**
   * Authenticate using OAuth2. This is the most common type of OAuth2, which involves the user approving access to
   * their account before being granted a token.
   * The API must use a (largely) standards-compliant implementation of OAuth2.
   *
   * @see {@link OAuth2Authentication}
   */
  OAuth2 = 'OAuth2',
  /**
   * Authenticate using OAuth2 client credentials. This is a less common type of OAuth2,
   * which involves exchanging a client ID and secret for a temporary access token.
   *
   * @see [OAuth2 client credentials spec](https://oauth.net/2/grant-types/client-credentials/)
   * @see {@link OAuth2ClientCredentials}
   */
  OAuth2ClientCredentials = 'OAuth2ClientCredentials',
  /**
   * Authenticate using HTTP Basic authorization. The user provides a username and password
   * (sometimes optional) which are included as an HTTP header according to the Basic auth standard.
   *
   * @see {@link WebBasicAuthentication}
   */
  WebBasic = 'WebBasic',
  /**
   * Authenticate in a custom way by having one or more arbitrary secret values inserted into the request URL, body,
   * headers, or the form data using template replacement. Approval from Coda is required.
   *
   * @see {@link CustomAuthentication}
   */
  Custom = 'Custom',
  /**
   * Authenticate to Amazon Web Services using an IAM access key id & secret access key pair.
   *
   * @see {@link AWSAccessKeyAuthentication}
   */
  AWSAccessKey = 'AWSAccessKey',
  /**
   * Authenticate to Amazon Web Services by assuming an IAM role. This is not yet supported.
   *
   * @see {@link AWSAssumeRoleAuthentication}
   * @hidden
   */
  AWSAssumeRole = 'AWSAssumeRole',
  /**
   * Authenticate using a Coda REST API token, sent as an HTTP header.
   *
   * @see {@link CodaApiBearerTokenAuthentication}
   */
  CodaApiHeaderBearerToken = 'CodaApiHeaderBearerToken',
  /**
   * Only for use by Coda-authored packs.
   *
   * @see {@link VariousAuthentication}
   * @hidden
   */
  Various = 'Various',
}

/**
 * A pack or formula which does not use authentication.
 */
export interface NoAuthentication {
  /** Identifies this as not using authentication. You may also omit any definition to achieve the same result. */
  type: AuthenticationType.None;
}

/**
 * Configuration for a step that will run after the user sets up a new account
 * that fetches a set of endpoint domains that the user has access to and prompts
 * the user to select the one that should apply to this account.
 *
 * The selected endpoint domain is bound to this account and used as the root domain
 * of HTTP requests made by the fetcher. (Whenever an endpoint is associated with
 * an account, it is available at execution time as `context.endpoint`, and alternatively
 * can make fetcher requests using relative URLs and the fetcher will apply the endpoint
 * to the URL automatically.)
 *
 * As an example, we use this in the Jira pack to set up the Jira instance endpoint
 * to use with the user's account. A Jira account may have access to multiple
 * Jira instances; after authorizing the user account, this step makes an API call to
 * fetch all of the Jira instances that the user has access to, which are rendered as
 * options for the user, and the endpoint domain of the select option
 * (of the form <instance>.atlassian.net) is stored along with this account.
 */
export interface SetEndpoint {
  /** Identifies this as a SetEndpoint step. */
  type: PostSetupType.SetEndpoint;
  /**
   * An arbitrary name for this step, to distinguish from other steps of the same type
   * (exceedingly rare).
   */
  name: string;
  /**
   * A description to render to the user describing the selection they should be making,
   * for example, "Choose an instance to use with this account".
   */
  description: string;
  /**
   * The formula that fetches endpoints for the user
   * to select from. Like any {@link MetadataFormula}, this formula should return
   * an array of options, either strings or objects of the form
   * `{display: '<display name>', value: '<endpoint>'}` if wanting to render a display
   * label to the user rather than rendering the underlying value directly.
   */
  getOptions?: MetadataFormula; // TODO(packs-dev): Make this required after migration.
  /** @deprecated Use {@link getOptions} */
  getOptionsFormula?: MetadataFormula;
}

/**
 * Simplified configuration for {@link SetEndpoint} that a pack developer can specify when calling
 * {@link PackDefinitionBuilder.setUserAuthentication} or {@link PackDefinitionBuilder.setSystemAuthentication}.
 */
export type SetEndpointDef = Omit<SetEndpoint, 'getOptions' | 'getOptionsFormula'> & {
  /** See {@link SetEndpoint.getOptions} */
  getOptions?: MetadataFormulaDef;
  /** @deprecated Use {@link getOptions} */
  getOptionsFormula?: MetadataFormulaDef;
};

/**
 * Enumeration of post-account-setup step types. See {@link PostSetup}.
 */
export enum PostSetupType {
  /**
   * See {@link SetEndpoint}.
   */
  SetEndpoint = 'SetEndPoint',
}

/**
 * Definitions for optional steps that can happen upon a user completing setup
 * for a new account for this pack.
 *
 * This addresses only a highly-specific use case today but may grow to other
 * use cases and step types in the future.
 */
export type PostSetup = SetEndpoint;

/**
 * Simplified configuration for {@link PostSetup} that a pack developer can specify when calling
 * {@link PackDefinitionBuilder.setUserAuthentication} or {@link PackDefinitionBuilder.setSystemAuthentication}.
 */
export type PostSetupDef = SetEndpointDef;

/**
 * Base interface for authentication definitions.
 */
export interface BaseAuthentication {
  /**
   * A function that is called when a user sets up a new account, that returns a name for
   * the account to label that account in the UI. The users credentials are applied to any
   * fetcher requests that this function makes. Typically, this function makes an API call
   * to an API's "who am I" endpoint and returns a username.
   *
   * If omitted, or if the function returns an empty value, the account will be labeled
   * with the creating user's Coda username.
   */
  getConnectionName?: MetadataFormula;
  /**
   * A function that is called when a user sets up a new account, that returns the ID of
   * that account in the third-party system being called.
   *
   * This ID is not yet subsequently exposed to pack developers and is mostly for Coda
   * internal use.
   *
   * @ignore
   */
  getConnectionUserId?: MetadataFormula;

  /**
   * A link to a help article or other page with more instructions about how to set up an account for this pack.
   */
  instructionsUrl?: string;

  /**
   * If true, indicates this has pack has a specific endpoint domain for each account, that is used
   * as the basis of HTTP requests. For example, API requests are made to <custom-subdomain>.example.com
   * rather than example.com. If true, the user will be prompted to provide their specific endpoint domain
   * when creating a new account.
   */
  requiresEndpointUrl?: boolean;

  /**
   * When requiresEndpointUrl is set to true this should be the root domain that all endpoints share.
   * For example, this value would be "example.com" if specific endpoints looked like \{custom-subdomain\}.example.com.
   *
   * For packs that make requests to multiple domains (uncommon), this should be the domain within
   * {@link PackVersionDefinition.networkDomains} that this configuration applies to.
   */
  endpointDomain?: string;

  /**
   * One or more setup steps to run after the user has set up the account, before completing installation of the pack.
   * This is not common.
   */
  postSetup?: PostSetup[];

  /**
   * Which domain(s) should get auth credentials, when a pack is configured with multiple domains.
   * Packs configured with only one domain or with requiresEndpointUrl set to true can omit this.
   *
   * Using multiple authenticated network domains is uncommon and requires Coda approval.
   */
  networkDomain?: string | string[];
}

/**
 * Authenticate using an HTTP header of the form `Authorization: Bearer <token>`.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.HeaderBearerToken,
 * });
 * ```
 *
 * @see [Authenticating with other services - Simple tokens](https://coda.io/packs/build/latest/guides/basics/authentication/#simple-tokens)
 * @see [Authentication samples - Authorization header](https://coda.io/packs/build/latest/samples/topic/authentication/#authorization-header)
 */
export interface HeaderBearerTokenAuthentication extends BaseAuthentication {
  /** Identifies this as HeaderBearerToken authentication. */
  type: AuthenticationType.HeaderBearerToken;
}

/**
 * Authenticate using a Coda REST API token, sent as an HTTP header.
 *
 * This is identical to {@link AuthenticationType.HeaderBearerToken} except the user wil be presented
 * with a UI to generate an API token rather than needing to paste an arbitrary API
 * token into a text input.
 *
 * This is primarily for use by Coda-authored packs, as it is only relevant for interacting with the
 * Coda REST API.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.CodaApiHeaderBearerToken,
 * });
 * ```
 *
 * @see [Authenticating with other services - Coda API token](https://coda.io/packs/build/latest/guides/basics/authentication/#coda-api-token)
 * @see [Authentication samples - Coda API token](https://coda.io/packs/build/latest/samples/topic/authentication/#coda-api-token)
 */
export interface CodaApiBearerTokenAuthentication extends BaseAuthentication {
  /** Identifies this as CodaApiHeaderBearerToken authentication. */
  type: AuthenticationType.CodaApiHeaderBearerToken;
  /**
   * @deprecated
   */
  deferConnectionSetup?: boolean;
  /**
   * If true, automatically creates and configures an account with a Coda API token with
   * default settings when installing the pack: a read-write token, added to the doc
   * as a shared account that allows actions.
   */
  shouldAutoAuthSetup?: boolean;
}

/**
 * Authenticate using an HTTP header with a custom name and token prefix that you specify.
 * The header name is defined in the {@link headerName} property.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.CustomHeaderToken,
 *   headerName: "X-API-Key",
 * });
 * ```
 *
 * @see [Authenticating with other services - Simple tokens](https://coda.io/packs/build/latest/guides/basics/authentication/#simple-tokens)
 * @see [Authentication samples - Custom header](https://coda.io/packs/build/latest/samples/topic/authentication/#custom-header)
 */
export interface CustomHeaderTokenAuthentication extends BaseAuthentication {
  /** Identifies this as CustomHeaderToken authentication. */
  type: AuthenticationType.CustomHeaderToken;
  /**
   * The name of the HTTP header.
   */
  headerName: string;
  /**
   * An optional prefix in the HTTP header value before the actual token. Omit this
   * if the token is the entirety of the header value.
   *
   * The HTTP header will be of the form `<headerName>: <tokenPrefix> <token>`
   */
  tokenPrefix?: string;
}

// TODO(jonathan/ekoleda): Add samples.
/**
 * Authenticate using multiple HTTP headers that you specify.
 * Each header is specified with a name and an optional token prefix.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.MultiHeaderToken,
 *   headers: [
 *     {name: 'Header1', description: 'Enter the value for Header1',  tokenPrefix: 'prefix1'},
 *     {name: 'Header2', description: 'Enter value for Header2'},
 *   ],
 * });
 * ```
 */
export interface MultiHeaderTokenAuthentication extends BaseAuthentication {
  /** Identifies this as MultiHeaderToken authentication. */
  type: AuthenticationType.MultiHeaderToken;
  /**
   * Names and descriptions of the headers used for authentication.
   */
  headers: Array<{
    /**
     * The name of the HTTP header.
     */
    name: string;
    /**
     * A description shown to the user indicating what value they should provide for this header.
     */
    description: string;
    /**
     * An optional prefix in the HTTP header value before the actual token. Omit this
     * if the token is the entirety of the header value.
     *
     * The HTTP header will be of the form `<headerName>: <tokenPrefix> <token>`
     */
    tokenPrefix?: string;
  }>;
}

/**
 * Authenticate using a token that is passed as a URL parameter with each request, e.g.
 * `https://example.com/api?paramName=token`.
 *
 * The parameter name is defined in the {@link paramName} property.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.QueryParamToken,
 *   paramName: "key",
 * });
 * ```
 *
 * @see [Authenticating with other services - Simple tokens](https://coda.io/packs/build/latest/guides/basics/authentication/#simple-tokens)
 * @see [Authentication samples - Query parameters](https://coda.io/packs/build/latest/samples/topic/authentication/#query-parameter)
 */
export interface QueryParamTokenAuthentication extends BaseAuthentication {
  /** Identifies this as QueryParamToken authentication. */
  type: AuthenticationType.QueryParamToken;
  /**
   * The name of the query parameter that will include the token,
   * e.g. "foo" if a token is passed as "foo=bar".
   */
  paramName: string;
}

/**
 * Authenticate using multiple tokens, each passed as a different URL parameter, e.g.
 * `https://example.com/api?param1=token1&param2=token2`.
 *
 * The parameter names are defined in the {@link params} array property.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.MultiQueryParamToken,
 *   params: [
 *     { name: "key", description: "The key." },
 *     { name: "secret", description: "The secret." },
 *   ],
 * });
 * ```
 *
 * @see [Authenticating with other services - Simple tokens](https://coda.io/packs/build/latest/guides/basics/authentication/#simple-tokens)
 * @see [Authentication samples - Multiple query parameters](https://coda.io/packs/build/latest/samples/topic/authentication/#multiple-query-parameters)
 */
export interface MultiQueryParamTokenAuthentication extends BaseAuthentication {
  /** Identifies this as MultiQueryParamToken authentication. */
  type: AuthenticationType.MultiQueryParamToken;
  /**
   * Names and descriptions of the query parameters used for authentication.
   */
  params: Array<{
    /**
     * The name of the query parameter, e.g. "foo" if a token is passed as "foo=bar".
     */
    name: string;
    /**
     * A description shown to the user indicating what value they should provide for this parameter.
     */
    description: string;
  }>;
}

export interface BaseOAuthAuthentication extends BaseAuthentication {
  /**
   * Scopes that are required to use this pack.
   *
   * Each API defines its own list of scopes, or none at all. You should consult
   * the documentation for the API you are connecting to.
   */
  scopes?: string[];
  /**
   * In rare cases, OAuth providers may want the permission scopes in a different query parameter
   * than `scope`.
   */
  scopeParamName?: string;
  /**
   * The delimiter to use when joining {@link scopes} when generating authorization URLs.
   *
   * The OAuth2 standard is to use spaces to delimit scopes, and Coda will do that by default.
   * If the API you are using requires a different delimiter, say a comma, specify it here.
   */
  scopeDelimiter?: ' ' | ',' | ';';
  /**
   * The URL that Coda will hit in order to exchange the temporary code for an access token.
   */
  tokenUrl: string;
  /**
   * In rare cases, OAuth providers send back access tokens nested inside another object in
   * their authentication response.
   */
  nestedResponseKey?: string;
  /**
   * When making the token exchange request, where to pass the client credentials (client ID and
   * client secret). The default is {@link TokenExchangeCredentialsLocation#Automatic}, which should
   * work for most providers. Pick a more specific option if the provider invalidates authorization
   * codes when there is an error in the token exchange.
   */
  credentialsLocation?: TokenExchangeCredentialsLocation;
  /**
   * A custom prefix to be used when passing the access token in the HTTP Authorization
   * header when making requests. Typically this prefix is `Bearer` which is what will be
   * used if this value is omitted. However, some services require a different prefix.
   * When sending authenticated requests, a HTTP header of the form
   * `Authorization: <tokenPrefix> <token>` will be used.
   */
  tokenPrefix?: string;
  /**
   * In rare cases, OAuth providers ask that a token is passed as a URL parameter
   * rather than an HTTP header. If so, this is the name of the URL query parameter
   * that should contain the token.
   */
  tokenQueryParam?: string;
}

/**
 * Authenticate using OAuth2. You must specify the authorization URL, token exchange URL, and
 * scopes here as part of the pack definition. You'll provide the application's client ID and
 * client secret in the pack management UI, so that these can be stored securely.
 *
 * The API must use a (largely) standards-compliant implementation of OAuth2.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.OAuth2,
 *   // These URLs come from the API's developer documentation.
 *   authorizationUrl: "https://example.com/authorize",
 *   tokenUrl: "https://api.example.com/token",
 * });
 * ```
 *
 * @see [Authenticating using OAuth](https://coda.io/packs/build/latest/guides/basics/authentication/oauth2/)
 * @see [Authentication samples - OAuth2](https://coda.io/packs/build/latest/samples/topic/authentication/#oauth2)
 */
export interface OAuth2Authentication extends BaseOAuthAuthentication {
  /** Identifies this as OAuth2 authentication. */
  type: AuthenticationType.OAuth2;
  /**
   * The URL to which the user will be redirected in order to authorize this pack.
   * This is typically just a base url with no parameters. Coda will append the `scope`
   * parameter automatically. If the authorization flow requires additional parameters,
   * they may be specified using {@link additionalParams}.
   */
  authorizationUrl: string;

  /**
   * Option custom URL parameters and values that should be included when redirecting the
   * user to the {@link authorizationUrl}.
   */
  additionalParams?: {[key: string]: any};

  /**
   * In rare cases, OAuth providers will return the specific API endpoint domain for the user as
   * part of the OAuth token exchange response. If so, this is the property in the OAuth
   * token exchange response JSON body that points to the endpoint.
   *
   * The endpoint will be saved along with the account and will be available during execution
   * as {@link ExecutionContext.endpoint}.
   */
  endpointKey?: string;

  /**
   * Option to apply PKCE (Proof Key for Code Exchange) OAuth2 extension. With PKCE extension,
   * a `code_challenge` parameter and a `code_challenge_method` parameter will be sent to the
   * authorization page. A `code_verifier` parameter will be sent to the token exchange API as
   * well.
   *
   * `code_challenge_method` defaults to SHA256 and can be configured with {@link pkceChallengeMethod}.
   *
   * See https://datatracker.ietf.org/doc/html/rfc7636 for more details.
   */
  useProofKeyForCodeExchange?: boolean;

  /**
   * See {@link useProofKeyForCodeExchange}
   */
  pkceChallengeMethod?: 'plain' | 'S256';
}

/**
 * Authenticate using OAuth2 client credentials.
 * You must specify the token exchange URL here as part of the pack definition.
 * You'll provide the application's client ID and client secret when authenticating.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.OAuth2ClientCredentials,
 *   // This URL comes from the API's developer documentation.
 *   tokenUrl: "https://api.example.com/token",
 * });
 * ```
 */
export interface OAuth2ClientCredentialsAuthentication extends BaseOAuthAuthentication {
  /** Identifies this as OAuth2 client credentials authentication. */
  type: AuthenticationType.OAuth2ClientCredentials;
}

/**
 * Where to pass the client credentials (client ID and client secret) when making the OAuth2 token
 * exchange request. Used in {@link OAuth2Authentication.credentialsLocation}.
 */
export enum TokenExchangeCredentialsLocation {
  /**
   * Allow Coda to determine this automatically. Currently that means Coda tries passing the
   * credentials in the body first, and if that fails then tries passing them in the Authorization
   * header.
   */
  Automatic = 'Automatic',

  /**
   * The credentials are passed in the body of the request, encoded as
   * `application/x-www-form-urlencoded` along with the other parameters.
   */
  Body = 'Body',

  /**
   * The credentials are passed in the Authorization header using the `Basic` scheme.
   */
  AuthorizationHeader = 'AuthorizationHeader',
}

/**
 * Authenticate using HTTP Basic authorization. The user provides a username and password
 * (sometimes optional) which are included as an HTTP header according to the Basic auth standard.
 *
 * @example
 * ```ts
 * pack.setUserAuthentication({
 *   type: coda.AuthenticationType.MultiQueryParamToken,
 *   params: [
 *     { name: "key", description: "The key." },
 *     { name: "secret", description: "The secret." },
 *   ],
 * });
 * ```
 *
 * @see [Authenticating with other services - Username and password](https://coda.io/packs/build/latest/guides/basics/authentication/#username-and-password)
 * @see [Authentication samples - Username and password](https://coda.io/packs/build/latest/samples/topic/authentication/#username-and-password)
 * @see [Wikipedia - Basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)
 */
export interface WebBasicAuthentication extends BaseAuthentication {
  /** Identifies this as WebBasic authentication. */
  type: AuthenticationType.WebBasic;
  /**
   * Configuration for labels to show in the UI when the user sets up a new account.
   */
  uxConfig?: {
    /**
     * A placeholder value for the text input where the user will enter a username.
     */
    placeholderUsername?: string;
    /**
     * A placeholder value for the text input where the user will enter a password.
     */
    placeholderPassword?: string;

    /**
     * If true, only a username input will be shown to the user.
     * Some services pass API keys in the username field and do not require a password.
     */
    usernameOnly?: boolean;
  };
}

/**
 * Parameters for the {@link CustomAuthentication} authentication type.
 */
export interface CustomAuthParameter {
  /**
   * The name used to refer to this parameter and to generate the template replacement string.
   */
  name: string;

  /**
   * A description shown to the user indicating what value they should provide for this parameter.
   */
  description: string;
}

/**
 * Authenticate for custom, non-standard API authentication schemes by inserting one or more arbitrary secret values
 * into the request (the body, URL, headers, or form data) using template replacement. Approval from Coda is required.
 *
 * Some APIs use non-standard authentication schemes which often require secret credentials to be put in specific places
 * in the request URL or request body. Custom authentication supports many of these cases by allowing you as the pack
 * author to define one or more secret values that the user or you as the pack author must provide (depending on
 * user or system authentication). When constructing a network request, you may indicate where these values should
 * be inserted by our fetcher service using the syntax described below (similar to templating engines).
 *
 * \{% raw %\}
 * To insert the credentials, simply put `{{<paramName>-<invocationToken>}}` as a string anywhere in your request,
 * where `<paramName>` is the name of the parameter defined in the params mapping and `<invocationToken>` is the
 * secret invocation-specific token provided within the {@link ExecutionContext}. The invocation
 * token is required for security reasons.
 * \{% endraw %\}
 *
 * @example
 * ```
 * {% raw %}
 * // Suppose you're using an API that requires a secret id in the request URL,
 * // and a different secret value in the request body. You can define a Custom
 * // authentication configuration with two params:
 * // params: [{name: "secretId", description: "Secret id"},
 * //          {name: "secretValue", description: "Secret value"}])
 * // The user or the pack author will be prompted to specify a value for each
 * // of these when setting up an account.
 * // In the `execute` body of your formula, you can specify where those values
 * // are inserted in the request using the template replacement syntax shown
 * // above.
 * //
 * // A real-world example of an API that would require this is the Plaid API
 * // (https://plaid.com/docs/api/products/#auth).
 * // See the use of `secret`, `client_id`, and `access_token` parameters in the
 * // body.
 * execute: async function([], context) {
 *   let secretIdTemplateName = "secretId-" + context.invocationToken;
 *   let urlWithSecret = "/api/entities/{{" + secretIdTemplateName + "}}"
 *   let secretValueTemplateName = "secretValue-" + context.invocationToken;
 *   let secretHeader = "Authorization  {{" + secretValueTemplateName + "}}";
 *   let bodyWithSecret = JSON.stringify({
 *     key: "{{" + secretValueTemplateName + "}}",
 *     otherBodyParam: "foo",
 *   });
 *
 *   let response = await context.fetcher.fetch({
 *     method: "GET",
 *     url: urlWithSecret,
 *     body: bodyWithSecret,
 *     headers: {
 *       "X-Custom-Authorization-Header": secretHeader,
 *     },
 *   });
 *   // ...
 * }
 * {% endraw %}
 * ```
 *
 * @see [Authenticating with other services - Custom tokens](https://coda.io/packs/build/latest/guides/basics/authentication/#custom-tokens)
 * @see [Authentication samples - Custom tokens](https://coda.io/packs/build/latest/samples/topic/authentication/#custom-tokens)
 */
export interface CustomAuthentication extends BaseAuthentication {
  /** Identifies this as Custom authentication. */
  type: AuthenticationType.Custom;
  /**
   * An array of parameters that must be provided for new connection accounts to authenticate this pack.
   * These parameters can then be referenced via the {@link CustomAuthParameter.name} property for template
   * replacement inside the constructed network request.
   */
  params: CustomAuthParameter[];
}

/**
 * Authenticate to Amazon Web Services using an IAM access key id & secret access key pair.
 *
 * @see [Amazon - AWS Signature Version 4](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)
 */
export interface AWSAccessKeyAuthentication extends BaseAuthentication {
  /** Identifies this as AWSAccessKey authentication. */
  type: AuthenticationType.AWSAccessKey;
  /** The AWS service to authenticate with, like "s3", "iam", or "route53". */
  service: string;
}

/**
 * Authenticate to Amazon Web Services by assuming an IAM role. This is not yet supported.
 *
 * @see [Amazon - AWS Signature Version 4](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)
 * @hidden
 */
export interface AWSAssumeRoleAuthentication extends BaseAuthentication {
  /** Identifies this as AWSAssumeRole authentication. */
  type: AuthenticationType.AWSAssumeRole;
  /** The AWS service to authenticate with, like "s3", "iam", or "route53". */
  service: string;
}

/**
 * Only for use by Coda-authored packs.
 *
 * @hidden
 */
export interface VariousAuthentication {
  /** Identifies this as Various authentication. */
  type: AuthenticationType.Various;
}

/**
 * The union of supported authentication methods.
 */
export type Authentication =
  | NoAuthentication
  | VariousAuthentication
  | HeaderBearerTokenAuthentication
  | CodaApiBearerTokenAuthentication
  | CustomHeaderTokenAuthentication
  | MultiHeaderTokenAuthentication
  | QueryParamTokenAuthentication
  | MultiQueryParamTokenAuthentication
  | OAuth2Authentication
  | OAuth2ClientCredentialsAuthentication
  | WebBasicAuthentication
  | AWSAccessKeyAuthentication
  | AWSAssumeRoleAuthentication
  | CustomAuthentication;

/** @ignore */
export interface AuthenticationTypeMap {
  [AuthenticationType.None]: NoAuthentication;
  [AuthenticationType.Various]: VariousAuthentication;
  [AuthenticationType.HeaderBearerToken]: HeaderBearerTokenAuthentication;
  [AuthenticationType.CodaApiHeaderBearerToken]: CodaApiBearerTokenAuthentication;
  [AuthenticationType.CustomHeaderToken]: CustomHeaderTokenAuthentication;
  [AuthenticationType.QueryParamToken]: QueryParamTokenAuthentication;
  [AuthenticationType.MultiQueryParamToken]: MultiQueryParamTokenAuthentication;
  [AuthenticationType.OAuth2]: OAuth2Authentication;
  [AuthenticationType.OAuth2ClientCredentials]: OAuth2ClientCredentialsAuthentication;
  [AuthenticationType.WebBasic]: WebBasicAuthentication;
  [AuthenticationType.AWSAccessKey]: AWSAccessKeyAuthentication;
  [AuthenticationType.AWSAssumeRole]: AWSAssumeRoleAuthentication;
  [AuthenticationType.Custom]: CustomAuthentication;
}

type AsAuthDef<T extends BaseAuthentication> = Omit<T, 'getConnectionName' | 'getConnectionUserId' | 'postSetup'> & {
  /** See {@link BaseAuthentication.getConnectionName} */
  getConnectionName?: MetadataFormulaDef;
  /** See {@link BaseAuthentication.getConnectionUserId} @ignore */
  getConnectionUserId?: MetadataFormulaDef;
  /** {@link BaseAuthentication.postSetup} */
  postSetup?: PostSetupDef[];
};

/**
 * The union of supported authentication definitions. These represent simplified configurations
 * a pack developer can specify when calling {@link PackDefinitionBuilder.setUserAuthentication} when using
 * a pack definition builder. The builder massages these definitions into the form of
 * an {@link Authentication} value, which is the value Coda ultimately cares about.
 */
export type AuthenticationDef =
  | NoAuthentication
  | VariousAuthentication
  | AsAuthDef<HeaderBearerTokenAuthentication>
  | AsAuthDef<CodaApiBearerTokenAuthentication>
  | AsAuthDef<CustomHeaderTokenAuthentication>
  | AsAuthDef<MultiHeaderTokenAuthentication>
  | AsAuthDef<QueryParamTokenAuthentication>
  | AsAuthDef<MultiQueryParamTokenAuthentication>
  | AsAuthDef<OAuth2Authentication>
  | AsAuthDef<OAuth2ClientCredentialsAuthentication>
  | AsAuthDef<WebBasicAuthentication>
  | AsAuthDef<AWSAccessKeyAuthentication>
  | AsAuthDef<AWSAssumeRoleAuthentication>
  | AsAuthDef<CustomAuthentication>;

/**
 * The union of authentication methods that are supported for system authentication,
 * where the pack author provides credentials used in HTTP requests rather than the user.
 */
export type SystemAuthentication =
  | HeaderBearerTokenAuthentication
  | CustomHeaderTokenAuthentication
  | MultiHeaderTokenAuthentication
  | QueryParamTokenAuthentication
  | MultiQueryParamTokenAuthentication
  | WebBasicAuthentication
  | AWSAccessKeyAuthentication
  | AWSAssumeRoleAuthentication
  | CustomAuthentication
  | OAuth2ClientCredentialsAuthentication;

/**
 * The union of supported system authentication definitions. These represent simplified
 * configurations a pack developer can specify when calling {@link PackDefinitionBuilder.setSystemAuthentication}
 * when using a pack definition builder. The builder massages these definitions into the form of
 * an {@link SystemAuthentication} value, which is the value Coda ultimately cares about.
 */
export type SystemAuthenticationDef =
  | AsAuthDef<HeaderBearerTokenAuthentication>
  | AsAuthDef<CustomHeaderTokenAuthentication>
  | AsAuthDef<MultiHeaderTokenAuthentication>
  | AsAuthDef<QueryParamTokenAuthentication>
  | AsAuthDef<MultiQueryParamTokenAuthentication>
  | AsAuthDef<WebBasicAuthentication>
  | AsAuthDef<AWSAccessKeyAuthentication>
  | AsAuthDef<AWSAssumeRoleAuthentication>
  | AsAuthDef<CustomAuthentication>
  | AsAuthDef<OAuth2ClientCredentialsAuthentication>;

/**
 * The subset of valid {@link AuthenticationType} enum values that can be used
 * when defining {@link SystemAuthentication}.
 */
export type SystemAuthenticationTypes = $Values<Pick<SystemAuthentication, 'type'>>;

/**
 * @ignore
 */
export type VariousSupportedAuthentication =
  | NoAuthentication
  | HeaderBearerTokenAuthentication
  | CustomHeaderTokenAuthentication
  | MultiHeaderTokenAuthentication
  | QueryParamTokenAuthentication
  | MultiQueryParamTokenAuthentication
  | WebBasicAuthentication;

/**
 * @ignore
 */
export type VariousSupportedAuthenticationTypes = $Values<Pick<VariousSupportedAuthentication, 'type'>>;

/**
 * Definition for a custom column type that users can apply to any column in any Coda table.
 * A column format tells Coda to interpret the value in a cell by executing a formula
 * using that value, typically looking up data related to that value from a third-party API.
 * For example, the Weather pack has a column format "Current Weather"; when applied to a column,
 * if you type a city or address into a cell in that column, that location will be used as the input
 * to a formula that fetches the current weather at that location, and the resulting object with
 * weather info will be shown in the cell.
 *
 * A column format is just a wrapper around a formula defined in the {@link PackVersionDefinition.formulas} section
 * of your pack definition. It tells Coda to execute that particular formula using the value
 * of the cell as input.
 *
 * The formula referenced by a format must have exactly one required parameter.
 *
 * You may optionally specify one or more {@link matchers}, which are regular expressions
 * that can be matched against values that users paste into table cells, to determine if
 * this Format is applicable to that value. Matchers help users realize that there is a pack
 * format that may augment their experience of working with such values.
 *
 * For example, if you're building a Wikipedia pack, you may write a matcher regular expression
 * that looks for Wikipedia article URLs, if you have a formula that can fetch structured data
 * given an article URL. This would help users discover that there is a pack that can fetch
 * structured data given only a url.
 *
 * At present, matchers will only be run on URLs and not other text values.
 */
export interface Format {
  /**
   * The name of this column format. This will show to users in the column type chooser.
   */
  name: string;
  /** @deprecated Namespaces are being removed from the product. */
  formulaNamespace?: string;
  /**
   * The name of the formula to invoke for values in columns using this format.
   * This must correspond to the name of a regular, public formula defined in this pack.
   */
  formulaName: string;
  /** @deprecated No longer needed, will be inferred from the referenced formula. */
  hasNoConnection?: boolean;
  /**
   * A brief, optional explanation of how users should use this format, for example, what kinds
   * of values they should put in columns using this format.
   */
  instructions?: string;
  /**
   * A list of regular expressions that match URLs that the formula implementing this format
   * is capable of handling. As described in {@link Format}, this is a discovery mechanism.
   */
  matchers?: RegExp[];
  /**
   * @deprecated Currently unused.
   */
  placeholder?: string;
}

/**
 * @deprecated
 * @ignore
 */
export enum FeatureSet {
  Basic = 'Basic',
  Pro = 'Pro',
  Team = 'Team',
  Enterprise = 'Enterprise',
}

/**
 * @ignore
 * @deprecated
 */
export enum QuotaLimitType {
  Action = 'Action',
  Getter = 'Getter',
  Sync = 'Sync',
  Metadata = 'Metadata',
}

/**
 * @ignore
 * @deprecated
 */
export enum SyncInterval {
  Manual = 'Manual',
  Daily = 'Daily',
  Hourly = 'Hourly',
  EveryTenMinutes = 'EveryTenMinutes',
}

/**
 * @ignore
 * @deprecated
 */
export interface SyncQuota {
  maximumInterval?: SyncInterval;
  maximumRowCount?: number;
}

/**
 * @ignore
 * @deprecated
 */
export interface Quota {
  monthlyLimits?: Partial<{[quotaLimitType in QuotaLimitType]: number}>;
  // TODO(alexd): Deprecate
  maximumSyncInterval?: SyncInterval;
  sync?: SyncQuota;
}

/**
 * @deprecated Define these in the pack management UI instead.
 */
export interface RateLimit {
  operationsPerInterval: number;
  intervalSeconds: number;
}

/**
 * @deprecated Define these in the pack management UI instead.
 */
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
  /**
   * The semantic version of the pack. This must be valid semantic version of the form `1`, `1.2`, or `1.2.3`.
   * When uploading a pack version, the semantic version must be greater than any previously uploaded version.
   */
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
  /**
   * Any domain(s) to which this pack makes fetcher requests. The domains this pack connects to must be
   * declared up front here, both to clearly communicate to users what a pack is capable of connecting to,
   * and for security reasons. These network domains are enforced at execution time: any fetcher request
   * to a domain not listed here will be rejected.
   *
   * Only one network domain is allowed by default. If your pack has needs to connect to multiple domains
   * contact Coda support for approval.
   */
  networkDomains?: string[];

  // User-facing components

  /**
   * @deprecated
   */
  formulaNamespace?: string; // TODO: @alan-fang remove
  /**
   * Definitions of this pack's formulas. See {@link Formula}.
   *
   * Note that button actions are also defined here. Buttons are simply formulas
   * with `isAction: true`.
   *
   */
  formulas?: Formula[];
  /**
   * Definitions of this pack's column formats. See {@link Format}.
   */
  formats?: Format[];
  /**
   * Definitions of this pack's sync tables. See {@link SyncTable}.
   */
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
