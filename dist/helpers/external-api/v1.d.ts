/**
 * This file is auto-generated from OpenAPI definitions by `make build-openapi`. Do not edit manually.
 */
export declare const OpenApiSpecHash = "d7c3f53287ba26554cc58614e4870ec5bfd5328139ef564e67517bd0411267a6";
export declare const OpenApiSpecVersion = "1.1.0";
/**
 * A constant identifying the type of the resource.
 */
export declare enum PublicApiType {
    Doc = "doc",
    AclPermissions = "aclPermissions",
    AclMetadata = "aclMetadata",
    User = "user",
    ApiLink = "apiLink",
    Page = "page",
    Table = "table",
    Row = "row",
    Column = "column",
    Formula = "formula",
    Control = "control",
    DocAnalytics = "docAnalytics",
    MutationStatus = "mutationStatus",
    Workspace = "workspace",
    Pack = "pack",
    PackVersion = "packVersion"
}
/**
 * Type of principal.
 */
export declare enum PublicApiPrincipalType {
    Email = "email",
    Domain = "domain",
    Anyone = "anyone"
}
/**
 * Metadata about a principal.
 */
export declare type PublicApiPrincipal = PublicApiEmailPrincipal | PublicApiDomainPrincipal | PublicApiAnyonePrincipal;
export interface PublicApiEmailPrincipal {
    type: PublicApiPrincipalType;
    /**
     * Email for the principal.
     */
    email: string;
}
export interface PublicApiDomainPrincipal {
    type: PublicApiPrincipalType;
    /**
     * Domain for the principal.
     */
    domain: string;
}
export interface PublicApiAnyonePrincipal {
    type: PublicApiPrincipalType;
}
/**
 * Type of access.
 */
export declare enum PublicApiAccessType {
    ReadOnly = "readonly",
    Write = "write",
    Comment = "comment",
    None = "none"
}
/**
 * A specific premission granted to a principal.
 */
export interface PublicApiPermission {
    principal: PublicApiPrincipal;
    /**
     * Id for the Permission
     */
    id: string;
    access: PublicApiAccessType;
}
/**
 * Payload for granting a new permission.
 */
export interface PublicApiAddPermission {
    access: PublicApiAccessType;
    principal: PublicApiPrincipal;
    /**
     * When true suppresses email notification
     */
    suppressEmail?: boolean;
}
/**
 * List of Permissions.
 */
export interface PublicApiAcl {
    items: PublicApiPermission[];
    /**
     * API link to these results
     */
    href: string;
    nextPageToken?: PublicApiNextPageToken;
    nextPageLink?: PublicApiNextPageLink & string;
}
/**
 * Doc level metadata associated with ACL.
 */
export interface PublicApiAclMetadata {
    /**
     * When true, the user of the api can share
     */
    canShare: boolean;
    /**
     * When true, the user of the api can share with the org
     */
    canShareWithOrg: boolean;
}
/**
 * The result of sharing a doc.
 */
export interface PublicApiAddPermissionResult {
}
/**
 * The result of deleting a permission.
 */
export interface PublicApiDeletePermissionResult {
}
/**
 * Reference to a Coda doc.
 */
export interface PublicApiDocReference {
    /**
     * ID of the Coda doc.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'doc';
    /**
     * API link to the Coda doc.
     */
    href: string;
    /**
     * Browser-friendly link to the Coda doc.
     */
    browserLink: string;
}
/**
 * Metadata about a Coda doc.
 */
export interface PublicApiDoc {
    /**
     * ID of the Coda doc.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'doc';
    /**
     * API link to the Coda doc.
     */
    href: string;
    /**
     * Browser-friendly link to the Coda doc.
     */
    browserLink: string;
    icon?: PublicApiIcon;
    /**
     * Name of the doc.
     */
    name: string;
    /**
     * Email address of the doc owner.
     */
    owner: string;
    /**
     * Name of the doc owner.
     */
    ownerName: string;
    docSize?: PublicApiDocSize;
    sourceDoc?: {} & PublicApiDocReference;
    /**
     * Timestamp for when the doc was created.
     */
    createdAt: string;
    /**
     * Timestamp for when the doc was last modified.
     */
    updatedAt: string;
    published?: PublicApiDocPublished;
    /**
     * ID of the Coda workspace containing this doc.
     */
    workspaceId: string;
    /**
     * ID of the Coda folder containing this doc.
     */
    folderId: string;
}
/**
 * The category applied to a doc.
 */
export interface PublicApiDocCategory {
    /**
     * Name of the category.
     */
    name: string;
}
/**
 * A list of categories that can be applied to a doc.
 */
export interface PublicApiDocCategoryList {
    /**
     * Categories for the doc.
     */
    items: PublicApiDocCategory[];
}
/**
 * List of Coda docs.
 */
