"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultValidationException = exports.ParameterException = void 0;
class ParameterException extends Error {
}
exports.ParameterException = ParameterException;
class ResultValidationException extends Error {
    constructor(message, errors) {
        super(message);
        this.errors = errors;
    }
    static fromErrors(formulaName, errors) {
        const messages = errors.map(err => err.message).join('\n');
        const message = `The following errors were found when validating the result of the formula "${formulaName}":\n${messages}`;
        return new ResultValidationException(message, errors);
    }
}
exports.ResultValidationException = ResultValidationException;
