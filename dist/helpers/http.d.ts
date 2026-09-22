/// <reference types="node" />
/// <reference types="node" />
import type { Fetcher } from '../api_types';
export interface DownloadedFile {
    filename: string;
    contentType: string;
    data: Buffer;
}
export interface MultipartFile extends DownloadedFile {
    fieldName: string;
}
export interface MultipartBody {
    body: Buffer;
    contentType: string;
}
export interface ServerSentEvent {
    data: string;
    event?: string;
    id?: string;
    retry?: number;
}
/**
 * Downloads a URL supplied by a File parameter without applying the Pack's authentication.
 */
export declare function downloadFile(fileUrl: string, fetcher: Fetcher): Promise<DownloadedFile>;
/**
 * Encodes text fields and files as a multipart/form-data request body.
 */
export declare function makeMultipartBody(fields: Record<string, string>, files?: MultipartFile[], boundary?: string): MultipartBody;
/**
 * Parses a complete server-sent events response into events.
 */
export declare function parseServerSentEvents(body: string | Buffer): ServerSentEvent[];
