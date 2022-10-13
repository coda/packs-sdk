import { deepCopy } from '../helpers/object_utils';
export class ParameterException extends Error {
}
export class ResultValidationContext {
    constructor(contexts) {
        this.fieldContexts = contexts ? deepCopy(contexts) : [];
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
export class ResultValidationException extends Error {
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
