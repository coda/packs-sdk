"use strict";
/**
 * This file is auto-generated from OpenAPI definitions by `make build-openapi`. Do not edit manually.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicApiPackConnectionType = exports.PublicApiPackAssetType = exports.PublicApiPackAccessType = exports.PublicApiPackPrincipalType = exports.PublicApiPacksSortBy = exports.PublicApiDocAnalyticsScale = exports.PublicApiWorkspaceUserRole = exports.PublicApiTableType = exports.PublicApiSortBy = exports.PublicApiControlType = exports.PublicApiValueFormat = exports.PublicApiRowsSortBy = exports.PublicApiImageStatus = exports.PublicApiLinkedDataType = exports.PublicApiColumnFormatType = exports.PublicApiIconSet = exports.PublicApiDurationUnit = exports.PublicApiEmailDisplayType = exports.PublicApiCurrencyFormatType = exports.PublicApiSortDirection = exports.PublicApiLayout = exports.PublicApiDocPublishMode = exports.PublicApiAccessType = exports.PublicApiPrincipalType = exports.PublicApiType = exports.OpenApiSpecVersion = exports.OpenApiSpecHash = void 0;
/* eslint-disable */
exports.OpenApiSpecHash = 'c17f33bab1c1496bf73356d09380fa0a04e074f97741adc801db545ea8db0026';
exports.OpenApiSpecVersion = '1.2.0';
/**
 * A constant identifying the type of the resource.
 */
var PublicApiType;
(function (PublicApiType) {
    PublicApiType["Doc"] = "doc";
    PublicApiType["AclPermissions"] = "aclPermissions";
    PublicApiType["AclMetadata"] = "aclMetadata";
    PublicApiType["User"] = "user";
    PublicApiType["ApiLink"] = "apiLink";
    PublicApiType["Page"] = "page";
    PublicApiType["Table"] = "table";
    PublicApiType["Row"] = "row";
    PublicApiType["Column"] = "column";
    PublicApiType["Formula"] = "formula";
    PublicApiType["Control"] = "control";
    PublicApiType["DocAnalytics"] = "docAnalytics";
    PublicApiType["MutationStatus"] = "mutationStatus";
    PublicApiType["Workspace"] = "workspace";
    PublicApiType["Pack"] = "pack";
    PublicApiType["PackVersion"] = "packVersion";
    PublicApiType["PackAclPermissions"] = "packAclPermissions";
    PublicApiType["PackAsset"] = "packAsset";
    PublicApiType["PackRelease"] = "packRelease";
    PublicApiType["PackSourceCode"] = "packSourceCode";
})(PublicApiType = exports.PublicApiType || (exports.PublicApiType = {}));
/**
 * Type of principal.
 */
var PublicApiPrincipalType;
(function (PublicApiPrincipalType) {
    PublicApiPrincipalType["Email"] = "email";
    PublicApiPrincipalType["Domain"] = "domain";
    PublicApiPrincipalType["Anyone"] = "anyone";
})(PublicApiPrincipalType = exports.PublicApiPrincipalType || (exports.PublicApiPrincipalType = {}));
/**
 * Type of access.
 */
var PublicApiAccessType;
(function (PublicApiAccessType) {
    PublicApiAccessType["ReadOnly"] = "readonly";
    PublicApiAccessType["Write"] = "write";
    PublicApiAccessType["Comment"] = "comment";
    PublicApiAccessType["None"] = "none";
})(PublicApiAccessType = exports.PublicApiAccessType || (exports.PublicApiAccessType = {}));
/**
 * A time unit used as part of a duration value.
 */
var PublicApiDocPublishMode;
(function (PublicApiDocPublishMode) {
    PublicApiDocPublishMode["View"] = "view";
    PublicApiDocPublishMode["Play"] = "play";
    PublicApiDocPublishMode["Edit"] = "edit";
})(PublicApiDocPublishMode = exports.PublicApiDocPublishMode || (exports.PublicApiDocPublishMode = {}));
/**
 * Layout type of the table or view.
 */
