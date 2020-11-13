export interface ParameterError {
    message: string;
}
export declare class ParameterException extends Error {
}
export interface ResultValidationError {
    message: string;
}
export declare class ResultValidationException extends Error {
    errors: ResultValidationError[];
    constructor(message: string, errors: ResultValidationError[]);
    static fromErrors(formulaName: string, errors: ResultValidationError[]): ResultValidationException;
}
