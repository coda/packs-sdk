"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    PackCategory["Mathematics"] = "Mathematics";
    PackCategory["Organization"] = "Organization";
    PackCategory["Recruiting"] = "Recruiting";
    PackCategory["Shopping"] = "Shopping";
    PackCategory["Weather"] = "Weather";
})(PackCategory = exports.PackCategory || (exports.PackCategory = {}));
var PackId;
(function (PackId) {
    PackId[PackId["Slack"] = 1000] = "Slack";
    PackId[PackId["Airtable"] = 1001] = "Airtable";
    PackId[PackId["Intercom"] = 1002] = "Intercom";
    PackId[PackId["GoogleCalendar"] = 1003] = "GoogleCalendar";
    PackId[PackId["Gmail"] = 1004] = "Gmail";
    PackId[PackId["Notion"] = 1005] = "Notion";
    PackId[PackId["CodaTrigonometry"] = 1006] = "CodaTrigonometry";
    PackId[PackId["Twitter"] = 1007] = "Twitter";
    PackId[PackId["Giphy"] = 1008] = "Giphy";
    PackId[PackId["CodaDebug"] = 1009] = "CodaDebug";
    PackId[PackId["Figma"] = 1010] = "Figma";
    PackId[PackId["GoogleContacts"] = 1011] = "GoogleContacts";
    PackId[PackId["GoogleNaturalLanguage"] = 1014] = "GoogleNaturalLanguage";
    PackId[PackId["GoogleTasks"] = 1012] = "GoogleTasks";
    PackId[PackId["GitHub"] = 1013] = "GitHub";
    PackId[PackId["Weather"] = 1015] = "Weather";
    PackId[PackId["Twilio"] = 1016] = "Twilio";
    PackId[PackId["Zoom"] = 1017] = "Zoom";
    PackId[PackId["Spotify"] = 1018] = "Spotify";
    PackId[PackId["FullContact"] = 1019] = "FullContact";
    PackId[PackId["GoogleDirections"] = 1020] = "GoogleDirections";
    PackId[PackId["CodaDoc"] = 1021] = "CodaDoc";
    PackId[PackId["Greenhouse"] = 1022] = "Greenhouse";
    PackId[PackId["Lob"] = 1023] = "Lob";
    PackId[PackId["Stocks"] = 1024] = "Stocks";
    PackId[PackId["Discourse"] = 1025] = "Discourse";
    PackId[PackId["WalmartShopping"] = 1026] = "WalmartShopping";
    PackId[PackId["GooglePlaces"] = 1027] = "GooglePlaces";
})(PackId = exports.PackId || (exports.PackId = {}));
// This is for packs that have been deployed out of band of the master branch,
// so that they don't get marked as deleted when running `make validate-version-changes`.
// Don't reuse any of these ids in actual packs.
exports.HackathonPackIds = new Set([
    1028,
]);
var ProviderId;
(function (ProviderId) {
    ProviderId[ProviderId["Airtable"] = 2001] = "Airtable";
    ProviderId[ProviderId["Coda"] = 2002] = "Coda";
    ProviderId[ProviderId["Figma"] = 2003] = "Figma";
    ProviderId[ProviderId["Giphy"] = 2004] = "Giphy";
    ProviderId[ProviderId["Google"] = 2005] = "Google";
    ProviderId[ProviderId["Intercom"] = 2006] = "Intercom";
    ProviderId[ProviderId["Notion"] = 2007] = "Notion";
    ProviderId[ProviderId["Slack"] = 2008] = "Slack";
    ProviderId[ProviderId["Twitter"] = 2009] = "Twitter";
    ProviderId[ProviderId["GitHub"] = 2010] = "GitHub";
    ProviderId[ProviderId["Weather"] = 2011] = "Weather";
    ProviderId[ProviderId["Twilio"] = 2012] = "Twilio";
    ProviderId[ProviderId["Zoom"] = 2013] = "Zoom";
    ProviderId[ProviderId["Spotify"] = 2014] = "Spotify";
    ProviderId[ProviderId["FullContact"] = 2015] = "FullContact";
    ProviderId[ProviderId["Greenhouse"] = 2016] = "Greenhouse";
    ProviderId[ProviderId["Lob"] = 2017] = "Lob";
    ProviderId[ProviderId["Stocks"] = 2018] = "Stocks";
    ProviderId[ProviderId["Discourse"] = 2019] = "Discourse";
    ProviderId[ProviderId["Walmart"] = 2020] = "Walmart";
})(ProviderId = exports.ProviderId || (exports.ProviderId = {}));
var AuthenticationType;
(function (AuthenticationType) {
    AuthenticationType["None"] = "None";
    AuthenticationType["HeaderBearerToken"] = "HeaderBearerToken";
    AuthenticationType["CustomHeaderToken"] = "CustomHeaderToken";
    AuthenticationType["QueryParamToken"] = "QueryParamToken";
    AuthenticationType["MultiQueryParamToken"] = "MultiQueryParamToken";
    AuthenticationType["OAuth2"] = "OAuth2";
    AuthenticationType["WebBasic"] = "WebBasic";
})(AuthenticationType = exports.AuthenticationType || (exports.AuthenticationType = {}));
var DefaultConnectionType;
(function (DefaultConnectionType) {
    DefaultConnectionType[DefaultConnectionType["SharedDataOnly"] = 1] = "SharedDataOnly";
    DefaultConnectionType[DefaultConnectionType["Shared"] = 2] = "Shared";
    DefaultConnectionType[DefaultConnectionType["ProxyActionsOnly"] = 3] = "ProxyActionsOnly";
})(DefaultConnectionType = exports.DefaultConnectionType || (exports.DefaultConnectionType = {}));
