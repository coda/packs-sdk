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
