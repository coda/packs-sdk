"use strict";
/* eslint-disable */
/**
 * This file is auto-generated from OpenAPI definitions by `make build-openapi`. Do not edit manually.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicApiPackAssetType = exports.PublicApiPackEntrypoint = exports.PublicApiPackAccessType = exports.PublicApiPackPrincipalType = exports.PublicApiPackListingsSortBy = exports.PublicApiPacksSortBy = exports.PublicApiPackFormulaAnalyticsOrderBy = exports.PublicApiAnalyticsScale = exports.PublicApiPackAnalyticsOrderBy = exports.PublicApiDocAnalyticsOrderBy = exports.PublicApiWorkspaceUserRole = exports.PublicApiTableType = exports.PublicApiSortBy = exports.PublicApiControlType = exports.PublicApiValueFormat = exports.PublicApiRowsSortBy = exports.PublicApiImageStatus = exports.PublicApiLinkedDataType = exports.PublicApiColumnFormatType = exports.PublicApiCheckboxDisplayType = exports.PublicApiSliderDisplayType = exports.PublicApiIconSet = exports.PublicApiDurationUnit = exports.PublicApiLinkDisplayType = exports.PublicApiImageShapeStyle = exports.PublicApiEmailDisplayType = exports.PublicApiCurrencyFormatType = exports.PublicApiSyncPageType = exports.PublicApiSortDirection = exports.PublicApiPageLineStyle = exports.PublicApiPageType = exports.PublicApiPageContentFormat = exports.PublicApiLayout = exports.PublicApiPageEmbedRenderMethod = exports.PublicApiPageContentExportStatus = exports.PublicApiPageContentOutputFormat = exports.PublicApiPageContentInsertionMode = exports.PublicApiPageContentItemContentFormat = exports.PublicApiPageContentItemType = exports.PublicApiFolderIconColor = exports.PublicApiCustomDomainConnectedStatus = exports.PublicApiCustomDocDomainSetupStatus = exports.PublicApiCustomDocDomainProvider = exports.PublicApiDocPublishMode = exports.PublicApiAccessTypeNotNone = exports.PublicApiAccessType = exports.PublicApiPrincipalType = exports.PublicApiType = exports.OpenApiSpecVersion = exports.OpenApiSpecHash = void 0;
exports.PublicApiIngestionChildExecutionType = exports.PublicApiIngestionExecutionType = exports.PublicApiIngestionStatus = exports.PublicApiPackPlanPricingType = exports.PublicApiPackPlanCurrency = exports.PublicApiPackSourceCodeVisibility = exports.PublicApiPackFormulaType = exports.PublicApiFeaturedDocStatus = exports.PublicApiPaidFeatureSet = exports.PublicApiFeatureSet = exports.PublicApiLogLevel = exports.PublicApiPackLogType = exports.PublicApiPackLogRequestType = exports.PublicApiPackOAuth2ClientCredentialsLocation = exports.PublicApiPackConnectionType = exports.PublicApiIngestionPackReleaseChannel = exports.PublicApiPackListingInstallContextType = exports.PublicApiPackCategoryType = exports.PublicApiPackType = exports.PublicApiPackDiscoverability = exports.PublicApiPackSource = exports.PublicApiPackReviewStatus = void 0;
exports.OpenApiSpecHash = '4f64de8de03e3a7e64fa67827a25c62de87d1a332fbb5c6414943849dff961f6';
exports.OpenApiSpecVersion = '1.6.0';
/**
 * A constant identifying the type of the resource.
 */
