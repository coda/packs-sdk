/**
 * This file is auto-generated from OpenAPI definitions by `make build-openapi`. Do not edit manually.
 */

/* eslint-disable */

export const OpenApiSpecHash = 'c17f33bab1c1496bf73356d09380fa0a04e074f97741adc801db545ea8db0026';

export const OpenApiSpecVersion = '1.2.0';

/**
 * A constant identifying the type of the resource.
 */
export enum PublicApiType {
  Doc = 'doc',
  AclPermissions = 'aclPermissions',
  AclMetadata = 'aclMetadata',
  User = 'user',
  ApiLink = 'apiLink',
  Page = 'page',
  Table = 'table',
  Row = 'row',
  Column = 'column',
  Formula = 'formula',
  Control = 'control',
  DocAnalytics = 'docAnalytics',
  MutationStatus = 'mutationStatus',
  Workspace = 'workspace',
  Pack = 'pack',
  PackVersion = 'packVersion',
  PackAclPermissions = 'packAclPermissions',
  PackAsset = 'packAsset',
  PackRelease = 'packRelease',
  PackSourceCode = 'packSourceCode',
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
  | PublicApiDateColumnFormat
  | PublicApiDateTimeColumnFormat
  | PublicApiDurationColumnFormat
  | PublicApiEmailColumnFormat
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
  Slider = 'slider',
  Scale = 'scale',
  Image = 'image',
  Attachments = 'attachments',
  Button = 'button',
  Checkbox = 'checkbox',
  Select = 'select',
  PackObject = 'packObject',
  Reaction = 'reaction',
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
   * Optional column IDs, URLs, or names (fragile and discouraged), specifying columns to be used as upsert keys.
   *
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
  type: 'user';
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
  type: 'user';
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
 * Quantization period over which to view analytics.
 */
export enum PublicApiDocAnalyticsScale {
  Day = 'daily',
  Cumulative = 'cumulative',
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
   * The parent workspace for the Pack.
   */
  workspaceId: string;
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
  overallRateLimit?: PublicApiPackRateLimit;
  perConnectionRateLimit?: PublicApiPackRateLimit;
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
   * The parent workspace for the Pack.
   */
  workspaceId: string;
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

/**
 * Access type for a Pack.
 */
export enum PublicApiPackAccessType {
  View = 'view',
  Test = 'test',
  Edit = 'edit',
}

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
   * The link to the logo of the Pack.
   */
  logoUrl: string;
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
 * The Pack system connection.
 */
export interface PublicApiPackSystemConnection {
  /**
   * Name of the system connection.
   */
  name: string;
  credentials: PublicApiPackSystemConnectionCredentials;
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
 * Type of Pack connections.
 */
export enum PublicApiPackConnectionType {
  Header = 'header',
  UrlParam = 'urlParam',
  HttpBasic = 'httpBasic',
}

/**
 * Credentials of a Pack connection.
 */
export type PublicApiPackSystemConnectionCredentials =
  | PublicApiPackConnectionHeaderCredentials
  | PublicApiPackConnectionUrlParamCredentials
  | PublicApiPackConnectionHttpBasicCredentials;

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
  type: PublicApiPackConnectionType.UrlParam;
  username: string;
  password: string;
}

/**
 * Payload for registering a Pack version.
 */
export interface PublicApiRegisterPackVersionRequest {
  /**
   * The SHA-256 hash of the file to be uploaded.
   */
  bundleHash: string;
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
}

/**
 * Payload for setting a Pack version live.
 */
export interface PublicApiSetPackLiveVersionRequest {
  /**
   * The version of the Pack.
   */
  packVersion: string;
}

/**
 * Confirmation of successful Pack version creation.
 */
export interface PublicApiCreatePackVersionResponse {}

/**
 * Confirmation of successfully setting a Pack version live.
 */
export interface PublicApiSetPackLiveVersionResponse {}

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
 * The request to set Pack system connection.
 */
export interface PublicApiSetPackSystemConnectionRequest {
  /**
   * Name of the system connection.
   */
  name: string;
  credentials: PublicApiPackSystemConnectionCredentials;
}

/**
 * Empty response of deleting pack system connection.
 */
export interface PublicApiDeletePackSystemConnectionResponse {}
