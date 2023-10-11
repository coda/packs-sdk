"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultValidationException = exports.ResultValidationContext = exports.ParameterException = void 0;
const object_utils_1 = require("../helpers/object_utils");
class ParameterException extends Error {
}
exports.ParameterException = ParameterException;
class ResultValidationContext {
    constructor(contexts) {
        this.fieldContexts = contexts ? (0, object_utils_1.deepCopy)(contexts) : [];
    }
    extendForProperty(propertyKey) {
        const newContext = { propertyKey, arrayIndices: [] };
        return new ResultValidationContext([...this.fieldContexts, newContext]);
    }
    extendForIndex(arrayIndex) {
        const newContext = new ResultValidationContext(this.fieldContexts);
        const currentContext = newContext.fieldContexts[newContext.fieldContexts.length - 1];
        currentContext.arrayIndices.push(arrayIndex);
        return newContext;
    }
    generateFieldPath() {
        const fieldPath = this.fieldContexts.map(context => this.generateFieldPathFromValidationContext(context));
        return fieldPath.join('.');
    }
    generateFieldPathFromValidationContext(context) {
        const { propertyKey, arrayIndices } = context;
        return `${propertyKey}${arrayIndices.map(idx => `[${idx}]`)}`;
    }
}
exports.ResultValidationContext = ResultValidationContext;
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
