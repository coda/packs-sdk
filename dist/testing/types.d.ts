import type { FormulaSpecification } from '../runtime/types';
import type { GenericSyncFormulaResult } from '../api';
import type { GenericSyncUpdateResult } from '../api';
import type { GetPermissionsFormulaSpecification } from '../runtime/types';
import type { GetPermissionsResult } from '../api';
import type { PackFormulaResult } from '../api_types';
import type { SyncFormulaSpecification } from '../runtime/types';
import type { SyncUpdateFormulaSpecification } from '../runtime/types';
export interface ParameterError {
    message: string;
}
export declare class ParameterException extends Error {
}
export interface ValidationError {
    message: string;
    path?: string;
}
export interface ValidationContext {
    propertyKey: string;
    arrayIndices: number[];
}
export declare class ResultValidationContext {
    fieldContexts: ValidationContext[];
    constructor(contexts?: ValidationContext[]);
    extendForProperty(propertyKey: string): ResultValidationContext;
    extendForIndex(arrayIndex: number): ResultValidationContext;
    generateFieldPath(): string;
    generateFieldPathFromValidationContext(context: ValidationContext): string;
}
export declare class ResultValidationException extends Error {
    errors: ValidationError[];
    constructor(message: string, errors: ValidationError[]);
    static fromErrors(formulaName: string, errors: ValidationError[]): ResultValidationException;
}
export declare enum ChainedCommandType {
    Interleaved = "Interleaved",
    Subsequent = "Subsequent"
}
export declare enum ChainableCommandType {
    GetPermissions = "GetPermissions",
    IncrementalSync = "IncrementalSync"
}
export interface InterleavedChainedCommand {
    type: ChainedCommandType.Interleaved;
    formulaSpec: GetPermissionsFormulaSpecification;
    commandType: ChainableCommandType.GetPermissions;
}
interface SubsequentChainedCommand {
    type: ChainedCommandType.Subsequent;
    formulaSpec: SyncFormulaSpecification;
    commandType: ChainableCommandType.IncrementalSync;
}
export type ChainedCommand = InterleavedChainedCommand | SubsequentChainedCommand;
export type FormulaResultType<T extends FormulaSpecification> = T extends SyncFormulaSpecification ? GenericSyncFormulaResult : T extends SyncUpdateFormulaSpecification ? GenericSyncUpdateResult : T extends GetPermissionsFormulaSpecification ? GetPermissionsResult : PackFormulaResult;
export {};
