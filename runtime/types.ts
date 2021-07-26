export enum FormulaType {
  Standard = 'Standard',
  Sync = 'Sync',
  Metadata = 'Metadata',
}

export enum MetadataFormulaType {
  GetConnectionName = 'GetConnectionName',
  GetConnectionUserId = 'GetConnectionUserId',
  ParameterAutocomplete = 'ParameterAutocomplete',
  PostSetupSetEndpoint = 'PostSetupSetEndpoint',
  SyncListDynamicUrls = 'SyncListDynamicUrls',
  SyncGetDisplayUrl = 'SyncGetDisplayUrl',
  SyncGetTableName = 'SyncGetTableName',
  SyncGetSchema = 'SyncGetSchema',
}

export interface StandardFormulaSpecification {
  type: FormulaType.Standard;
  formulaName: string;
}

export interface SyncFormulaSpecification {
  type: FormulaType.Sync;
  formulaName: string;
}

export interface MetadataFormulaSpecification {
  type: FormulaType.Metadata;
  metadataFormulaType: MetadataFormulaType.GetConnectionName | MetadataFormulaType.GetConnectionUserId;
}

export interface ParameterAutocompleteMetadataFormulaSpecification {
  type: FormulaType.Metadata;
  metadataFormulaType: MetadataFormulaType.ParameterAutocomplete;
  parentFormulaName: string;
  parentFormulaType: FormulaType.Standard | FormulaType.Sync;
  parameterName: string;
}

export interface PostSetupMetadataFormulaSpecification {
  type: FormulaType.Metadata;
  metadataFormulaType: MetadataFormulaType.PostSetupSetEndpoint;
  stepName: string;
}

export interface SyncMetadataFormulaSpecification {
  type: FormulaType.Metadata;
  metadataFormulaType:
    | MetadataFormulaType.SyncListDynamicUrls
    | MetadataFormulaType.SyncGetDisplayUrl
    | MetadataFormulaType.SyncGetTableName
    | MetadataFormulaType.SyncGetSchema;
  syncTableName: string;
}

export type FormulaSpecification =
  | StandardFormulaSpecification
  | SyncFormulaSpecification
  | MetadataFormulaSpecification
  | ParameterAutocompleteMetadataFormulaSpecification
  | PostSetupMetadataFormulaSpecification
  | SyncMetadataFormulaSpecification;
