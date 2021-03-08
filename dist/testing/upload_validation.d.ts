/// <reference types="node" />
import type { PackMetadata } from 'index';
import type { ValidationError } from './types';
import stream from 'stream';
export interface ParsedUpload {
    metadata: PackMetadata;
    rawBundleStream: stream.Readable;
}
export declare class PackUploadValidationError extends Error {
    readonly originalError: Error | undefined;
    readonly validationErrors: ValidationError[] | undefined;
    constructor(message: string, originalError?: Error, validationErrors?: ValidationError[]);
}
export declare function validateAndParseUpload(untrustedUploadStream: stream.Readable): Promise<ParsedUpload>;
