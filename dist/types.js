"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncInterval = exports.QuotaLimitType = exports.FeatureSet = exports.TokenExchangeCredentialsLocation = exports.PostSetupType = exports.AuthenticationType = exports.PackCategory = void 0;
/**
 * @deprecated
 */
var PackCategory;
(function (PackCategory) {
    PackCategory["CRM"] = "CRM";
    PackCategory["Calendar"] = "Calendar";
    PackCategory["Communication"] = "Communication";
    PackCategory["DataStorage"] = "DataStorage";
    PackCategory["Design"] = "Design";
    PackCategory["Financial"] = "Financial";
    PackCategory["Fun"] = "Fun";
    PackCategory["Geo"] = "Geo";
    PackCategory["IT"] = "IT";
    PackCategory["Mathematics"] = "Mathematics";
    PackCategory["Organization"] = "Organization";
    PackCategory["Recruiting"] = "Recruiting";
    PackCategory["Shopping"] = "Shopping";
    PackCategory["Social"] = "Social";
    PackCategory["Sports"] = "Sports";
    PackCategory["Travel"] = "Travel";
    PackCategory["Weather"] = "Weather";
})(PackCategory || (exports.PackCategory = PackCategory = {}));
/**
 * Authentication types supported by Coda Packs.
 *
 * @see [Authenticating with other services](https://coda.io/packs/build/latest/guides/basics/authentication/)
 * @see [Authentication samples](https://coda.io/packs/build/latest/samples/topic/authentication/)
 */
var AuthenticationType;
(function (AuthenticationType) {
    /**
     * Indicates this pack does not use authentication. You may also omit an authentication declaration entirely.
     */
    AuthenticationType["None"] = "None";
    /**
     * Authenticate using an HTTP header of the form `Authorization: Bearer <token>`.
     *
     * @see {@link HeaderBearerTokenAuthentication}
     */
    AuthenticationType["HeaderBearerToken"] = "HeaderBearerToken";
    /**
     * Authenticate using an HTTP header with a custom name and token prefix that you specify.
     *
     * @see {@link CustomHeaderTokenAuthentication}
     */
    AuthenticationType["CustomHeaderToken"] = "CustomHeaderToken";
    /**
     * Authenticate using multiple HTTP headers that you specify.
     *
     * @see {@link MultiHeaderTokenAuthentication}
     */
    AuthenticationType["MultiHeaderToken"] = "MultiHeaderToken";
    /**
     * Authenticate using a token that is passed as a URL parameter with each request, e.g.
     * `https://example.com/api?paramName=token`.
     *
     * @see {@link QueryParamTokenAuthentication}
     */
    AuthenticationType["QueryParamToken"] = "QueryParamToken";
    /**
     * Authenticate using multiple tokens, each passed as a different URL parameter, e.g.
     * `https://example.com/api?param1=token1&param2=token2`
     *
     * @see {@link MultiQueryParamTokenAuthentication}
     */
    AuthenticationType["MultiQueryParamToken"] = "MultiQueryParamToken";
    /**
     * Authenticate using OAuth2. This is the most common type of OAuth2, which involves the user approving access to
     * their account before being granted a token.
     * The API must use a (largely) standards-compliant implementation of OAuth2.
     *
     * @see {@link OAuth2Authentication}
     */
    AuthenticationType["OAuth2"] = "OAuth2";
    /**
     * Authenticate using OAuth2 client credentials. This is a less common type of OAuth2,
     * which involves exchanging a client ID and secret for a temporary access token.
     *
     * @see [OAuth2 client credentials spec](https://oauth.net/2/grant-types/client-credentials/)
     * @see {@link OAuth2ClientCredentials}
     */
    AuthenticationType["OAuth2ClientCredentials"] = "OAuth2ClientCredentials";
    /**
     * Authenticate using HTTP Basic authorization. The user provides a username and password
     * (sometimes optional) which are included as an HTTP header according to the Basic auth standard.
     *
     * @see {@link WebBasicAuthentication}
     */
    AuthenticationType["WebBasic"] = "WebBasic";
    /**
     * Authenticate in a custom way by having one or more arbitrary secret values inserted into the request URL, body,
     * headers, or the form data using template replacement. Approval from Coda is required.
     *
     * @see {@link CustomAuthentication}
     */
    AuthenticationType["Custom"] = "Custom";
    /**
     * Authenticate to Amazon Web Services using an IAM access key id & secret access key pair.
     *
     * @see {@link AWSAccessKeyAuthentication}
     */
    AuthenticationType["AWSAccessKey"] = "AWSAccessKey";
    /**
     * Authenticate to Amazon Web Services by assuming an IAM role. This is not yet supported.
     *
     * @see {@link AWSAssumeRoleAuthentication}
     * @hidden
     */
    AuthenticationType["AWSAssumeRole"] = "AWSAssumeRole";
    /**
     * Authenticate using a Coda REST API token, sent as an HTTP header.
     *
     * @see {@link CodaApiBearerTokenAuthentication}
     */
    AuthenticationType["CodaApiHeaderBearerToken"] = "CodaApiHeaderBearerToken";
    /**
     * Only for use by Coda-authored packs.
     *
     * @see {@link VariousAuthentication}
     * @hidden
     */
    AuthenticationType["Various"] = "Various";
})(AuthenticationType || (exports.AuthenticationType = AuthenticationType = {}));
/**
 * Enumeration of post-account-setup step types. See {@link PostSetup}.
 */
