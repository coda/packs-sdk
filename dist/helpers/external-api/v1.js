"use strict";
/**
 * This file is auto-generated from OpenAPI definitions by `make build-openapi`. Do not edit manually.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicApiPackFormulaType = exports.PublicApiFeaturedDocStatus = exports.PublicApiFeatureSet = exports.PublicApiLogLevel = exports.PublicApiPackLogType = exports.PublicApiPackLogRequestType = exports.PublicApiPackConnectionType = exports.PublicApiPackDiscoverability = exports.PublicApiPackSource = exports.PublicApiPackAssetType = exports.PublicApiPackAccessType = exports.PublicApiPackPrincipalType = exports.PublicApiPackListingsSortBy = exports.PublicApiPacksSortBy = exports.PublicApiAnalyticsScale = exports.PublicApiPackAnalyticsOrderBy = exports.PublicApiWorkspaceUserRole = exports.PublicApiTableType = exports.PublicApiSortBy = exports.PublicApiControlType = exports.PublicApiValueFormat = exports.PublicApiRowsSortBy = exports.PublicApiImageStatus = exports.PublicApiLinkedDataType = exports.PublicApiColumnFormatType = exports.PublicApiIconSet = exports.PublicApiDurationUnit = exports.PublicApiLinkDisplayType = exports.PublicApiEmailDisplayType = exports.PublicApiCurrencyFormatType = exports.PublicApiSortDirection = exports.PublicApiLayout = exports.PublicApiDocPublishMode = exports.PublicApiAccessType = exports.PublicApiPrincipalType = exports.PublicApiType = exports.OpenApiSpecVersion = exports.OpenApiSpecHash = void 0;
/* eslint-disable */
exports.OpenApiSpecHash = '3cb65a92b168c432b6eb8cad28cd0cc16911c3536d86f2d256c7ddb6007de8ad';
exports.OpenApiSpecVersion = '1.2.5';
/**
 * A constant identifying the type of the resource.
 */
var PublicApiType;
(function (PublicApiType) {
    PublicApiType["AclMetadata"] = "aclMetadata";
    PublicApiType["AclPermissions"] = "aclPermissions";
    PublicApiType["ApiLink"] = "apiLink";
    PublicApiType["Automation"] = "automation";
    PublicApiType["Column"] = "column";
    PublicApiType["Control"] = "control";
    PublicApiType["Doc"] = "doc";
    PublicApiType["DocAnalytics"] = "docAnalytics";
    PublicApiType["DocAnalyticsSummary"] = "docAnalyticsSummary";
    PublicApiType["DocAnalyticsV2"] = "docAnalyticsV2";
    PublicApiType["Folder"] = "folder";
    PublicApiType["Formula"] = "formula";
    PublicApiType["MutationStatus"] = "mutationStatus";
    PublicApiType["Pack"] = "pack";
    PublicApiType["PackAclPermissions"] = "packAclPermissions";
    PublicApiType["PackAnalytics"] = "packAnalytics";
    PublicApiType["PackAnalyticsSummary"] = "packAnalyticsSummary";
    PublicApiType["PackAsset"] = "packAsset";
    PublicApiType["PackCategory"] = "packCategory";
    PublicApiType["PackFormulaAnalytics"] = "packFormulaAnalytics";
    PublicApiType["PackLog"] = "packLog";
    PublicApiType["PackMaker"] = "packMaker";
    PublicApiType["PackOauthConfig"] = "packOauthConfig";
    PublicApiType["PackRelease"] = "packRelease";
    PublicApiType["PackSourceCode"] = "packSourceCode";
    PublicApiType["PackSystemConnection"] = "packSystemConnection";
    PublicApiType["PackVersion"] = "packVersion";
    PublicApiType["Page"] = "page";
    PublicApiType["Row"] = "row";
    PublicApiType["Table"] = "table";
    PublicApiType["User"] = "user";
    PublicApiType["Workspace"] = "workspace";
})(PublicApiType || (exports.PublicApiType = PublicApiType = {}));
/**
 * Type of principal.
 */
var PublicApiPrincipalType;
(function (PublicApiPrincipalType) {
    PublicApiPrincipalType["Email"] = "email";
    PublicApiPrincipalType["Domain"] = "domain";
    PublicApiPrincipalType["Anyone"] = "anyone";
})(PublicApiPrincipalType || (exports.PublicApiPrincipalType = PublicApiPrincipalType = {}));
/**
 * Type of access.
 */
