export interface ParameterError {
  message: string;
}

export class ParameterException extends Error {}

export interface ResultValidationError {
  message: string;
}

export class ResultValidationException extends Error {
  errors: ResultValidationError[];

  constructor(message: string, errors: ResultValidationError[]) {
    super(message);
    this.errors = errors;
  }

  static fromErrors(formulaName: string, errors: ResultValidationError[]): ResultValidationException {
    const messages = errors.map(err => err.message).join('\n');
    const message = `The following errors were found when validating the result of the formula "${formulaName}":\n${messages}`;
    return new ResultValidationException(message, errors);
  }
}
