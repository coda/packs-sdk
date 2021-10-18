"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncInterval = exports.QuotaLimitType = exports.FeatureSet = exports.PostSetupType = exports.DefaultConnectionType = exports.AuthenticationType = exports.PackCategory = void 0;
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
})(PackCategory = exports.PackCategory || (exports.PackCategory = {}));
/**
 * Authentication types supported by Coda Packs.
 */
var AuthenticationType;
(function (AuthenticationType) {
    /**
     * Indicates this pack does not use authentication. You may also omit an authentication declaration entirely.
     */
    AuthenticationType["None"] = "None";
    /**
     * Authenticate using an HTTP header of the form `Authorization: Bearer <token>`.
     */
    AuthenticationType["HeaderBearerToken"] = "HeaderBearerToken";
    /**
     * Authenticate using an HTTP header with a custom name and token prefix that you specify.
     * The header name is defined in the {@link headerName} property.
     */
    AuthenticationType["CustomHeaderToken"] = "CustomHeaderToken";
    /**
     * Authenticate using a token that is passed as a URL parameter with each request, e.g.
     * https://example.com/api?paramName=token
     *
     * The parameter name is defined in the {@link paramName} property.
     */
    AuthenticationType["QueryParamToken"] = "QueryParamToken";
    /**
     * Authenticate using multiple tokens, each passed as a different URL parameter, e.g.
     * https://example.com/api?param1=token1&param2=token2
     *
     * The parameter names are defined in the {@link params} array property.
     */
    AuthenticationType["MultiQueryParamToken"] = "MultiQueryParamToken";
    /**
     * Authenticate using OAuth2. You must specify the authorization URL, token exchange URL, and
     * scopes here as part of the pack definition. You'll provide the application's client ID and
     * client secret in the pack management UI, so that these can be stored securely.
     *
     * The API must use a (largely) standards-compliant implementation of OAuth2.
     */
    AuthenticationType["OAuth2"] = "OAuth2";
    /**
     * Authenticate using HTTP Basic authorization. The user provides a username and password
     * (sometimes optional) which are included as an HTTP header according to the Basic auth standard.
     *
     * See https://en.wikipedia.org/wiki/Basic_access_authentication
     */
    AuthenticationType["WebBasic"] = "WebBasic";
    /**
     * Authenticate with Amazon Web Services using AWS Signature Version 4.
     * See https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html
     *
     * This is not yet supported.
     *
     * @ignore
     */
    AuthenticationType["AWSSignature4"] = "AWSSignature4";
    /**
     * Authenticate using a Coda REST API token, sent as an HTTP header.
     *
     * This is identical to {@link HeaderBearerToken} except the user wil be presented
     * with a UI to generate an API token rather than needing to paste an arbitrary API
     * token into a text input.
     *
     * This is primarily for use by Coda-authored packs, as it is only relevant for interacting with the
     * Coda REST API.
     */
    AuthenticationType["CodaApiHeaderBearerToken"] = "CodaApiHeaderBearerToken";
    /**
     * Only for use by Coda-authored packs.
     *
     * @ignore
     */
    AuthenticationType["Various"] = "Various";
})(AuthenticationType = exports.AuthenticationType || (exports.AuthenticationType = {}));
/**
 * Ways in which a user account can be used with a doc.
 */
var DefaultConnectionType;
(function (DefaultConnectionType) {
    /**
     * The account can be used by any user in the a doc, but only to read data. The account can't be
     * used to take actions (i.e. push buttons).
     */
    DefaultConnectionType[DefaultConnectionType["SharedDataOnly"] = 1] = "SharedDataOnly";
    /**
     * The account can be used by any user in the doc both to retrieve data and to take actions.
     */
    DefaultConnectionType[DefaultConnectionType["Shared"] = 2] = "Shared";
    /**
     * The account can only be used by the Coda user who set up the account, and only to take
     * actions (i.e. push buttons). Each Coda user that uses the pack will be prompted to
     * connect their own private (AKA proxy) account. Private accounts can't be used to retrieve
     * data, because all users in the doc must be able to retrieve the same data.
     */
    DefaultConnectionType[DefaultConnectionType["ProxyActionsOnly"] = 3] = "ProxyActionsOnly";
})(DefaultConnectionType = exports.DefaultConnectionType || (exports.DefaultConnectionType = {}));
/**
 * Enumeration of post-account-setup step types. See {@link PostSetup}.
 */
var PostSetupType;
(function (PostSetupType) {
    /**
     * See {@link SetEndpoint}.
     */
    PostSetupType["SetEndpoint"] = "SetEndPoint";
})(PostSetupType = exports.PostSetupType || (exports.PostSetupType = {}));
/**
 * @ignore
 */
var FeatureSet;
(function (FeatureSet) {
    FeatureSet["Basic"] = "Basic";
    FeatureSet["Pro"] = "Pro";
    FeatureSet["Team"] = "Team";
    FeatureSet["Enterprise"] = "Enterprise";
})(FeatureSet = exports.FeatureSet || (exports.FeatureSet = {}));
/**
 * @ignore
 */
var QuotaLimitType;
(function (QuotaLimitType) {
    QuotaLimitType["Action"] = "Action";
    QuotaLimitType["Getter"] = "Getter";
    QuotaLimitType["Sync"] = "Sync";
    QuotaLimitType["Metadata"] = "Metadata";
})(QuotaLimitType = exports.QuotaLimitType || (exports.QuotaLimitType = {}));
/**
 * @ignore
 */
var SyncInterval;
(function (SyncInterval) {
    SyncInterval["Manual"] = "Manual";
    SyncInterval["Daily"] = "Daily";
    SyncInterval["Hourly"] = "Hourly";
    SyncInterval["EveryTenMinutes"] = "EveryTenMinutes";
})(SyncInterval = exports.SyncInterval || (exports.SyncInterval = {}));