var PublicApiAccessType;
(function (PublicApiAccessType) {
    PublicApiAccessType["ReadOnly"] = "readonly";
    PublicApiAccessType["Write"] = "write";
    PublicApiAccessType["Comment"] = "comment";
    PublicApiAccessType["None"] = "none";
})(PublicApiAccessType || (exports.PublicApiAccessType = PublicApiAccessType = {}));
/**
 * A time unit used as part of a duration value.
 */
var PublicApiDocPublishMode;
(function (PublicApiDocPublishMode) {
    PublicApiDocPublishMode["View"] = "view";
    PublicApiDocPublishMode["Play"] = "play";
    PublicApiDocPublishMode["Edit"] = "edit";
})(PublicApiDocPublishMode || (exports.PublicApiDocPublishMode = PublicApiDocPublishMode = {}));
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
    PublicApiLayout["Detail"] = "detail";
    PublicApiLayout["Form"] = "form";
    PublicApiLayout["GanttChart"] = "ganttChart";
    PublicApiLayout["LineChart"] = "lineChart";
    PublicApiLayout["MasterDetail"] = "masterDetail";
    PublicApiLayout["PieChart"] = "pieChart";
    PublicApiLayout["ScatterChart"] = "scatterChart";
    PublicApiLayout["Slide"] = "slide";
    PublicApiLayout["WordCloud"] = "wordCloud";
})(PublicApiLayout || (exports.PublicApiLayout = PublicApiLayout = {}));
/**
 * Direction of a sort for a table or view.
 */
var PublicApiSortDirection;
(function (PublicApiSortDirection) {
    PublicApiSortDirection["Ascending"] = "ascending";
    PublicApiSortDirection["Descending"] = "descending";
})(PublicApiSortDirection || (exports.PublicApiSortDirection = PublicApiSortDirection = {}));
/**
 * How the numeric value should be formatted (with or without symbol, negative numbers in parens).
 */
var PublicApiCurrencyFormatType;
(function (PublicApiCurrencyFormatType) {
    PublicApiCurrencyFormatType["Currency"] = "currency";
    PublicApiCurrencyFormatType["Accounting"] = "accounting";
    PublicApiCurrencyFormatType["Financial"] = "financial";
})(PublicApiCurrencyFormatType || (exports.PublicApiCurrencyFormatType = PublicApiCurrencyFormatType = {}));
/**
 * How an email address should be displayed in the user interface.
 */
var PublicApiEmailDisplayType;
(function (PublicApiEmailDisplayType) {
    PublicApiEmailDisplayType["IconAndEmail"] = "iconAndEmail";
    PublicApiEmailDisplayType["IconOnly"] = "iconOnly";
    PublicApiEmailDisplayType["EmailOnly"] = "emailOnly";
})(PublicApiEmailDisplayType || (exports.PublicApiEmailDisplayType = PublicApiEmailDisplayType = {}));
/**
 * How a link should be displayed in the user interface.
 */
var PublicApiLinkDisplayType;
(function (PublicApiLinkDisplayType) {
    PublicApiLinkDisplayType["IconOnly"] = "iconOnly";
    PublicApiLinkDisplayType["Url"] = "url";
    PublicApiLinkDisplayType["Title"] = "title";
    PublicApiLinkDisplayType["Card"] = "card";
    PublicApiLinkDisplayType["Embed"] = "embed";
})(PublicApiLinkDisplayType || (exports.PublicApiLinkDisplayType = PublicApiLinkDisplayType = {}));
/**
 * A time unit used as part of a duration value.
 */
var PublicApiDurationUnit;
(function (PublicApiDurationUnit) {
    PublicApiDurationUnit["Days"] = "days";
    PublicApiDurationUnit["Hours"] = "hours";
    PublicApiDurationUnit["Minutes"] = "minutes";
    PublicApiDurationUnit["Seconds"] = "seconds";
})(PublicApiDurationUnit || (exports.PublicApiDurationUnit = PublicApiDurationUnit = {}));
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
})(PublicApiIconSet || (exports.PublicApiIconSet = PublicApiIconSet = {}));
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
    PublicApiColumnFormatType["Link"] = "link";
    PublicApiColumnFormatType["Slider"] = "slider";
    PublicApiColumnFormatType["Scale"] = "scale";
    PublicApiColumnFormatType["Image"] = "image";
    PublicApiColumnFormatType["Attachments"] = "attachments";
    PublicApiColumnFormatType["Button"] = "button";
    PublicApiColumnFormatType["Checkbox"] = "checkbox";
    PublicApiColumnFormatType["Select"] = "select";
    PublicApiColumnFormatType["PackObject"] = "packObject";
    PublicApiColumnFormatType["Reaction"] = "reaction";
    PublicApiColumnFormatType["Canvas"] = "canvas";
    PublicApiColumnFormatType["Other"] = "other";
})(PublicApiColumnFormatType || (exports.PublicApiColumnFormatType = PublicApiColumnFormatType = {}));
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
})(PublicApiLinkedDataType || (exports.PublicApiLinkedDataType = PublicApiLinkedDataType = {}));
/**
 * The status values that an image object can have.
 */