var PublicApiType;
(function (PublicApiType) {
    PublicApiType["AclMetadata"] = "aclMetadata";
    PublicApiType["AclPermissions"] = "aclPermissions";
    PublicApiType["AclSettings"] = "aclSettings";
    PublicApiType["AgentPackLog"] = "agentPackLog";
    PublicApiType["AnalyticsLastUpdated"] = "analyticsLastUpdated";
    PublicApiType["ApiLink"] = "apiLink";
    PublicApiType["Automation"] = "automation";
    PublicApiType["Column"] = "column";
    PublicApiType["Control"] = "control";
    PublicApiType["Doc"] = "doc";
    PublicApiType["CustomDocDomain"] = "customDocDomain";
    PublicApiType["CustomDocDomainProvider"] = "customDocDomainProvider";
    PublicApiType["DocAnalytics"] = "docAnalytics";
    PublicApiType["DocAnalyticsSummary"] = "docAnalyticsSummary";
    PublicApiType["DocAnalyticsV2"] = "docAnalyticsV2";
    PublicApiType["Folder"] = "folder";
    PublicApiType["Formula"] = "formula";
    PublicApiType["GoLink"] = "goLink";
    PublicApiType["IngestionBatchExecution"] = "ingestionBatchExecution";
    PublicApiType["IngestionExecution"] = "ingestionExecution";
    PublicApiType["IngestionExecutionAttempt"] = "ingestionExecutionAttempt";
    PublicApiType["IngestionPackLog"] = "ingestionPackLog";
    PublicApiType["IngestionParentItem"] = "ingestionParentItem";
    PublicApiType["InternalRichText"] = "internalRichText";
    PublicApiType["MutationStatus"] = "mutationStatus";
    PublicApiType["Pack"] = "pack";
    PublicApiType["PackAclPermissions"] = "packAclPermissions";
    PublicApiType["PackAnalytics"] = "packAnalytics";
    PublicApiType["PackAnalyticsSummary"] = "packAnalyticsSummary";
    PublicApiType["PackAsset"] = "packAsset";
    PublicApiType["PackCategory"] = "packCategory";
    PublicApiType["PackConfigurationSchema"] = "packConfigurationSchema";
    PublicApiType["PackFeaturedDocs"] = "packFeaturedDocs";
    PublicApiType["PackFormulaAnalytics"] = "packFormulaAnalytics";
    PublicApiType["PackInvitation"] = "packInvitation";
    PublicApiType["PackListingDraft"] = "packListingDraft";
    PublicApiType["PackLog"] = "packLog";
    PublicApiType["PackMaker"] = "packMaker";
    PublicApiType["PackOauthConfig"] = "packOauthConfig";
    PublicApiType["PackRelease"] = "packRelease";
    PublicApiType["PackReview"] = "packReview";
    PublicApiType["PackSourceCode"] = "packSourceCode";
    PublicApiType["PackSystemConnection"] = "packSystemConnection";
    PublicApiType["PackVersion"] = "packVersion";
    PublicApiType["Page"] = "page";
    PublicApiType["PageContentExport"] = "pageContentExport";
    PublicApiType["PageContentExportStatus"] = "pageContentExportStatus";
    PublicApiType["Principal"] = "principal";
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
    PublicApiPrincipalType["Group"] = "group";
    PublicApiPrincipalType["Domain"] = "domain";
    PublicApiPrincipalType["Workspace"] = "workspace";
    PublicApiPrincipalType["Anyone"] = "anyone";
    PublicApiPrincipalType["InternalAccess"] = "internalAccess";
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
 * Type of access (excluding none).
 */
var PublicApiAccessTypeNotNone;
(function (PublicApiAccessTypeNotNone) {
    PublicApiAccessTypeNotNone["ReadOnly"] = "readonly";
    PublicApiAccessTypeNotNone["Write"] = "write";
    PublicApiAccessTypeNotNone["Comment"] = "comment";
})(PublicApiAccessTypeNotNone || (exports.PublicApiAccessTypeNotNone = PublicApiAccessTypeNotNone = {}));
/**
 * Which interaction mode the published doc should use.
 */
var PublicApiDocPublishMode;
(function (PublicApiDocPublishMode) {
    PublicApiDocPublishMode["View"] = "view";
    PublicApiDocPublishMode["Play"] = "play";
    PublicApiDocPublishMode["Edit"] = "edit";
})(PublicApiDocPublishMode || (exports.PublicApiDocPublishMode = PublicApiDocPublishMode = {}));
var PublicApiCustomDocDomainProvider;
(function (PublicApiCustomDocDomainProvider) {
    PublicApiCustomDocDomainProvider["GoDaddy"] = "GoDaddy";
    PublicApiCustomDocDomainProvider["Namecheap"] = "Namecheap";
    PublicApiCustomDocDomainProvider["Hover"] = "Hover (Tucows)";
    PublicApiCustomDocDomainProvider["NetworkSolutions"] = "Network Solutions";
    PublicApiCustomDocDomainProvider["GoogleDomains"] = "Google Domains";
    PublicApiCustomDocDomainProvider["Other"] = "Other";
})(PublicApiCustomDocDomainProvider || (exports.PublicApiCustomDocDomainProvider = PublicApiCustomDocDomainProvider = {}));
var PublicApiCustomDocDomainSetupStatus;
(function (PublicApiCustomDocDomainSetupStatus) {
    PublicApiCustomDocDomainSetupStatus["Pending"] = "pending";
    PublicApiCustomDocDomainSetupStatus["Succeeded"] = "succeeded";
    PublicApiCustomDocDomainSetupStatus["Failed"] = "failed";
})(PublicApiCustomDocDomainSetupStatus || (exports.PublicApiCustomDocDomainSetupStatus = PublicApiCustomDocDomainSetupStatus = {}));
var PublicApiCustomDomainConnectedStatus;
(function (PublicApiCustomDomainConnectedStatus) {
    PublicApiCustomDomainConnectedStatus["Connected"] = "connected";
    PublicApiCustomDomainConnectedStatus["NotConnected"] = "notConnected";
})(PublicApiCustomDomainConnectedStatus || (exports.PublicApiCustomDomainConnectedStatus = PublicApiCustomDomainConnectedStatus = {}));
/**
 * Color scheme for folder icons.
 */
var PublicApiFolderIconColor;
(function (PublicApiFolderIconColor) {
    PublicApiFolderIconColor["DarkBlue"] = "DARK_BLUE";
    PublicApiFolderIconColor["DarkYellow"] = "DARK_YELLOW";
    PublicApiFolderIconColor["DarkPurple"] = "DARK_PURPLE";
    PublicApiFolderIconColor["DarkPink"] = "DARK_PINK";
    PublicApiFolderIconColor["DarkOrange"] = "DARK_ORANGE";
    PublicApiFolderIconColor["DarkGreen"] = "DARK_GREEN";
    PublicApiFolderIconColor["DarkRed"] = "DARK_RED";
    PublicApiFolderIconColor["DarkGray"] = "DARK_GRAY";
    PublicApiFolderIconColor["LightBlue"] = "LIGHT_BLUE";
    PublicApiFolderIconColor["LightYellow"] = "LIGHT_YELLOW";
    PublicApiFolderIconColor["LightPurple"] = "LIGHT_PURPLE";
    PublicApiFolderIconColor["LightPink"] = "LIGHT_PINK";
    PublicApiFolderIconColor["LightOrange"] = "LIGHT_ORANGE";
    PublicApiFolderIconColor["LightGreen"] = "LIGHT_GREEN";
    PublicApiFolderIconColor["LightRed"] = "LIGHT_RED";
    PublicApiFolderIconColor["LightGray"] = "LIGHT_GRAY";
})(PublicApiFolderIconColor || (exports.PublicApiFolderIconColor = PublicApiFolderIconColor = {}));
/**
 * The type of content item in a page.
 */
var PublicApiPageContentItemType;
(function (PublicApiPageContentItemType) {
    PublicApiPageContentItemType["Line"] = "line";
})(PublicApiPageContentItemType || (exports.PublicApiPageContentItemType = PublicApiPageContentItemType = {}));
/**
 * Content format for the item.
 */
var PublicApiPageContentItemContentFormat;
(function (PublicApiPageContentItemContentFormat) {
    PublicApiPageContentItemContentFormat["PlainText"] = "plainText";
})(PublicApiPageContentItemContentFormat || (exports.PublicApiPageContentItemContentFormat = PublicApiPageContentItemContentFormat = {}));
/**
 * Mode for updating the content on an existing page.
 */
var PublicApiPageContentInsertionMode;
(function (PublicApiPageContentInsertionMode) {
    PublicApiPageContentInsertionMode["Append"] = "append";
    PublicApiPageContentInsertionMode["Prepend"] = "prepend";
    PublicApiPageContentInsertionMode["Replace"] = "replace";
})(PublicApiPageContentInsertionMode || (exports.PublicApiPageContentInsertionMode = PublicApiPageContentInsertionMode = {}));
/**
 * Supported output content formats that can be requested for getting content for an existing page.
 */
var PublicApiPageContentOutputFormat;
(function (PublicApiPageContentOutputFormat) {
    PublicApiPageContentOutputFormat["Html"] = "html";
    PublicApiPageContentOutputFormat["Markdown"] = "markdown";
})(PublicApiPageContentOutputFormat || (exports.PublicApiPageContentOutputFormat = PublicApiPageContentOutputFormat = {}));
/**
 * Status of a page content export.
 */
var PublicApiPageContentExportStatus;
(function (PublicApiPageContentExportStatus) {
    PublicApiPageContentExportStatus["InProgress"] = "inProgress";
    PublicApiPageContentExportStatus["Failed"] = "failed";
    PublicApiPageContentExportStatus["Complete"] = "complete";
})(PublicApiPageContentExportStatus || (exports.PublicApiPageContentExportStatus = PublicApiPageContentExportStatus = {}));
/**
 * Render mode for a page using the Embed page type.
 */
var PublicApiPageEmbedRenderMethod;
(function (PublicApiPageEmbedRenderMethod) {
    PublicApiPageEmbedRenderMethod["Compatibility"] = "compatibility";
    PublicApiPageEmbedRenderMethod["Standard"] = "standard";
})(PublicApiPageEmbedRenderMethod || (exports.PublicApiPageEmbedRenderMethod = PublicApiPageEmbedRenderMethod = {}));
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
 * Supported content types for page (canvas) content.
 */
var PublicApiPageContentFormat;
(function (PublicApiPageContentFormat) {
    PublicApiPageContentFormat["Html"] = "html";
    PublicApiPageContentFormat["Markdown"] = "markdown";
})(PublicApiPageContentFormat || (exports.PublicApiPageContentFormat = PublicApiPageContentFormat = {}));
/**
 * The type of a page in a doc.
 */
var PublicApiPageType;
(function (PublicApiPageType) {
    PublicApiPageType["Canvas"] = "canvas";
    PublicApiPageType["Embed"] = "embed";
    PublicApiPageType["SyncPage"] = "syncPage";
    PublicApiPageType["Table"] = "table";
})(PublicApiPageType || (exports.PublicApiPageType = PublicApiPageType = {}));
/**
 * The style of a line element in a canvas page.
 */
var PublicApiPageLineStyle;
(function (PublicApiPageLineStyle) {
    PublicApiPageLineStyle["BlockQuote"] = "blockQuote";
    PublicApiPageLineStyle["BulletedList"] = "bulletedList";
    PublicApiPageLineStyle["CheckboxList"] = "checkboxList";
    PublicApiPageLineStyle["Code"] = "code";
    PublicApiPageLineStyle["CollapsibleList"] = "collapsibleList";
    PublicApiPageLineStyle["H1"] = "h1";
    PublicApiPageLineStyle["H2"] = "h2";
    PublicApiPageLineStyle["H3"] = "h3";
    PublicApiPageLineStyle["NumberedList"] = "numberedList";
    PublicApiPageLineStyle["Paragraph"] = "paragraph";
    PublicApiPageLineStyle["PullQuote"] = "pullQuote";
})(PublicApiPageLineStyle || (exports.PublicApiPageLineStyle = PublicApiPageLineStyle = {}));
/**
 * Direction of a sort for a table or view.
 */
var PublicApiSortDirection;
(function (PublicApiSortDirection) {
    PublicApiSortDirection["Ascending"] = "ascending";
    PublicApiSortDirection["Descending"] = "descending";
})(PublicApiSortDirection || (exports.PublicApiSortDirection = PublicApiSortDirection = {}));
/**
 * The type of sync page in a doc
 */
var PublicApiSyncPageType;
(function (PublicApiSyncPageType) {
    PublicApiSyncPageType["Page"] = "page";
    PublicApiSyncPageType["Document"] = "document";
})(PublicApiSyncPageType || (exports.PublicApiSyncPageType = PublicApiSyncPageType = {}));
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
 * How an image should be displayed.
 */
var PublicApiImageShapeStyle;
(function (PublicApiImageShapeStyle) {
    PublicApiImageShapeStyle["Auto"] = "auto";
    PublicApiImageShapeStyle["Circle"] = "circle";
})(PublicApiImageShapeStyle || (exports.PublicApiImageShapeStyle = PublicApiImageShapeStyle = {}));
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
 * How the slider should be rendered.
 */
var PublicApiSliderDisplayType;
(function (PublicApiSliderDisplayType) {
    PublicApiSliderDisplayType["Slider"] = "slider";
    PublicApiSliderDisplayType["Progress"] = "progress";
})(PublicApiSliderDisplayType || (exports.PublicApiSliderDisplayType = PublicApiSliderDisplayType = {}));
/**
 * How a checkbox should be displayed.
 */
var PublicApiCheckboxDisplayType;
(function (PublicApiCheckboxDisplayType) {
    PublicApiCheckboxDisplayType["Toggle"] = "toggle";
    PublicApiCheckboxDisplayType["Check"] = "check";
})(PublicApiCheckboxDisplayType || (exports.PublicApiCheckboxDisplayType = PublicApiCheckboxDisplayType = {}));
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
    PublicApiColumnFormatType["ImageReference"] = "imageReference";
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
    PublicApiControlType["AIBlock"] = "aiBlock";
    PublicApiControlType["Button"] = "button";
    PublicApiControlType["Checkbox"] = "checkbox";
    PublicApiControlType["DatePicker"] = "datePicker";
    PublicApiControlType["DateRangePicker"] = "dateRangePicker";
    PublicApiControlType["DateTimePicker"] = "dateTimePicker";
    PublicApiControlType["Lookup"] = "lookup";
    PublicApiControlType["Multiselect"] = "multiselect";
    PublicApiControlType["Select"] = "select";
    PublicApiControlType["Scale"] = "scale";
    PublicApiControlType["Slider"] = "slider";
    PublicApiControlType["Reaction"] = "reaction";
    PublicApiControlType["Textbox"] = "textbox";
    PublicApiControlType["TimePicker"] = "timePicker";
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
    PublicApiTableType["Database"] = "database";
})(PublicApiTableType || (exports.PublicApiTableType = PublicApiTableType = {}));
var PublicApiWorkspaceUserRole;
(function (PublicApiWorkspaceUserRole) {
    PublicApiWorkspaceUserRole["Admin"] = "Admin";
    PublicApiWorkspaceUserRole["DocMaker"] = "DocMaker";
    PublicApiWorkspaceUserRole["Editor"] = "Editor";
})(PublicApiWorkspaceUserRole || (exports.PublicApiWorkspaceUserRole = PublicApiWorkspaceUserRole = {}));
/**
 * Determines how the Doc analytics returned are sorted.
 */