export interface PublicApiDocList {
    items: PublicApiDoc[];
    /**
     * API link to these results
     */
    href?: string;
    nextPageToken?: PublicApiNextPageToken;
    nextPageLink?: PublicApiNextPageLink & string;
}
/**
 * Payload for creating a new doc.
 */
export interface PublicApiDocCreate {
    /**
     * Title of the new doc. Defaults to 'Untitled'.
     */
    title?: string;
    /**
     * An optional doc ID from which to create a copy.
     */
    sourceDoc?: string;
    /**
     * The timezone to use for the newly created doc.
     */
    timezone?: string;
    /**
     * The ID of the folder within which to create this doc. Defaults to your "My Docs" folder in the oldest workspace you joined; this is subject to change. You can get this ID by opening the folder in the docs list on your computer and grabbing the `folderId` query parameter.
     *
     */
    folderId?: string;
}
/**
 * The result of a doc deletion.
 */
export interface PublicApiDocDelete {
}
/**
 * The number of components within a Coda doc.
 */
export interface PublicApiDocSize {
    /**
     * The number of rows contained within all tables of the doc.
     */
    totalRowCount: number;
    /**
     * The total number of tables and views contained within the doc.
     */
    tableAndViewCount: number;
    /**
     * The total number of page contained within the doc.
     */
    pageCount: number;
    /**
     * If true, indicates that the doc is over the API size limit.
     */
    overApiSizeLimit: boolean;
}
/**
 * Payload for publishing a doc or or updating its publishing information.
 */
export interface PublicApiDocPublish {
    /**
     * Slug for the published doc.
     */
    slug?: string;
    /**
     * If true, the doc will display a copy button in the header.
     */
    copyable?: boolean;
    /**
     * If true, indicates that the doc is discoverable.
     */
    discoverable?: boolean;
    /**
     * If true, new users may be required to sign in to view content within this document. You will receive Coda credit for each user who signs up via your doc.
     *
     */
    earnCredit?: boolean;
    /**
     * The names of categories to apply to the document.
     */
    categoryNames?: string[];
    mode?: PublicApiDocPublishMode;
}
/**
 * Information about the publishing state of the document.
 */
export interface PublicApiDocPublished {
    /**
     * Description of the published doc.
     */
    description?: string;
    /**
     * URL to the published doc.
     */
    browserLink: string;
    /**
     * URL to the cover image for the published doc.
     */
    imageLink?: string;
    /**
     * If true, the doc will display a copy button in the header.
     */
    copyable: boolean;
    /**
     * If true, indicates that the doc is discoverable.
     */
    discoverable: boolean;
    /**
     * If true, new users may be required to sign in to view content within this document. You will receive Coda credit for each user who signs up via your doc.
     *
     */
    earnCredit: boolean;
    mode: PublicApiDocPublishMode;
    /**
     * Categories applied to the doc.
     */
    categories: PublicApiDocCategory[];
}
/**
 * A time unit used as part of a duration value.
 */
export declare enum PublicApiDocPublishMode {
    View = "view",
    Play = "play",
    Edit = "edit"
}
/**
 * The result of publishing a doc.
 */
export declare type PublicApiPublishResult = PublicApiDocumentMutateResponse & {};
/**
 * The result of unpublishing a doc.
 */
export interface PublicApiUnpublishResult {
}
/**
 * The result of a doc creation.
 */
export interface PublicApiDocumentCreationResult {
    /**
     * ID of the Coda doc.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'doc';
    /**
     * API link to the Coda doc.
     */
    href: string;
    /**
     * Browser-friendly link to the Coda doc.
     */
    browserLink: string;
    icon?: PublicApiIcon;
    /**
     * Name of the doc.
     */
    name: string;
    /**
     * Email address of the doc owner.
     */
    owner: string;
    /**
     * Name of the doc owner.
     */
    ownerName: string;
    docSize?: PublicApiDocSize;
    sourceDoc?: {} & PublicApiDocReference;
    /**
     * Timestamp for when the doc was created.
     */
    createdAt: string;
    /**
     * Timestamp for when the doc was last modified.
     */
    updatedAt: string;
    published?: PublicApiDocPublished;
    /**
     * ID of the Coda workspace containing this doc.
     */
    workspaceId: string;
    /**
     * ID of the Coda folder containing this doc.
     */
    folderId: string;
    /**
     * An arbitrary unique identifier for this request.
     */
    requestId?: string;
}
/**
 * Reference to a page.
 */
export interface PublicApiPageReference {
    /**
     * ID of the page.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'page';
    /**
     * API link to the page.
     */
    href: string;
    /**
     * Browser-friendly link to the page.
     */
    browserLink: string;
    /**
     * Name of the page.
     */
    name: string;
}
/**
 * Metadata about a page.
 */