var PublicApiLayout;
(function (PublicApiLayout) {
    PublicApiLayout["Default"] = "default";
    PublicApiLayout["AreaChart"] = "areaChart";
    PublicApiLayout["BarChart"] = "barChart";
    PublicApiLayout["BubbleChart"] = "bubbleChart";
    PublicApiLayout["Calendar"] = "calendar";
    PublicApiLayout["Card"] = "card";
    PublicApiLayout["GanttChart"] = "ganttChart";
    PublicApiLayout["LineChart"] = "lineChart";
    PublicApiLayout["MasterDetail"] = "masterDetail";
    PublicApiLayout["PieChart"] = "pieChart";
    PublicApiLayout["ScatterChart"] = "scatterChart";
    PublicApiLayout["Slide"] = "slide";
    PublicApiLayout["WordCloud"] = "wordCloud";
})(PublicApiLayout = exports.PublicApiLayout || (exports.PublicApiLayout = {}));
/**
 * Direction of a sort for a table or view.
 */
var PublicApiSortDirection;
(function (PublicApiSortDirection) {
    PublicApiSortDirection["Ascending"] = "ascending";
    PublicApiSortDirection["Descending"] = "descending";
})(PublicApiSortDirection = exports.PublicApiSortDirection || (exports.PublicApiSortDirection = {}));
/**
 * How the numeric value should be formatted (with or without symbol, negative numbers in parens).
 */
var PublicApiCurrencyFormatType;
(function (PublicApiCurrencyFormatType) {
    PublicApiCurrencyFormatType["Currency"] = "currency";
    PublicApiCurrencyFormatType["Accounting"] = "accounting";
    PublicApiCurrencyFormatType["Financial"] = "financial";
})(PublicApiCurrencyFormatType = exports.PublicApiCurrencyFormatType || (exports.PublicApiCurrencyFormatType = {}));
/**
 * How an email address should be displayed in the user interface.
 */
var PublicApiEmailDisplayType;
(function (PublicApiEmailDisplayType) {
    PublicApiEmailDisplayType["IconAndEmail"] = "iconAndEmail";
    PublicApiEmailDisplayType["IconOnly"] = "iconOnly";
    PublicApiEmailDisplayType["EmailOnly"] = "emailOnly";
})(PublicApiEmailDisplayType = exports.PublicApiEmailDisplayType || (exports.PublicApiEmailDisplayType = {}));
/**
 * A time unit used as part of a duration value.
 */
var PublicApiDurationUnit;
(function (PublicApiDurationUnit) {
    PublicApiDurationUnit["Days"] = "days";
    PublicApiDurationUnit["Hours"] = "hours";
    PublicApiDurationUnit["Minutes"] = "minutes";
    PublicApiDurationUnit["Seconds"] = "seconds";
})(PublicApiDurationUnit = exports.PublicApiDurationUnit || (exports.PublicApiDurationUnit = {}));
/**
 * List of available icon sets.
 */
var PublicApiIconSet;
(function (PublicApiIconSet) {
    PublicApiIconSet["Star"] = "star";
    PublicApiIconSet["Circle"] = "circle";
    PublicApiIconSet["Fire"] = "fire";
    PublicApiIconSet["Bug"] = "bug";
    PublicApiIconSet["Diamond"] = "diamond";
    PublicApiIconSet["Bell"] = "bell";
    PublicApiIconSet["ThumbsUp"] = "thumbsup";
    PublicApiIconSet["Heart"] = "heart";
    PublicApiIconSet["Chili"] = "chili";
    PublicApiIconSet["Smiley"] = "smiley";
    PublicApiIconSet["Lightning"] = "lightning";
    PublicApiIconSet["Currency"] = "currency";
    PublicApiIconSet["Coffee"] = "coffee";
    PublicApiIconSet["Person"] = "person";
    PublicApiIconSet["Battery"] = "battery";
    PublicApiIconSet["Cocktail"] = "cocktail";
    PublicApiIconSet["Cloud"] = "cloud";
    PublicApiIconSet["Sun"] = "sun";
    PublicApiIconSet["Checkmark"] = "checkmark";
    PublicApiIconSet["LightBulb"] = "lightbulb";
})(PublicApiIconSet = exports.PublicApiIconSet || (exports.PublicApiIconSet = {}));
/**
 * Format type of the column
 */