var PublicApiDocAnalyticsOrderBy;
(function (PublicApiDocAnalyticsOrderBy) {
    PublicApiDocAnalyticsOrderBy["AnalyticsDate"] = "date";
    PublicApiDocAnalyticsOrderBy["DocId"] = "docId";
    PublicApiDocAnalyticsOrderBy["Title"] = "title";
    PublicApiDocAnalyticsOrderBy["CreatedAt"] = "createdAt";
    PublicApiDocAnalyticsOrderBy["PublishedAt"] = "publishedAt";
    PublicApiDocAnalyticsOrderBy["Likes"] = "likes";
    PublicApiDocAnalyticsOrderBy["Copies"] = "copies";
    PublicApiDocAnalyticsOrderBy["Views"] = "views";
    PublicApiDocAnalyticsOrderBy["SessionsDesktop"] = "sessionsDesktop";
    PublicApiDocAnalyticsOrderBy["SessionsMobile"] = "sessionsMobile";
    PublicApiDocAnalyticsOrderBy["SessionsOther"] = "sessionsOther";
    PublicApiDocAnalyticsOrderBy["TotalSessions"] = "totalSessions";
    PublicApiDocAnalyticsOrderBy["AiCreditsChat"] = "aiCreditsChat";
    PublicApiDocAnalyticsOrderBy["AiCreditsBlock"] = "aiCreditsBlock";
    PublicApiDocAnalyticsOrderBy["AiCreditsColumn"] = "aiCreditsColumn";
    PublicApiDocAnalyticsOrderBy["AiCreditsAssistant"] = "aiCreditsAssistant";
    PublicApiDocAnalyticsOrderBy["AiCreditsReviewer"] = "aiCreditsReviewer";
    PublicApiDocAnalyticsOrderBy["AiCredits"] = "aiCredits";
})(PublicApiDocAnalyticsOrderBy || (exports.PublicApiDocAnalyticsOrderBy = PublicApiDocAnalyticsOrderBy = {}));
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
    PublicApiPackAnalyticsOrderBy["WorkspacesWithActiveSubscriptions"] = "workspacesWithActiveSubscriptions";
    PublicApiPackAnalyticsOrderBy["WorkspacesWithSuccessfulTrials"] = "workspacesWithSuccessfulTrials";
    PublicApiPackAnalyticsOrderBy["RevenueUsd"] = "revenueUsd";
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
 * Determines how the Pack formula analytics returned are sorted.
 */
