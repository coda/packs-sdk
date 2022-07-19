import {LegacyCodaMarshalerType} from './constants';
import {LegacyMarshalingInjectedKeys} from './constants';
import {MissingScopesError} from '../../api';
import {StatusCodeError} from '../../api';

enum ErrorClassType {
  System = 'System',
  Coda = 'Coda',
  Other = 'Other',
}

const recognizableSystemErrorClasses: ErrorConstructor[] = [
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
];

const recognizableCodaErrorClasses: ErrorConstructor[] = [
  // StatusCodeError doesn't have the new StatusCodeError(message) constructor but it's okay.
  StatusCodeError as any,
  MissingScopesError as any,
];

function getErrorClassType(err: Error): ErrorClassType {
  if (recognizableSystemErrorClasses.some(cls => cls === err.constructor)) {
    return ErrorClassType.System;
  }

  if (recognizableCodaErrorClasses.some(cls => cls === err.constructor)) {
    return ErrorClassType.Coda;
  }

  return ErrorClassType.Other;
}

export function legacyMarshalError(err: any): object | undefined {
  if (!(err instanceof Error)) {
    return;
  }

  /**
   * typical Error instance has 3 special & common fields that doesn't get serialized in JSON.stringify:
   *  - name
   *  - stack
   *  - message
   */
  const {name, stack, message, ...args} = err;
  return {
    name,
    stack,
    message,
    [LegacyMarshalingInjectedKeys.CodaMarshaler]: LegacyCodaMarshalerType.Error,
    [LegacyMarshalingInjectedKeys.ErrorClassName]: err.constructor.name,
    [LegacyMarshalingInjectedKeys.ErrorClassType]: getErrorClassType(err),
    ...args,
  };
}

function getErrorClass(errorClassType: ErrorClassType, name: string): ErrorConstructor {
  let errorClasses: ErrorConstructor[];
  switch (errorClassType) {
    case ErrorClassType.System:
      errorClasses = recognizableSystemErrorClasses;
      break;
    case ErrorClassType.Coda:
      errorClasses = recognizableCodaErrorClasses;
      break;
    default:
      errorClasses = [];
  }

  return errorClasses.find(cls => cls.name === name) || Error;
}

export function legacyUnmarshalError(val: {[key: string]: any | undefined}): Error | undefined {
  if (typeof val !== 'object' || val[LegacyMarshalingInjectedKeys.CodaMarshaler] !== LegacyCodaMarshalerType.Error) {
    return;
  }

  const {
    name,
    stack,
    message,
    [LegacyMarshalingInjectedKeys.ErrorClassName]: errorClassName,
    [LegacyMarshalingInjectedKeys.CodaMarshaler]: _,
    [LegacyMarshalingInjectedKeys.ErrorClassType]: errorClassType,
    ...otherProperties
  } = val;
  const ErrorClass = getErrorClass(errorClassType, errorClassName);
  const error = new ErrorClass();

  error.message = message;
  error.stack = stack;
  // "name" is a bit tricky because native Error class implements it as a getter but not a property.
  // setting name explicitly makes it a property. Some behavior may change (for example, JSON.stringify).
  error.name = name;

  for (const key of Object.keys(otherProperties)) {
    (error as any)[key] = otherProperties[key];
  }

  return error;
}