export interface PublicApiPage {
    /**
     * ID of the page.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'page';
    /**
     * API link to the page.
     */
    href: string;
    /**
     * Browser-friendly link to the page.
     */
    browserLink: string;
    /**
     * Name of the page.
     */
    name: string;
    /**
     * Subtitle of the page.
     */
    subtitle?: string;
    icon?: PublicApiIcon;
    image?: PublicApiImage;
    parent?: PublicApiPageReference;
    children: PublicApiPageReference[];
}
/**
 * List of pages.
 */
export interface PublicApiPageList {
    items: PublicApiPage[];
    /**
     * API link to these results
     */
    href?: string;
    nextPageToken?: PublicApiNextPageToken;
    nextPageLink?: PublicApiNextPageLink & string;
}
/**
 * Payload for updating a page.
 */
export interface PublicApiPageUpdate {
    /**
     * Name of the page.
     */
    name?: string;
    /**
     * Subtitle of the page.
     */
    subtitle?: string;
    /**
     * Name of the icon.
     */
    iconName?: string;
    /**
     * Url of the image to use.
     */
    imageUrl?: string;
}
/**
 * The result of a page update.
 */
export declare type PublicApiPageUpdateResult = PublicApiDocumentMutateResponse & {
    /**
     * ID of the updated page.
     */
    id: string;
};
/**
 * Layout type of the table or view.
 */
export declare enum PublicApiLayout {
    Default = "default",
    AreaChart = "areaChart",
    BarChart = "barChart",
    BubbleChart = "bubbleChart",
    Calendar = "calendar",
    Card = "card",
    GanttChart = "ganttChart",
    LineChart = "lineChart",
    MasterDetail = "masterDetail",
    PieChart = "pieChart",
    ScatterChart = "scatterChart",
    Slide = "slide",
    WordCloud = "wordCloud"
}
/**
 * A sort applied to a table or view.
 */
export interface PublicApiSort {
    column: PublicApiColumnReference;
    direction: PublicApiSortDirection;
}
/**
 * Direction of a sort for a table or view.
 */
export declare enum PublicApiSortDirection {
    Ascending = "ascending",
    Descending = "descending"
}
/**
 * Base response type for an operation that mutates a document.
 */
export interface PublicApiDocumentMutateResponse {
    /**
     * An arbitrary unique identifier for this request.
     */
    requestId: string;
}
/**
 * Reference to a table or view.
 */
export interface PublicApiTableReference {
    /**
     * ID of the table.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'table';
    tableType: PublicApiTableType;
    /**
     * API link to the table.
     */
    href: string;
    /**
     * Browser-friendly link to the table.
     */
    browserLink: string;
    /**
     * Name of the table.
     */
    name: string;
    parent?: PublicApiPageReference;
}
/**
 * Metadata about a table.
 */
export interface PublicApiTable {
    /**
     * ID of the table.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'table';
    tableType: PublicApiTableType;
    /**
     * API link to the table.
     */
    href: string;
    /**
     * Browser-friendly link to the table.
     */
    browserLink: string;
    /**
     * Name of the table.
     */
    name: string;
    parent: PublicApiPageReference;
    parentTable?: PublicApiTableReference;
    displayColumn: PublicApiColumnReference;
    /**
     * Total number of rows in the table.
     */
    rowCount: number;
    /**
     * Any sorts applied to the table.
     */
    sorts: PublicApiSort[];
    layout: PublicApiLayout;
    filter?: {} & PublicApiFormulaDetail;
    /**
     * Timestamp for when the table was created.
     */
    createdAt: string;
    /**
     * Timestamp for when the table was last modified.
     */
    updatedAt: string;
}
/**
 * List of tables.
 */
export interface PublicApiTableList {
    items: PublicApiTableReference[];
    /**
     * API link to these results
     */
    href?: string;
    nextPageToken?: PublicApiNextPageToken;
    nextPageLink?: PublicApiNextPageLink & string;
}
/**
 * Reference to a column.
 */
export interface PublicApiColumnReference {
    /**
     * ID of the column.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'column';
    /**
     * API link to the column.
     */
    href: string;
}
/**
 * Info about a column.
 */
export interface PublicApiColumn {
    /**
     * ID of the column.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'column';
    /**
     * API link to the column.
     */
    href: string;
    /**
     * Name of the column.
     */
    name: string;
    /**
     * Whether the column is the display column.
     */
    display?: boolean;
    /**
     * Whether the column has a formula set on it.
     */
    calculated?: boolean;
    format: PublicApiColumnFormat;
}
/**
 * Info about a column.
 */
export interface PublicApiColumnDetail {
    /**
     * ID of the column.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'column';
    /**
     * API link to the column.
     */
    href: string;
    /**
     * Name of the column.
     */
    name: string;
    /**
     * Whether the column is the display column.
     */
    display?: boolean;
    /**
     * Whether the column has a formula set on it.
     */
    calculated?: boolean;
    format: PublicApiColumnFormat;
    parent: PublicApiTableReference;
}
/**
 * Format of a simple column.
 */