var PublicApiPackFormulaAnalyticsOrderBy;
(function (PublicApiPackFormulaAnalyticsOrderBy) {
    PublicApiPackFormulaAnalyticsOrderBy["AnalyticsDate"] = "date";
    PublicApiPackFormulaAnalyticsOrderBy["FormulaName"] = "formulaName";
    PublicApiPackFormulaAnalyticsOrderBy["FormulaType"] = "formulaType";
    PublicApiPackFormulaAnalyticsOrderBy["FormulaInvocations"] = "formulaInvocations";
    PublicApiPackFormulaAnalyticsOrderBy["MedianLatencyMs"] = "medianLatencyMs";
    PublicApiPackFormulaAnalyticsOrderBy["MedianResponseSizeBytes"] = "medianResponseSizeBytes";
    PublicApiPackFormulaAnalyticsOrderBy["Errors"] = "errors";
    PublicApiPackFormulaAnalyticsOrderBy["DocsActivelyUsing"] = "docsActivelyUsing";
    PublicApiPackFormulaAnalyticsOrderBy["DocsActivelyUsing7Day"] = "docsActivelyUsing7Day";
    PublicApiPackFormulaAnalyticsOrderBy["DocsActivelyUsing30Day"] = "docsActivelyUsing30Day";
    PublicApiPackFormulaAnalyticsOrderBy["DocsActivelyUsing90Day"] = "docsActivelyUsing90Day";
    PublicApiPackFormulaAnalyticsOrderBy["DocsActivelyUsingAllTime"] = "docsActivelyUsingAllTime";
    PublicApiPackFormulaAnalyticsOrderBy["WorkspacesActivelyUsing"] = "workspacesActivelyUsing";
    PublicApiPackFormulaAnalyticsOrderBy["WorkspacesActivelyUsing7Day"] = "workspacesActivelyUsing7Day";
    PublicApiPackFormulaAnalyticsOrderBy["WorkspacesActivelyUsing30Day"] = "workspacesActivelyUsing30Day";
    PublicApiPackFormulaAnalyticsOrderBy["WorkspacesActivelyUsing90Day"] = "workspacesActivelyUsing90Day";
    PublicApiPackFormulaAnalyticsOrderBy["WorkspacesActivelyUsingAllTime"] = "workspacesActivelyUsingAllTime";
})(PublicApiPackFormulaAnalyticsOrderBy || (exports.PublicApiPackFormulaAnalyticsOrderBy = PublicApiPackFormulaAnalyticsOrderBy = {}));
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
    PublicApiPackListingsSortBy["AgentDirectorySort"] = "agentDirectorySort";
})(PublicApiPackListingsSortBy || (exports.PublicApiPackListingsSortBy = PublicApiPackListingsSortBy = {}));
/**
 * Type of Pack permissions.
 */
