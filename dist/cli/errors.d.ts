export interface CodaError {
    statusCode: number;
    statusMessage: string;
    message: string;
}
export declare function isCodaError(value: any): value is CodaError;
export declare function tryParseSystemError(error: any): "" | "Run `export NODE_TLS_REJECT_UNAUTHORIZED=0` and rerun your command.";
export declare function formatError(obj: any): string;
