/**
 * This file is auto-generated from OpenAPI definitions by `make build-openapi`. Do not edit manually.
 */

/* eslint-disable */

export const OpenApiSpecHash = '3cb65a92b168c432b6eb8cad28cd0cc16911c3536d86f2d256c7ddb6007de8ad';

export const OpenApiSpecVersion = '1.2.5';

/**
 * A constant identifying the type of the resource.
 */
export enum PublicApiType {
  AclMetadata = 'aclMetadata',
  AclPermissions = 'aclPermissions',
  ApiLink = 'apiLink',
  Automation = 'automation',
  Column = 'column',
  Control = 'control',
  Doc = 'doc',
  DocAnalytics = 'docAnalytics',
  DocAnalyticsSummary = 'docAnalyticsSummary',
  DocAnalyticsV2 = 'docAnalyticsV2',
  Folder = 'folder',
  Formula = 'formula',
  MutationStatus = 'mutationStatus',
  Pack = 'pack',
  PackAclPermissions = 'packAclPermissions',
  PackAnalytics = 'packAnalytics',
  PackAnalyticsSummary = 'packAnalyticsSummary',
  PackAsset = 'packAsset',
  PackCategory = 'packCategory',
  PackFormulaAnalytics = 'packFormulaAnalytics',
  PackLog = 'packLog',
  PackMaker = 'packMaker',
  PackOauthConfig = 'packOauthConfig',
  PackRelease = 'packRelease',
  PackSourceCode = 'packSourceCode',
  PackSystemConnection = 'packSystemConnection',
  PackVersion = 'packVersion',
  Page = 'page',
  Row = 'row',
  Table = 'table',
  User = 'user',
  Workspace = 'workspace',
}

/**
 * Type of principal.
 */
export enum PublicApiPrincipalType {
  Email = 'email',
  Domain = 'domain',
  Anyone = 'anyone',
}

/**
 * Metadata about a principal.
 */
export type PublicApiPrincipal = PublicApiEmailPrincipal | PublicApiDomainPrincipal | PublicApiAnyonePrincipal;

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
export enum PublicApiAccessType {
  ReadOnly = 'readonly',
  Write = 'write',
  Comment = 'comment',
  None = 'none',
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
export interface PublicApiAddPermissionRequest {
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
  /**
   * When true, the user of the api can copy the doc
   */
  canCopy: boolean;
}

/**
 * The result of sharing a doc.
 */
export interface PublicApiAddPermissionResult {}

/**
 * The result of deleting a permission.
 */
export interface PublicApiDeletePermissionResult {}

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
  type: PublicApiType.Doc;
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
  type: PublicApiType.Doc;
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
  folder: PublicApiFolderReference;
  workspace: PublicApiWorkspaceReference;
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
   * The ID of the folder within which to create this doc. Defaults to your "My docs" folder in the oldest workspace you joined; this is subject to change. You can get this ID by opening the folder in the docs list on your computer and grabbing the `folderId` query parameter.
   *
   */
  folderId?: string;
}

/**
 * The result of a doc deletion.
 */
export interface PublicApiDocDelete {}

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
export enum PublicApiDocPublishMode {
  View = 'view',
  Play = 'play',
  Edit = 'edit',
}

/**
 * The result of publishing a doc.
 */
export type PublicApiPublishResult = PublicApiDocumentMutateResponse & {};

/**
 * The result of unpublishing a doc.
 */
export interface PublicApiUnpublishResult {}

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
  type: PublicApiType.Doc;
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
  folder: PublicApiFolderReference;
  workspace: PublicApiWorkspaceReference;
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
  type: PublicApiType.Page;
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
  type: PublicApiType.Page;
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
export type PublicApiPageUpdateResult = PublicApiDocumentMutateResponse & {
  /**
   * ID of the updated page.
   */
  id: string;
};

/**
 * Layout type of the table or view.
 */