var PublicApiPackPrincipalType;
(function (PublicApiPackPrincipalType) {
    PublicApiPackPrincipalType["User"] = "user";
    PublicApiPackPrincipalType["Workspace"] = "workspace";
    PublicApiPackPrincipalType["Worldwide"] = "worldwide";
    PublicApiPackPrincipalType["NomosOrganization"] = "nomosOrganization";
    PublicApiPackPrincipalType["Group"] = "group";
    PublicApiPackPrincipalType["GrammarlyInstitution"] = "grammarlyInstitution";
})(PublicApiPackPrincipalType || (exports.PublicApiPackPrincipalType = PublicApiPackPrincipalType = {}));
var PublicApiPackAccessType;
(function (PublicApiPackAccessType) {
    PublicApiPackAccessType["None"] = "none";
    PublicApiPackAccessType["View"] = "view";
    PublicApiPackAccessType["Test"] = "test";
    PublicApiPackAccessType["Edit"] = "edit";
    PublicApiPackAccessType["Admin"] = "admin";
})(PublicApiPackAccessType || (exports.PublicApiPackAccessType = PublicApiPackAccessType = {}));
var PublicApiPackEntrypoint;
(function (PublicApiPackEntrypoint) {
    PublicApiPackEntrypoint["Go"] = "go";
    PublicApiPackEntrypoint["Docs"] = "docs";
})(PublicApiPackEntrypoint || (exports.PublicApiPackEntrypoint = PublicApiPackEntrypoint = {}));
var PublicApiPackAssetType;
(function (PublicApiPackAssetType) {
    PublicApiPackAssetType["Logo"] = "logo";
    PublicApiPackAssetType["Cover"] = "cover";
    PublicApiPackAssetType["ExampleImage"] = "exampleImage";
    PublicApiPackAssetType["AgentImage"] = "agentImage";
})(PublicApiPackAssetType || (exports.PublicApiPackAssetType = PublicApiPackAssetType = {}));
/**
 * The status of a Pack review
 */
