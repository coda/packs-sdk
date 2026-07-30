/* eslint-disable */
/**
 * This file is auto-generated from OpenAPI definitions by `make build-openapi`. Do not edit manually.
 */

export const OpenApiSpecHash = '4f64de8de03e3a7e64fa67827a25c62de87d1a332fbb5c6414943849dff961f6';

export const OpenApiSpecVersion = '1.6.0';

/**
 * A constant identifying the type of the resource.
 */
export enum PublicApiType {
  AclMetadata = 'aclMetadata',
  AclPermissions = 'aclPermissions',
  AclSettings = 'aclSettings',
  AgentPackLog = 'agentPackLog',
  AnalyticsLastUpdated = 'analyticsLastUpdated',
  ApiLink = 'apiLink',
  Automation = 'automation',
  Column = 'column',
  Control = 'control',
  Doc = 'doc',
  CustomDocDomain = 'customDocDomain',
  CustomDocDomainProvider = 'customDocDomainProvider',
  DocAnalytics = 'docAnalytics',
  DocAnalyticsSummary = 'docAnalyticsSummary',
  DocAnalyticsV2 = 'docAnalyticsV2',
  Folder = 'folder',
  Formula = 'formula',
  GoLink = 'goLink',
  IngestionBatchExecution = 'ingestionBatchExecution',
  IngestionExecution = 'ingestionExecution',
  IngestionExecutionAttempt = 'ingestionExecutionAttempt',
  IngestionPackLog = 'ingestionPackLog',
  IngestionParentItem = 'ingestionParentItem',
  InternalRichText = 'internalRichText',
  MutationStatus = 'mutationStatus',
  Pack = 'pack',
  PackAclPermissions = 'packAclPermissions',
  PackAnalytics = 'packAnalytics',
  PackAnalyticsSummary = 'packAnalyticsSummary',
  PackAsset = 'packAsset',
  PackCategory = 'packCategory',
  PackConfigurationSchema = 'packConfigurationSchema',
  PackFeaturedDocs = 'packFeaturedDocs',
  PackFormulaAnalytics = 'packFormulaAnalytics',
  PackInvitation = 'packInvitation',
  PackListingDraft = 'packListingDraft',
  PackLog = 'packLog',
  PackMaker = 'packMaker',
  PackOauthConfig = 'packOauthConfig',
  PackRelease = 'packRelease',
  PackReview = 'packReview',
  PackSourceCode = 'packSourceCode',
  PackSystemConnection = 'packSystemConnection',
  PackVersion = 'packVersion',
  Page = 'page',
  PageContentExport = 'pageContentExport',
  PageContentExportStatus = 'pageContentExportStatus',
  Principal = 'principal',
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
  Group = 'group',
  Domain = 'domain',
  Workspace = 'workspace',
  Anyone = 'anyone',
  InternalAccess = 'internalAccess',
}

/**
 * Metadata about a principal to add to a doc.
 */
export type PublicApiAddedPrincipal =
  | PublicApiAddedEmailPrincipal
  | PublicApiAddedGroupPrincipal
  | PublicApiAddedDomainPrincipal
  | PublicApiAddedWorkspacePrincipal
  | PublicApiAddedAnyonePrincipal;

export interface PublicApiAddedEmailPrincipal {
  /**
   * The type of this principal.
   */
  type: PublicApiPrincipalType.Email;
  /**
   * Email for the principal.
   */
  email: string;
}

export interface PublicApiAddedGroupPrincipal {
  /**
   * The type of this principal.
   */
  type: PublicApiPrincipalType.Group;
  /**
   * Group ID for the principal.
   */
  groupId: string;
}

export interface PublicApiAddedDomainPrincipal {
  /**
   * The type of this principal.
   */
  type: PublicApiPrincipalType.Domain;
  /**
   * Domain for the principal.
   */
  domain: string;
}

export interface PublicApiAddedWorkspacePrincipal {
  /**
   * The type of this principal.
   */
  type: PublicApiPrincipalType.Workspace;
  /**
   * WorkspaceId for the principal.
   */
  workspaceId: string;
}

export interface PublicApiAddedAnyonePrincipal {
  /**
   * The type of this principal.
   */
  type: PublicApiPrincipalType.Anyone;
}

/**
 * Metadata about a principal.
 */
export type PublicApiPrincipal =
  | PublicApiEmailPrincipal
  | PublicApiGroupPrincipal
  | PublicApiDomainPrincipal
  | PublicApiWorkspacePrincipal
  | PublicApiAnyonePrincipal
  | PublicApiInternalAccessPrincipal;

export interface PublicApiEmailPrincipal {
  /**
   * The type of this principal.
   */
  type: PublicApiPrincipalType.Email;
  /**
   * Email for the principal.
   */
  email: string;
}

export interface PublicApiGroupPrincipal {
  /**
   * The type of this principal.
   */
  type: PublicApiPrincipalType.Group;
  /**
   * Group ID for the principal.
   */
  groupId: string;
  /**
   * Name of the group.
   */
  groupName: string;
}

export interface PublicApiDomainPrincipal {
  /**
   * The type of this principal.
   */
  type: PublicApiPrincipalType.Domain;
  /**
   * Domain for the principal.
   */
  domain: string;
}

export interface PublicApiWorkspacePrincipal {
  /**
   * The type of this principal.
   */
  type: PublicApiPrincipalType.Workspace;
  /**
   * WorkspaceId for the principal.
   */
  workspaceId: string;
}

export interface PublicApiAnyonePrincipal {
  /**
   * The type of this principal.
   */
  type: PublicApiPrincipalType.Anyone;
}