var PublicApiImageStatus;
(function (PublicApiImageStatus) {
    PublicApiImageStatus["Live"] = "live";
    PublicApiImageStatus["Deleted"] = "deleted";
    PublicApiImageStatus["Failed"] = "failed";
})(PublicApiImageStatus || (exports.PublicApiImageStatus = PublicApiImageStatus = {}));
/**
 * Determines how the rows returned are sorted
 */
var PublicApiRowsSortBy;
(function (PublicApiRowsSortBy) {
    PublicApiRowsSortBy["CreatedAt"] = "createdAt";
    PublicApiRowsSortBy["Natural"] = "natural";
    PublicApiRowsSortBy["UpdatedAt"] = "updatedAt";
})(PublicApiRowsSortBy || (exports.PublicApiRowsSortBy = PublicApiRowsSortBy = {}));
/**
 * The format that cell values are returned as.
 */
var PublicApiValueFormat;
(function (PublicApiValueFormat) {
    PublicApiValueFormat["Simple"] = "simple";
    PublicApiValueFormat["SimpleWithArrays"] = "simpleWithArrays";
    PublicApiValueFormat["Rich"] = "rich";
})(PublicApiValueFormat || (exports.PublicApiValueFormat = PublicApiValueFormat = {}));
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
})(PublicApiControlType || (exports.PublicApiControlType = PublicApiControlType = {}));
/**
 * Determines how the objects returned are sorted
 */
var PublicApiSortBy;
(function (PublicApiSortBy) {
    PublicApiSortBy["Name"] = "name";
})(PublicApiSortBy || (exports.PublicApiSortBy = PublicApiSortBy = {}));
var PublicApiTableType;
(function (PublicApiTableType) {
    PublicApiTableType["Table"] = "table";
    PublicApiTableType["View"] = "view";
})(PublicApiTableType || (exports.PublicApiTableType = PublicApiTableType = {}));
var PublicApiWorkspaceUserRole;
(function (PublicApiWorkspaceUserRole) {
    PublicApiWorkspaceUserRole["Admin"] = "Admin";
    PublicApiWorkspaceUserRole["DocMaker"] = "DocMaker";
    PublicApiWorkspaceUserRole["Editor"] = "Editor";
})(PublicApiWorkspaceUserRole || (exports.PublicApiWorkspaceUserRole = PublicApiWorkspaceUserRole = {}));
/**
 * Determines how the Pack analytics returned are sorted.
 */
var PublicApiPackAnalyticsOrderBy;
(function (PublicApiPackAnalyticsOrderBy) {
    PublicApiPackAnalyticsOrderBy["AnalyticsDate"] = "date";
    PublicApiPackAnalyticsOrderBy["PackId"] = "packId";
    PublicApiPackAnalyticsOrderBy["Name"] = "name";
    PublicApiPackAnalyticsOrderBy["CreatedAt"] = "createdAt";
    PublicApiPackAnalyticsOrderBy["DocInstalls"] = "docInstalls";
    PublicApiPackAnalyticsOrderBy["WorkspaceInstalls"] = "workspaceInstalls";
    PublicApiPackAnalyticsOrderBy["NumFormulaInvocations"] = "numFormulaInvocations";
    PublicApiPackAnalyticsOrderBy["NumActionInvocations"] = "numActionInvocations";
    PublicApiPackAnalyticsOrderBy["NumSyncInvocations"] = "numSyncInvocations";
    PublicApiPackAnalyticsOrderBy["NumMetadataInvocations"] = "numMetadataInvocations";
    PublicApiPackAnalyticsOrderBy["DocsActivelyUsing"] = "docsActivelyUsing";
    PublicApiPackAnalyticsOrderBy["DocsActivelyUsing7Day"] = "docsActivelyUsing7Day";
    PublicApiPackAnalyticsOrderBy["DocsActivelyUsing30Day"] = "docsActivelyUsing30Day";
    PublicApiPackAnalyticsOrderBy["DocsActivelyUsing90Day"] = "docsActivelyUsing90Day";
    PublicApiPackAnalyticsOrderBy["DocsActivelyUsingAllTime"] = "docsActivelyUsingAllTime";
    PublicApiPackAnalyticsOrderBy["WorkspacesActivelyUsing"] = "workspacesActivelyUsing";
    PublicApiPackAnalyticsOrderBy["WorkspacesActivelyUsing7Day"] = "workspacesActivelyUsing7Day";
    PublicApiPackAnalyticsOrderBy["WorkspacesActivelyUsing30Day"] = "workspacesActivelyUsing30Day";
    PublicApiPackAnalyticsOrderBy["WorkspacesActivelyUsing90Day"] = "workspacesActivelyUsing90Day";
    PublicApiPackAnalyticsOrderBy["WorkspacesActivelyUsingAllTime"] = "workspacesActivelyUsingAllTime";
})(PublicApiPackAnalyticsOrderBy || (exports.PublicApiPackAnalyticsOrderBy = PublicApiPackAnalyticsOrderBy = {}));
/**
 * Quantization period over which to view analytics.
 */