var PublicApiPackReviewStatus;
(function (PublicApiPackReviewStatus) {
    PublicApiPackReviewStatus["Pending"] = "pending";
    PublicApiPackReviewStatus["Approved"] = "approved";
    PublicApiPackReviewStatus["Denied"] = "denied";
    PublicApiPackReviewStatus["Canceled"] = "canceled";
    PublicApiPackReviewStatus["Superseded"] = "superseded";
})(PublicApiPackReviewStatus || (exports.PublicApiPackReviewStatus = PublicApiPackReviewStatus = {}));
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
    PublicApiPackDiscoverability["NomosOrganization"] = "nomosOrganization";
    PublicApiPackDiscoverability["Group"] = "group";
    PublicApiPackDiscoverability["GrammarlyInstitution"] = "grammarlyInstitution";
    PublicApiPackDiscoverability["Workspace"] = "workspace";
    PublicApiPackDiscoverability["Private"] = "private";
})(PublicApiPackDiscoverability || (exports.PublicApiPackDiscoverability = PublicApiPackDiscoverability = {}));
/**
 * Type of a Pack.
 */
var PublicApiPackType;
(function (PublicApiPackType) {
    PublicApiPackType["Standard"] = "standard";
    PublicApiPackType["System"] = "system";
})(PublicApiPackType || (exports.PublicApiPackType = PublicApiPackType = {}));
/**
 * The category of a Pack.
 */
var PublicApiPackCategoryType;
(function (PublicApiPackCategoryType) {
    PublicApiPackCategoryType["Connector"] = "connector";
    PublicApiPackCategoryType["Agent"] = "agent";
    PublicApiPackCategoryType["CustomAgent"] = "customAgent";
})(PublicApiPackCategoryType || (exports.PublicApiPackCategoryType = PublicApiPackCategoryType = {}));
/**
 * Type of context in which a Pack is being installed.
 */
var PublicApiPackListingInstallContextType;
(function (PublicApiPackListingInstallContextType) {
    PublicApiPackListingInstallContextType["Workspace"] = "workspace";
    PublicApiPackListingInstallContextType["Doc"] = "doc";
    PublicApiPackListingInstallContextType["CodaBrain"] = "codaBrain";
})(PublicApiPackListingInstallContextType || (exports.PublicApiPackListingInstallContextType = PublicApiPackListingInstallContextType = {}));
/**
 * Live or Latest version of Pack
 */
var PublicApiIngestionPackReleaseChannel;
(function (PublicApiIngestionPackReleaseChannel) {
    PublicApiIngestionPackReleaseChannel["Live"] = "LIVE";
    PublicApiIngestionPackReleaseChannel["Latest"] = "LATEST";
})(PublicApiIngestionPackReleaseChannel || (exports.PublicApiIngestionPackReleaseChannel = PublicApiIngestionPackReleaseChannel = {}));
/**
 * Type of Pack connections.
 */