export enum PublicApiLayout {
  Default = 'default',
  AreaChart = 'areaChart',
  BarChart = 'barChart',
  BubbleChart = 'bubbleChart',
  Calendar = 'calendar',
  Card = 'card',
  Detail = 'detail',
  Form = 'form',
  GanttChart = 'ganttChart',
  LineChart = 'lineChart',
  MasterDetail = 'masterDetail',
  PieChart = 'pieChart',
  ScatterChart = 'scatterChart',
  Slide = 'slide',
  WordCloud = 'wordCloud',
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
export enum PublicApiSortDirection {
  Ascending = 'ascending',
  Descending = 'descending',
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
 * Detail about why a particular field failed request validation.
 */
export interface PublicApiValidationError {
  /**
   * A path indicating the affected field, in OGNL notation.
   */
  path: string;
  /**
   * An error message.
   */
  message: string;
}

/**
 * A response that represents a count
 */
export interface PublicApiCountResponse {
  /**
   * The count of an item.
   */
  count: number;
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
  type: PublicApiType.Table;
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
  type: PublicApiType.Table;
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
  type: PublicApiType.Column;
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
  type: PublicApiType.Column;
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
  /**
   * Formula on the column.
   */
  formula?: string;
  /**
   * Default value formula for the column.
   */
  defaultValue?: string;
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
  type: PublicApiType.Column;
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
  /**
   * Formula on the column.
   */
  formula?: string;
  /**
   * Default value formula for the column.
   */
  defaultValue?: string;
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
export type PublicApiReferenceColumnFormat = PublicApiSimpleColumnFormat & {
  table: {} & PublicApiTableReference;
};

/**
 * Format of a numeric column.
 */
export type PublicApiNumericColumnFormat = PublicApiSimpleColumnFormat & {
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
export type PublicApiCurrencyColumnFormat = PublicApiSimpleColumnFormat & {
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
export enum PublicApiCurrencyFormatType {
  Currency = 'currency',
  Accounting = 'accounting',
  Financial = 'financial',
}

/**
 * Format of a date column.
 */
export type PublicApiDateColumnFormat = PublicApiSimpleColumnFormat & {
  /**
   * A format string using Moment syntax: https://momentjs.com/docs/#/displaying/
   */
  format?: string;
};

/**
 * Format of an email column.
 */
export type PublicApiEmailColumnFormat = PublicApiSimpleColumnFormat & {
  display?: PublicApiEmailDisplayType;
  autocomplete?: boolean;
};

/**
 * How an email address should be displayed in the user interface.
 */
export enum PublicApiEmailDisplayType {
  IconAndEmail = 'iconAndEmail',
  IconOnly = 'iconOnly',
  EmailOnly = 'emailOnly',
}

/**
 * Format of a link column.
 */
export type PublicApiLinkColumnFormat = PublicApiSimpleColumnFormat & {
  display?: PublicApiLinkDisplayType;
  /**
   * Force embeds to render on the client instead of the server (for sites that require user login).
   */
  force?: boolean;
};

/**
 * How a link should be displayed in the user interface.
 */
export enum PublicApiLinkDisplayType {
  IconOnly = 'iconOnly',
  Url = 'url',
  Title = 'title',
  Card = 'card',
  Embed = 'embed',
}

/**
 * Format of a time column.
 */
export type PublicApiTimeColumnFormat = PublicApiSimpleColumnFormat & {
  /**
   * A format string using Moment syntax: https://momentjs.com/docs/#/displaying/
   */
  format?: string;
};

/**
 * Format of a date column.
 */
export type PublicApiDateTimeColumnFormat = PublicApiSimpleColumnFormat & {
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
export type PublicApiDurationColumnFormat = PublicApiSimpleColumnFormat & {
  precision?: number;
  maxUnit?: {} & PublicApiDurationUnit;
};

/**
 * A time unit used as part of a duration value.
 */
export enum PublicApiDurationUnit {
  Days = 'days',
  Hours = 'hours',
  Minutes = 'minutes',
  Seconds = 'seconds',
}

/**
 * A number or a string representing a formula that evaluates to a number.
 */
export type PublicApiNumberOrNumberFormula = number | string;

/**
 * Format of a numeric column that renders as a slider.
 */
export type PublicApiSliderColumnFormat = PublicApiSimpleColumnFormat & {
  minimum?: {} & PublicApiNumberOrNumberFormula;
  maximum?: {} & PublicApiNumberOrNumberFormula;
  step?: {} & PublicApiNumberOrNumberFormula;
};

/**
 * Format of a button column.
 */
export type PublicApiButtonColumnFormat = PublicApiSimpleColumnFormat & {
  /**
   * Label formula for the button.
   */
  label?: string;
  /**
   * DisableIf formula for the button.
   */
  disableIf?: string;
  /**
   * Action formula for the button.
   */
  action?: string;
};

/**
 * List of available icon sets.
 */
export enum PublicApiIconSet {
  Star = 'star',
  Circle = 'circle',
  Fire = 'fire',
  Bug = 'bug',
  Diamond = 'diamond',
  Bell = 'bell',
  ThumbsUp = 'thumbsup',
  Heart = 'heart',
  Chili = 'chili',
  Smiley = 'smiley',
  Lightning = 'lightning',
  Currency = 'currency',
  Coffee = 'coffee',
  Person = 'person',
  Battery = 'battery',
  Cocktail = 'cocktail',
  Cloud = 'cloud',
  Sun = 'sun',
  Checkmark = 'checkmark',
  LightBulb = 'lightbulb',
}

/**
 * Format of a numeric column that renders as a scale, like star ratings.
 */
export type PublicApiScaleColumnFormat = PublicApiSimpleColumnFormat & {
  /**
   * The maximum number allowed for this scale.
   */
  maximum: number;
  icon: {} & PublicApiIconSet;
};

/**
 * Format of a column.
 */
export type PublicApiColumnFormat =
  | PublicApiButtonColumnFormat
  | PublicApiDateColumnFormat
  | PublicApiDateTimeColumnFormat
  | PublicApiDurationColumnFormat
  | PublicApiEmailColumnFormat
  | PublicApiLinkColumnFormat
  | PublicApiCurrencyColumnFormat
  | PublicApiNumericColumnFormat
  | PublicApiReferenceColumnFormat
  | PublicApiSimpleColumnFormat
  | PublicApiScaleColumnFormat
  | PublicApiSliderColumnFormat
  | PublicApiTimeColumnFormat;

/**
 * Format type of the column
 */
export enum PublicApiColumnFormatType {
  Text = 'text',
  Person = 'person',
  Lookup = 'lookup',
  Number = 'number',
  Percent = 'percent',
  Currency = 'currency',
  Date = 'date',
  DateTime = 'dateTime',
  Time = 'time',
  Duration = 'duration',
  Email = 'email',
  Link = 'link',
  Slider = 'slider',
  Scale = 'scale',
  Image = 'image',
  Attachments = 'attachments',
  Button = 'button',
  Checkbox = 'checkbox',
  Select = 'select',
  PackObject = 'packObject',
  Reaction = 'reaction',
  Canvas = 'canvas',
  Other = 'other',
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
  type: PublicApiType.Row;
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
  type: PublicApiType.Row;
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
  nextSyncToken?: PublicApiNextSyncToken;
}

/**
 * A Coda result or entity expressed as a primitive type.
 */
export type PublicApiScalarValue = string | number | boolean;

/**
 * A Coda result or entity expressed as a primitive type, or array of primitive types.
 */
export type PublicApiValue = PublicApiScalarValue | (PublicApiScalarValue | PublicApiScalarValue[])[];

/**
 * A value that contains rich structured data. Cell values are composed of these values or arrays of these values.
 *
 */
export type PublicApiRichSingleValue =
  | PublicApiScalarValue
  | PublicApiCurrencyValue
  | PublicApiImageUrlValue
  | PublicApiPersonValue
  | PublicApiUrlValue
  | PublicApiRowValue;

/**
 * A cell value that contains rich structured data.
 */
export type PublicApiRichValue = PublicApiRichSingleValue | (PublicApiRichSingleValue | PublicApiRichSingleValue[])[];

/**
 * A value representing a Coda row.
 */
export type PublicApiRowValue = PublicApiLinkedDataObject & {
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
export enum PublicApiLinkedDataType {
  ImageObject = 'ImageObject',
  MonetaryAmount = 'MonetaryAmount',
  Person = 'Person',
  WebPage = 'WebPage',
  StructuredValue = 'StructuredValue',
}

/**
 * A named hyperlink to an arbitrary url.
 */
export type PublicApiUrlValue = PublicApiLinkedDataObject & {
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
export type PublicApiImageUrlValue = PublicApiLinkedDataObject & {
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
export enum PublicApiImageStatus {
  Live = 'live',
  Deleted = 'deleted',
  Failed = 'failed',
}

/**
 * A named reference to a person, where the person is identified by email address.
 */
export type PublicApiPersonValue = PublicApiLinkedDataObject & {
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
export type PublicApiCurrencyAmount = string | number;

/**
 * A monetary value with its associated currency code.
 */
export type PublicApiCurrencyValue = PublicApiLinkedDataObject & {
  /**
   * The 3-letter currency code.
   */
  currency: string;
  amount: PublicApiCurrencyAmount;
};

/**
 * All values that a row cell can contain.
 */
export type PublicApiCellValue = PublicApiValue | PublicApiRichValue;

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
export type PublicApiPushButtonResult = PublicApiDocumentMutateResponse & {
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
export type PublicApiRowUpdateResult = PublicApiDocumentMutateResponse & {
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
export type PublicApiRowsDeleteResult = PublicApiDocumentMutateResponse & {
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
   * Optional unique row IDs to make the request idempotent. Must match the row id format.
   */
  rowIds?: string[];
  /**
   * Optional column IDs, URLs, or names (fragile and discouraged), specifying columns to be used as upsert keys.
   */
  keyColumns?: string[];
}

/**
 * The result of a rows insert/upsert operation.
 */
export type PublicApiRowsUpsertResult = PublicApiDocumentMutateResponse & {
  /**
   * Row IDs for rows that will be added. Only applicable when keyColumns is not set or empty.
   */
  addedRowIds?: string[];
};

/**
 * The result of a row deletion.
 */
export type PublicApiRowDeleteResult = PublicApiDocumentMutateResponse & {
  /**
   * ID of the row to be deleted.
   */
  id: string;
};

/**
 * Determines how the rows returned are sorted
 */
export enum PublicApiRowsSortBy {
  CreatedAt = 'createdAt',
  Natural = 'natural',
  UpdatedAt = 'updatedAt',
}

/**
 * The format that cell values are returned as.
 */
export enum PublicApiValueFormat {
  Simple = 'simple',
  SimpleWithArrays = 'simpleWithArrays',
  Rich = 'rich',
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
  type: PublicApiType.Formula;
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
  type: PublicApiType.Formula;
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
  type: PublicApiType.Control;
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
  type: PublicApiType.Control;
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
export enum PublicApiControlType {
  Button = 'button',
  Checkbox = 'checkbox',
  DatePicker = 'datePicker',
  DateRangePicker = 'dateRangePicker',
  Lookup = 'lookup',
  Multiselect = 'multiselect',
  Select = 'select',
  Scale = 'scale',
  Slider = 'slider',
  Reaction = 'reaction',
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
  type: PublicApiType.User;
  /**
   * Browser-friendly link to the user's avatar image.
   */
  pictureLink?: string;
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
  workspace: PublicApiWorkspaceReference;
}

/**
 * Summary about the user.
 */
export interface PublicApiUserSummary {
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
  type: PublicApiType.User;
  /**
   * Browser-friendly link to the user's avatar image.
   */
  pictureLink?: string;
}

/**
 * If specified, an opaque token used to fetch the next page of results.
 */
export type PublicApiNextPageToken = string;

/**
 * If specified, a link that can be used to fetch the next page of results.
 */
export type PublicApiNextPageLink = string;

/**
 * If specified, an opaque token that can be passed back later to retrieve new results that match the parameters specified when the sync token was created.
 *
 */
export type PublicApiNextSyncToken = string;

/**
 * Info about a publishing category
 */
export interface PublicApiPublishingCategory {
  /**
   * The ID for this category.
   */
  categoryId: string;
  /**
   * The name of the category.
   */
  categoryName: string;
  /**
   * The URL identifier of the category.
   */
  categorySlug?: string;
}

/**
 * Info about the maker
 */
export interface PublicApiMaker {
  /**
   * Name of the maker.
   */
  name: string;
  /**
   * Browser-friendly link to the maker's avatar image.
   */
  pictureLink?: string;
  /**
   * Maker profile identifier for the maker.
   */
  slug?: string;
  /**
   * Job title for maker.
   */
  jobTitle?: string;
  /**
   * Employer for maker.
   */
  employer?: string;
  /**
   * Description for the maker.
   */
  description?: string;
  /**
   * Email address of the user.
   */
  loginId: string;
}

/**
 * Summary about a maker
 */
export interface PublicApiMakerSummary {
  /**
   * Name of the maker.
   */
  name: string;
  /**
   * Browser-friendly link to the maker's avatar image.
   */
  pictureLink?: string;
  /**
   * Maker profile identifier for the maker.
   */
  slug?: string;
  /**
   * Job title for maker.
   */
  jobTitle?: string;
  /**
   * Employer for maker.
   */
  employer?: string;
  /**
   * Description for the maker.
   */
  description?: string;
}

/**
 * Info about a resolved link to an API resource.
 */
export interface PublicApiApiLink {
  /**
   * The type of this resource.
   */
  type: PublicApiType.ApiLink;
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
export enum PublicApiSortBy {
  Name = 'name',
}

export enum PublicApiTableType {
  Table = 'table',
  View = 'view',
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
 * Payload for webhook trigger
 */
export interface PublicApiWebhookTriggerPayload {
  [k: string]: unknown;
}

/**
 * The result of triggering a webhook
 */
export type PublicApiWebhookTriggerResult = PublicApiDocumentMutateResponse & {};

/**
 * Reference to a Coda folder.
 */
export interface PublicApiFolderReference {
  /**
   * ID of the Coda folder.
   */
  id: string;
  /**
   * The type of this resource.
   */
  type: PublicApiType.Folder;
  /**
   * Browser-friendly link to the folder.
   */
  browserLink: string;
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
  type: PublicApiType.Workspace;
  /**
   * ID of the organization bound to this workspace, if any.
   */
  organizationId?: string;
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
  type: PublicApiType.Workspace;
  /**
   * ID of the organization bound to this workspace, if any.
   */
  organizationId?: string;
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

export enum PublicApiWorkspaceUserRole {
  Admin = 'Admin',
  DocMaker = 'DocMaker',
  Editor = 'Editor',
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
 * List of analytics for Coda docs over a date range.
 */
export interface PublicApiDeprecatedDocAnalyticsCollection {
  items: PublicApiDeprecatedDocAnalyticsItem[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

/**
 * Analytics data for a Coda doc.
 */
export interface PublicApiDeprecatedDocAnalyticsItem {
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
 * Analytics data for a Coda doc.
 */
export interface PublicApiDocAnalyticsItem {
  doc: PublicApiDocAnalyticsDetails;
  metrics: PublicApiDocAnalyticsMetrics[];
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
 * Analytics metrics for a Coda Doc.
 */
export interface PublicApiDocAnalyticsMetrics {
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

export type PublicApiDocAnalyticsDetails = PublicApiDocReference & {
  /**
   * The name of the doc.
   */
  title: string;
  icon?: PublicApiIcon;
  /**
   * Publish time for this doc.
   */
  publishTimestamp: number;
};

/**
 * Summarized metrics for Coda docs.
 */
export interface PublicApiDocAnalyticsSummary {
  /**
   * Total number of sessions across all docs.
   */
  totalSessions: number;
}

/**
 * Metadata about a Pack relevant to analytics.
 */
export interface PublicApiPackAnalyticsDetails {
  /**
   * ID of the Pack.
   */
  id: number;
  /**
   * The name of the Pack.
   */
  name: string;
  /**
   * The link to the logo of the Pack.
   */
  logoUrl?: string;
  /**
   * Creation time of the Pack.
   */
  createdAt: string;
}

/**
 * List of analytics for Coda Packs over a date range.
 */
export interface PublicApiPackAnalyticsCollection {
  items: PublicApiPackAnalyticsItem[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

/**
 * Analytics data for a Coda Pack.
 */
export interface PublicApiPackAnalyticsItem {
  pack: PublicApiPackAnalyticsDetails;
  metrics: PublicApiPackAnalyticsMetrics[];
}

/**
 * Analytics metrics for a Coda Pack.
 */
export interface PublicApiPackAnalyticsMetrics {
  /**
   * Date of the analytics data.
   */
  date: string;
  /**
   * Number of unique documents that have installed this Pack.
   */
  docInstalls: number;
  /**
   * Number of unique workspaces that have installed this Pack.
   */
  workspaceInstalls: number;
  /**
   * Number of times regular formulas have been called.
   */
  numFormulaInvocations: number;
  /**
   * Number of times action formulas have been called.
   */
  numActionInvocations: number;
  /**
   * Number of times sync table formulas have been called.
   */
  numSyncInvocations: number;
  /**
   * Number of times metadata formulas have been called.
   */
  numMetadataInvocations: number;
  /**
   * Number of unique docs that have invoked a formula from this Pack in the past day.
   */
  docsActivelyUsing: number;
  /**
   * Number of unique docs that have invoked a formula from this Pack in the past 7 days.
   */
  docsActivelyUsing7Day: number;
  /**
   * Number of unique docs that have invoked a formula from this Pack in the past 30 days.
   */
  docsActivelyUsing30Day: number;
  /**
   * Number of unique docs that have invoked a formula from this Pack in the past 90 days.
   */
  docsActivelyUsing90Day: number;
  /**
   * Number of unique docs that have invoked a formula from this Pack ever.
   */
  docsActivelyUsingAllTime: number;
  /**
   * Number of unique workspaces that have invoked a formula from this Pack in the past day.
   */
  workspacesActivelyUsing: number;
  /**
   * Number of unique workspaces that have invoked a formula from this Pack in the past 7 days.
   */
  workspacesActivelyUsing7Day: number;
  /**
   * Number of unique workspaces that have invoked a formula from this Pack in the past 30 days.
   */
  workspacesActivelyUsing30Day: number;
  /**
   * Number of unique workspaces that have invoked a formula from this Pack in the past 90 days.
   */
  workspacesActivelyUsing90Day: number;
  /**
   * Number of unique workspaces that have invoked a formula from this Pack ever.
   */
  workspacesActivelyUsingAllTime: number;
}

/**
 * Determines how the Pack analytics returned are sorted.
 */
export enum PublicApiPackAnalyticsOrderBy {
  AnalyticsDate = 'date',
  PackId = 'packId',
  Name = 'name',
  CreatedAt = 'createdAt',
  DocInstalls = 'docInstalls',
  WorkspaceInstalls = 'workspaceInstalls',
  NumFormulaInvocations = 'numFormulaInvocations',
  NumActionInvocations = 'numActionInvocations',
  NumSyncInvocations = 'numSyncInvocations',
  NumMetadataInvocations = 'numMetadataInvocations',
  DocsActivelyUsing = 'docsActivelyUsing',
  DocsActivelyUsing7Day = 'docsActivelyUsing7Day',
  DocsActivelyUsing30Day = 'docsActivelyUsing30Day',
  DocsActivelyUsing90Day = 'docsActivelyUsing90Day',
  DocsActivelyUsingAllTime = 'docsActivelyUsingAllTime',
  WorkspacesActivelyUsing = 'workspacesActivelyUsing',
  WorkspacesActivelyUsing7Day = 'workspacesActivelyUsing7Day',
  WorkspacesActivelyUsing30Day = 'workspacesActivelyUsing30Day',
  WorkspacesActivelyUsing90Day = 'workspacesActivelyUsing90Day',
  WorkspacesActivelyUsingAllTime = 'workspacesActivelyUsingAllTime',
}

/**
 * Summary analytics for Packs.
 */
export interface PublicApiPackAnalyticsSummary {
  /**
   * The times this Pack was installed in docs.
   */
  totalDocInstalls: number;
  /**
   * The times this Pack was installed in workspaces.
   */
  totalWorkspaceInstalls: number;
  /**
   * The number of times formulas in this Pack were invoked.
   */
  totalInvocations: number;
}

/**
 * Quantization period over which to view analytics.
 */
export enum PublicApiAnalyticsScale {
  Daily = 'daily',
  Cumulative = 'cumulative',
}

/**
 * Analytics metrics for a Coda Pack formula.
 */
export interface PublicApiPackFormulaAnalyticsMetrics {
  /**
   * Date of the analytics data.
   */
  date: string;
  /**
   * Number of times this formula has been invoked.
   */
  formulaInvocations: number;
  /**
   * Number of errors from invocations.
   */
  errors: number;
  /**
   * Median latency of an invocation in milliseconds. Only present for daily metrics.
   */
  medianLatencyMs?: number;
  /**
   * Median response size in bytes. Only present for daily metrics.
   */
  medianResponseSizeBytes?: number;
  /**
   * Number of unique docs that have invoked a formula from this Pack in the past day.
   */
  docsActivelyUsing: number;
  /**
   * Number of unique docs that have invoked a formula from this Pack in the past 7 days.
   */
  docsActivelyUsing7Day: number;
  /**
   * Number of unique docs that have invoked a formula from this Pack in the past 30 days.
   */
  docsActivelyUsing30Day: number;
  /**
   * Number of unique docs that have invoked a formula from this Pack in the past 90 days.
   */
  docsActivelyUsing90Day: number;
  /**
   * Number of unique docs that have invoked a formula from this Pack ever.
   */
  docsActivelyUsingAllTime: number;
  /**
   * Number of unique workspaces that have invoked a formula from this Pack in the past day.
   */
  workspacesActivelyUsing: number;
  /**
   * Number of unique workspaces that have invoked a formula from this Pack in the past 7 days.
   */
  workspacesActivelyUsing7Day: number;
  /**
   * Number of unique workspaces that have invoked a formula from this Pack in the past 30 days.
   */
  workspacesActivelyUsing30Day: number;
  /**
   * Number of unique workspaces that have invoked a formula from this Pack in the past 90 days.
   */
  workspacesActivelyUsing90Day: number;
  /**
   * Number of unique workspaces that have invoked a formula from this Pack ever.
   */
  workspacesActivelyUsingAllTime: number;
}

/**
 * Analytics data for a Coda Pack formula.
 */
export interface PublicApiPackFormulaAnalyticsItem {
  formula: PublicApiPackFormulaIdentifier;
  metrics: PublicApiPackFormulaAnalyticsMetrics[];
}

/**
 * A collection of analytics for Coda Packs formulas over a date range.
 */
export interface PublicApiPackFormulaAnalyticsCollection {
  items: PublicApiPackFormulaAnalyticsItem[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

/**
 * Details about a Pack.
 */
export interface PublicApiPack {
  /**
   * ID of the Pack.
   */
  id: number;
  /**
   * The link to the logo of the Pack.
   */
  logoUrl?: string;
  /**
   * The link to the cover photo of the Pack.
   */
  coverUrl?: string;
  /**
   * The parent workspace for the Pack.
   */
  workspaceId: string;
  /**
   * Publishing categories associated with this Pack.
   */
  categories: PublicApiPublishingCategory[];
  /**
   * The name of the Pack.
   */
  name: string;
  /**
   * The full description of the Pack.
   */
  description: string;
  /**
   * A short version of the description of the Pack.
   */
  shortDescription: string;
  /**
   * A contact email for the Pack.
   */
  supportEmail?: string;
  /**
   * A Terms of Service URL for the Pack.
   */
  termsOfServiceUrl?: string;
  /**
   * A Privacy Policy URL for the Pack.
   */
  privacyPolicyUrl?: string;
  /**
   * A Featured Doc URL for the Pack.
   */
  featuredDocUrl?: string;
  overallRateLimit?: PublicApiPackRateLimit;
  perConnectionRateLimit?: PublicApiPackRateLimit;
  featuredDocStatus?: PublicApiFeaturedDocStatus;
}

/**
 * Summary of a Pack.
 */
export interface PublicApiPackSummary {
  /**
   * ID of the Pack.
   */
  id: number;
  /**
   * The link to the logo of the Pack.
   */
  logoUrl?: string;
  /**
   * The link to the cover photo of the Pack.
   */
  coverUrl?: string;
  /**
   * The parent workspace for the Pack.
   */
  workspaceId: string;
  /**
   * Publishing categories associated with this Pack.
   */
  categories: PublicApiPublishingCategory[];
  /**
   * The name of the Pack.
   */
  name: string;
  /**
   * The full description of the Pack.
   */
  description: string;
  /**
   * A short version of the description of the Pack.
   */
  shortDescription: string;
  /**
   * A contact email for the Pack.
   */
  supportEmail?: string;
  /**
   * A Terms of Service URL for the Pack.
   */
  termsOfServiceUrl?: string;
  /**
   * A Privacy Policy URL for the Pack.
   */
  privacyPolicyUrl?: string;
  /**
   * A Featured Doc URL for the Pack.
   */
  featuredDocUrl?: string;
}

/**
 * List of Pack summaries.
 */
export interface PublicApiPackSummaryList {
  items: PublicApiPackSummary[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

/**
 * Rate limit in Pack settings.
 */
export interface PublicApiPackRateLimit {
  /**
   * The rate limit interval in seconds.
   */
  intervalSeconds: number;
  /**
   * The maximum number of Pack operations that can be performed in a given interval.
   */
  operationsPerInterval: number;
}

/**
 * Determines how the Packs returned are sorted.
 */
export enum PublicApiPacksSortBy {
  Title = 'title',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
}

/**
 * Determines how the Pack listings returned are sorted.
 */
export enum PublicApiPackListingsSortBy {
  PackId = 'packId',
  Name = 'name',
  PackVersion = 'packVersion',
  PackVersionModifiedAt = 'packVersionModifiedAt',
}

/**
 * Information indicating where to upload the Pack version definition.
 */
export interface PublicApiPackVersionUploadInfo {
  /**
   * A url to be used for uploading a Pack version definition.
   */
  uploadUrl: string;
  /**
   * Key-value pairs of authorization headers to include in the upload request.
   */
  headers: {
    [k: string]: string;
  };
}

/**
 * Metadata about a Pack principal.
 */
export type PublicApiPackPrincipal =
  | PublicApiPackUserPrincipal
  | PublicApiPackWorkspacePrincipal
  | PublicApiPackGlobalPrincipal;

/**
 * Type of Pack permissions.
 */
export enum PublicApiPackPrincipalType {
  User = 'user',
  Workspace = 'workspace',
  Worldwide = 'worldwide',
}

export enum PublicApiPackAccessType {
  View = 'view',
  Test = 'test',
  Edit = 'edit',
}

/**
 * Access types for a Pack.
 */
export type PublicApiPackAccessTypes = PublicApiPackAccessType[];

export interface PublicApiPackUserPrincipal {
  type: PublicApiPackPrincipalType.User;
  email: string;
}

export interface PublicApiPackWorkspacePrincipal {
  type: PublicApiPackPrincipalType.Workspace;
  workspaceId: string;
}

export interface PublicApiPackGlobalPrincipal {
  type: PublicApiPackPrincipalType.Worldwide;
}

/**
 * List of Pack permissions.
 */
export interface PublicApiPackPermissionList {
  items: PublicApiPackPermission[];
  permissionUsers: PublicApiUserSummary[];
}

/**
 * Metadata about a Pack permission.
 */
export interface PublicApiPackPermission {
  /**
   * Id for the Permission
   */
  id: string;
  principal: PublicApiPackPrincipal;
  access: PublicApiPackAccessType;
}

export enum PublicApiPackAssetType {
  Logo = 'logo',
  Cover = 'cover',
  ExampleImage = 'exampleImage',
}

/**
 * Information indicating where to upload the Pack asset, and an endpoint to mark the upload as complete.
 */
export interface PublicApiPackAssetUploadInfo {
  /**
   * A signed url to be used for uploading a Pack asset.
   */
  uploadUrl: string;
  /**
   * An endpoint to mark the upload as complete.
   */
  packAssetUploadedPathName: string;
  /**
   * Key-value pairs of authorization headers to include in the upload request.
   */
  headers: {
    [k: string]: string;
  };
}

/**
 * Details about a Pack version.
 */
export interface PublicApiPackVersion {
  /**
   * ID of the Pack.
   */
  packId: number;
  /**
   * The build number of the Pack version.
   */
  buildId: number;
  /**
   * Developer notes.
   */
  buildNotes: string;
  /**
   * Timestamp for when the version was created.
   */
  createdAt: string;
  /**
   * The login ID of creation user of the Pack version.
   */
  creationUserLoginId: string;
  /**
   * The release number of the Pack version if it has one.
   */
  releaseId?: number;
  /**
   * The semantic format of the Pack version.
   */
  packVersion: string;
  source?: PublicApiPackSource;
}

/**
 * List of Pack versions.
 */
export interface PublicApiPackVersionList {
  items: PublicApiPackVersion[];
  creationUsers: PublicApiUserSummary[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

/**
 * Details about a Pack release.
 */
export interface PublicApiPackRelease {
  /**
   * ID of the Packs.
   */
  packId: number;
  /**
   * The build number of the Pack release.
   */
  buildId: number;
  /**
   * Developer notes.
   */
  releaseNotes: string;
  /**
   * Timestamp for when the release was created.
   */
  createdAt: string;
  /**
   * The release number of the Pack version if it has one.
   */
  releaseId: number;
  /**
   * The semantic format of the Pack version.
   */
  packVersion: string;
  /**
   * The semantic format of the Pack release version.
   */
  releaseVersion: string;
}

/**
 * List of Pack releases.
 */
export interface PublicApiPackReleaseList {
  items: PublicApiPackRelease[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

export enum PublicApiPackSource {
  Web = 'web',
  Cli = 'cli',
}

/**
 * Information indicating where to upload the Pack source code, and an endpoint to mark the upload as complete.
 */
export interface PublicApiPackSourceCodeUploadInfo {
  /**
   * A signed url to be used for uploading a Pack source code.
   */
  uploadUrl: string;
  /**
   * An endpoint to mark the upload as complete.
   */
  uploadedPathName: string;
  /**
   * Key-value pairs of authorization headers to include in the upload request.
   */
  headers: {
    [k: string]: string;
  };
}

/**
 * Information indicating where to upload the Pack source code, and an endpoint to mark the upload as complete.
 */
export interface PublicApiPackSourceCodeInfo {
  files: PublicApiPackSourceCode[];
}

/**
 * Details about a Pack's source code.
 */
export interface PublicApiPackSourceCode {
  /**
   * name of the file
   */
  filename: string;
  /**
   * The url to download the source code from
   */
  url: string;
}

/**
 * Widest principal a Pack is available to.
 */
export enum PublicApiPackDiscoverability {
  Public = 'public',
  Workspace = 'workspace',
  Private = 'private',
}

/**
 * A Pack listing.
 */
export interface PublicApiPackListing {
  /**
   * ID of the Pack.
   */
  packId: number;
  /**
   * The version of the Pack.
   */
  packVersion: string;
  /**
   * The current release number of the Pack if released, otherwise undefined.
   */
  releaseId?: number;
  /**
   * The link to the logo of the Pack.
   */
  logoUrl: string;
  /**
   * The link to the cover photo of the Pack.
   */
  coverUrl?: string;
  /**
   * The name of the Pack.
   */
  name: string;
  /**
   * The full description of the Pack.
   */
  description: string;
  /**
   * A short version of the description of the Pack.
   */
  shortDescription: string;
  /**
   * A contact email for the Pack.
   */
  supportEmail?: string;
  /**
   * A Terms of Service URL for the Pack.
   */
  termsOfServiceUrl?: string;
  /**
   * A Privacy Policy URL for the Pack.
   */
  privacyPolicyUrl?: string;
  /**
   * A Featured Doc ID for the Pack.
   */
  featuredDocId?: string;
  /**
   * Publishing Categories associated with this Pack.
   */
  categories: PublicApiPublishingCategory[];
  /**
   * Makers associated with this Pack.
   */
  makers: PublicApiMakerSummary[];
  minimumFeatureSet?: PublicApiFeatureSet;
  unrestrictedFeatureSet?: PublicApiFeatureSet;
  /**
   * The url where complete metadata about the contents of the Pack version can be downloaded.
   */
  externalMetadataUrl: string;
}

/**
 * A detailed Pack listing.
 */
export interface PublicApiPackListingDetail {
  /**
   * ID of the Pack.
   */
  packId: number;
  /**
   * The version of the Pack.
   */
  packVersion: string;
  /**
   * The current release number of the Pack if released, otherwise undefined.
   */
  releaseId?: number;
  /**
   * The link to the logo of the Pack.
   */
  logoUrl: string;
  /**
   * The link to the cover photo of the Pack.
   */
  coverUrl?: string;
  /**
   * The name of the Pack.
   */
  name: string;
  /**
   * The full description of the Pack.
   */
  description: string;
  /**
   * A short version of the description of the Pack.
   */
  shortDescription: string;
  /**
   * A contact email for the Pack.
   */
  supportEmail?: string;
  /**
   * A Terms of Service URL for the Pack.
   */
  termsOfServiceUrl?: string;
  /**
   * A Privacy Policy URL for the Pack.
   */
  privacyPolicyUrl?: string;
  /**
   * A Featured Doc ID for the Pack.
   */
  featuredDocId?: string;
  /**
   * Publishing Categories associated with this Pack.
   */
  categories: PublicApiPublishingCategory[];
  /**
   * Makers associated with this Pack.
   */
  makers: PublicApiMakerSummary[];
  minimumFeatureSet?: PublicApiFeatureSet;
  unrestrictedFeatureSet?: PublicApiFeatureSet;
  /**
   * The url where complete metadata about the contents of the Pack version can be downloaded.
   */
  externalMetadataUrl: string;
  discoverability: PublicApiPackDiscoverability;
  /**
   * The access capabilities the current user has for this Pack.
   */
  userAccess: {
    canEdit: boolean;
    canTest: boolean;
    canView: boolean;
    canInstall: boolean;
  };
}

/**
 * A list of Pack listings.
 */
export interface PublicApiPackListingList {
  items: PublicApiPackListing[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

/**
 * Metadata of a Pack system connection.
 */
export type PublicApiPackSystemConnectionMetadata =
  | PublicApiPackConnectionHeaderMetadata
  | PublicApiPackConnectionUrlParamMetadata
  | PublicApiPackConnectionHttpBasicMetadata
  | PublicApiPackConnectionCustomMetadata;

/**
 * The Pack OAuth configuration metadata.
 */
export interface PublicApiPackOauthConfigMetadata {
  /**
   * Masked OAuth client id. If not set, empty string will be returned.
   */
  maskedClientId: string;
  /**
   * Masked OAuth client secret. If not set, empty string will be returned.
   */
  maskedClientSecret: string;
  /**
   * Authorization url of the OAuth provider.
   */
  authorizationUrl: string;
  /**
   * Token url of the OAuth provider.
   */
  tokenUrl: string;
  /**
   * Optional token prefix that's used to make the API request.
   */
  tokenPrefix?: string;
  /**
   * Optional scopes of the OAuth client.
   */
  scopes?: string;
}

/**
 * Payload for creating a Pack.
 */
export interface PublicApiCreatePackRequest {
  /**
   * The parent workspace for the Pack. If unspecified, the user's default workspace will be used.
   */
  workspaceId?: string;
  /**
   * The name for the Pack.
   */
  name?: string;
  /**
   * A brief description of the Pack.
   */
  description?: string;
}

/**
 * Info about a Pack that was just created.
 */
export interface PublicApiCreatePackResponse {
  /**
   * The ID assigned to the newly-created Pack.
   */
  packId: number;
}

/**
 * Payload for getting the next version of a Pack.
 */
export interface PublicApiGetNextPackVersionRequest {
  /**
   * The metadata for the next version of the Pack.
   */
  proposedMetadata: string;

  /**
   * The SDK version this metadata should validate against.
   */
  sdkVersion: string;
}

/**
 * Type of Pack connections.
 */
export enum PublicApiPackConnectionType {
  Header = 'header',
  UrlParam = 'urlParam',
  HttpBasic = 'httpBasic',
  Custom = 'custom',
}

/**
 * Credentials of a Pack connection.
 */
export type PublicApiPackSystemConnectionCredentials =
  | PublicApiPackConnectionHeaderCredentials
  | PublicApiPackConnectionUrlParamCredentials
  | PublicApiPackConnectionHttpBasicCredentials
  | PublicApiPackConnectionCustomCredentials;

export interface PublicApiPackConnectionHeaderMetadata {
  type: PublicApiPackConnectionType.Header;
  maskedToken?: string;
  headerName: string;
  tokenPrefix: string;
}

export interface PublicApiPackConnectionUrlParamMetadata {
  type: PublicApiPackConnectionType.UrlParam;
  params: {
    key: string;
    maskedValue: string;
  }[];
  domain: string;
  presetKeys: string[];
}

export interface PublicApiPackConnectionHttpBasicMetadata {
  type: PublicApiPackConnectionType.HttpBasic;
  maskedUsername?: string;
  maskedPassword?: string;
}

export interface PublicApiPackConnectionCustomMetadata {
  type: PublicApiPackConnectionType.Custom;
  /**
   * An array of objects containing the parameter key and masked value.
   */
  params: {
    key: string;
    maskedValue: string;
  }[];
  /**
   * The domain corresponding to the pre-authorized network domain in the pack.
   */
  domain: string;
  /**
   * An array containing the keys of parameters specified by the authentication config.
   */
  presetKeys: string[];
}

export interface PublicApiPackConnectionHeaderCredentials {
  type: PublicApiPackConnectionType.Header;
  token: string;
}

export interface PublicApiPackConnectionUrlParamCredentials {
  type: PublicApiPackConnectionType.UrlParam;
  params: {
    key: string;
    value: string;
  }[];
}

export interface PublicApiPackConnectionHttpBasicCredentials {
  type: PublicApiPackConnectionType.HttpBasic;
  username: string;
  password?: string;
}

export interface PublicApiPackConnectionCustomCredentials {
  type: PublicApiPackConnectionType.Custom;
  params: {
    key: string;
    value: string;
  }[];
}

export interface PublicApiPackConnectionHeaderPatch {
  type: PublicApiPackConnectionType.Header;
  token?: string;
}

export interface PublicApiPackConnectionUrlParamPatch {
  type: PublicApiPackConnectionType.UrlParam;
  paramsToPatch?: {
    key: string;
    value: string;
  }[];
}

export interface PublicApiPackConnectionHttpBasicPatch {
  type: PublicApiPackConnectionType.HttpBasic;
  username?: string;
  password?: string;
}

/**
 * List of grouped Pack logs.
 */
export interface PublicApiGroupedPackLogsList {
  items: PublicApiGroupedPackLog[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
  /**
   * This flag will be set to true if the result doens't include all the related logs.
   */
  incompleteRelatedLogs: boolean;
}

export interface PublicApiPackConnectionCustomPatch {
  type: PublicApiPackConnectionType.Custom;
  paramsToPatch?: {
    key: string;
    value: string;
  }[];
}

/**
 * List of Pack logs.
 */
export interface PublicApiPackLogsList {
  items: PublicApiPackLog[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

/**
 * A record of grouped Pack log.
 */
export type PublicApiGroupedPackLog = PublicApiGroupedPackInvocationLog | PublicApiPackAuthLog;

/**
 * A record of Pack log.
 */
export type PublicApiPackLog =
  | PublicApiPackCustomLog
  | PublicApiPackInvocationLog
  | PublicApiPackFetcherLog
  | PublicApiPackInternalLog
  | PublicApiPackAuthLog;

/**
 * Logging context that comes with a Pack log.
 */
export interface PublicApiPackLogContext {
  docId: string;
  packId: string;
  packVersion: string;
  formulaName: string;
  userId: string;
  connectionId: string;
  /**
   * A unique identifier of the Pack invocation that can be used to associate all log types generated in one call of a Pack formula.
   *
   */
  requestId: string;
  requestType: PublicApiPackLogRequestType;
  /**
   * Creation time of the log.
   */
  createdAt: string;
  /**
   * Unique identifier of this log record.
   */
  logId: string;
  /**
   * Doc canvas object id where the formula was fired from.
   */
  docObjectId?: string;
  /**
   * Doc canvas row id where the formula was fired from.
   */
  docRowId?: string;
  /**
   * Doc canvas column id where the formula was fired from.
   */
  docColumnId?: string;
  /**
   * True if this is an execution of a sync table which received a pagination parameter.
   */
  isContinuedSyncTable?: boolean;
  /**
   * If this formula invocation was for a parameter auto-complete, this names the parameter.
   */
  autocompleteParameterName?: string;
  /**
   * If this formula was invoked by something other than a user action, this should say what that was.
   */
  invocationSource?: string;
}

/**
 * Pack log generated by developer's custom logging with context.logger.
 */
export interface PublicApiPackCustomLog {
  type: PublicApiPackLogType.Custom;
  context: PublicApiPackLogContext;
  /**
   * The message that's passed into context.logger.
   */
  message: string;
  level: PublicApiLogLevel;
}

/**
 * System logs of the invocations of the Pack.
 */
export interface PublicApiPackInvocationLog {
  type: PublicApiPackLogType.Invocation;
  context: PublicApiPackLogContext;
  /**
   * True if the formula returned a prior result without executing.
   */
  cacheHit?: boolean;
  /**
   * Duration of the formula exeuction in miliseconds.
   */
  duration?: number;
  /**
   * Error info if this invocation resulted in an error.
   */
  error?: {
    message: string;
    stack?: string;
  };
}

/**
 * Grouped logs ofthe invocations of the Pack.
 */
export interface PublicApiGroupedPackInvocationLog {
  type: PublicApiPackLogType.Invocation;
  invocationLog: PublicApiPackInvocationLog;
  relatedLogs: PublicApiPackLog[];
}

/**
 * System logs of Pack calls to context.fetcher.
 */
export interface PublicApiPackFetcherLog {
  type: PublicApiPackLogType.Fetcher;
  context: PublicApiPackLogContext;
  /**
   * The number of bytes in the HTTP request sent
   */
  requestSizeBytes?: number;
  responseCode?: number;
  /**
   * The number of bytes in the HTTP response received
   */
  responseSizeBytes?: number;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /**
   * base url of the fetcher request, with all query parameters stripped off.
   */
  baseUrl?: string;
  /**
   * true if the fetcher request hits catche instead of actually requesting the remote service.
   */
  cacheHit?: boolean;
  /**
   * Duration of the fetcher request in miliseconds.
   */
  duration?: number;
}

/**
 * Coda internal logs from the packs infrastructure. Only visible to Codans.
 */
export interface PublicApiPackInternalLog {
  type: PublicApiPackLogType.Internal;
  context: PublicApiPackLogContext;
  /**
   * The log message.
   */
  message: string;
  level: PublicApiLogLevel;
}

/**
 * System logs of Pack authentication requests.
 */
export interface PublicApiPackAuthLog {
  type: PublicApiPackLogType.Auth;
  context: PublicApiPackLogContext;
  /**
   * The request path.
   */
  path: string;
  /**
   * The error message.
   */
  errorMessage?: string;
  /**
   * The error stacktrace (internal only).
   */
  errorStack?: string;
}

/**
 * The context request type where a Pack log is generated.
 */
export enum PublicApiPackLogRequestType {
  Unknown = 'unknown',
  ConnectionNameMetadataRequest = 'connectionNameMetadataRequest',
  ParameterAutocompleteMetadataRequest = 'parameterAutocompleteMetadataRequest',
  PostAuthSetupMetadataRequest = 'postAuthSetupMetadataRequest',
  GetSyncTableSchemaMetadataRequest = 'getSyncTableSchemaMetadataRequest',
  GetDynamicSyncTableNameMetadataRequest = 'getDynamicSyncTableNameMetadataRequest',
  ListSyncTableDynamicUrlsMetadataRequest = 'listSyncTableDynamicUrlsMetadataRequest',
  GetDynamicSyncTableDisplayUrlMetadataRequest = 'getDynamicSyncTableDisplayUrlMetadataRequest',
  GetIdentifiersForConnectionRequest = 'getIdentifiersForConnectionRequest',
  InvokeFormulaRequest = 'invokeFormulaRequest',
  InvokeSyncFormulaRequest = 'invokeSyncFormulaRequest',
  ImpersonateInvokeFormulaRequest = 'impersonateInvokeFormulaRequest',
  ImpersonateInvokeMetadataFormulaRequest = 'impersonateInvokeMetadataFormulaRequest',
}

export enum PublicApiPackLogType {
  Custom = 'custom',
  Fetcher = 'fetcher',
  Invocation = 'invocation',
  Internal = 'internal',
  Auth = 'auth',
}

export enum PublicApiLogLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
  Unknown = 'unknown',
}

/**
 * Only relevant for original Coda packs.
 */
export enum PublicApiFeatureSet {
  Basic = 'Basic',
  Pro = 'Pro',
  Team = 'Team',
  Enterprise = 'Enterprise',
}

/**
 * Status of featured doc in pack listing.
 */
export enum PublicApiFeaturedDocStatus {
  DocInaccessibleOrDoesNotExist = 'docInaccessibleOrDoesNotExist',
  InvalidPublishedDocUrl = 'invalidPublishedDocUrl',
}

export interface PublicApiPackFormulaIdentifier {
  /**
   * The Pack formula name.
   */
  name: string;
  type: PublicApiPackFormulaType;
}

/**
 * The pack formula type.
 */
export enum PublicApiPackFormulaType {
  Action = 'action',
  Formula = 'formula',
  Sync = 'sync',
  Metadata = 'metadata',
}

/**
 * The request to patch pack system connection credentials.
 */
export type PublicApiPatchPackSystemConnectionRequest =
  | PublicApiPackConnectionHeaderPatch
  | PublicApiPackConnectionUrlParamPatch
  | PublicApiPackConnectionHttpBasicPatch
  | PublicApiPackConnectionCustomPatch;

/**
 * Request to set the Pack OAuth configuration.
 */
export interface PublicApiSetPackOauthConfigRequest {
  clientId?: string;
  clientSecret?: string;
}

/**
 * The request to set pack system connection credentials.
 */
export interface PublicApiSetPackSystemConnectionRequest {
  credentials: PublicApiPackSystemConnectionCredentials;
}

/**
 * Payload for registering a Pack version.
 */
export interface PublicApiRegisterPackVersionRequest {
  /**
   * The SHA-256 hash of the file to be uploaded.
   */
  bundleHash: string;
  /**
   * Internal field for cross-environment pack import.
   */
  dangerouslyAllowCrossEnvPack?: boolean;
  /**
   * Internal field that allows the api to use the non-latest pack version.
   */
  dangerouslyAllowNonLatestVersionNumber?: boolean;
}

/**
 * Payload for updating a Pack.
 */
export interface PublicApiUpdatePackRequest {
  /**
   * Rate limit in Pack settings.
   */
  overallRateLimit?: {
    /**
     * The rate limit interval in seconds.
     */
    intervalSeconds: number;
    /**
     * The maximum number of Pack operations that can be performed in a given interval.
     */
    operationsPerInterval: number;
  } | null;
  /**
   * Rate limit in Pack settings.
   */
  perConnectionRateLimit?: {
    /**
     * The rate limit interval in seconds.
     */
    intervalSeconds: number;
    /**
     * The maximum number of Pack operations that can be performed in a given interval.
     */
    operationsPerInterval: number;
  } | null;
  /**
   * The asset id of the Pack's logo, returned by [`#PackAssetUploadComplete`](#operation/packAssetUploadComplete) endpoint.
   */
  logoAssetId?: string | null;
  /**
   * The asset id of the Pack's cover image, returned by [`#PackAssetUploadComplete`](#operation/packAssetUploadComplete) endpoint.
   */
  coverAssetId?: string | null;
  /**
   * The asset ids of the Pack's example images, returned by [`#PackAssetUploadComplete`](#operation/packAssetUploadComplete) endpoint, sorted by their display order.
   */
  exampleImageAssetIds?: string[] | null;
  /**
   * The name of the Pack.
   */
  name?: string;
  /**
   * The full description of the Pack.
   */
  description?: string;
  /**
   * A short version of the description of the Pack.
   */
  shortDescription?: string;
  /**
   * A contact email for the Pack.
   */
  supportEmail?: string;
  /**
   * A Terms of Service URL for the Pack.
   */
  termsOfServiceUrl?: string;
  /**
   * A Privacy Policy URL for the Pack.
   */
  privacyPolicyUrl?: string;
  /**
   * A Featured Doc URL for the Pack.
   */
  featuredDocUrl?: string;
}

/**
 * Confirmation of successful Pack version creation.
 */
export interface PublicApiCreatePackVersionResponse {
  deprecationWarnings?: PublicApiValidationError[];
}

/**
 * Confirmation of successful Pack deletion.
 */
export interface PublicApiDeletePackResponse {}

/**
 * Confirmation of successfully retrieving Pack makers.
 */
export interface PublicApiListPackMakersResponse {
  makers: PublicApiMaker[];
}

/**
 * Payload for adding a Pack maker.
 */
export interface PublicApiAddPackMakerRequest {
  /**
   * The email of the Pack maker.
   */
  loginId: string;
}

/**
 * Confirmation of successfully adding a Pack maker.
 */
export interface PublicApiAddPackMakerResponse {}

/**
 * Confirmation of successfully deleting a Pack maker.
 */
export interface PublicApiDeletePackMakerResponse {}

/**
 * Confirmation of successfully retrieving Pack categories.
 */
export interface PublicApiListPackCategoriesResponse {
  /**
   * The names of categories associated with a Pack.
   */
  categories: PublicApiPublishingCategory[];
}

/**
 * Payload for adding a Pack Category.
 */
export interface PublicApiAddPackCategoryRequest {
  /**
   * Name of the publishing category.
   */
  categoryName: string;
}

/**
 * Confirmation of successfully adding a Pack category.
 */
export interface PublicApiAddPackCategoryResponse {}

/**
 * Confirmation of successfully deleting a Pack category.
 */
export interface PublicApiDeletePackCategoryResponse {}

/**
 * Payload for upserting a Pack permission.
 */
export interface PublicApiAddPackPermissionRequest {
  principal: PublicApiPackPrincipal;
  access: PublicApiPackAccessType;
}

/**
 * Confirmation of successfully upserting a Pack permission.
 */
export interface PublicApiAddPackPermissionResponse {
  /**
   * The ID of the permission created or updated.
   */
  permissionId: string;
}

/**
 * Confirmation of successfully deleting a Pack permission.
 */
export interface PublicApiDeletePackPermissionResponse {}

/**
 * Payload for a Pack asset upload.
 */
export interface PublicApiUploadPackAssetRequest {
  packAssetType: PublicApiPackAssetType;
  /**
   * The SHA-256 hash of the image to be uploaded.
   */
  imageHash: string;
  /**
   * The media type of the image being sent.
   */
  mimeType: string;
  filename: string;
}

/**
 * Payload for noting a Pack asset upload is complete.
 */
export interface PublicApiPackAssetUploadCompleteRequest {
  packAssetType: PublicApiPackAssetType;
}

/**
 * Response for noting a Pack asset upload is complete.
 */
export interface PublicApiPackAssetUploadCompleteResponse {
  /**
   * An arbitrary unique identifier for this request.
   */
  requestId: string;
  /**
   * An identifier of this uploaded asset.
   */
  assetId: string;
}

/**
 * Payload for noting a Pack source code upload is complete.
 */
export interface PublicApiPackSourceCodeUploadCompleteRequest {
  filename: string;
  /**
   * A SHA-256 hash of the source code used to identify duplicate uploads.
   */
  codeHash: string;
}

/**
 * Response for noting a Pack source code upload is complete.
 */
export interface PublicApiPackSourceCodeUploadCompleteResponse {
  /**
   * An arbitrary unique identifier for this request.
   */
  requestId: string;
}

/**
 * Payload for Pack version upload complete.
 */
export interface PublicApiCreatePackVersionRequest {
  /**
   * Developer notes of the new Pack version.
   */
  notes?: string;
  source?: PublicApiPackSource;
  /**
   * By default, Coda prevents a new pack version from using an older SDK version than the prior version,
   * assuming that there are multiple dev environments trampling each other. In the rare case that you
   * actually need to use the older SDK, use this flag.
   */
  allowOlderSdkVersion?: boolean;
  /**
   * Internal field for cross-environment pack import.
   */
  dangerouslyAllowCrossEnvPack?: boolean;
}

/**
 * Payload for creating a new Pack release.
 */
export interface PublicApiCreatePackReleaseRequest {
  /**
   * Which semantic pack version that the release will be created on.
   */
  packVersion: string;
  /**
   * Developers notes.
   */
  releaseNotes?: string;
  /**
   * Internal field for cross-environment pack import.
   */
  dangerouslyAllowCrossEnvPack?: boolean;
}

/**
 * Payload for a Pack asset upload.
 */
export interface PublicApiUploadPackSourceCodeRequest {
  /**
   * The SHA-256 hash of the image to be uploaded.
   */
  payloadHash: string;
  filename: string;
  packVersion?: string;
}

/**
 * Information indicating the next Pack version definition.
 */
export interface PublicApiNextPackVersionInfo {
  /**
   * The next valid version for the Pack.
   */
  nextVersion: string;
  /**
   * List of changes from the previous version.
   */
  findings: string[];
}

/**
 * Info about the diff between two Pack versions.
 */
export interface PublicApiPackVersionDiffs {
  /**
   * List of changes from the previous version to the next version.
   */
  findings: string[];
}
