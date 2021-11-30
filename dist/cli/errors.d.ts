import type { ResponseError } from '../helpers/external-api/coda';
export declare function tryParseSystemError(error: any): "" | "Run `export NODE_TLS_REJECT_UNAUTHORIZED=0` and rerun your command.";
export declare function formatResponseError(err: ResponseError): Promise<string>;
export declare function formatError(obj: any): string;