var PostSetupType;
(function (PostSetupType) {
    /**
     * See {@link SetEndpoint}.
     */
    PostSetupType["SetEndpoint"] = "SetEndPoint";
})(PostSetupType || (exports.PostSetupType = PostSetupType = {}));
/**
 * Where to pass the client credentials (client ID and client secret) when making the OAuth2 token
 * exchange request. Used in {@link OAuth2Authentication.credentialsLocation}.
 */
var TokenExchangeCredentialsLocation;
(function (TokenExchangeCredentialsLocation) {
    /**
     * Allow Coda to determine this automatically. Currently that means Coda tries passing the
     * credentials in the body first, and if that fails then tries passing them in the Authorization
     * header.
     */
    TokenExchangeCredentialsLocation["Automatic"] = "Automatic";
    /**
     * The credentials are passed in the body of the request, encoded as
     * `application/x-www-form-urlencoded` along with the other parameters.
     */
    TokenExchangeCredentialsLocation["Body"] = "Body";
    /**
     * The credentials are passed in the Authorization header using the `Basic` scheme.
     */
    TokenExchangeCredentialsLocation["AuthorizationHeader"] = "AuthorizationHeader";
})(TokenExchangeCredentialsLocation || (exports.TokenExchangeCredentialsLocation = TokenExchangeCredentialsLocation = {}));
/**
 * @deprecated
 * @ignore
 */
var FeatureSet;
(function (FeatureSet) {
    FeatureSet["Basic"] = "Basic";
    FeatureSet["Pro"] = "Pro";
    FeatureSet["Team"] = "Team";
    FeatureSet["Enterprise"] = "Enterprise";
})(FeatureSet || (exports.FeatureSet = FeatureSet = {}));
/**
 * @ignore
 * @deprecated
 */
var QuotaLimitType;
(function (QuotaLimitType) {
    QuotaLimitType["Action"] = "Action";
    QuotaLimitType["Getter"] = "Getter";
    QuotaLimitType["Sync"] = "Sync";
    QuotaLimitType["Metadata"] = "Metadata";
})(QuotaLimitType || (exports.QuotaLimitType = QuotaLimitType = {}));
/**
 * @ignore
 * @deprecated
 */
var SyncInterval;
(function (SyncInterval) {
    SyncInterval["Manual"] = "Manual";
    SyncInterval["Daily"] = "Daily";
    SyncInterval["Hourly"] = "Hourly";
    SyncInterval["EveryTenMinutes"] = "EveryTenMinutes";
})(SyncInterval || (exports.SyncInterval = SyncInterval = {}));
