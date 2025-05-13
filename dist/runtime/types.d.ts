import type { GenericSyncFormulaResult } from '../api';
import type { GenericSyncUpdateResultMarshaled } from '../api';
import type { ObjectSchemaProperty } from '../schema';
import type { PackFormulaResult } from '../api_types';
import type { Schema } from '../schema';
export declare enum FormulaType {
    Standard = "Standard",
    Sync = "Sync",
    SyncUpdate = "SyncUpdate",
    GetPermissions = "GetPermissions",
    Metadata = "Metadata"
}
export declare enum MetadataFormulaType {
    GetConnectionName = "GetConnectionName",
    GetConnectionUserId = "GetConnectionUserId",
    ParameterAutocomplete = "ParameterAutocomplete",
    PostSetupSetEndpoint = "PostSetupSetEndpoint",
    SyncListDynamicUrls = "SyncListDynamicUrls",
    SyncSearchDynamicUrls = "SyncSearchDynamicUrls",
    SyncGetDisplayUrl = "SyncGetDisplayUrl",
    SyncGetTableName = "SyncGetTableName",
    SyncGetSchema = "SyncGetSchema",
    PropertyOptions = "PropertyOptions",
    ValidateParameters = "ValidateParameters"
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
export interface GetPermissionsFormulaSpecification {
    type: FormulaType.GetPermissions;
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
    metadataFormulaType: MetadataFormulaType.SyncListDynamicUrls | MetadataFormulaType.SyncSearchDynamicUrls | MetadataFormulaType.SyncGetDisplayUrl | MetadataFormulaType.SyncGetTableName | MetadataFormulaType.SyncGetSchema;
    syncTableName: string;
}
export interface ValidateParametersFormulaSpecification {
    type: FormulaType.Metadata;
    metadataFormulaType: MetadataFormulaType.ValidateParameters;
    parentFormulaName: string;
    parentFormulaType: FormulaType.Standard | FormulaType.Sync;
}
export interface PropertyAutocompleteFormulaSpecification {
    type: FormulaType.Metadata;
    metadataFormulaType: MetadataFormulaType.PropertyOptions;
    syncTableName: string;
    optionsFormulaKey: string;
    propertyName: string;
    propertyValues: Record<string, any>;
    propertySchema: Schema & ObjectSchemaProperty;
    search: string;
}
export type FormulaSpecification = StandardFormulaSpecification | SyncFormulaSpecification | SyncUpdateFormulaSpecification | MetadataFormulaSpecification | ParameterAutocompleteMetadataFormulaSpecification | PostSetupMetadataFormulaSpecification | SyncMetadataFormulaSpecification | PropertyAutocompleteFormulaSpecification | GetPermissionsFormulaSpecification | ValidateParametersFormulaSpecification;
export type PackFunctionResponse<T extends FormulaSpecification> = T extends SyncFormulaSpecification ? GenericSyncFormulaResult : T extends SyncUpdateFormulaSpecification ? GenericSyncUpdateResultMarshaled : PackFormulaResult;
