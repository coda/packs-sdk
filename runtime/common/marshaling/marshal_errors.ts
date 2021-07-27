import {CodaMarshalerType} from './constants';
import {MarshalingInjectedKeys} from './constants';
import {StatusCodeError} from '../../../api';

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

export function marshalError(err: any): object | undefined {
  if (!(err instanceof Error)) {
    return;
  }
  /**
   * typical Error instance has 3 special & common fields that doesn't get serialized in JSON.stringify:
   *  - name
   *  - stac
   *  - message
   */
  const {name, stack, message, ...args} = err;
  return {
    name,
    stack,
    message,
    [MarshalingInjectedKeys.CodaMarshaler]: CodaMarshalerType.Error,
    [MarshalingInjectedKeys.ErrorClassName]: err.constructor.name,
    [MarshalingInjectedKeys.ErrorClassType]: getErrorClassType(err),
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

export function unmarshalError(val: {[key: string]: any | undefined}): Error | undefined {
  if (typeof val !== 'object' || val[MarshalingInjectedKeys.CodaMarshaler] !== CodaMarshalerType.Error) {
    return;
  }

  const {
    name,
    stack,
    message,
    [MarshalingInjectedKeys.ErrorClassName]: errorClassName,
    [MarshalingInjectedKeys.CodaMarshaler]: _,
    [MarshalingInjectedKeys.ErrorClassType]: errorClassType,
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
