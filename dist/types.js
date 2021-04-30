"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncInterval = exports.QuotaLimitType = exports.FeatureSet = exports.PostSetupType = exports.DefaultConnectionType = exports.AuthenticationType = exports.PackCategory = void 0;
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
var AuthenticationType;
(function (AuthenticationType) {
    AuthenticationType["None"] = "None";
    AuthenticationType["HeaderBearerToken"] = "HeaderBearerToken";
    AuthenticationType["CustomHeaderToken"] = "CustomHeaderToken";
    AuthenticationType["QueryParamToken"] = "QueryParamToken";
    AuthenticationType["MultiQueryParamToken"] = "MultiQueryParamToken";
    AuthenticationType["OAuth2"] = "OAuth2";
    AuthenticationType["WebBasic"] = "WebBasic";
    AuthenticationType["AWSSignature4"] = "AWSSignature4";
    AuthenticationType["CodaApiHeaderBearerToken"] = "CodaApiHeaderBearerToken";
    AuthenticationType["Various"] = "Various";
})(AuthenticationType = exports.AuthenticationType || (exports.AuthenticationType = {}));
var DefaultConnectionType;
(function (DefaultConnectionType) {
    DefaultConnectionType[DefaultConnectionType["SharedDataOnly"] = 1] = "SharedDataOnly";
    DefaultConnectionType[DefaultConnectionType["Shared"] = 2] = "Shared";
    DefaultConnectionType[DefaultConnectionType["ProxyActionsOnly"] = 3] = "ProxyActionsOnly";
})(DefaultConnectionType = exports.DefaultConnectionType || (exports.DefaultConnectionType = {}));
var PostSetupType;
(function (PostSetupType) {
    PostSetupType["SetEndpoint"] = "SetEndPoint";
})(PostSetupType = exports.PostSetupType || (exports.PostSetupType = {}));
var FeatureSet;
(function (FeatureSet) {
    FeatureSet["Basic"] = "Basic";
    FeatureSet["Pro"] = "Pro";
    FeatureSet["Team"] = "Team";
    FeatureSet["Enterprise"] = "Enterprise";
})(FeatureSet = exports.FeatureSet || (exports.FeatureSet = {}));
var QuotaLimitType;
(function (QuotaLimitType) {
    QuotaLimitType["Action"] = "Action";
    QuotaLimitType["Getter"] = "Getter";
    QuotaLimitType["Sync"] = "Sync";
    QuotaLimitType["Metadata"] = "Metadata";
})(QuotaLimitType = exports.QuotaLimitType || (exports.QuotaLimitType = {}));
var SyncInterval;
(function (SyncInterval) {
    SyncInterval["Manual"] = "Manual";
    SyncInterval["Daily"] = "Daily";
    SyncInterval["Hourly"] = "Hourly";
    SyncInterval["EveryTenMinutes"] = "EveryTenMinutes";
})(SyncInterval = exports.SyncInterval || (exports.SyncInterval = {}));
