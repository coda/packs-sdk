export interface ParameterError {
    message: string;
}
export declare class ParameterException extends Error {
}
export interface ResultValidationError {
    message: string;
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
    errors: ResultValidationError[];
    constructor(message: string, errors: ResultValidationError[]);
    static fromErrors(formulaName: string, errors: ResultValidationError[]): ResultValidationException;
}
