/// <reference types="node" />
import type { PackMetadata } from 'index';
import type { ValidationError } from './types';
import type stream from 'stream';
export interface ParsedUpload {
    metadata: PackMetadata;
    rawBundleStream: stream.Readable;
}
export declare class PackMetadataValidationError extends Error {
    readonly originalError: Error | undefined;
    readonly validationErrors: ValidationError[] | undefined;
    constructor(message: string, originalError?: Error, validationErrors?: ValidationError[]);
}
export declare function validatePackMetadata(metadata: Record<string, any>): Promise<void>;