var PublicApiPackConnectionType;
(function (PublicApiPackConnectionType) {
    PublicApiPackConnectionType["Header"] = "header";
    PublicApiPackConnectionType["MultiHeader"] = "multiHeader";
    PublicApiPackConnectionType["UrlParam"] = "urlParam";
    PublicApiPackConnectionType["HttpBasic"] = "httpBasic";
    PublicApiPackConnectionType["Custom"] = "custom";
    PublicApiPackConnectionType["OAuth2ClientCredentials"] = "oauth2ClientCredentials";
    PublicApiPackConnectionType["GoogleServiceAccount"] = "googleServiceAccount";
    PublicApiPackConnectionType["AwsAssumeRole"] = "awsAssumeRole";
    PublicApiPackConnectionType["AwsAccessKey"] = "awsAccessKey";
})(PublicApiPackConnectionType || (exports.PublicApiPackConnectionType = PublicApiPackConnectionType = {}));
/**
 * Location of including OAuth2 client credentials in a request.
 */
var PublicApiPackOAuth2ClientCredentialsLocation;
(function (PublicApiPackOAuth2ClientCredentialsLocation) {
    PublicApiPackOAuth2ClientCredentialsLocation["Automatic"] = "automatic";
    PublicApiPackOAuth2ClientCredentialsLocation["Body"] = "body";
    PublicApiPackOAuth2ClientCredentialsLocation["Header"] = "header";
})(PublicApiPackOAuth2ClientCredentialsLocation || (exports.PublicApiPackOAuth2ClientCredentialsLocation = PublicApiPackOAuth2ClientCredentialsLocation = {}));
/**
 * The context request type where a Pack log is generated.
 */