var PublicApiAnalyticsScale;
(function (PublicApiAnalyticsScale) {
    PublicApiAnalyticsScale["Daily"] = "daily";
    PublicApiAnalyticsScale["Cumulative"] = "cumulative";
})(PublicApiAnalyticsScale || (exports.PublicApiAnalyticsScale = PublicApiAnalyticsScale = {}));
/**
 * Determines how the Packs returned are sorted.
 */
var PublicApiPacksSortBy;
(function (PublicApiPacksSortBy) {
    PublicApiPacksSortBy["Title"] = "title";
    PublicApiPacksSortBy["CreatedAt"] = "createdAt";
    PublicApiPacksSortBy["UpdatedAt"] = "updatedAt";
})(PublicApiPacksSortBy || (exports.PublicApiPacksSortBy = PublicApiPacksSortBy = {}));
/**
 * Determines how the Pack listings returned are sorted.
 */
var PublicApiPackListingsSortBy;
(function (PublicApiPackListingsSortBy) {
    PublicApiPackListingsSortBy["PackId"] = "packId";
    PublicApiPackListingsSortBy["Name"] = "name";
    PublicApiPackListingsSortBy["PackVersion"] = "packVersion";
    PublicApiPackListingsSortBy["PackVersionModifiedAt"] = "packVersionModifiedAt";
})(PublicApiPackListingsSortBy || (exports.PublicApiPackListingsSortBy = PublicApiPackListingsSortBy = {}));
/**
 * Type of Pack permissions.
 */
var PublicApiPackPrincipalType;
(function (PublicApiPackPrincipalType) {
    PublicApiPackPrincipalType["User"] = "user";
    PublicApiPackPrincipalType["Workspace"] = "workspace";
    PublicApiPackPrincipalType["Worldwide"] = "worldwide";
})(PublicApiPackPrincipalType || (exports.PublicApiPackPrincipalType = PublicApiPackPrincipalType = {}));
var PublicApiPackAccessType;
(function (PublicApiPackAccessType) {
    PublicApiPackAccessType["View"] = "view";
    PublicApiPackAccessType["Test"] = "test";
    PublicApiPackAccessType["Edit"] = "edit";
})(PublicApiPackAccessType || (exports.PublicApiPackAccessType = PublicApiPackAccessType = {}));
var PublicApiPackAssetType;
(function (PublicApiPackAssetType) {
    PublicApiPackAssetType["Logo"] = "logo";
    PublicApiPackAssetType["Cover"] = "cover";
    PublicApiPackAssetType["ExampleImage"] = "exampleImage";
})(PublicApiPackAssetType || (exports.PublicApiPackAssetType = PublicApiPackAssetType = {}));
var PublicApiPackSource;
(function (PublicApiPackSource) {
    PublicApiPackSource["Web"] = "web";
    PublicApiPackSource["Cli"] = "cli";
})(PublicApiPackSource || (exports.PublicApiPackSource = PublicApiPackSource = {}));
/**
 * Widest principal a Pack is available to.
 */
var PublicApiPackDiscoverability;
(function (PublicApiPackDiscoverability) {
    PublicApiPackDiscoverability["Public"] = "public";
    PublicApiPackDiscoverability["Workspace"] = "workspace";
    PublicApiPackDiscoverability["Private"] = "private";
})(PublicApiPackDiscoverability || (exports.PublicApiPackDiscoverability = PublicApiPackDiscoverability = {}));
/**
 * Type of Pack connections.
 */
var PublicApiPackConnectionType;
(function (PublicApiPackConnectionType) {
    PublicApiPackConnectionType["Header"] = "header";
    PublicApiPackConnectionType["UrlParam"] = "urlParam";
    PublicApiPackConnectionType["HttpBasic"] = "httpBasic";
    PublicApiPackConnectionType["Custom"] = "custom";
})(PublicApiPackConnectionType || (exports.PublicApiPackConnectionType = PublicApiPackConnectionType = {}));
/**
 * The context request type where a Pack log is generated.
 */