export interface PublicApiSimpleColumnFormat {
    type: PublicApiColumnFormatType;
    /**
     * Whether or not this column is an array.
     */
    isArray: boolean;
}
/**
 * Format of a column that refers to another table.
 */
export declare type PublicApiReferenceColumnFormat = PublicApiSimpleColumnFormat & {
    table: {} & PublicApiTableReference;
};
/**
 * Format of a numeric column.
 */
export declare type PublicApiNumericColumnFormat = PublicApiSimpleColumnFormat & {
    /**
     * The decimal precision.
     */
    precision?: number;
    /**
     * Whether to use a thousands separator (like ",") to format the numeric value.
     */
    useThousandsSeparator?: boolean;
};
/**
 * Format of a currency column.
 */
export declare type PublicApiCurrencyColumnFormat = PublicApiSimpleColumnFormat & {
    /**
     * The currency symbol
     */
    currencyCode?: string;
    /**
     * The decimal precision.
     */
    precision?: number;
    format?: PublicApiCurrencyFormatType;
};
/**
 * How the numeric value should be formatted (with or without symbol, negative numbers in parens).
 */
export declare enum PublicApiCurrencyFormatType {
    Currency = "currency",
    Accounting = "accounting",
    Financial = "financial"
}
/**
 * Format of a date column.
 */
export declare type PublicApiDateColumnFormat = PublicApiSimpleColumnFormat & {
    /**
     * A format string using Moment syntax: https://momentjs.com/docs/#/displaying/
     */
    format?: string;
};
/**
 * Format of a time column.
 */
export declare type PublicApiTimeColumnFormat = PublicApiSimpleColumnFormat & {
    /**
     * A format string using Moment syntax: https://momentjs.com/docs/#/displaying/
     */
    format?: string;
};
/**
 * Format of a date column.
 */
export declare type PublicApiDateTimeColumnFormat = PublicApiSimpleColumnFormat & {
    /**
     * A format string using Moment syntax: https://momentjs.com/docs/#/displaying/
     */
    dateFormat?: string;
    /**
     * A format string using Moment syntax: https://momentjs.com/docs/#/displaying/
     */
    timeFormat?: string;
};
/**
 * Format of a duration column.
 */
export declare type PublicApiDurationColumnFormat = PublicApiSimpleColumnFormat & {
    precision?: number;
    maxUnit?: {} & PublicApiDurationUnit;
};
/**
 * A time unit used as part of a duration value.
 */
export declare enum PublicApiDurationUnit {
    Days = "days",
    Hours = "hours",
    Minutes = "minutes",
    Seconds = "seconds"
}
/**
 * A number or a string representing a formula that evaluates to a number.
 */
export declare type PublicApiNumberOrNumberFormula = number | string;
/**
 * Format of a numeric column that renders as a slider.
 */
export declare type PublicApiSliderColumnFormat = PublicApiSimpleColumnFormat & {
    minimum?: {} & PublicApiNumberOrNumberFormula;
    maximum?: {} & PublicApiNumberOrNumberFormula;
    step?: {} & PublicApiNumberOrNumberFormula;
};
/**
 * List of available icon sets.
 */
export declare enum PublicApiIconSet {
    Star = "star",
    Circle = "circle",
    Fire = "fire",
    Bug = "bug",
    Diamond = "diamond",
    Bell = "bell",
    ThumbsUp = "thumbsup",
    Heart = "heart",
    Chili = "chili",
    Smiley = "smiley",
    Lightning = "lightning",
    Currency = "currency",
    Coffee = "coffee",
    Person = "person",
    Battery = "battery",
    Cocktail = "cocktail",
    Cloud = "cloud",
    Sun = "sun",
    Checkmark = "checkmark",
    LightBulb = "lightbulb"
}
/**
 * Format of a numeric column that renders as a scale, like star ratings.
 */
export declare type PublicApiScaleColumnFormat = PublicApiSimpleColumnFormat & {
    /**
     * The maximum number allowed for this scale.
     */
    maximum: number;
    icon: {} & PublicApiIconSet;
};
/**
 * Format of a column.
 */
export declare type PublicApiColumnFormat = PublicApiDateColumnFormat | PublicApiDateTimeColumnFormat | PublicApiDurationColumnFormat | PublicApiCurrencyColumnFormat | PublicApiNumericColumnFormat | PublicApiReferenceColumnFormat | PublicApiSimpleColumnFormat | PublicApiScaleColumnFormat | PublicApiSliderColumnFormat | PublicApiTimeColumnFormat;
/**
 * Format type of the column
 */