var PublicApiColumnFormatType;
(function (PublicApiColumnFormatType) {
    PublicApiColumnFormatType["Text"] = "text";
    PublicApiColumnFormatType["Person"] = "person";
    PublicApiColumnFormatType["Lookup"] = "lookup";
    PublicApiColumnFormatType["Number"] = "number";
    PublicApiColumnFormatType["Percent"] = "percent";
    PublicApiColumnFormatType["Currency"] = "currency";
    PublicApiColumnFormatType["Date"] = "date";
    PublicApiColumnFormatType["DateTime"] = "dateTime";
    PublicApiColumnFormatType["Time"] = "time";
    PublicApiColumnFormatType["Duration"] = "duration";
    PublicApiColumnFormatType["Email"] = "email";
    PublicApiColumnFormatType["Slider"] = "slider";
    PublicApiColumnFormatType["Scale"] = "scale";
    PublicApiColumnFormatType["Image"] = "image";
    PublicApiColumnFormatType["Attachments"] = "attachments";
    PublicApiColumnFormatType["Button"] = "button";
    PublicApiColumnFormatType["Checkbox"] = "checkbox";
    PublicApiColumnFormatType["Select"] = "select";
    PublicApiColumnFormatType["PackObject"] = "packObject";
    PublicApiColumnFormatType["Reaction"] = "reaction";
    PublicApiColumnFormatType["Other"] = "other";
})(PublicApiColumnFormatType = exports.PublicApiColumnFormatType || (exports.PublicApiColumnFormatType = {}));
/**
 * A schema.org identifier for the object.
 */
var PublicApiLinkedDataType;
(function (PublicApiLinkedDataType) {
    PublicApiLinkedDataType["ImageObject"] = "ImageObject";
    PublicApiLinkedDataType["MonetaryAmount"] = "MonetaryAmount";
    PublicApiLinkedDataType["Person"] = "Person";
    PublicApiLinkedDataType["WebPage"] = "WebPage";
    PublicApiLinkedDataType["StructuredValue"] = "StructuredValue";
})(PublicApiLinkedDataType = exports.PublicApiLinkedDataType || (exports.PublicApiLinkedDataType = {}));
/**
 * The status values that an image object can have.
 */
var PublicApiImageStatus;
(function (PublicApiImageStatus) {
    PublicApiImageStatus["Live"] = "live";
    PublicApiImageStatus["Deleted"] = "deleted";
    PublicApiImageStatus["Failed"] = "failed";
})(PublicApiImageStatus = exports.PublicApiImageStatus || (exports.PublicApiImageStatus = {}));
/**
 * Determines how the rows returned are sorted
 */
var PublicApiRowsSortBy;
(function (PublicApiRowsSortBy) {
    PublicApiRowsSortBy["CreatedAt"] = "createdAt";
    PublicApiRowsSortBy["Natural"] = "natural";
    PublicApiRowsSortBy["UpdatedAt"] = "updatedAt";
})(PublicApiRowsSortBy = exports.PublicApiRowsSortBy || (exports.PublicApiRowsSortBy = {}));
/**
 * The format that cell values are returned as.
 */
var PublicApiValueFormat;
(function (PublicApiValueFormat) {
    PublicApiValueFormat["Simple"] = "simple";
    PublicApiValueFormat["SimpleWithArrays"] = "simpleWithArrays";
    PublicApiValueFormat["Rich"] = "rich";
})(PublicApiValueFormat = exports.PublicApiValueFormat || (exports.PublicApiValueFormat = {}));
/**
 * Type of the control.
 */
