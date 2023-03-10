import type { GenericSyncFormulaResult } from '../api';
import type { GenericSyncUpdateResultMarshaled } from '../api';
import type { PackFormulaResult } from '../api_types';
export declare enum FormulaType {
    Standard = "Standard",
    Sync = "Sync",
    SyncUpdate = "SyncUpdate",
    Metadata = "Metadata"
}
export declare enum MetadataFormulaType {
    GetConnectionName = "GetConnectionName",
    GetConnectionUserId = "GetConnectionUserId",
    ParameterAutocomplete = "ParameterAutocomplete",
    PostSetupSetEndpoint = "PostSetupSetEndpoint",
    SyncListDynamicUrls = "SyncListDynamicUrls",
    SyncGetDisplayUrl = "SyncGetDisplayUrl",
    SyncGetTableName = "SyncGetTableName",
    SyncGetSchema = "SyncGetSchema",
    CellAutocomplete = "CellAutocomplete"
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
    metadataFormulaType: MetadataFormulaType.SyncListDynamicUrls | MetadataFormulaType.SyncGetDisplayUrl | MetadataFormulaType.SyncGetTableName | MetadataFormulaType.SyncGetSchema;
    syncTableName: string;
}
export interface CellAutocompleteFormulaSpecification {
    type: FormulaType.Metadata;
    metadataFormulaType: MetadataFormulaType.CellAutocomplete;
    syncTableName: string;
    propertyName: string;
    propertyValues: Record<string, any>;
    search: string;
}
export declare type FormulaSpecification = StandardFormulaSpecification | SyncFormulaSpecification | SyncUpdateFormulaSpecification | MetadataFormulaSpecification | ParameterAutocompleteMetadataFormulaSpecification | PostSetupMetadataFormulaSpecification | SyncMetadataFormulaSpecification | CellAutocompleteFormulaSpecification;
export declare type PackFunctionResponse<T extends FormulaSpecification> = T extends SyncFormulaSpecification ? GenericSyncFormulaResult : T extends SyncUpdateFormulaSpecification ? GenericSyncUpdateResultMarshaled : PackFormulaResult;