export declare enum PublicApiColumnFormatType {
    Text = "text",
    Person = "person",
    Lookup = "lookup",
    Number = "number",
    Percent = "percent",
    Currency = "currency",
    Date = "date",
    DateTime = "dateTime",
    Time = "time",
    Duration = "duration",
    Slider = "slider",
    Scale = "scale",
    Image = "image",
    Attachments = "attachments",
    Button = "button",
    Checkbox = "checkbox",
    Select = "select",
    PackObject = "packObject",
    Other = "other"
}
/**
 * List of columns.
 */
export interface PublicApiColumnList {
    items: PublicApiColumn[];
    /**
     * API link to these results
     */
    href?: string;
    nextPageToken?: PublicApiNextPageToken;
    nextPageLink?: PublicApiNextPageLink & string;
}
/**
 * Info about a row.
 */
export interface PublicApiRow {
    /**
     * ID of the row.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'row';
    /**
     * API link to the row.
     */
    href: string;
    /**
     * The display name of the row, based on its identifying column.
     */
    name: string;
    /**
     * Index of the row within the table.
     */
    index: number;
    /**
     * Browser-friendly link to the row.
     */
    browserLink: string;
    /**
     * Timestamp for when the row was created.
     */
    createdAt: string;
    /**
     * Timestamp for when the row was last modified.
     */
    updatedAt: string;
    /**
     * Values for a specific row, represented as a hash of column IDs (or names with `useColumnNames`) to values.
     *
     */
    values: {
        [k: string]: PublicApiCellValue;
    };
}
/**
 * Details about a row.
 */
export interface PublicApiRowDetail {
    /**
     * ID of the row.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'row';
    /**
     * API link to the row.
     */
    href: string;
    /**
     * The display name of the row, based on its identifying column.
     */
    name: string;
    /**
     * Index of the row within the table.
     */
    index: number;
    /**
     * Browser-friendly link to the row.
     */
    browserLink: string;
    /**
     * Timestamp for when the row was created.
     */
    createdAt: string;
    /**
     * Timestamp for when the row was last modified.
     */
    updatedAt: string;
    /**
     * Values for a specific row, represented as a hash of column IDs (or names with `useColumnNames`) to values.
     *
     */
    values: {
        [k: string]: PublicApiCellValue;
    };
    parent: PublicApiTableReference;
}
/**
 * List of rows.
 */
export interface PublicApiRowList {
    items: PublicApiRow[];
    /**
     * API link to these results
     */
    href?: string;
    nextPageToken?: PublicApiNextPageToken;
    nextPageLink?: PublicApiNextPageLink & string;
}
/**
 * A Coda result or entity expressed as a primitive type.
 */
export declare type PublicApiScalarValue = string | number | boolean;
/**
 * A Coda result or entity expressed as a primitive type, or array of primitive types.
 */
export declare type PublicApiValue = PublicApiScalarValue | (PublicApiScalarValue | PublicApiScalarValue[])[];
/**
 * A value that contains rich structured data. Cell values are composed of these values or arrays of these values.
 *
 */
export declare type PublicApiRichSingleValue = PublicApiScalarValue | PublicApiCurrencyValue | PublicApiImageUrlValue | PublicApiPersonValue | PublicApiUrlValue | PublicApiRowValue;
/**
 * A cell value that contains rich structured data.
 */
export declare type PublicApiRichValue = PublicApiRichSingleValue | (PublicApiRichSingleValue | PublicApiRichSingleValue[])[];
/**
 * A value representing a Coda row.
 */
export declare type PublicApiRowValue = PublicApiLinkedDataObject & {
    /**
     * The display name of the row, based on its identifying column.
     */
    name: string;
    /**
     * The url of the row.
     */
    url: string;
    /**
     * The ID of the table
     */
    tableId: string;
    /**
     * The ID of the table
     */
    rowId: string;
    /**
     * The url of the table.
     */
    tableUrl: string;
    /**
     * The type of this resource.
     */
    additionalType: 'row';
};
/**
 * Base type for a JSON-LD (Linked Data) object.
 */
export interface PublicApiLinkedDataObject {
    /**
     * A url describing the schema context for this object, typically "http://schema.org/".
     */
    '@context': string;
    '@type': PublicApiLinkedDataType;
    /**
     * An identifier of additional type info specific to Coda that may not be present in a schema.org taxonomy,
     *
     */
    additionalType?: string;
}
/**
 * A schema.org identifier for the object.
 */
export declare enum PublicApiLinkedDataType {
    ImageObject = "ImageObject",
    MonetaryAmount = "MonetaryAmount",
    Person = "Person",
    WebPage = "WebPage",
    StructuredValue = "StructuredValue"
}
/**
 * A named hyperlink to an arbitrary url.
 */
export declare type PublicApiUrlValue = PublicApiLinkedDataObject & {
    /**
     * The user-visible text of the hyperlink.
     */
    name?: string;
    /**
     * The url of the hyperlink.
     */
    url: string;
};
/**
 * A named url of an image along with metadata.
 */
