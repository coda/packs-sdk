/// <reference types="node" />
import streamModule from 'stream';
declare type ReadableStream = streamModule.Readable | streamModule.Duplex;
export declare function isReadableStream(stream: any): stream is ReadableStream;
export declare function toBuffer(stream: streamModule.Readable, maxBytes?: number): Promise<Buffer>;
export {};
