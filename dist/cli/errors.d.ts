export interface CodaError {
    statusCode: number;
    statusMessage: string;
    message: string;
}
export declare function isCodaError(value: any): value is CodaError;
export declare function formatError(obj: any): string;