export declare type PublicApiImageUrlValue = PublicApiLinkedDataObject & {
    /**
     * The name of the image.
     */
    name?: string;
    /**
     * The url of the image.
     */
    url?: string;
    /**
     * The height of the image in pixels.
     */
    height?: number;
    /**
     * The width of the image in pixels.
     */
    width?: number;
    status?: PublicApiImageStatus;
};
/**
 * The status values that an image object can have.
 */
export declare enum PublicApiImageStatus {
    Live = "live",
    Deleted = "deleted",
    Failed = "failed"
}
/**
 * A named reference to a person, where the person is identified by email address.
 */
export declare type PublicApiPersonValue = PublicApiLinkedDataObject & {
    /**
     * The full name of the person.
     */
    name: string;
    /**
     * The email address of the person.
     */
    email: string;
};
/**
 * A numeric monetary amount as a string or number.
 */
export declare type PublicApiCurrencyAmount = string | number;
/**
 * A monetary value with its associated currency code.
 */
export declare type PublicApiCurrencyValue = PublicApiLinkedDataObject & {
    /**
     * The 3-letter currency code.
     */
    currency: string;
    amount: PublicApiCurrencyAmount;
};
/**
 * All values that a row cell can contain.
 */
export declare type PublicApiCellValue = PublicApiValue | PublicApiRichValue;
/**
 * An edit made to a particular cell in a row.
 */
export interface PublicApiCellEdit {
    /**
     * Column ID, URL, or name (fragile and discouraged) associated with this edit.
     */
    column: string;
    value: PublicApiValue;
}
/**
 * The result of a push button.
 */
export declare type PublicApiPushButtonResult = PublicApiDocumentMutateResponse & {
    /**
     * ID of the row where the button exists.
     */
    rowId: string;
    /**
     * ID of the column where the button exists.
     */
    columnId: string;
};
/**
 * An edit made to a particular row.
 */
export interface PublicApiRowEdit {
    cells: PublicApiCellEdit[];
}
/**
 * Payload for updating a row in a table.
 */
export interface PublicApiRowUpdate {
    row: PublicApiRowEdit;
}
/**
 * The result of a row update.
 */
export declare type PublicApiRowUpdateResult = PublicApiDocumentMutateResponse & {
    /**
     * ID of the updated row.
     */
    id: string;
};
/**
 * Payload for deleting rows from a table.
 */
export interface PublicApiRowsDelete {
    /**
     * Row IDs to delete.
     *
     */
    rowIds: string[];
}
/**
 * The result of a rows delete operation.
 */
export declare type PublicApiRowsDeleteResult = PublicApiDocumentMutateResponse & {
    /**
     * Row IDs to delete.
     */
    rowIds: string[];
};
/**
 * Payload for upserting rows in a table.
 */
export interface PublicApiRowsUpsert {
    rows: PublicApiRowEdit[];
    /**
     * Optional column IDs, URLs, or names (fragile and discouraged), specifying columns to be used as upsert keys.
     *
     */
    keyColumns?: string[];
}
/**
 * The result of a rows insert/upsert operation.
 */
export declare type PublicApiRowsUpsertResult = PublicApiDocumentMutateResponse;
/**
 * The result of a row deletion.
 */
export declare type PublicApiRowDeleteResult = PublicApiDocumentMutateResponse & {
    /**
     * ID of the row to be deleted.
     */
    id: string;
};
/**
 * Determines how the rows returned are sorted
 */
export declare enum PublicApiRowsSortBy {
    CreatedAt = "createdAt",
    Natural = "natural"
}
/**
 * The format that cell values are returned as.
 */
export declare enum PublicApiValueFormat {
    Simple = "simple",
    SimpleWithArrays = "simpleWithArrays",
    Rich = "rich"
}
/**
 * Reference to a formula.
 */
export interface PublicApiFormulaReference {
    /**
     * ID of the formula.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'formula';
    /**
     * API link to the formula.
     */
    href: string;
    /**
     * Name of the formula.
     */
    name: string;
    parent?: PublicApiPageReference;
}
/**
 * Details about a formula.
 */
export interface PublicApiFormula {
    /**
     * ID of the formula.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'formula';
    /**
     * API link to the formula.
     */
    href: string;
    /**
     * Name of the formula.
     */
    name: string;
    parent?: PublicApiPageReference;
    value: PublicApiValue;
}
/**
 * List of formulas.
 */
export interface PublicApiFormulaList {
    items: PublicApiFormulaReference[];
    /**
     * API link to these results
     */
    href?: string;
    nextPageToken?: PublicApiNextPageToken;
    nextPageLink?: PublicApiNextPageLink & string;
}
/**
 * Reference to a control.
 */
export interface PublicApiControlReference {
    /**
     * ID of the control.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'control';
    /**
     * API link to the control.
     */
    href: string;
    /**
     * Name of the control.
     */
    name: string;
    parent?: PublicApiPageReference;
}
/**
 * Details about a control.
 */