var PublicApiPackLogRequestType;
(function (PublicApiPackLogRequestType) {
    PublicApiPackLogRequestType["Unknown"] = "unknown";
    PublicApiPackLogRequestType["ConnectionNameMetadataRequest"] = "connectionNameMetadataRequest";
    PublicApiPackLogRequestType["ParameterAutocompleteMetadataRequest"] = "parameterAutocompleteMetadataRequest";
    PublicApiPackLogRequestType["PostAuthSetupMetadataRequest"] = "postAuthSetupMetadataRequest";
    PublicApiPackLogRequestType["PropertyOptionsMetadataRequest"] = "propertyOptionsMetadataRequest";
    PublicApiPackLogRequestType["GetSyncTableSchemaMetadataRequest"] = "getSyncTableSchemaMetadataRequest";
    PublicApiPackLogRequestType["GetDynamicSyncTableNameMetadataRequest"] = "getDynamicSyncTableNameMetadataRequest";
    PublicApiPackLogRequestType["ListSyncTableDynamicUrlsMetadataRequest"] = "listSyncTableDynamicUrlsMetadataRequest";
    PublicApiPackLogRequestType["SearchSyncTableDynamicUrlsMetadataRequest"] = "searchSyncTableDynamicUrlsMetadataRequest";
    PublicApiPackLogRequestType["GetDynamicSyncTableDisplayUrlMetadataRequest"] = "getDynamicSyncTableDisplayUrlMetadataRequest";
    PublicApiPackLogRequestType["ValidateParametersMetadataRequest"] = "getIdentifiersForConnectionRequest";
    PublicApiPackLogRequestType["GetIdentifiersForConnectionRequest"] = "invokeFormulaRequest";
    PublicApiPackLogRequestType["InvokeFormulaRequest"] = "invokeSyncFormulaRequest";
    PublicApiPackLogRequestType["InvokeSyncFormulaRequest"] = "invokeSyncUpdateFormulaRequest";
    PublicApiPackLogRequestType["InvokeSyncUpdateFormulaRequest"] = "invokeExecuteGetPermissionsRequest";
    PublicApiPackLogRequestType["InvokeExecuteGetPermissionsRequest"] = "validateParametersMetadataRequest";
    PublicApiPackLogRequestType["Mcp"] = "mcp";
})(PublicApiPackLogRequestType || (exports.PublicApiPackLogRequestType = PublicApiPackLogRequestType = {}));
var PublicApiPackLogType;
(function (PublicApiPackLogType) {
    PublicApiPackLogType["Custom"] = "custom";
    PublicApiPackLogType["Fetcher"] = "fetcher";
    PublicApiPackLogType["Invocation"] = "invocation";
    PublicApiPackLogType["Internal"] = "internal";
    PublicApiPackLogType["Auth"] = "auth";
    PublicApiPackLogType["IngestionLifecycle"] = "ingestionLifecycle";
    PublicApiPackLogType["IngestionDebug"] = "ingestionDebug";
    PublicApiPackLogType["AgentRuntime"] = "agentRuntime";
    PublicApiPackLogType["Mcp"] = "mcp";
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
 * Only relevant for original Superhuman Packs.
 */
var PublicApiFeatureSet;
(function (PublicApiFeatureSet) {
    PublicApiFeatureSet["Basic"] = "Basic";
    PublicApiFeatureSet["Pro"] = "Pro";
    PublicApiFeatureSet["Team"] = "Team";
    PublicApiFeatureSet["Enterprise"] = "Enterprise";
})(PublicApiFeatureSet || (exports.PublicApiFeatureSet = PublicApiFeatureSet = {}));
/**
 * Workspace feature set excluding free.
 */
var PublicApiPaidFeatureSet;
(function (PublicApiPaidFeatureSet) {
    PublicApiPaidFeatureSet["Pro"] = "Pro";
    PublicApiPaidFeatureSet["Team"] = "Team";
    PublicApiPaidFeatureSet["Enterprise"] = "Enterprise";
})(PublicApiPaidFeatureSet || (exports.PublicApiPaidFeatureSet = PublicApiPaidFeatureSet = {}));
/**
 * Status of featured doc in Pack listing.
 */
var PublicApiFeaturedDocStatus;
(function (PublicApiFeaturedDocStatus) {
    PublicApiFeaturedDocStatus["DocInaccessibleOrDoesNotExist"] = "docInaccessibleOrDoesNotExist";
    PublicApiFeaturedDocStatus["InvalidPublishedDocUrl"] = "invalidPublishedDocUrl";
})(PublicApiFeaturedDocStatus || (exports.PublicApiFeaturedDocStatus = PublicApiFeaturedDocStatus = {}));
var PublicApiPackFormulaType;
(function (PublicApiPackFormulaType) {
    PublicApiPackFormulaType["Action"] = "action";
    PublicApiPackFormulaType["Formula"] = "formula";
    PublicApiPackFormulaType["Sync"] = "sync";
    PublicApiPackFormulaType["Metadata"] = "metadata";
})(PublicApiPackFormulaType || (exports.PublicApiPackFormulaType = PublicApiPackFormulaType = {}));
/**
 * Visibility of a Pack's source code.
 */
var PublicApiPackSourceCodeVisibility;
(function (PublicApiPackSourceCodeVisibility) {
    PublicApiPackSourceCodeVisibility["Private"] = "private";
    PublicApiPackSourceCodeVisibility["Shared"] = "shared";
})(PublicApiPackSourceCodeVisibility || (exports.PublicApiPackSourceCodeVisibility = PublicApiPackSourceCodeVisibility = {}));
/**
 * Currency needed to subscribe to the Pack.
 */
var PublicApiPackPlanCurrency;
(function (PublicApiPackPlanCurrency) {
    PublicApiPackPlanCurrency["Usd"] = "USD";
})(PublicApiPackPlanCurrency || (exports.PublicApiPackPlanCurrency = PublicApiPackPlanCurrency = {}));
/**
 * Type of pricing used to subscribe to a Pack.
 */
var PublicApiPackPlanPricingType;
(function (PublicApiPackPlanPricingType) {
    PublicApiPackPlanPricingType["Free"] = "Free";
    PublicApiPackPlanPricingType["MonthlyDocMaker"] = "MonthlyDocMaker";
    PublicApiPackPlanPricingType["BundledWithTier"] = "BundledWithTier";
})(PublicApiPackPlanPricingType || (exports.PublicApiPackPlanPricingType = PublicApiPackPlanPricingType = {}));
/**
 * Status of the ingestion execution.
 */
var PublicApiIngestionStatus;
(function (PublicApiIngestionStatus) {
    PublicApiIngestionStatus["Queued"] = "QUEUED";
    PublicApiIngestionStatus["Started"] = "STARTED";
    PublicApiIngestionStatus["Cancelled"] = "CANCELLED";
    PublicApiIngestionStatus["UpForRetry"] = "UP_FOR_RETRY";
    PublicApiIngestionStatus["Completed"] = "COMPLETED";
    PublicApiIngestionStatus["Failed"] = "FAILED";
})(PublicApiIngestionStatus || (exports.PublicApiIngestionStatus = PublicApiIngestionStatus = {}));
/**
 * Type of an ingestion batch execution.
 */
var PublicApiIngestionExecutionType;
(function (PublicApiIngestionExecutionType) {
    PublicApiIngestionExecutionType["Full"] = "FULL";
    PublicApiIngestionExecutionType["Incremental"] = "INCREMENTAL";
})(PublicApiIngestionExecutionType || (exports.PublicApiIngestionExecutionType = PublicApiIngestionExecutionType = {}));
/**
 * Type of an ingestion childexecution.
 */
var PublicApiIngestionChildExecutionType;
(function (PublicApiIngestionChildExecutionType) {
    PublicApiIngestionChildExecutionType["Full"] = "FULL";
    PublicApiIngestionChildExecutionType["Incremental"] = "INCREMENTAL";
    PublicApiIngestionChildExecutionType["Patch"] = "PATCH";
})(PublicApiIngestionChildExecutionType || (exports.PublicApiIngestionChildExecutionType = PublicApiIngestionChildExecutionType = {}));
