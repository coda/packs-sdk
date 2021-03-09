import {deepCopy} from '../helpers/object_utils';

export interface ParameterError {
  message: string;
}

export class ParameterException extends Error {}

export interface ValidationError {
  message: string;
  path?: string;
}

export interface ValidationContext {
  propertyKey: string;
  arrayIndices: number[];
}

export class ResultValidationContext {
  fieldContexts: ValidationContext[];

  constructor(contexts?: ValidationContext[]) {
    this.fieldContexts = contexts ? deepCopy(contexts) : [];
  }

  extendForProperty(propertyKey: string) {
    const newContext: ValidationContext = {propertyKey, arrayIndices: []};
    return new ResultValidationContext([...this.fieldContexts, newContext]);
  }

  extendForIndex(arrayIndex: number) {
    const newContext: ResultValidationContext = new ResultValidationContext(this.fieldContexts);
    const currentContext: ValidationContext = newContext.fieldContexts[newContext.fieldContexts.length - 1];
    currentContext.arrayIndices.push(arrayIndex);
    return newContext;
  }

  generateFieldPath(): string {
    const fieldPath = this.fieldContexts.map(context => this.generateFieldPathFromValidationContext(context));
    return fieldPath.join('.');
  }

  generateFieldPathFromValidationContext(context: ValidationContext): string {
    const {propertyKey, arrayIndices} = context;
    return `${propertyKey}${arrayIndices.map(idx => `[${idx}]`)}`;
  }
}

export class ResultValidationException extends Error {
  errors: ValidationError[];

  constructor(message: string, errors: ValidationError[]) {
    super(message);
    this.errors = errors;
  }

  static fromErrors(formulaName: string, errors: ValidationError[]): ResultValidationException {
    const messages = errors.map(err => err.message).join('\n');
    const message = `The following errors were found when validating the result of the formula "${formulaName}":\n${messages}`;
    return new ResultValidationException(message, errors);
  }
}