export interface PublicApiControl {
    /**
     * ID of the control.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'control';
    /**
     * API link to the control.
     */
    href: string;
    /**
     * Name of the control.
     */
    name: string;
    parent?: PublicApiPageReference;
    controlType: PublicApiControlType;
    value: PublicApiValue;
}
/**
 * List of controls.
 */
export interface PublicApiControlList {
    items: PublicApiControlReference[];
    /**
     * API link to these results
     */
    href?: string;
    nextPageToken?: PublicApiNextPageToken;
    nextPageLink?: PublicApiNextPageLink & string;
}
/**
 * Type of the control.
 */
export declare enum PublicApiControlType {
    Button = "button",
    Checkbox = "checkbox",
    DatePicker = "datePicker",
    DateRangePicker = "dateRangePicker",
    Lookup = "lookup",
    Multiselect = "multiselect",
    Select = "select",
    Scale = "scale",
    Slider = "slider"
}
/**
 * Info about the user.
 */
export interface PublicApiUser {
    /**
     * Name of the user.
     */
    name: string;
    /**
     * Email address of the user.
     */
    loginId: string;
    /**
     * The type of this resource.
     */
    type: 'user';
    /**
     * True if the token used to make this request has restricted/scoped access to the API.
     */
    scoped: boolean;
    /**
     * Returns the name of the token used for this request.
     */
    tokenName: string;
    /**
     * API link to the user.
     */
    href: string;
    /**
     * Browser-friendly link to the user's avatar image.
     */
    pictureLink?: string;
    workspace: PublicApiWorkspaceReference;
}
/**
 * If specified, an opaque token used to fetch the next page of results.
 */
export declare type PublicApiNextPageToken = string;
/**
 * If specified, a link that can be used to fetch the next page of results.
 */
export declare type PublicApiNextPageLink = string;
/**
 * Info about a resolved link to an API resource.
 */
export interface PublicApiApiLink {
    /**
     * The type of this resource.
     */
    type: 'apiLink';
    /**
     * Self link to this query.
     */
    href: string;
    /**
     * Canonical browser-friendly link to the resolved resource.
     */
    browserLink?: string;
    resource: PublicApiApiLinkResolvedResource;
}
/**
 * Reference to the resolved resource.
 */
export interface PublicApiApiLinkResolvedResource {
    type: PublicApiType;
    /**
     * ID of the resolved resource.
     */
    id: string;
    /**
     * Name of the resource.
     */
    name?: string;
    /**
     * API link to the resolved resource that can be queried to get further information.
     */
    href: string;
}
/**
 * Info about the icon.
 */
export interface PublicApiIcon {
    /**
     * Name of the icon.
     */
    name: string;
    /**
     * MIME type of the icon
     */
    type: string;
    /**
     * Browser-friendly link to an icon.
     */
    browserLink: string;
}
/**
 * Info about the image.
 */
export interface PublicApiImage {
    /**
     * Browser-friendly link to an image.
     */
    browserLink: string;
    /**
     * MIME type of the image.
     */
    type?: string;
    /**
     * The width in pixels of the image.
     */
    width?: number;
    /**
     * The height in pixels of the image.
     */
    height?: number;
}
/**
 * Determines how the objects returned are sorted
 */
export declare enum PublicApiSortBy {
    Name = "name"
}
export declare enum PublicApiTableType {
    Table = "table",
    View = "view"
}
/**
 * Detailed information about a formula.
 */
export interface PublicApiFormulaDetail {
    /**
     * Returns whether or not the given formula is valid.
     */
    valid: boolean;
    /**
     * Returns whether or not the given formula can return different results in different contexts (for example, for different users).
     *
     */
    isVolatile?: boolean;
    /**
     * Returns whether or not the given formula has a User() formula within it.
     */
    hasUserFormula?: boolean;
    /**
     * Returns whether or not the given formula has a Today() formula within it.
     */
    hasTodayFormula?: boolean;
    /**
     * Returns whether or not the given formula has a Now() formula within it.
     */
    hasNowFormula?: boolean;
}
/**
 * The status of an asynchronous mutation.
 */
export interface PublicApiMutationStatus {
    /**
     * Returns whether the mutation has completed.
     */
    completed: boolean;
}
/**
 * Reference to a Coda workspace.
 */
export interface PublicApiWorkspaceReference {
    /**
     * ID of the Coda workspace.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'workspace';
    /**
     * Browser-friendly link to the Coda workspace.
     */
    browserLink: string;
}
/**
 * Metadata about a Coda workspace.
 */
export interface PublicApiWorkspace {
    /**
     * ID of the Coda workspace.
     */
    id: string;
    /**
     * The type of this resource.
     */
    type: 'workspace';
    /**
     * Browser-friendly link to the Coda workspace.
     */
    browserLink: string;
    /**
     * Name of the workspace.
     */
    name: string;
    /**
     * Description of the workspace.
     */
    description?: string;
}
/**
 * Metadata of a workspace user.
 */
