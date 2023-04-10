import type {GenericSyncFormulaResult} from '../api';
import type {GenericSyncUpdateResultMarshaled} from '../api';
import type {PackFormulaResult} from '../api_types';

export enum FormulaType {
  Standard = 'Standard',
  Sync = 'Sync',
  SyncUpdate = 'SyncUpdate',
  Metadata = 'Metadata',
}

export enum MetadataFormulaType {
  GetConnectionName = 'GetConnectionName',
  GetConnectionUserId = 'GetConnectionUserId',
  ParameterAutocomplete = 'ParameterAutocomplete',
  PostSetupSetEndpoint = 'PostSetupSetEndpoint',
  SyncListDynamicUrls = 'SyncListDynamicUrls',
  SyncSearchDynamicUrls = 'SyncSearchDynamicUrls',
  SyncGetDisplayUrl = 'SyncGetDisplayUrl',
  SyncGetTableName = 'SyncGetTableName',
  SyncGetSchema = 'SyncGetSchema',
  PropertyAutocomplete = 'PropertyAutocomplete',
}

export interface StandardFormulaSpecification {
  type: FormulaType.Standard;
  formulaName: string;
}

export interface SyncFormulaSpecification {
  type: FormulaType.Sync;
  formulaName: string;
}

export interface SyncUpdateFormulaSpecification {
  type: FormulaType.SyncUpdate;
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
  parentFormulaType: FormulaType.Standard | FormulaType.Sync | FormulaType.SyncUpdate;
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
    | MetadataFormulaType.SyncSearchDynamicUrls
    | MetadataFormulaType.SyncGetDisplayUrl
    | MetadataFormulaType.SyncGetTableName
    | MetadataFormulaType.SyncGetSchema;
  syncTableName: string;
}

export interface PropertyAutocompleteFormulaSpecification {
  type: FormulaType.Metadata;
  metadataFormulaType: MetadataFormulaType.PropertyAutocomplete;
  syncTableName: string;
  propertyName: string;
  propertyValues: Record<string, any>;
  search: string;
}

export type FormulaSpecification =
  | StandardFormulaSpecification
  | SyncFormulaSpecification
  | SyncUpdateFormulaSpecification
  | MetadataFormulaSpecification
  | ParameterAutocompleteMetadataFormulaSpecification
  | PostSetupMetadataFormulaSpecification
  | SyncMetadataFormulaSpecification
  | PropertyAutocompleteFormulaSpecification;

export type PackFunctionResponse<T extends FormulaSpecification> = T extends SyncFormulaSpecification
  ? GenericSyncFormulaResult
  : T extends SyncUpdateFormulaSpecification
  ? GenericSyncUpdateResultMarshaled
  : PackFormulaResult;