export interface PublicApiInternalAccessPrincipal {
  /**
   * The type of this principal.
   */
  type: PublicApiPrincipalType.InternalAccess;
  /**
   * The type of internal access (e.g., support).
   */
  internalAccessType: string;
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
 * Type of access (excluding none).
 */
export enum PublicApiAccessTypeNotNone {
  ReadOnly = 'readonly',
  Write = 'write',
  Comment = 'comment',
}

/**
 * A specific permission granted to a principal.
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
  access: PublicApiAccessTypeNotNone;
  principal: PublicApiAddedPrincipal;
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
   * When true, the user of the api can share with the workspace
   */
  canShareWithWorkspace: boolean;
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
 * Sharing settings for the doc.
 */
export interface PublicApiAclSettings {
  /**
   * When true, allows editors to change doc permissions. When false, only doc owner can change doc permissions.
   *
   */
  allowEditorsToChangePermissions: boolean;
  /**
   * When true, allows doc viewers to copy the doc.
   */
  allowCopying: boolean;
  /**
   * When true, allows doc viewers to request editing permissions.
   */
  allowViewersToRequestEditing: boolean;
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
 * Metadata about the principals that match the given query.
 */
export interface PublicApiSearchPrincipalsResponse {
  users: PublicApiUserSummary[];
  groups: PublicApiGroupPrincipal[];
}

/**
 * Request to update ACL settings for a doc.
 */
export interface PublicApiUpdateAclSettingsRequest {
  /**
   * When true, allows editors to change doc permissions. When false, only doc owner can change doc permissions.
   *
   */
  allowEditorsToChangePermissions?: boolean;
  /**
   * When true, allows doc viewers to copy the doc.
   */
  allowCopying?: boolean;
  /**
   * When true, allows doc viewers to request editing permissions.
   */
  allowViewersToRequestEditing?: boolean;
}

/**
 * Reference to a document.
 */
export interface PublicApiDocReference {
  /**
   * ID of the document.
   */
  id: string;
  /**
   * The type of this resource.
   */
  type: PublicApiType.Doc;
  /**
   * API link to the document.
   */
  href: string;
  /**
   * Browser-friendly link to the document.
   */
  browserLink: string;
}

/**
 * Metadata about a document.
 */
export interface PublicApiDoc {
  /**
   * ID of the document.
   */
  id: string;
  /**
   * The type of this resource.
   */
  type: PublicApiType.Doc;
  /**
   * API link to the document.
   */
  href: string;
  /**
   * Browser-friendly link to the document.
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
   * ID of the Superhuman Docs workspace containing this document.
   */
  workspaceId: string;
  /**
   * ID of the Superhuman Docs folder containing this document.
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
 * List of documents.
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
  initialPage?: {} & PublicApiPageCreate;
}

/**
 * The result of a doc deletion.
 */
export interface PublicApiDocDelete {}

/**
 * Payload for updating a doc.
 */
export interface PublicApiDocUpdate {
  /**
   * Title of the doc.
   */
  title?: string;
  /**
   * Name of the icon.
   */
  iconName?: string;
}

/**
 * The number of components within a document.
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
   * The total number of base tables contained within the doc.
   */
  baseTableCount?: number;
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
   * If true, new users may be required to sign in to view content within this document. You will receive Superhuman Docs credit for each user who signs up via your document.
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
 * Which interaction mode the published doc should use.
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
   * ID of the document.
   */
  id: string;
  /**
   * The type of this resource.
   */
  type: PublicApiType.Doc;
  /**
   * API link to the document.
   */
  href: string;
  /**
   * Browser-friendly link to the document.
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
   * ID of the Superhuman Docs workspace containing this document.
   */
  workspaceId: string;
  /**
   * ID of the Superhuman Docs folder containing this document.
   */
  folderId: string;
  /**
   * An arbitrary unique identifier for this request.
   */
  requestId?: string;
}

/**
 * The result of a doc update
 */
export interface PublicApiDocUpdateResult {}

/**
 * List of all custom domains added to a published doc.
 */
export interface PublicApiCustomDocDomainList {
  /**
   * Custom domains for the published doc.
   */
  customDocDomains: PublicApiCustomDocDomain[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

/**
 * The custom domain added to a published doc.
 */
export interface PublicApiCustomDocDomain {
  /**
   * The custom domain.
   */
  customDocDomain: string;
  /**
   * Whether the domain has a certificate
   */
  hasCertificate: boolean;
  /**
   * Whether the domain DNS points back to this doc.
   */
  hasDnsDocId: boolean;
  setupStatus: PublicApiCustomDocDomainSetupStatus;
  domainStatus: PublicApiCustomDomainConnectedStatus;
  /**
   * When the domain DNS settings were last checked.
   */
  lastVerifiedTimestamp?: string;
}

export enum PublicApiCustomDocDomainProvider {
  GoDaddy = 'GoDaddy',
  Namecheap = 'Namecheap',
  Hover = 'Hover (Tucows)',
  NetworkSolutions = 'Network Solutions',
  GoogleDomains = 'Google Domains',
  Other = 'Other',
}

export enum PublicApiCustomDocDomainSetupStatus {
  Pending = 'pending',
  Succeeded = 'succeeded',
  Failed = 'failed',
}

export enum PublicApiCustomDomainConnectedStatus {
  Connected = 'connected',
  NotConnected = 'notConnected',
}

/**
 * The result of adding a custom domain to a published doc.
 */
export interface PublicApiAddCustomDocDomainResponse {}

/**
 * Payload for adding a custom published doc domain.
 */
export interface PublicApiAddCustomDocDomainRequest {
  /**
   * The custom domain.
   */
  customDocDomain: string;
}

/**
 * The result of updating a custom domain for a published doc.
 */
export interface PublicApiUpdateCustomDocDomainResponse {}

/**
 * Payload for updating the properties of a custom published doc domain.
 */
export interface PublicApiUpdateCustomDocDomainRequest {}

/**
 * The result of deleting a custom domain from a published doc.
 */
export interface PublicApiDeleteCustomDocDomainResponse {}

/**
 * The result of determining the domain provider for a custom doc domain.
 */
export interface PublicApiCustomDocDomainProviderResponse {
  provider: PublicApiCustomDocDomainProvider;
}

/**
 * A Superhuman Docs folder.
 */
export interface PublicApiFolder {
  /**
   * ID of the Superhuman Docs folder.
   */
  id: string;
  /**
   * The type of this resource.
   */
  type: PublicApiType.Folder;
  /**
   * The name of the folder.
   */
  name: string;
  /**
   * Browser-friendly link to the folder.
   */
  browserLink: string;
  /**
   * The description of the folder.
   */
  description?: string;
  icon?: PublicApiIcon;
  iconColor?: PublicApiFolderIconColor;
  /**
   * Timestamp for when the folder was created.
   */
  createdAt?: string;
  /**
   * Whether the folder settings can be edited. E.g., some folder types (like personal folders - "My Docs") cannot be edited.
   */
  canEdit?: boolean;
  workspace: PublicApiWorkspaceReference;
}

/**
 * List of folders.
 */
export interface PublicApiFolderList {
  items: PublicApiFolder[];
  /**
   * API link to these results.
   */
  href?: string;
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

/**
 * Request for creating a folder.
 */
export interface PublicApiCreateFolderRequest {
  /**
   * Name of the folder.
   */
  name: string;
  /**
   * ID of the workspace where the folder should be created.
   */
  workspaceId: string;
  /**
   * Description of the folder.
   */
  description?: string;
}

/**
 * Request for updating a folder.
 */
export interface PublicApiUpdateFolderRequest {
  /**
   * Name of the folder.
   */
  name?: string;
  /**
   * Description of the folder.
   */
  description?: string;
}

/**
 * The result of a folder deletion.
 */
export interface PublicApiDeleteFolderResult {}

/**
 * Color scheme for folder icons.
 */
export enum PublicApiFolderIconColor {
  DarkBlue = 'DARK_BLUE',
  DarkYellow = 'DARK_YELLOW',
  DarkPurple = 'DARK_PURPLE',
  DarkPink = 'DARK_PINK',
  DarkOrange = 'DARK_ORANGE',
  DarkGreen = 'DARK_GREEN',
  DarkRed = 'DARK_RED',
  DarkGray = 'DARK_GRAY',
  LightBlue = 'LIGHT_BLUE',
  LightYellow = 'LIGHT_YELLOW',
  LightPurple = 'LIGHT_PURPLE',
  LightPink = 'LIGHT_PINK',
  LightOrange = 'LIGHT_ORANGE',
  LightGreen = 'LIGHT_GREEN',
  LightRed = 'LIGHT_RED',
  LightGray = 'LIGHT_GRAY',
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
 * The type of content item in a page.
 */
export enum PublicApiPageContentItemType {
  Line = 'line',
}

/**
 * Content format for the item.
 */
export enum PublicApiPageContentItemContentFormat {
  PlainText = 'plainText',
}

/**
 * Content details of the item.
 */
export interface PublicApiPageContentItemContent {
  style: PublicApiPageLineStyle;
  format: PublicApiPageContentItemContentFormat;
  /**
   * Content of the item in the specified format.
   */
  content: string;
  /**
   * Indentation level of the element. Present for indentable elements (paragraphs, blockquotes, and list items).
   *
   */
  lineLevel?: number;
}

/**
 * Content item in a page (canvas).
 */
export interface PublicApiPageContentItem {
  /**
   * ID of the content item.
   */
  id: string;
  type: PublicApiPageContentItemType;
  itemContent?: PublicApiPageContentItemContent;
}

/**
 * List of page content elements.
 */
export interface PublicApiPageContentList {
  items: PublicApiPageContentItem[];
  /**
   * API link to these results
   */
  href: string;
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
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
  contentType: PublicApiPageType;
  /**
   * Whether the page is hidden in the UI.
   */
  isHidden: boolean;
  /**
   * Whether the page or any of its parents is hidden in the UI.
   */
  isEffectivelyHidden: boolean;
  parent?: PublicApiPageReference;
  children: PublicApiPageReference[];
  /**
   * Authors of the page
   */
  authors?: PublicApiPersonValue[];
  /**
   * Timestamp for when the page was created.
   */
  createdAt?: string;
  createdBy?: PublicApiPersonValue;
  /**
   * Timestamp for when page content was last modified.
   */
  updatedAt?: string;
  updatedBy?: PublicApiPersonValue;
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
 * Payload for creating a new page in a doc.
 */
export interface PublicApiPageCreate {
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
   * Url of the cover image to use.
   */
  imageUrl?: string;
  /**
   * The ID of this new page's parent, if creating a subpage.
   */
  parentPageId?: string;
  pageContent?: PublicApiPageCreateContent;
}

/**
 * Content that can be added to a page at creation time, either text (or rich text) or a URL to create a full-page embed.
 */
export type PublicApiPageCreateContent =
  | {
      /**
       * Indicates a page containing canvas content.
       */
      type: PublicApiPageType.Canvas;
      canvasContent: PublicApiPageContent;
    }
  | {
      /**
       * Indicates a page that embeds other content.
       */
      type: PublicApiPageType.Embed;
      /**
       * The URL of the content to embed.
       */
      url: string;
      renderMethod?: PublicApiPageEmbedRenderMethod;
    }
  | (
      | {
          /**
           * Indicates a page that embeds other Superhuman Docs content.
           */
          type: PublicApiPageType.SyncPage;
          /**
           * Indicates a single-page sync page.
           */
          mode: PublicApiSyncPageType.Page;
          /**
           * Include subpages in the sync page.
           */
          includeSubpages: boolean;
          /**
           * The page id to insert as a sync page.
           */
          sourcePageId: string;
          /**
           * The id of the document to insert as a sync page.
           */
          sourceDocId: string;
        }
      | {
          /**
           * Indicates a page that embeds other content.
           */
          type: PublicApiPageType.SyncPage;
          /**
           * Indicates a full doc sync page.
           */
          mode: PublicApiSyncPageType.Document;
          /**
           * The id of the document to insert as a sync page.
           */
          sourceDocId: string;
        }
    );

/**
 * The result of a page creation.
 */
export type PublicApiPageCreateResult = PublicApiDocumentMutateResponse & {
  /**
   * ID of the created page.
   */
  id: string;
};

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
   * Url of the cover image to use.
   */
  imageUrl?: string;
  /**
   * Whether the page is hidden or not. Note that for pages that cannot be hidden, like the sole top-level page in a doc, this will be ignored.
   */
  isHidden?: boolean;
  contentUpdate?: {} & PublicApiPageContentUpdate;
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
 * The result of a page deletion.
 */
export type PublicApiPageDeleteResult = PublicApiDocumentMutateResponse & {
  /**
   * ID of the page to be deleted.
   */
  id: string;
};

/**
 * Payload for deleting content from a page.
 */
export interface PublicApiPageContentDelete {
  /**
   * IDs of the elements to delete from the page. If omitted or empty, all content will be deleted.
   *
   */
  elementIds?: string[];
}

/**
 * The result of a page content deletion.
 */
export type PublicApiPageContentDeleteResult = PublicApiDocumentMutateResponse & {
  /**
   * ID of the page whose content was deleted.
   */
  id: string;
};

/**
 * Mode for updating the content on an existing page.
 */
export enum PublicApiPageContentInsertionMode {
  Append = 'append',
  Prepend = 'prepend',
  Replace = 'replace',
}

/**
 * Payload for updating the content of an existing page.
 */
export interface PublicApiPageContentUpdate {
  insertionMode: PublicApiPageContentInsertionMode;
  /**
   * ID of the element on the page to use as a reference point for editing content. If provided, the operation will be relative to this element (e.g., append after it, prepend before it, replace it). If omitted, the operation will be performed on the entire page (e.g., append to end, prepend to beginning, replace all).
   *
   */
  elementId?: string;
  canvasContent: PublicApiPageContent;
}

/**
 * Request for beginning an export of page content.
 */
export interface PublicApiBeginPageContentExportRequest {
  outputFormat: PublicApiPageContentOutputFormat;
}

/**
 * Response when beginning an export of page content.
 */
export interface PublicApiBeginPageContentExportResponse {
  /**
   * The identifier of this export request.
   */
  id: string;
  /**
   * The status of this export.
   */
  status: string;
  /**
   * The URL that reports the status of this export. Poll this URL to get the content URL when the export has completed.
   */
  href: string;
}

/**
 * Supported output content formats that can be requested for getting content for an existing page.
 */
export enum PublicApiPageContentOutputFormat {
  Html = 'html',
  Markdown = 'markdown',
}

/**
 * Status of a page content export.
 */
export enum PublicApiPageContentExportStatus {
  InProgress = 'inProgress',
  Failed = 'failed',
  Complete = 'complete',
}

/**
 * Response when requesting the status of a page content export.
 */
export interface PublicApiPageContentExportStatusResponse {
  /**
   * The identifier of this export request.
   */
  id: string;
  /**
   * The status of this export.
   */
  status: string;
  /**
   * The URL that reports the status of this export.
   */
  href: string;
  /**
   * Once the export completes, the location where the resulting export file can be downloaded; this link typically expires after a short time.  Call this method again to get a fresh link.
   */
  downloadLink?: string;
  /**
   * Message describing an error, if this export failed.
   */
  error?: string;
}

/**
 * Render mode for a page using the Embed page type.
 */
export enum PublicApiPageEmbedRenderMethod {
  Compatibility = 'compatibility',
  Standard = 'standard',
}

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
 * Content to be added or replaced with in a page (canvas).
 *
 */
export interface PublicApiPageContent {
  format: PublicApiPageContentFormat;
  /**
   * The actual page content.
   */
  content: string;
}

/**
 * Supported content types for page (canvas) content.
 */
export enum PublicApiPageContentFormat {
  Html = 'html',
  Markdown = 'markdown',
}

/**
 * The type of a page in a doc.
 */
export enum PublicApiPageType {
  Canvas = 'canvas',
  Embed = 'embed',
  SyncPage = 'syncPage',
  Table = 'table',
}

/**
 * The style of a line element in a canvas page.
 */
export enum PublicApiPageLineStyle {
  BlockQuote = 'blockQuote',
  BulletedList = 'bulletedList',
  CheckboxList = 'checkboxList',
  Code = 'code',
  CollapsibleList = 'collapsibleList',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  NumberedList = 'numberedList',
  Paragraph = 'paragraph',
  PullQuote = 'pullQuote',
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
 * The type of sync page in a doc
 */
export enum PublicApiSyncPageType {
  Page = 'page',
  Document = 'document',
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
  /**
   * The ID of the underlying view of the table.
   */
  viewId: string;
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
 * Format of an image reference column.
 */
export type PublicApiImageReferenceColumnFormat = PublicApiSimpleColumnFormat & {
  width: {} & PublicApiNumberOrNumberFormula;
  height: {} & PublicApiNumberOrNumberFormula;
  style: PublicApiImageShapeStyle;
};

/**
 * How an image should be displayed.
 */
export enum PublicApiImageShapeStyle {
  Auto = 'auto',
  Circle = 'circle',
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
  displayType?: PublicApiSliderDisplayType;
  /**
   * Whether the underyling numeric value is also displayed.
   */
  showValue?: boolean;
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
 * Format of a select column.
 */
export type PublicApiSelectColumnFormat = PublicApiSimpleColumnFormat & {
  /**
   * For select format columns, the list of available options. Only returned for select lists that used a fixed set of options. Returns the first 5000 options.
   */
  options?: PublicApiSelectOption[];
};

/**
 * An option for a select column.
 */
export interface PublicApiSelectOption {
  /**
   * The name of the option.
   */
  name: string;
  /**
   * The background color of the option.
   */
  backgroundColor?: string;
  /**
   * The foreground color of the option.
   */
  foregroundColor?: string;
}

/**
 * How the slider should be rendered.
 */
export enum PublicApiSliderDisplayType {
  Slider = 'slider',
  Progress = 'progress',
}

/**
 * Format of a checkbox column.
 */
export type PublicApiCheckboxColumnFormat = PublicApiSimpleColumnFormat & {
  displayType: PublicApiCheckboxDisplayType;
};

/**
 * How a checkbox should be displayed.
 */
export enum PublicApiCheckboxDisplayType {
  Toggle = 'toggle',
  Check = 'check',
}

/**
 * Format of a column.
 */
export type PublicApiColumnFormat =
  | PublicApiButtonColumnFormat
  | PublicApiCheckboxColumnFormat
  | PublicApiDateColumnFormat
  | PublicApiDateTimeColumnFormat
  | PublicApiDurationColumnFormat
  | PublicApiEmailColumnFormat
  | PublicApiLinkColumnFormat
  | PublicApiCurrencyColumnFormat
  | PublicApiImageReferenceColumnFormat
  | PublicApiNumericColumnFormat
  | PublicApiReferenceColumnFormat
  | PublicApiSelectColumnFormat
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
  ImageReference = 'imageReference',
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
 * A Superhuman Docs result or entity expressed as a primitive type.
 */
export type PublicApiScalarValue = string | number | boolean;

/**
 * A Superhuman Docs result or entity expressed as a primitive type, or array of primitive types.
 */
export type PublicApiValue = PublicApiScalarValue | (PublicApiScalarValue | PublicApiScalarValue[])[];

/**
 * A value that contains rich structured data. Cell values are composed of these values or arrays of these values.
 *
 */
export type PublicApiRichSingleValue =
  | PublicApiScalarValue
  | PublicApiCodaInternalRichTextValue
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
 * A value representing a Superhuman Docs row.
 */
export type PublicApiRowValue = PublicApiLinkedDataObject & {
  '@type': PublicApiLinkedDataType.StructuredValue;
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
  additionalType: PublicApiType.Row;
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
   * An identifier of additional type info specific to Superhuman Docs that may not be present in a schema.org taxonomy,
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
  '@type': PublicApiLinkedDataType.WebPage;
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
  '@type': PublicApiLinkedDataType.ImageObject;
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
  '@type': PublicApiLinkedDataType.Person;
  /**
   * The full name of the person.
   */
  name: string;
  /**
   * The email address of the person.
   */
  email?: string;
  /**
   * The Superhuman Docs ID of the person.
   */
  userId?: number;
};

/**
 * A numeric monetary amount as a string or number.
 */
export type PublicApiCurrencyAmount = string | number;

/**
 * A monetary value with its associated currency code.
 */
export type PublicApiCurrencyValue = PublicApiLinkedDataObject & {
  '@type': PublicApiLinkedDataType.MonetaryAmount;
  /**
   * The 3-letter currency code.
   */
  currency: string;
  amount: PublicApiCurrencyAmount;
};

/**
 * A rich text value in Superhuman Docs internal format.
 */
export type PublicApiCodaInternalRichTextValue = PublicApiLinkedDataObject & {
  '@type': PublicApiLinkedDataType.StructuredValue;
  /**
   * The type of this resource.
   */
  additionalType: PublicApiType.InternalRichText;
  /**
   * The rich text value in Superhuman Docs internal format.
   */
  value: string;
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
  AIBlock = 'aiBlock',
  Button = 'button',
  Checkbox = 'checkbox',
  DatePicker = 'datePicker',
  DateRangePicker = 'dateRangePicker',
  DateTimePicker = 'dateTimePicker',
  Lookup = 'lookup',
  Multiselect = 'multiselect',
  Select = 'select',
  Scale = 'scale',
  Slider = 'slider',
  Reaction = 'reaction',
  Textbox = 'textbox',
  TimePicker = 'timePicker',
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
  /**
   * ID of the organization this user belongs to, if any. Only returned if includeUserOrg query param is set.
   */
  organizationId?: string;
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
  Database = 'database',
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
  /**
   * A warning if the mutation completed but with caveats.
   */
  warning?: string;
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
 * Reference to a Superhuman Docs folder.
 */
export interface PublicApiFolderReference {
  /**
   * ID of the Superhuman Docs folder.
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
  /**
   * Name of the folder; included if the user has access to the folder.
   */
  name?: string;
}

/**
 * Reference to a Superhuman Docs workspace.
 */
export interface PublicApiWorkspaceReference {
  /**
   * ID of the Superhuman Docs workspace.
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
   * Browser-friendly link to the Superhuman Docs workspace.
   */
  browserLink: string;
  /**
   * Name of the workspace; included if the user has access to the workspace.
   */
  name?: string;
}

/**
 * Metadata about a Superhuman Docs workspace.
 */
export interface PublicApiWorkspace {
  /**
   * ID of the Superhuman Docs workspace.
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
   * Browser-friendly link to the Superhuman Docs workspace.
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
  roleChangedAt?: string;
  /**
   * Date when the user last took an action in any workspace.
   */
  lastActiveAt?: string;
  /**
   * Number of docs the user owns in this workspace.
   */
  ownedDocs?: number;
  /**
   * Date when anyone last accessed a doc that the user owns in this workspace.
   */
  docsLastActiveAt?: string;
  /**
   * Number of collaborators that have interacted with docs owned by the user in the last 90 days.
   */
  docCollaboratorCount?: number;
  /**
   * Number of docs the user owns, manages, or to which they have added pages in the last 90 days.
   */
  totalDocs?: number;
  /**
   * Date when anyone last accessed a doc the member owns or contributed to.
   */
  totalDocsLastActiveAt?: string;
  /**
   * Number of unique users that have viewed any doc the user owns, manages, or has added pages to in the last 90 days.
   */
  totalDocCollaboratorsLast90Days?: number;
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
 * Analytics data for a document.
 */
export interface PublicApiDocAnalyticsItem {
  doc: PublicApiDocAnalyticsDetails;
  metrics: PublicApiDocAnalyticsMetrics[];
}

/**
 * List of analytics for documents over a date range.
 */
export interface PublicApiDocAnalyticsCollection {
  items: PublicApiDocAnalyticsItem[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

/**
 * Analytics metrics for a document.
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
  /**
   * Sum of the total sessions from any device.
   */
  totalSessions: number;
  /**
   * Number of credits used for AI chat.
   */
  aiCreditsChat?: number;
  /**
   * Number of credits used for AI block.
   */
  aiCreditsBlock?: number;
  /**
   * Number of credits used for AI column.
   */
  aiCreditsColumn?: number;
  /**
   * Number of credits used for AI assistant.
   */
  aiCreditsAssistant?: number;
  /**
   * Number of credits used for AI reviewer.
   */
  aiCreditsReviewer?: number;
  /**
   * Total number of AI credits used.
   */
  aiCredits?: number;
}

/**
 * Determines how the Doc analytics returned are sorted.
 */
export enum PublicApiDocAnalyticsOrderBy {
  AnalyticsDate = 'date',
  DocId = 'docId',
  Title = 'title',
  CreatedAt = 'createdAt',
  PublishedAt = 'publishedAt',
  Likes = 'likes',
  Copies = 'copies',
  Views = 'views',
  SessionsDesktop = 'sessionsDesktop',
  SessionsMobile = 'sessionsMobile',
  SessionsOther = 'sessionsOther',
  TotalSessions = 'totalSessions',
  AiCreditsChat = 'aiCreditsChat',
  AiCreditsBlock = 'aiCreditsBlock',
  AiCreditsColumn = 'aiCreditsColumn',
  AiCreditsAssistant = 'aiCreditsAssistant',
  AiCreditsReviewer = 'aiCreditsReviewer',
  AiCredits = 'aiCredits',
}

export type PublicApiDocAnalyticsDetails = PublicApiDocReference & {
  /**
   * The name of the doc.
   */
  title: string;
  icon?: PublicApiIcon;
  /**
   * Creation time of the doc.
   */
  createdAt: string;
  /**
   * Published time of the doc.
   */
  publishedAt?: string;
};

/**
 * Summarized metrics for documents.
 */
export interface PublicApiDocAnalyticsSummary {
  /**
   * Total number of sessions across all docs.
   */
  totalSessions: number;
}

/**
 * Analytics metrics for a page within a document.
 */
export interface PublicApiPageAnalyticsMetrics {
  /**
   * Date of the analytics data.
   */
  date: string;
  /**
   * Number of times the page was viewed within the given day.
   */
  views: number;
  /**
   * Number of unique browsers that viewed the page on the given day.
   */
  sessions: number;
  /**
   * Number of unique Superhuman Docs users that viewed the page on the given day.
   */
  users: number;
  /**
   * Average number of seconds that the page was viewed on the given day.
   */
  averageSecondsViewed: number;
  /**
   * Median number of seconds that the page was viewed on the given day.
   */
  medianSecondsViewed: number;
  /**
   * Number of unique tabs that opened the doc on the given day.
   */
  tabs: number;
}

/**
 * Analytics data for a page within a document.
 */
export interface PublicApiPageAnalyticsItem {
  page: PublicApiPageAnalyticsDetails;
  metrics: PublicApiPageAnalyticsMetrics[];
}

/**
 * Metadata about a page relevant to analytics.
 */
export interface PublicApiPageAnalyticsDetails {
  /**
   * ID of the page.
   */
  id: string;
  /**
   * Name of the page.
   */
  name: string;
  icon?: PublicApiIcon;
}

/**
 * List of analytics for pages within a document over a date range.
 */
export interface PublicApiPageAnalyticsCollection {
  items: PublicApiPageAnalyticsItem[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
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
 * List of analytics for Superhuman Packs over a date range.
 */
export interface PublicApiPackAnalyticsCollection {
  items: PublicApiPackAnalyticsItem[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

/**
 * Analytics data for a Superhuman Pack.
 */
export interface PublicApiPackAnalyticsItem {
  pack: PublicApiPackAnalyticsDetails;
  metrics: PublicApiPackAnalyticsMetrics[];
}

/**
 * Analytics metrics for a Superhuman Pack.
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
  /**
   * Number of unique workspaces that are currently involved in a trial.
   */
  workspacesActivelyTrialing: number;
  /**
   * Number of unique workspaces that have been involved in a trial in the last 7 days.
   */
  workspacesActivelyTrialing7Day: number;
  /**
   * Number of unique workspaces that have been involved in a trial in the last 30 days.
   */
  workspacesActivelyTrialing30Day: number;
  /**
   * Number of unique workspaces that have been involved in a trial in the last 90 days.
   */
  workspacesActivelyTrialing90Day: number;
  /**
   * Number of unique workspaces that have been involved in a trial ever.
   */
  workspacesActivelyTrialingAllTime: number;
  /**
   * Number of unique workspaces that have recently subscribed to the Pack.
   */
  workspacesNewlySubscribed: number;
  /**
   * Number of unique workspaces that are currently subscribed to the Pack.
   */
  workspacesWithActiveSubscriptions: number;
  /**
   * Number of unique workspaces that subscribed after undertaking a Pack trial.
   */
  workspacesWithSuccessfulTrials: number;
  /**
   * Amount of revenue (in USD) that the Pack has produced.
   */
  revenueUsd: string;
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
  WorkspacesWithActiveSubscriptions = 'workspacesWithActiveSubscriptions',
  WorkspacesWithSuccessfulTrials = 'workspacesWithSuccessfulTrials',
  RevenueUsd = 'revenueUsd',
}

/**
 * Summary analytics for Packs.
 */
export interface PublicApiPackAnalyticsSummary {
  /**
   * The number of times this Pack was installed in docs.
   */
  totalDocInstalls: number;
  /**
   * The number of times this Pack was installed in workspaces.
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
 * Analytics metrics for a Superhuman Pack formula.
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
  /**
   * Number of unique workspaces that are currently involved in a trial.
   */
  workspacesActivelyTrialing?: number;
  /**
   * Number of unique workspaces that have been involved in a trial in the last 7 days.
   */
  workspacesActivelyTrialing7Day?: number;
  /**
   * Number of unique workspaces that have been involved in a trial in the last 30 days.
   */
  workspacesActivelyTrialing30Day?: number;
  /**
   * Number of unique workspaces that have been involved in a trial in the last 90 days.
   */
  workspacesActivelyTrialing90Day?: number;
  /**
   * Number of unique workspaces that have been involved in a trial ever.
   */
  workspacesActivelyTrialingAllTime?: number;
  /**
   * Number of unique workspaces that have recently subscribed to the Pack.
   */
  workspacesNewlySubscribed?: number;
  /**
   * Number of unique workspaces that are currently subscribed to the Pack.
   */
  workspacesWithActiveSubscriptions?: number;
  /**
   * Number of unique workspaces that subscribed after undertaking a Pack trial.
   */
  workspacesWithSuccessfulTrials?: number;
  /**
   * Amount of revenue (in USD) that the Pack has produced.
   */
  revenueUsd?: string;
}

/**
 * Analytics data for a Superhuman Pack formula.
 */
export interface PublicApiPackFormulaAnalyticsItem {
  formula: PublicApiPackFormulaIdentifier;
  metrics: PublicApiPackFormulaAnalyticsMetrics[];
}

/**
 * A collection of analytics for Superhuman Packs formulas over a date range.
 */
export interface PublicApiPackFormulaAnalyticsCollection {
  items: PublicApiPackFormulaAnalyticsItem[];
  nextPageToken?: PublicApiNextPageToken;
  nextPageLink?: PublicApiNextPageLink & string;
}

/**
 * Determines how the Pack formula analytics returned are sorted.
 */
export enum PublicApiPackFormulaAnalyticsOrderBy {
  AnalyticsDate = 'date',
  FormulaName = 'formulaName',
  FormulaType = 'formulaType',
  FormulaInvocations = 'formulaInvocations',
  MedianLatencyMs = 'medianLatencyMs',
  MedianResponseSizeBytes = 'medianResponseSizeBytes',
  Errors = 'errors',
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
 * Response representing the last day analytics were updated.
 */
export interface PublicApiAnalyticsLastUpdatedResponse {
  /**
   * Date that doc analytics were last updated.
   */
  docAnalyticsLastUpdated: string;
  /**
   * Date that Pack analytics were last updated.
   */
  packAnalyticsLastUpdated: string;
  /**
   * Date that Pack formula analytics were last updated.
   */
  packFormulaAnalyticsLastUpdated: string;
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
   * The example images for the Pack.
   */
  exampleImages?: PublicApiPackImageFile[];
  /**
   * The agent images for the Pack.
   */
  agentImages?: PublicApiPackImageFile[];
  /**
   * The parent workspace for the Pack.
   */
  workspaceId: string;
  /**
   * Publishing categories associated with this Pack.
   */
  categories: PublicApiPublishingCategory[];
  /**
   * Denotes if the Pack is certified by Superhuman.
   */
  certified?: boolean;
  /**
   * Denotes if the Pack is certified by Grammarly to be optimized for agent usage.
   */
  certifiedAgent?: boolean;
  sourceCodeVisibility?: PublicApiPackSourceCodeVisibility;
  /**
   * Pack entrypoints where this Pack is available
   */
  packEntrypoints?: PublicApiPackEntrypoint[];
  /**
   * The latest released Pack version that has been verified (approved) for use. For agent Packs, this is the most recent release that passed review. For non-agent Packs or legacy releases, this is the most recent release.
   */
  verifiedVersion?: string;
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
   * A short description for the Pack as an agent.
   */
  agentShortDescription?: string;
  /**
   * A full description for the Pack as an agent.
   */
  agentDescription?: string;
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
  overallRateLimit?: PublicApiPackRateLimit;
  perConnectionRateLimit?: PublicApiPackRateLimit;
  featuredDocStatus?: PublicApiFeaturedDocStatus;
  additionalInformation?: PublicApiPackListingAdditionalInformation;
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
   * The example images for the Pack.
   */
  exampleImages?: PublicApiPackImageFile[];
  /**
   * The agent images for the Pack.
   */
  agentImages?: PublicApiPackImageFile[];
  /**
   * The parent workspace for the Pack.
   */
  workspaceId: string;
  /**
   * Publishing categories associated with this Pack.
   */
  categories: PublicApiPublishingCategory[];
  /**
   * Denotes if the Pack is certified by Superhuman.
   */
  certified?: boolean;
  /**
   * Denotes if the Pack is certified by Grammarly to be optimized for agent usage.
   */
  certifiedAgent?: boolean;
  sourceCodeVisibility?: PublicApiPackSourceCodeVisibility;
  /**
   * Pack entrypoints where this Pack is available
   */
  packEntrypoints?: PublicApiPackEntrypoint[];
  /**
   * The latest released Pack version that has been verified (approved) for use. For agent Packs, this is the most recent release that passed review. For non-agent Packs or legacy releases, this is the most recent release.
   */
  verifiedVersion?: string;
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
   * A short description for the Pack as an agent.
   */
  agentShortDescription?: string;
  /**
   * A full description for the Pack as an agent.
   */
  agentDescription?: string;
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
  AgentDirectorySort = 'agentDirectorySort',
}

/**
 * Information indicating where to upload the Pack version definition.
 */
export interface PublicApiPackVersionUploadInfo {
  /**
   * A URL to be used for uploading a Pack version definition.
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
  | PublicApiPackGlobalPrincipal
  | PublicApiPackNomosOrganizationPrincipal
  | PublicApiPackGroupPrincipal
  | PublicApiPackGrammarlyInstitutionPrincipal;

/**
 * Type of Pack permissions.
 */
export enum PublicApiPackPrincipalType {
  User = 'user',
  Workspace = 'workspace',
  Worldwide = 'worldwide',
  NomosOrganization = 'nomosOrganization',
  Group = 'group',
  GrammarlyInstitution = 'grammarlyInstitution',
}

export enum PublicApiPackAccessType {
  None = 'none',
  View = 'view',
  Test = 'test',
  Edit = 'edit',
  Admin = 'admin',
}

/**
 * Access types for a Pack.
 */
export type PublicApiPackAccessTypes = PublicApiPackAccessType[];

export enum PublicApiPackEntrypoint {
  Go = 'go',
  Docs = 'docs',
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

export interface PublicApiPackNomosOrganizationPrincipal {
  type: PublicApiPackPrincipalType.NomosOrganization;
  nomosOrganizationId: string;
}

export interface PublicApiPackGroupPrincipal {
  type: PublicApiPackPrincipalType.Group;
  groupId: string;
  groupName?: string;
}

export interface PublicApiPackGrammarlyInstitutionPrincipal {
  type: PublicApiPackPrincipalType.GrammarlyInstitution;
  grammarlyInstitutionId: number;
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

/**
 * Metadata about a Pack invitation.
 */
export interface PublicApiPackInvitation {
  /**
   * ID of the invitation
   */
  invitationId: string;
  /**
   * ID of the Pack
   */
  packId: number;
  /**
   * Email address of the invited user
   */
  inviteeEmail: string;
  /**
   * User ID of the user who created this invitation
   */
  inviterUserId: number;
  access: PublicApiPackAccessType;
  /**
   * Timestamp when the invitation was created
   */
  createdAt: string;
  /**
   * Timestamp when the invitation expires
   */
  expiresAt: string;
}

/**
 * List of Pack invitations.
 */
export interface PublicApiPackInvitationList {
  items: PublicApiPackInvitation[];
  /**
   * Token for fetching the next page of results
   */
  nextPageToken?: string | null;
  /**
   * URL for fetching the next page of results
   */
  nextPageLink?: string | null;
}

/**
 * Pack invitation with Pack metadata.
 */
export interface PublicApiPackInvitationWithPack {
  invitation: PublicApiPackInvitation;
  pack: PublicApiPackSummary;
  makers: PublicApiMaker[];
  /**
   * Network domain of the Pack
   */
  networkDomains: string[];
}

/**
 * List of Pack invitations with Pack metadata.
 */
export interface PublicApiPackInvitationWithPackList {
  items: PublicApiPackInvitationWithPack[];
  /**
   * Token for fetching the next page of results
   */
  nextPageToken?: string | null;
  /**
   * URL for fetching the next page of results
   */
  nextPageLink?: string | null;
}

/**
 * A Pack image file.
 */
export interface PublicApiPackImageFile {
  /**
   * The name of the image file.
   */
  filename: string;
  /**
   * The URL to the image file.
   */
  imageUrl: string;
  /**
   * The asset id of the Pack's image.
   */
  assetId: string;
  /**
   * The alt text for the image.
   */
  altText?: string;
  /**
   * The media type of the image.
   */
  mimeType?: string;
}

export enum PublicApiPackAssetType {
  Logo = 'logo',
  Cover = 'cover',
  ExampleImage = 'exampleImage',
  AgentImage = 'agentImage',
}

/**
 * Information indicating where to upload the Pack asset, and an endpoint to mark the upload as complete.
 */
export interface PublicApiPackAssetUploadInfo {
  /**
   * A signed URL to be used for uploading a Pack asset.
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
 * Basic details about a configuration that can be used in conjunction with a Pack
 */
export interface PublicApiPackConfigurationEntry {
  configurationId: string;
  /**
   * Name of the configuration
   */
  name: string;
  /**
   * Policy associated with the configuration
   */
  policy?: {
    [k: string]: unknown;
  };
}

/**
 * Describes restrictions that a user's organization has placed on a Pack
 */
export interface PublicApiPackOrganizationAccessForDocs {
  canRequestAccess: boolean;
  hasRequestedAccess: boolean;
  requiresConfiguration: boolean;
  allowedConfigurations?: PublicApiPackConfigurationEntry[];
  allowedPackIds?: number[];
  incompatibleDocPermissions?: PublicApiPermission[];
  incompatibleDocOwner?: PublicApiUserSummary;
  incompatibleDocFolder?: PublicApiFolderReference;
  isDocOwner?: boolean;
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
  /**
   * What Packs SDK version was this version built on.
   */
  sdkVersion?: string;
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
   * What Packs SDK version was this version built on.
   */
  sdkVersion: string;
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
 * Request to create a Pack review
 */
export interface PublicApiCreatePackReviewRequest {
  /**
   * Pack version to review (for code reviews)
   */
  packVersion?: string;
  /**
   * Release notes for this version (used when Pack is approved and released)
   */
  releaseNotes?: string;
}

/**
 * Response containing created review information
 */
export interface PublicApiCreatePackReviewResponse {
  /**
   * ID of the created review
   */
  packReviewId: string;
}

/**
 * Response confirming the Pack review was canceled
 */
export interface PublicApiCancelPackReviewResponse {}

/**
 * The status of a Pack review
 */
export enum PublicApiPackReviewStatus {
  Pending = 'pending',
  Approved = 'approved',
  Denied = 'denied',
  Canceled = 'canceled',
  Superseded = 'superseded',
}

/**
 * A Pack review submission
 */
export interface PublicApiPackReview {
  /**
   * ID of the review
   */
  packReviewId: string;
  /**
   * ID of the Pack being reviewed
   */
  packId: number;
  /**
   * Pack version being reviewed (for code reviews)
   */
  packVersion?: string;
  /**
   * Whether listing info was included in the review scope
   */
  includesListingReview?: boolean;
  packReviewStatus: PublicApiPackReviewStatus;
  /**
   * User ID of the person who submitted the review
   */
  submittedByUserId: number;
  /**
   * When the review was submitted
   */
  submissionTimestamp: string;
  additionalInformation?: PublicApiPackReviewAdditionalInformation;
}

/**
 * Additional information about the Pack review
 */
export interface PublicApiPackReviewAdditionalInformation {
  /**
   * Whether the agent or third-party partners collect personal information.
   */
  privacyCollectsPersonalInfo?: boolean | null;
  /**
   * Categories of personal information collected by the agent.
   */
  privacyPersonalInfoCategories?: string[] | null;
  /**
   * Purposes for which collected data is used by the agent or third-party partners.
   */
  privacyDataUsagePurposes?: string[] | null;
  /**
   * Whether data is collected by the developer, a third party, or both.
   */
  privacyDataCollectedBy?: string[] | null;
}

/**
 * Response containing Pack reviews
 */
export interface PublicApiListPackReviewsResponse {
  /**
   * List of Pack reviews
   */
  items: PublicApiPackReview[];
  /**
   * Token for fetching the next page of results
   */
  nextPageToken?: string;
  /**
   * Link for fetching the next page of results
   */
  nextPageLink?: string;
}

/**
 * Draft listing data for a Pack. All fields are optional.
 */
export interface PublicApiPackListingDraftData {
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
  logo?: PublicApiPackImageFile;
  cover?: PublicApiPackImageFile;
  exampleImages?: PublicApiPackImageFile[] | null;
  agentImages?: PublicApiPackImageFile[] | null;
  categoryIds?: string[];
  supportEmail?: string | null;
  termsOfServiceUrl?: string | null;
  privacyPolicyUrl?: string | null;
  sourceCodeVisibility?: PublicApiPackSourceCodeVisibility;
  agentShortDescription?: string | null;
  agentDescription?: string | null;
  additionalInformation?: PublicApiPackListingAdditionalInformation;
}

/**
 * Input data for creating or updating a Pack listing draft. Images only require assetId and filename; the server resolves the full image URL.
 */
export interface PublicApiPackListingDraftInputData {
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
  logo?: PublicApiImageFileForUpdatePackRequest;
  cover?: PublicApiImageFileForUpdatePackRequest;
  exampleImages?: PublicApiImageFileForUpdatePackRequest[] | null;
  agentImages?: PublicApiImageFileForUpdatePackRequest[] | null;
  categoryIds?: string[];
  supportEmail?: string | null;
  termsOfServiceUrl?: string | null;
  privacyPolicyUrl?: string | null;
  sourceCodeVisibility?: PublicApiPackSourceCodeVisibility;
  agentShortDescription?: string | null;
  agentDescription?: string | null;
  additionalInformation?: PublicApiPackListingAdditionalInformation;
}

/**
 * Additional information saved with the Pack listing draft
 */
export interface PublicApiPackListingAdditionalInformation {
  /**
   * Whether the agent or third-party partners collect personal information.
   */
  privacyCollectsPersonalInfo?: boolean | null;
  /**
   * Categories of personal information collected by the agent.
   */
  privacyPersonalInfoCategories?: string[] | null;
  /**
   * Purposes for which collected data is used by the agent or third-party partners.
   */
  privacyDataUsagePurposes?: string[] | null;
  /**
   * Whether data is collected by the developer, a third party, or both.
   */
  privacyDataCollectedBy?: string[] | null;
}

/**
 * Response containing the Pack listing draft
 */
export interface PublicApiGetPackListingDraftResponse {
  /**
   * ID of the listing draft
   */
  packListingDraftId?: string;
  listingData?: PublicApiPackListingDraftData;
}

/**
 * Request to create or update a Pack listing draft
 */
export interface PublicApiUpsertPackListingDraftRequest {
  listingData: PublicApiPackListingDraftInputData;
}

/**
 * Response containing the upserted Pack listing draft
 */
export interface PublicApiUpsertPackListingDraftResponse {
  /**
   * ID of the listing draft
   */
  packListingDraftId: string;
  /**
   * ID of the Pack
   */
  packId: number;
  listingData: PublicApiPackListingDraftData;
}

/**
 * Response after deleting a Pack listing draft
 */
export interface PublicApiDeletePackListingDraftResponse {}

export enum PublicApiPackSource {
  Web = 'web',
  Cli = 'cli',
}

/**
 * Information indicating where to upload the Pack source code, and an endpoint to mark the upload as complete.
 */
export interface PublicApiPackSourceCodeUploadInfo {
  /**
   * A signed URL to be used for uploading a Pack source code.
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
   * The URL to download the source code from
   */
  url: string;
}

/**
 * Widest principal a Pack is available to.
 */
export enum PublicApiPackDiscoverability {
  Public = 'public',
  NomosOrganization = 'nomosOrganization',
  Group = 'group',
  GrammarlyInstitution = 'grammarlyInstitution',
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
   * The timestamp of the latest release of this Pack.
   */
  lastReleasedAt?: string;
  /**
   * The link to the logo of the Pack.
   */
  logoUrl: string;
  logo: PublicApiPackImageFile;
  /**
   * The link to the cover photo of the Pack.
   */
  coverUrl?: string;
  cover?: PublicApiPackImageFile;
  /**
   * The example images for the Pack.
   */
  exampleImages?: PublicApiPackImageFile[];
  /**
   * The agent images for the Pack.
   */
  agentImages?: PublicApiPackImageFile[];
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
   * A short description for the Pack as an agent.
   */
  agentShortDescription?: string;
  /**
   * A full description for the Pack as an agent.
   */
  agentDescription?: string;
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
   * Publishing Categories associated with this Pack.
   */
  categories: PublicApiPublishingCategory[];
  /**
   * Makers associated with this Pack.
   */
  makers: PublicApiMakerSummary[];
  /**
   * Denotes if the Pack is certified by Superhuman.
   */
  certified?: boolean;
  /**
   * Denotes if the Pack is certified by Superhuman to be optimized for agent usage.
   */
  certifiedAgent?: boolean;
  minimumFeatureSet?: PublicApiFeatureSet;
  unrestrictedFeatureSet?: PublicApiFeatureSet;
  /**
   * The URL where complete metadata about the contents of the Pack version can be downloaded.
   */
  externalMetadataUrl: string;
  standardPackPlan?: PublicApiStandardPackPlan;
  bundledPackPlan?: PublicApiBundledPackPlan;
  sourceCodeVisibility?: PublicApiPackSourceCodeVisibility;
  packType?: PublicApiPackType;
  /**
   * What Packs SDK version was this version built on.
   */
  sdkVersion: string;
  packCategoryType: PublicApiPackCategoryType;
  /**
   * Whether the Pack is disabled.
   */
  disabled?: boolean;
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
   * The timestamp of the latest release of this Pack.
   */
  lastReleasedAt?: string;
  /**
   * The link to the logo of the Pack.
   */
  logoUrl: string;
  logo: PublicApiPackImageFile;
  /**
   * The link to the cover photo of the Pack.
   */
  coverUrl?: string;
  cover?: PublicApiPackImageFile;
  /**
   * The example images for the Pack.
   */
  exampleImages?: PublicApiPackImageFile[];
  /**
   * The agent images for the Pack.
   */
  agentImages?: PublicApiPackImageFile[];
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
   * A short description for the Pack as an agent.
   */
  agentShortDescription?: string;
  /**
   * A full description for the Pack as an agent.
   */
  agentDescription?: string;
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
   * Publishing Categories associated with this Pack.
   */
  categories: PublicApiPublishingCategory[];
  /**
   * Makers associated with this Pack.
   */
  makers: PublicApiMakerSummary[];
  /**
   * Denotes if the Pack is certified by Superhuman.
   */
  certified?: boolean;
  /**
   * Denotes if the Pack is certified by Superhuman to be optimized for agent usage.
   */
  certifiedAgent?: boolean;
  minimumFeatureSet?: PublicApiFeatureSet;
  unrestrictedFeatureSet?: PublicApiFeatureSet;
  /**
   * The URL where complete metadata about the contents of the Pack version can be downloaded.
   */
  externalMetadataUrl: string;
  standardPackPlan?: PublicApiStandardPackPlan;
  bundledPackPlan?: PublicApiBundledPackPlan;
  sourceCodeVisibility?: PublicApiPackSourceCodeVisibility;
  packType?: PublicApiPackType;
  /**
   * What Packs SDK version was this version built on.
   */
  sdkVersion: string;
  packCategoryType: PublicApiPackCategoryType;
  /**
   * Whether the Pack is disabled.
   */
  disabled?: boolean;
  discoverability: PublicApiPackDiscoverability;
  userAccess: PublicApiPackUserAccess;
  /**
   * The URL of a Superhuman Docs Help Center article with documentation about the Pack. This will only exist for select Superhuman Docs-authored Packs.
   */
  codaHelpCenterUrl?: string;
  configuration?: PublicApiPackConfigurationEntry;
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
  | PublicApiPackConnectionMultiHeaderMetadata
  | PublicApiPackConnectionUrlParamMetadata
  | PublicApiPackConnectionHttpBasicMetadata
  | PublicApiPackConnectionCustomMetadata
  | PublicApiPackConnectionOauth2ClientCredentialsMetadata
  | PublicApiPackConnectionGoogleServiceAccountMetadata
  | PublicApiPackConnectionAwsAssumeRoleMetadata
  | PublicApiPackConnectionAwsAccessKeyMetadata;

/**
 * Type of a Pack.
 */
export enum PublicApiPackType {
  Standard = 'standard',
  System = 'system',
}

/**
 * The category of a Pack.
 */
export enum PublicApiPackCategoryType {
  Connector = 'connector',
  Agent = 'agent',
  CustomAgent = 'customAgent',
}

/**
 * The access capabilities the current user has for this Pack.
 */
export interface PublicApiPackUserAccess {
  canEdit: boolean;
  canTest: boolean;
  canView: boolean;
  canInstall: boolean;
  canPurchase: boolean;
  requiresTrial: boolean;
  canConnectAccount: boolean;
  organization?: PublicApiPackOrganizationAccessForDocs | PublicApiPackOrganizationAccessForCodaBrain;
  ingestionLimitSettings?: PublicApiIngestionLimitSettings;
}

/**
 * Type of context in which a Pack is being installed.
 */
export enum PublicApiPackListingInstallContextType {
  Workspace = 'workspace',
  Doc = 'doc',
  CodaBrain = 'codaBrain',
}

/**
 * Live or Latest version of Pack
 */
export enum PublicApiIngestionPackReleaseChannel {
  Live = 'LIVE',
  Latest = 'LATEST',
}

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
   * Authorization URL of the OAuth provider.
   */
  authorizationUrl: string;
  /**
   * Token URL of the OAuth provider.
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
  /**
   * Redirect URI of the Pack.
   */
  redirectUri: string;
  /**
   * Whether this Pack uses Dynamic Client Registration for OAuth.
   */
  useDynamicClientRegistration?: boolean;
}

/**
 * Describes restrictions that a user's organization has placed on a Pack for Coda Brain ingestions
 */
export interface PublicApiPackOrganizationAccessForCodaBrain {
  canRequestAccess: boolean;
  hasRequestedAccess: boolean;
  requiresConfiguration: boolean;
  allowedConfigurations?: PublicApiPackConfigurationEntry[];
  allowedPackIds?: number[];
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
  /**
   * The ID of the new Pack's source, if this new Pack was forked.
   */
  sourcePackId?: number | null;
}

/**
 * Info about a Pack that was just created.
 */
export interface PublicApiCreatePackResponse {
  /**
   * The ID assigned to the newly-created Pack.
   */
  packId: number;
  /**
   * The ID of the new Pack's source, if this new Pack was forked.
   */
  sourcePackId?: number | null;
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
   * The SDK version the metadata was built on.
   */
  sdkVersion?: string;
}

/**
 * Type of Pack connections.
 */
export enum PublicApiPackConnectionType {
  Header = 'header',
  MultiHeader = 'multiHeader',
  UrlParam = 'urlParam',
  HttpBasic = 'httpBasic',
  Custom = 'custom',
  OAuth2ClientCredentials = 'oauth2ClientCredentials',
  GoogleServiceAccount = 'googleServiceAccount',
  AwsAssumeRole = 'awsAssumeRole',
  AwsAccessKey = 'awsAccessKey',
}

/**
 * Location of including OAuth2 client credentials in a request.
 */
export enum PublicApiPackOAuth2ClientCredentialsLocation {
  Automatic = 'automatic',
  Body = 'body',
  Header = 'header',
}

/**
 * Credentials of a Pack connection.
 */
export type PublicApiPackSystemConnectionCredentials =
  | PublicApiPackConnectionHeaderCredentials
  | PublicApiPackConnectionMultiHeaderCredentials
  | PublicApiPackConnectionUrlParamCredentials
  | PublicApiPackConnectionHttpBasicCredentials
  | PublicApiPackConnectionCustomCredentials
  | PublicApiPackConnectionOauth2ClientCredentials
  | PublicApiPackConnectionGoogleServiceAccountCredentials
  | PublicApiPackConnectionAwsAssumeRoleCredentials
  | PublicApiPackConnectionAwsAccessKeyCredentials;

export interface PublicApiPackConnectionHeaderMetadata {
  type: PublicApiPackConnectionType.Header;
  maskedToken?: string;
  headerName: string;
  tokenPrefix: string;
}

export interface PublicApiPackConnectionMultiHeaderMetadata {
  type: PublicApiPackConnectionType.MultiHeader;
  headers: {
    headerName: string;
    maskedToken: string;
    tokenPrefix?: string;
  }[];
  presets: {
    headerName: string;
    tokenPrefix?: string;
  }[];
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
   * The domain corresponding to the pre-authorized network domain in the Pack.
   */
  domain: string;
  /**
   * An array containing the keys of parameters specified by the authentication config.
   */
  presetKeys: string[];
}

export interface PublicApiPackConnectionOauth2ClientCredentialsMetadata {
  type: PublicApiPackConnectionType.OAuth2ClientCredentials;
  location: PublicApiPackOAuth2ClientCredentialsLocation;
  maskedClientId: string;
  maskedClientSecret: string;
}

export interface PublicApiPackConnectionGoogleServiceAccountMetadata {
  type: PublicApiPackConnectionType.GoogleServiceAccount;
  maskedServiceAccountKey: string;
}

export interface PublicApiPackConnectionAwsAssumeRoleMetadata {
  type: PublicApiPackConnectionType.AwsAssumeRole;
  service: string;
  roleArn: string;
  externalId: string;
}

export interface PublicApiPackConnectionAwsAccessKeyMetadata {
  type: PublicApiPackConnectionType.AwsAccessKey;
  service: string;
  maskedAccessKeyId: string;
  maskedSecretAccessKey: string;
}

export interface PublicApiPackConnectionHeaderCredentials {
  type: PublicApiPackConnectionType.Header;
  token: string;
}

export interface PublicApiPackConnectionMultiHeaderCredentials {
  type: PublicApiPackConnectionType.MultiHeader;
  tokens: {
    key: string;
    value: string;
  }[];
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

export interface PublicApiPackConnectionOauth2ClientCredentials {
  type: PublicApiPackConnectionType.OAuth2ClientCredentials;
  clientId: string;
  clientSecret: string;
}

export interface PublicApiPackConnectionGoogleServiceAccountCredentials {
  type: PublicApiPackConnectionType.GoogleServiceAccount;
  serviceAccountKey: string;
}

export interface PublicApiPackConnectionAwsAssumeRoleCredentials {
  type: PublicApiPackConnectionType.AwsAssumeRole;
  roleArn: string;
  externalId: string;
}

export interface PublicApiPackConnectionAwsAccessKeyCredentials {
  type: PublicApiPackConnectionType.AwsAccessKey;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface PublicApiPackConnectionHeaderPatch {
  type: PublicApiPackConnectionType.Header;
  token?: string;
}

export interface PublicApiPackConnectionMultiHeaderPatch {
  type: PublicApiPackConnectionType.MultiHeader;
  tokensToPatch?: {
    key: string;
    value: string;
  }[];
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

/**
 * List of Ingestion Batch Executions.
 */
export interface PublicApiIngestionBatchExecutionsList {
  items: PublicApiIngestionBatchExecution[];
  nextPageToken?: PublicApiNextPageToken;
}

/**
 * List of Ingestion Executions.
 */
export interface PublicApiIngestionExecutionsList {
  items: PublicApiIngestionExecutionContext[];
  nextPageToken?: PublicApiNextPageToken;
}

/**
 * List of Ingestion Execution Attempts.
 */
export interface PublicApiIngestionExecutionAttemptsList {
  items: PublicApiIngestionExecutionAttempt[];
  nextPageToken?: PublicApiNextPageToken;
}

/**
 * List of Ingestion Parent Items.
 */
export interface PublicApiIngestionParentItemsList {
  items: PublicApiIngestionParentItem[];
  nextPageToken?: PublicApiNextPageToken;
}

/**
 * Details for Pack agent runtime logs
 */
export interface PublicApiPackAgentRuntimeLogDetails {
  type: PublicApiPackLogType.AgentRuntime;
  /**
   * The input to the turn.
   */
  input?: string;
  /**
   * The output from the turn.
   */
  output?: string;
}

/**
 * Details for Pack fetcher logs
 */
export interface PublicApiPackFetcherLogDetails {
  type: PublicApiPackLogType.Fetcher;
  request: string;
  response?: string;
}

/**
 * Details for Pack invocation logs
 */
export interface PublicApiPackInvocationLogDetails {
  type: PublicApiPackLogType.Invocation;
  result?: {
    stringVal: string;
    int64Val: number;
    doubleVal: number;
    objectVal: string;
    boolVal: boolean;
    dateVal: number;
  };
  /**
   * Supplementary information about the result.
   */
  resultDetail?: string;
  /**
   * Only used by sync invocations.
   */
  continuationJson?: string;
  /**
   * Only used by sync invocations.
   */
  completionJson?: string;
  /**
   * Only used by sync invocations.
   */
  deletedItemIdsJson?: string;
  /**
   * Only used by sync invocations.
   */
  permissionsContextJson?: string;
}

/**
 * Details for a Pack log.
 */
export type PublicApiPackLogDetails =
  | PublicApiPackFetcherLogDetails
  | PublicApiPackInvocationLogDetails
  | PublicApiPackAgentRuntimeLogDetails;

export interface PublicApiPackConnectionCustomPatch {
  type: PublicApiPackConnectionType.Custom;
  paramsToPatch?: {
    key: string;
    value: string;
  }[];
}

export interface PublicApiPackConnectionOauth2ClientCredentialsPatch {
  type: PublicApiPackConnectionType.OAuth2ClientCredentials;
  clientId?: string;
  clientSecret?: string;
}

export interface PublicApiPackConnectionGoogleServiceAccountPatch {
  type: PublicApiPackConnectionType.GoogleServiceAccount;
  serviceAccountKey?: string;
}

export interface PublicApiPackConnectionAwsAssumeRolePatch {
  type: PublicApiPackConnectionType.AwsAssumeRole;
  roleArn?: string;
  externalId?: string;
}

export interface PublicApiPackConnectionAwsAccessKeyPatch {
  type: PublicApiPackConnectionType.AwsAccessKey;
  accessKeyId?: string;
  secretAccessKey?: string;
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
export type PublicApiGroupedPackLog = PublicApiGroupedPackInvocationLog | PublicApiGroupedPackAuthLog;

/**
 * A record of Pack log.
 */
export type PublicApiPackLog =
  | PublicApiPackCustomLog
  | PublicApiPackInvocationLog
  | PublicApiPackFetcherLog
  | PublicApiPackInternalLog
  | PublicApiPackAuthLog
  | PublicApiPackIngestionLifecycleLog
  | PublicApiPackIngestionDebugLog
  | PublicApiPackAgentRuntimeLog
  | PublicApiPackMcpLog;

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
  connectionName?: string;
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
   * True if this is a formula invocation loading a page of a sync table, or metadata for a sync table (like creating a dynamic schema).
   */
  isSyncTable?: boolean;
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
  /**
   * Key to be used in fetching log details.
   */
  detailsKey: string;
  /**
   * Child execution id for this ingestion log.
   */
  ingestionChildExecutionIndex?: number;
  /**
   * Unique identifier of the ingestion that triggered this log.
   */
  ingestionId?: string;
  /**
   * Unique identifier of the root ingestion that triggered this log.
   */
  rootIngestionId?: string;
  /**
   * Unique identifier of the ingestion execution that triggered this log.
   */
  ingestionExecutionId?: string;
  /**
   * Stage along the ingestion lifecycle that this log was created in.
   */
  ingestionStage?: string;
  /**
   * An ingestion lifecycle stage that this ingestion log is bundled under.
   */
  ingestionParentStage?: string;
  /**
   * Execution attempt for this ingestion log.
   */
  ingestionExecutionAttempt?: number;
  /**
   * Parent item id for this ingestion log.
   */
  ingestionParentItemId?: string;
  /**
   * Unique identifier of the ingestion processing call that triggered this log.
   */
  ingestionProcessId?: string;
  /**
   * Additional metadata for the ingestion log.
   */
  additionalMetadata?: {
    [k: string]: unknown;
  };
  /**
   * Agent chat session id.
   */
  agentSessionId?: string;
  /**
   * Agent instance id.
   */
  agentInstanceId?: string;
  /**
   * Executing agent instance id.
   */
  executingAgentInstanceId?: string;
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
 * Grouped logs of the invocations of the Pack.
 */
export interface PublicApiGroupedPackInvocationLog {
  type: PublicApiPackLogType.Invocation;
  invocationLog: PublicApiPackInvocationLog;
  relatedLogs: PublicApiPackLog[];
}

/**
 * Grouped logs of the Pack's auth requests.
 */
export interface PublicApiGroupedPackAuthLog {
  type: PublicApiPackLogType.Auth;
  authLog: PublicApiPackAuthLog;
  relatedLogs: PublicApiPackLog[];
}

/**
 * Pack log generated by an executing agent runtime.
 */
export interface PublicApiPackAgentRuntimeLog {
  type: PublicApiPackLogType.AgentRuntime;
  context: PublicApiPackLogContext;
  /**
   * The type of LLM agent turn that this log is for.
   */
  turnType: string;
  /**
   * The duration of the turn in milliseconds.
   */
  durationMs?: number;
  /**
   * The name of the turn target.
   */
  name?: string;
  /**
   * The model used for the turn.
   */
  model?: string;
  /**
   * The token usage for the turn.
   */
  tokenUsage?: string;
  /**
   * The instructions for the turn.
   */
  instructions?: string;
  /**
   * The name of the agent that initiated the turn.
   */
  fromAgent?: string;
  /**
   * The name of the agent that received the turn.
   */
  toAgent?: string;
}

/**
 * Pack log generated by an MCP (Model Context Protocol) operation.
 */
export interface PublicApiPackMcpLog {
  type: PublicApiPackLogType.Mcp;
  context: PublicApiPackLogContext;
  /**
   * A descriptive message about the MCP operation.
   */
  message?: string;
  /**
   * Error info if this invocation resulted in an error.
   */
  error?: {
    message: string;
    stack?: string;
  };
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
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
  /**
   * base URL of the fetcher request, with all query parameters stripped off.
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
 * Superhuman Docs internal logs from the Packs infrastructure. Only visible to Superhuman employees.
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
 * Pack log generated by an executing ingestion.
 */
export interface PublicApiPackIngestionLifecycleLog {
  type: PublicApiPackLogType.IngestionLifecycle;
  context: PublicApiPackLogContext;
  /**
   * The message that's passed into context.logger.
   */
  message: string;
  level: PublicApiLogLevel;
}

/**
 * Pack log generated by an executing ingestion. Contains metadata helpful for debugging
 */
export interface PublicApiPackIngestionDebugLog {
  type: PublicApiPackLogType.IngestionDebug;
  context: PublicApiPackLogContext;
  /**
   * The message that's passed into context.logger.
   */
  message: string;
  level: PublicApiLogLevel;
}

/**
 * The context request type where a Pack log is generated.
 */
export enum PublicApiPackLogRequestType {
  Unknown = 'unknown',
  ConnectionNameMetadataRequest = 'connectionNameMetadataRequest',
  ParameterAutocompleteMetadataRequest = 'parameterAutocompleteMetadataRequest',
  PostAuthSetupMetadataRequest = 'postAuthSetupMetadataRequest',
  PropertyOptionsMetadataRequest = 'propertyOptionsMetadataRequest',
  GetSyncTableSchemaMetadataRequest = 'getSyncTableSchemaMetadataRequest',
  GetDynamicSyncTableNameMetadataRequest = 'getDynamicSyncTableNameMetadataRequest',
  ListSyncTableDynamicUrlsMetadataRequest = 'listSyncTableDynamicUrlsMetadataRequest',
  SearchSyncTableDynamicUrlsMetadataRequest = 'searchSyncTableDynamicUrlsMetadataRequest',
  GetDynamicSyncTableDisplayUrlMetadataRequest = 'getDynamicSyncTableDisplayUrlMetadataRequest',
  ValidateParametersMetadataRequest = 'getIdentifiersForConnectionRequest',
  GetIdentifiersForConnectionRequest = 'invokeFormulaRequest',
  InvokeFormulaRequest = 'invokeSyncFormulaRequest',
  InvokeSyncFormulaRequest = 'invokeSyncUpdateFormulaRequest',
  InvokeSyncUpdateFormulaRequest = 'invokeExecuteGetPermissionsRequest',
  InvokeExecuteGetPermissionsRequest = 'validateParametersMetadataRequest',
  Mcp = 'mcp',
}

export enum PublicApiPackLogType {
  Custom = 'custom',
  Fetcher = 'fetcher',
  Invocation = 'invocation',
  Internal = 'internal',
  Auth = 'auth',
  IngestionLifecycle = 'ingestionLifecycle',
  IngestionDebug = 'ingestionDebug',
  AgentRuntime = 'agentRuntime',
  Mcp = 'mcp',
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
 * Only relevant for original Superhuman Packs.
 */
export enum PublicApiFeatureSet {
  Basic = 'Basic',
  Pro = 'Pro',
  Team = 'Team',
  Enterprise = 'Enterprise',
}

/**
 * Workspace feature set excluding free.
 */
export enum PublicApiPaidFeatureSet {
  Pro = 'Pro',
  Team = 'Team',
  Enterprise = 'Enterprise',
}

/**
 * Status of featured doc in Pack listing.
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

export enum PublicApiPackFormulaType {
  Action = 'action',
  Formula = 'formula',
  Sync = 'sync',
  Metadata = 'metadata',
}

/**
 * Visibility of a Pack's source code.
 */
export enum PublicApiPackSourceCodeVisibility {
  Private = 'private',
  Shared = 'shared',
}

/**
 * Currency needed to subscribe to the Pack.
 */
export enum PublicApiPackPlanCurrency {
  Usd = 'USD',
}

/**
 * Type of pricing used to subscribe to a Pack.
 */
export enum PublicApiPackPlanPricingType {
  Free = 'Free',
  MonthlyDocMaker = 'MonthlyDocMaker',
  BundledWithTier = 'BundledWithTier',
}

/**
 * Pricing used when workspaces can subscribe to the Pack for free.
 */
export interface PublicApiFreePackPlanPricing {
  type: PublicApiPackPlanPricingType.Free;
}

/**
 * Pricing used when workspaces can subscribe to the Pack for a monthly cost per Doc Maker.
 */
export interface PublicApiMonthlyDocMakerPackPlanPricing {
  type: PublicApiPackPlanPricingType.MonthlyDocMaker;
  /**
   * The monthly cost of the Pack per Doc Maker.
   */
  amount: number;
  currency: PublicApiPackPlanCurrency;
}

/**
 * Pricing used when workspaces have access to the Pack for free if their workspace is at least the given tier.
 */
export interface PublicApiBundledPackPlanPricing {
  type: PublicApiPackPlanPricingType.BundledWithTier;
  minimumFeatureSet: PublicApiPaidFeatureSet;
}

/**
 * The Pack plan to show the Pack can be subscribed to at a monthly cost per Doc Maker or for free.
 */
export interface PublicApiStandardPackPlan {
  packPlanId: string;
  packId: number;
  /**
   * Pricing to show how workspaces can subscribe to the Pack.
   */
  pricing: PublicApiFreePackPlanPricing | PublicApiMonthlyDocMakerPackPlanPricing;
  /**
   * Timestamp for when the Pack plan was created.
   */
  createdAt: string;
}

/**
 * The Pack plan to show the Pack can be accessed if the workspace is at least the given tier.
 */
export interface PublicApiBundledPackPlan {
  packPlanId: string;
  packId: number;
  pricing: PublicApiBundledPackPlanPricing;
  /**
   * Timestamp for when the Pack plan was created.
   */
  createdAt: string;
}

/**
 * The request to patch Pack system connection credentials.
 */
export type PublicApiPatchPackSystemConnectionRequest =
  | PublicApiPackConnectionHeaderPatch
  | PublicApiPackConnectionMultiHeaderPatch
  | PublicApiPackConnectionUrlParamPatch
  | PublicApiPackConnectionHttpBasicPatch
  | PublicApiPackConnectionCustomPatch
  | PublicApiPackConnectionOauth2ClientCredentialsPatch
  | PublicApiPackConnectionGoogleServiceAccountPatch
  | PublicApiPackConnectionAwsAssumeRolePatch
  | PublicApiPackConnectionAwsAccessKeyPatch;

/**
 * Request to set the Pack OAuth configuration.
 */
export interface PublicApiSetPackOauthConfigRequest {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
}

/**
 * The request to set Pack system connection credentials.
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
   * Internal field for cross-environment Pack import.
   */
  dangerouslyAllowCrossEnvPack?: boolean;
  /**
   * Internal field that allows the api to use the non-latest Pack version.
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
   * Information about an image file for an update Pack request.
   */
  logo?: {
    /**
     * The asset id of the Pack's image, returned by [`#PackAssetUploadComplete`](#operation/packAssetUploadComplete) endpoint.
     */
    assetId: string;
    /**
     * The filename for the image.
     */
    filename: string;
    /**
     * The media type of the image being sent.
     */
    mimeType?: string;
  } | null;
  /**
   * Information about an image file for an update Pack request.
   */
  cover?: {
    /**
     * The asset id of the Pack's image, returned by [`#PackAssetUploadComplete`](#operation/packAssetUploadComplete) endpoint.
     */
    assetId: string;
    /**
     * The filename for the image.
     */
    filename: string;
    /**
     * The media type of the image being sent.
     */
    mimeType?: string;
  } | null;
  /**
   * The example images for the Pack.
   */
  exampleImages?: PublicApiImageFileForUpdatePackRequest[] | null;
  /**
   * The agent images for the Pack.
   */
  agentImages?: PublicApiImageFileForUpdatePackRequest[] | null;
  sourceCodeVisibility?: PublicApiPackSourceCodeVisibility;
  /**
   * Pack entrypoints where this Pack is available
   *
   * @minItems 1
   */
  packEntrypoints?: [PublicApiPackEntrypoint, ...PublicApiPackEntrypoint[]] | null;
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
   * A short description for the Pack as an agent.
   */
  agentShortDescription?: string;
  /**
   * A full description for the Pack as an agent.
   */
  agentDescription?: string;
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
}

/**
 * Information about an image file for an update Pack request.
 */
export interface PublicApiImageFileForUpdatePackRequest {
  /**
   * The asset id of the Pack's image, returned by [`#PackAssetUploadComplete`](#operation/packAssetUploadComplete) endpoint.
   */
  assetId: string;
  /**
   * The filename for the image.
   */
  filename: string;
  /**
   * The media type of the image being sent.
   */
  mimeType?: string;
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
 * Confirmation of successfully deleting a user's permissions for a Pack.
 */
export interface PublicApiDeleteUserPackPermissionsResponse {}

/**
 * Payload for creating a Pack invitation.
 */
export interface PublicApiCreatePackInvitationRequest {
  /**
   * Email address of the user to invite
   */
  email: string;
  access: PublicApiPackAccessType;
}

/**
 * Confirmation of successfully creating a Pack invitation.
 */
export interface PublicApiCreatePackInvitationResponse {
  /**
   * The ID of the invitation created.
   */
  invitationId: string;
}

/**
 * Payload for handling a Pack invitation (accept or reject).
 */
export interface PublicApiHandlePackInvitationRequest {
  /**
   * True to accept the invitation, false to reject it
   */
  accept: boolean;
}

/**
 * Confirmation of successfully handling a Pack invitation.
 */
export interface PublicApiHandlePackInvitationResponse {
  /**
   * The ID of the permission that was created. Only returned when accepting the invitation.
   */
  permissionId?: string;
}

/**
 * Payload for updating a Pack invitation.
 */
export interface PublicApiUpdatePackInvitationRequest {
  access: PublicApiPackAccessType;
}

/**
 * Confirmation of successfully updating a Pack invitation.
 */
export interface PublicApiUpdatePackInvitationResponse {}

/**
 * Confirmation of successfully deleting a Pack invitation.
 */
export interface PublicApiDeletePackInvitationResponse {}

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
   * Bypass the Superhuman Docs protection against SDK version regression when multiple makers build versions.
   */
  allowOlderSdkVersion?: boolean;
  /**
   * Internal field for cross-environment Pack import.
   */
  dangerouslyAllowCrossEnvPack?: boolean;
}

/**
 * Payload for creating a new Pack release.
 */
export interface PublicApiCreatePackReleaseRequest {
  /**
   * Which semantic Pack version that the release will be created on.
   */
  packVersion: string;
  /**
   * Developers notes.
   */
  releaseNotes?: string;
  /**
   * Internal field for cross-environment Pack import.
   */
  dangerouslyAllowCrossEnvPack?: boolean;
}

/**
 * Payload for updating a new Pack release.
 */
export interface PublicApiUpdatePackReleaseRequest {
  /**
   * Notes about key features or changes in this release that the Pack maker wants to communicate to users.
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
  findingDetails: {
    finding: string;
    path: string;
  }[];
}

/**
 * Info about the diff between two Pack versions.
 */
export interface PublicApiPackVersionDiffs {
  /**
   * List of changes from the previous version to the next version.
   */
  findings: string[];
  findingDetails: {
    finding: string;
    path: string;
  }[];
}

/**
 * A Pack's featured doc.
 */
export interface PublicApiPackFeaturedDoc {
  doc: PublicApiDocReference;
  /**
   * Whether or not this featured doc is pinned.
   */
  isPinned: boolean;
  docStatus?: PublicApiFeaturedDocStatus;
  /**
   * The URL of the published doc, if available.
   */
  publishedUrl?: string;
}

/**
 * Item representing a featured doc in the update Pack featured docs request.
 */
export interface PublicApiPackFeaturedDocRequestItem {
  /**
   * A URL to a doc.
   */
  url: string;
  /**
   * Whether or not the current doc should be pinned.
   */
  isPinned?: boolean;
}

/**
 * Payload for updating featured docs for a Pack.
 */
export interface PublicApiUpdatePackFeaturedDocsRequest {
  /**
   * A list of docs to set as the featured docs for a Pack.
   *
   * @maxItems 5
   */
  items:
    | []
    | [PublicApiPackFeaturedDocRequestItem]
    | [PublicApiPackFeaturedDocRequestItem, PublicApiPackFeaturedDocRequestItem]
    | [PublicApiPackFeaturedDocRequestItem, PublicApiPackFeaturedDocRequestItem, PublicApiPackFeaturedDocRequestItem]
    | [
        PublicApiPackFeaturedDocRequestItem,
        PublicApiPackFeaturedDocRequestItem,
        PublicApiPackFeaturedDocRequestItem,
        PublicApiPackFeaturedDocRequestItem,
      ]
    | [
        PublicApiPackFeaturedDocRequestItem,
        PublicApiPackFeaturedDocRequestItem,
        PublicApiPackFeaturedDocRequestItem,
        PublicApiPackFeaturedDocRequestItem,
        PublicApiPackFeaturedDocRequestItem,
      ];
}

/**
 * Confirmation of successful Pack featured docs update.
 */
export interface PublicApiUpdatePackFeaturedDocsResponse {}

/**
 * List of a Pack's featured docs.
 */
export interface PublicApiPackFeaturedDocsResponse {
  /**
   * A list of featured docs for the Pack.
   */
  items: PublicApiPackFeaturedDoc[];
}

/**
 * JSON schema response.
 */
export interface PublicApiGetPackConfigurationJsonSchemaResponse {
  [k: string]: unknown;
}

/**
 * An ingestion batch execution.
 */
export interface PublicApiIngestionBatchExecution {
  /**
   * Completion time of the ingestion batch execution in seconds since epoch.
   */
  completionTimestamp: number;
  /**
   * Creation time of the ingestion batch execution in seconds since epoch.
   */
  creationTimestamp: number;
  /**
   * The label of the dynamic URL of the ingestion, if any.
   */
  dynamicLabel?: string;
  /**
   * The dynamic URL of the ingestion.
   */
  dynamicUrl?: string;
  executionType: PublicApiIngestionExecutionType;
  /**
   * The ID of the full ingestion execution.
   */
  fullExecutionId: string;
  /**
   * The ID of the ingestion batch execution.
   */
  ingestionExecutionId: string;
  /**
   * The ID of the ingestion.
   */
  ingestionId: string;
  /**
   * The name of the ingestion.
   */
  ingestionName: string;
  /**
   * Histogram of IngestionStatus of child executions (even if there's only 1, non-crawled execution) as enum values.
   */
  ingestionStatusCounts?: {
    [k: string]: number;
  };
  /**
   * The ID of the last full workflow execution that finished.
   */
  lastFinishedFullWorkflowExecutionId?: string;
  /**
   * The ID of the last incremental workflow execution that finished.
   */
  lastFinishedIncrementalWorkflowExecutionId?: string;
  /**
   * The ID of the latest full workflow execution.
   */
  latestFullWorkflowExecutionId?: string;
  /**
   * The ID of the latest incremental workflow execution.
   */
  latestIncrementalWorkflowExecutionId?: string;
  /**
   * The ID of the latest full execution.
   */
  latestIngestionSequenceId?: string;
  /**
   * The ID of the full execution that generated the currently live data.
   */
  liveIngestionSequenceId?: string;
  /**
   * The ID of the parent sync tableingestion, if any.
   */
  parentSyncTableIngestionId?: string;
  /**
   * Start time of the ingestion batch execution in seconds since epoch.
   */
  startTimestamp: number;
  /**
   * The total number of rows processed in the ingestion batch execution.
   */
  totalRowCount?: number;
}

/**
 * Context that comes with a ingestion execution.
 */
export interface PublicApiIngestionExecutionContext {
  ingestionName: string | null;
  csbIngestionId: string;
  csbIngestionExecutionId: string;
  /**
   * Creation time of the ingestion execution in seconds since epoch.
   */
  creationTimestamp: number;
  parentItemId: string | null;
  /**
   * Start time of the ingestion execution in seconds since epoch.
   */
  startTimestamp: number | null;
  /**
   * Completion time of the ingestion execution in seconds since epoch.
   */
  completionTimestamp: number | null;
  /**
   * Next eligible time for the ingestion to run in seconds since epoch.
   */
  nextEligibleTimestamp: number | null;
  /**
   * Next eligible time for the ingestion to run incrementally in seconds since epoch.
   */
  nextEligibleIncrementalTimestamp: number | null;
  /**
   * The attempt number of the ingestion execution.
   */
  attemptNumber: number;
  ingestionStatus: PublicApiIngestionStatus;
  executionType: PublicApiIngestionExecutionType;
  errorMessage: string | null;
  /**
   * The total number of rows processed in the ingestion execution.
   */
  totalRowCount?: string;
  /**
   * The timestamp of the latest checkpoint of the ingestion execution.
   */
  latestCheckpointTimestamp?: number;
}

/**
 * An attempt of an ingestion execution.
 */
export interface PublicApiIngestionExecutionAttempt {
  /**
   * The ID of the ingestion execution.
   */
  csbIngestionExecutionId: string;
  /**
   * The attempt number of the ingestion execution attempt.
   */
  attemptNumber: number;
  ingestionStatus?: PublicApiIngestionStatus;
  /**
   * The start time of the ingestion execution attempt in seconds since epoch.
   */
  startTimestamp: number | null;
  /**
   * The completion time of the ingestion execution attempt in seconds since epoch.
   */
  completionTimestamp: number | null;
  /**
   * The error message of the ingestion execution attempt.
   */
  errorMessage: string | null;
  /**
   * The total number of rows processed in the ingestion execution attempt.
   */
  rowCountInAttempt?: string | null;
  /**
   * The timestamp of the latest checkpoint of the ingestion execution attempt.
   */
  latestCheckpointTimestamp?: number | null;
}

/**
 * An ingestion parent item and its execution state (either full or incremental).
 */
export interface PublicApiIngestionParentItem {
  /**
   * The attempt number of the ingestion child execution.
   */
  attemptNumber?: number;
  /**
   * Completion time of the ingestion child execution in seconds since epoch.
   */
  completionTimestamp: number;
  errorMessage: string | null;
  executionType: PublicApiIngestionChildExecutionType;
  /**
   * Current execution index for this parent item's child execution.
   */
  ingestionChildExecutionIndex?: number;
  /**
   * The ID of the ingestion child execution.
   */
  ingestionExecutionId: string;
  /**
   * The name of the ingestion child execution.
   */
  ingestionName: string;
  ingestionStatus?: PublicApiIngestionStatus;
  /**
   * The ID of the parent item.
   */
  parentItemId: string;
  /**
   * Start time of the ingestion child execution in seconds since epoch.
   */
  startTimestamp: number;
  /**
   * The number of rows processed so far in the current ingestion child execution.
   */
  rowCount?: number;
  /**
   * The timestamp of the latest checkpoint of the ingestion child execution.
   */
  latestCheckpointTimestamp?: number;
}

/**
 * Status of the ingestion execution.
 */
export enum PublicApiIngestionStatus {
  Queued = 'QUEUED',
  Started = 'STARTED',
  Cancelled = 'CANCELLED',
  UpForRetry = 'UP_FOR_RETRY',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
}

/**
 * Type of an ingestion batch execution.
 */
export enum PublicApiIngestionExecutionType {
  Full = 'FULL',
  Incremental = 'INCREMENTAL',
}

/**
 * Type of an ingestion childexecution.
 */
export enum PublicApiIngestionChildExecutionType {
  Full = 'FULL',
  Incremental = 'INCREMENTAL',
  Patch = 'PATCH',
}

/**
 * Limits for a Pack-driven ingestion
 */
export interface PublicApiIngestionLimitSettings {
  /**
   * Map from table name to per table settings. This may not include every table in the Pack. Each setting per table will include an optional maxBytesPerSyncTableOverride that will override the default, an optional excludeIngestionByDefault flag, and an optional parameterLimits dictionary of allowed parameter values.
   *
   */
  tableSettings?: {
    [k: string]: PublicApiIngestionTableSetting;
  };
  /**
   * The default bytes limit when ingesting data for a table in the Pack. null means no limit.
   */
  maxBytesPerSyncTableDefault: number | null;
  /**
   * The maximum number of tables that can be included. -1 means no limit.
   */
  allowedTablesCount: number;
}

/**
 * Ingestion settings for a specific table
 */
export interface PublicApiIngestionTableSetting {
  /**
   * The bytes limit when ingesting data for this table. null means no limit.
   */
  maxBytesPerSyncTableOverride?: number | null;
  /**
   * Whether to exclude this table from ingestions by default.
   */
  excludeIngestionByDefault?: boolean;
  /**
   * Limits for allowed parameter values.
   */
  parameterLimits?: {
    [k: string]: PublicApiParameterSetting;
  };
}

/**
 * Setting for a specific parameter
 */
export interface PublicApiParameterSetting {
  /**
   * Default value for the parameter
   */
  default: string;
  allowed: string[];
}

/**
 * Payload for creating a Go Link
 */
export interface PublicApiAddGoLinkRequest {
  /**
   * The name of the Go Link that comes after go/. Only alphanumeric characters, dashes, and underscores are allowed.
   */
  name: string;
  /**
   * The URL that the Go Link redirects to.
   */
  destinationUrl: string;
  /**
   * Optional description for the Go Link.
   */
  description?: string;
  /**
   * Optional destination URL with {*} placeholders for variables to be inserted. Variables are specified like go/<name>/<var1>/<var2>.
   */
  urlPattern?: string | null;
  /**
   * Optional creator email for the Go Link. Only organization admins can set this field.
   */
  creatorEmail?: string | null;
}

/**
 * The result of adding a Go Link.
 */
export interface PublicApiAddGoLinkResult {}