var PublicApiControlType;
(function (PublicApiControlType) {
    PublicApiControlType["Button"] = "button";
    PublicApiControlType["Checkbox"] = "checkbox";
    PublicApiControlType["DatePicker"] = "datePicker";
    PublicApiControlType["DateRangePicker"] = "dateRangePicker";
    PublicApiControlType["Lookup"] = "lookup";
    PublicApiControlType["Multiselect"] = "multiselect";
    PublicApiControlType["Select"] = "select";
    PublicApiControlType["Scale"] = "scale";
    PublicApiControlType["Slider"] = "slider";
    PublicApiControlType["Reaction"] = "reaction";
})(PublicApiControlType = exports.PublicApiControlType || (exports.PublicApiControlType = {}));
/**
 * Determines how the objects returned are sorted
 */
var PublicApiSortBy;
(function (PublicApiSortBy) {
    PublicApiSortBy["Name"] = "name";
})(PublicApiSortBy = exports.PublicApiSortBy || (exports.PublicApiSortBy = {}));
var PublicApiTableType;
(function (PublicApiTableType) {
    PublicApiTableType["Table"] = "table";
    PublicApiTableType["View"] = "view";
})(PublicApiTableType = exports.PublicApiTableType || (exports.PublicApiTableType = {}));
var PublicApiWorkspaceUserRole;
(function (PublicApiWorkspaceUserRole) {
    PublicApiWorkspaceUserRole["Admin"] = "Admin";
    PublicApiWorkspaceUserRole["DocMaker"] = "DocMaker";
    PublicApiWorkspaceUserRole["Editor"] = "Editor";
})(PublicApiWorkspaceUserRole = exports.PublicApiWorkspaceUserRole || (exports.PublicApiWorkspaceUserRole = {}));
/**
 * Quantization period over which to view analytics.
 */
var PublicApiDocAnalyticsScale;
(function (PublicApiDocAnalyticsScale) {
    PublicApiDocAnalyticsScale["Day"] = "daily";
    PublicApiDocAnalyticsScale["Cumulative"] = "cumulative";
})(PublicApiDocAnalyticsScale = exports.PublicApiDocAnalyticsScale || (exports.PublicApiDocAnalyticsScale = {}));
/**
 * Determines how the Packs returned are sorted.
 */
var PublicApiPacksSortBy;
(function (PublicApiPacksSortBy) {
    PublicApiPacksSortBy["Title"] = "title";
    PublicApiPacksSortBy["CreatedAt"] = "createdAt";
    PublicApiPacksSortBy["UpdatedAt"] = "updatedAt";
})(PublicApiPacksSortBy = exports.PublicApiPacksSortBy || (exports.PublicApiPacksSortBy = {}));
/**
 * Type of Pack permissions.
 */
var PublicApiPackPrincipalType;
(function (PublicApiPackPrincipalType) {
    PublicApiPackPrincipalType["User"] = "user";
    PublicApiPackPrincipalType["Workspace"] = "workspace";
    PublicApiPackPrincipalType["Worldwide"] = "worldwide";
})(PublicApiPackPrincipalType = exports.PublicApiPackPrincipalType || (exports.PublicApiPackPrincipalType = {}));
/**
 * Access type for a Pack.
 */
var PublicApiPackAccessType;
(function (PublicApiPackAccessType) {
    PublicApiPackAccessType["View"] = "view";
    PublicApiPackAccessType["Test"] = "test";
    PublicApiPackAccessType["Edit"] = "edit";
})(PublicApiPackAccessType = exports.PublicApiPackAccessType || (exports.PublicApiPackAccessType = {}));
var PublicApiPackAssetType;
(function (PublicApiPackAssetType) {
    PublicApiPackAssetType["Logo"] = "logo";
    PublicApiPackAssetType["ExampleImage"] = "exampleImage";
})(PublicApiPackAssetType = exports.PublicApiPackAssetType || (exports.PublicApiPackAssetType = {}));
/**
 * Type of Pack connections.
 */
var PublicApiPackConnectionType;
(function (PublicApiPackConnectionType) {
    PublicApiPackConnectionType["Header"] = "header";
    PublicApiPackConnectionType["UrlParam"] = "urlParam";
    PublicApiPackConnectionType["HttpBasic"] = "httpBasic";
})(PublicApiPackConnectionType = exports.PublicApiPackConnectionType || (exports.PublicApiPackConnectionType = {}));