export interface PublicApiWorkspaceUser {
    /**
     * Email of the user.
     */
    email: string;
    /**
     * Name of the user.
     */
    name: string;
    role: PublicApiWorkspaceUserRole;
    /**
     * Picture url of the user.
     */
    pictureUrl?: string;
    /**
     * Timestamp for when the user registered in this workspace
     */
    registeredAt: string;
    /**
     * Timestamp for when the user's role last changed in this workspace.
     */
    roleChangedAt: string;
    /**
     * Timestamp for when the user last took an action in this workspace.
     */
    lastActiveAt?: string;
    /**
     * Timestamp for when someone last loaded a doc that the user owns in this workspace.
     */
    docsLastActiveAt?: string;
    /**
     * List of IDs of docs owned by the user.
     */
    ownedDocIds?: string[];
    /**
     * Number of collaborators that have interacted with docs owned by the user.
     */
    docCollaboratorCount?: number;
}
export declare enum PublicApiWorkspaceUserRole {
    Admin = "Admin",
    DocMaker = "DocMaker",
    Editor = "Editor"
}
/**
 * Metadata for workspace role activity.
 */
export interface PublicApiWorkspaceRoleActivity {
    /**
     * Month corresponding to the data.
     */
    month: string;
    /**
     * Number of active Admins.
     */
    activeAdminCount: number;
    /**
     * Number of active Doc Makers.
     */
    activeDocMakerCount: number;
    /**
     * Number of active Editors.
     */
    activeEditorCount: number;
    /**
     * Number of inactive Admins.
     */
    inactiveAdminCount: number;
    /**
     * Number of inactive Doc Makers.
     */
    inactiveDocMakerCount: number;
    /**
     * Number of inactive Editor users.
     */
    inactiveEditorCount: number;
}
/**
 * Response for listing workspace users.
 */
export interface PublicApiWorkspaceMembersList {
    items: PublicApiWorkspaceUser[];
    nextPageToken?: PublicApiNextPageToken;
    nextPageLink?: PublicApiNextPageLink & string;
}
/**
 * Response for getting workspace role activity.
 */
export interface PublicApiGetWorkspaceRoleActivity {
    items: PublicApiWorkspaceRoleActivity[];
}
/**
 * Parameters for changing a workspace user role.
 */
export interface PublicApiChangeRole {
    /**
     * Email of the user.
     */
    email: string;
    newRole: PublicApiWorkspaceUserRole;
}
/**
 * The result of changing a user's workspace user role.
 */
export interface PublicApiChangeRoleResult {
    /**
     * Timestamp for when the user's role last changed in this workspace.
     */
    roleChangedAt: string;
}
/**
 * Analytics data for a Coda doc.
 */
export interface PublicApiDocAnalyticsItem {
    doc: PublicApiDocReference & {
        /**
         * Title of the doc.
         */
        title: string;
    };
    /**
     * Date of the analytics data.
     */
    date: string;
    /**
     * Number of times the doc was viewed.
     */
    views: number;
    /**
     * Number of times the doc was copied.
     */
    copies: number;
    /**
     * Number of times the doc was liked.
     */
    likes: number;
    /**
     * Number of unique visitors to this doc from a mobile device.
     */
    sessionsMobile: number;
    /**
     * Number of unique visitors to this doc from a desktop device.
     */
    sessionsDesktop: number;
    /**
     * Number of unique visitors to this doc from an unknown device type.
     */
    sessionsOther: number;
}
/**
 * List of analytics for Coda docs over a date range.
 */
export interface PublicApiDocAnalyticsCollection {
    items: PublicApiDocAnalyticsItem[];
    nextPageToken?: PublicApiNextPageToken;
    nextPageLink?: PublicApiNextPageLink & string;
}
/**
 * Info about a pack that was just created.
 */
export interface PublicApiCreatePackResponse {
    /**
     * The id assigned to the newly-created pack.
     */
    packId: number;
}
/**
 * Information indicating where to upload the pack version definition.
 */
export interface PublicApiPackVersionUploadInfo {
    /**
     * A signed url to be used for uploading a pack version definition.
     */
    uploadUrl: string;
}
/**
 * Confirmation of successful pack version creation.
 */
export interface PublicApiCreatePackVersionResponse {
}
/**
 * An error when trying to create a new pack version.
 */
export declare type PublicApiCreatePackVersionError = PublicApiInvalidMetadataError | PublicApiInvalidSemanticVersionError;
/**
 * An error indicating that the pack version contained unparseable or invalid metadata.
 */
export interface PublicApiInvalidMetadataError {
}
/**
 * An error indicating that the new semantic version is incompatible with the changes in the new pack definition.
 */
export interface PublicApiInvalidSemanticVersionError {
}