var PublicApiPackLogRequestType;
(function (PublicApiPackLogRequestType) {
    PublicApiPackLogRequestType["Unknown"] = "unknown";
    PublicApiPackLogRequestType["ConnectionNameMetadataRequest"] = "connectionNameMetadataRequest";
    PublicApiPackLogRequestType["ParameterAutocompleteMetadataRequest"] = "parameterAutocompleteMetadataRequest";
    PublicApiPackLogRequestType["PostAuthSetupMetadataRequest"] = "postAuthSetupMetadataRequest";
    PublicApiPackLogRequestType["GetSyncTableSchemaMetadataRequest"] = "getSyncTableSchemaMetadataRequest";
    PublicApiPackLogRequestType["GetDynamicSyncTableNameMetadataRequest"] = "getDynamicSyncTableNameMetadataRequest";
    PublicApiPackLogRequestType["ListSyncTableDynamicUrlsMetadataRequest"] = "listSyncTableDynamicUrlsMetadataRequest";
    PublicApiPackLogRequestType["GetDynamicSyncTableDisplayUrlMetadataRequest"] = "getDynamicSyncTableDisplayUrlMetadataRequest";
    PublicApiPackLogRequestType["GetIdentifiersForConnectionRequest"] = "getIdentifiersForConnectionRequest";
    PublicApiPackLogRequestType["InvokeFormulaRequest"] = "invokeFormulaRequest";
    PublicApiPackLogRequestType["InvokeSyncFormulaRequest"] = "invokeSyncFormulaRequest";
    PublicApiPackLogRequestType["ImpersonateInvokeFormulaRequest"] = "impersonateInvokeFormulaRequest";
    PublicApiPackLogRequestType["ImpersonateInvokeMetadataFormulaRequest"] = "impersonateInvokeMetadataFormulaRequest";
})(PublicApiPackLogRequestType || (exports.PublicApiPackLogRequestType = PublicApiPackLogRequestType = {}));
var PublicApiPackLogType;
(function (PublicApiPackLogType) {
    PublicApiPackLogType["Custom"] = "custom";
    PublicApiPackLogType["Fetcher"] = "fetcher";
    PublicApiPackLogType["Invocation"] = "invocation";
    PublicApiPackLogType["Internal"] = "internal";
    PublicApiPackLogType["Auth"] = "auth";
})(PublicApiPackLogType || (exports.PublicApiPackLogType = PublicApiPackLogType = {}));
var PublicApiLogLevel;
(function (PublicApiLogLevel) {
    PublicApiLogLevel["Error"] = "error";
    PublicApiLogLevel["Warn"] = "warn";
    PublicApiLogLevel["Info"] = "info";
    PublicApiLogLevel["Debug"] = "debug";
    PublicApiLogLevel["Trace"] = "trace";
    PublicApiLogLevel["Unknown"] = "unknown";
})(PublicApiLogLevel || (exports.PublicApiLogLevel = PublicApiLogLevel = {}));
/**
 * Only relevant for original Coda packs.
 */
var PublicApiFeatureSet;
(function (PublicApiFeatureSet) {
    PublicApiFeatureSet["Basic"] = "Basic";
    PublicApiFeatureSet["Pro"] = "Pro";
    PublicApiFeatureSet["Team"] = "Team";
    PublicApiFeatureSet["Enterprise"] = "Enterprise";
})(PublicApiFeatureSet || (exports.PublicApiFeatureSet = PublicApiFeatureSet = {}));
/**
 * Status of featured doc in pack listing.
 */
var PublicApiFeaturedDocStatus;
(function (PublicApiFeaturedDocStatus) {
    PublicApiFeaturedDocStatus["DocInaccessibleOrDoesNotExist"] = "docInaccessibleOrDoesNotExist";
    PublicApiFeaturedDocStatus["InvalidPublishedDocUrl"] = "invalidPublishedDocUrl";
})(PublicApiFeaturedDocStatus || (exports.PublicApiFeaturedDocStatus = PublicApiFeaturedDocStatus = {}));
/**
 * The pack formula type.
 */
var PublicApiPackFormulaType;
(function (PublicApiPackFormulaType) {
    PublicApiPackFormulaType["Action"] = "action";
    PublicApiPackFormulaType["Formula"] = "formula";
    PublicApiPackFormulaType["Sync"] = "sync";
    PublicApiPackFormulaType["Metadata"] = "metadata";
})(PublicApiPackFormulaType || (exports.PublicApiPackFormulaType = PublicApiPackFormulaType = {}));
