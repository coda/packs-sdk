import { LegacyCodaMarshalerType } from './constants';
import { LegacyMarshalingInjectedKeys } from './constants';
import { MissingScopesError } from '../../api';
import { StatusCodeError } from '../../api';
var ErrorClassType;
(function (ErrorClassType) {
    ErrorClassType["System"] = "System";
    ErrorClassType["Coda"] = "Coda";
    ErrorClassType["Other"] = "Other";
})(ErrorClassType || (ErrorClassType = {}));
const recognizableSystemErrorClasses = [
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
];
const recognizableCodaErrorClasses = [
    // StatusCodeError doesn't have the new StatusCodeError(message) constructor but it's okay.
    StatusCodeError,
    MissingScopesError,
];
function getErrorClassType(err) {
    if (recognizableSystemErrorClasses.some(cls => cls === err.constructor)) {
        return ErrorClassType.System;
    }
    if (recognizableCodaErrorClasses.some(cls => cls === err.constructor)) {
        return ErrorClassType.Coda;
    }
    return ErrorClassType.Other;
}
export function legacyMarshalError(err) {
    if (!(err instanceof Error)) {
        return;
    }
    /**
     * typical Error instance has 3 special & common fields that doesn't get serialized in JSON.stringify:
     *  - name
     *  - stack
     *  - message
     */
    const { name, stack, message, ...args } = err;
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
function getErrorClass(errorClassType, name) {
    let errorClasses;
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
export function legacyUnmarshalError(val) {
    if (typeof val !== 'object' || val[LegacyMarshalingInjectedKeys.CodaMarshaler] !== LegacyCodaMarshalerType.Error) {
        return;
    }
    const { name, stack, message, [LegacyMarshalingInjectedKeys.ErrorClassName]: errorClassName, [LegacyMarshalingInjectedKeys.CodaMarshaler]: _, [LegacyMarshalingInjectedKeys.ErrorClassType]: errorClassType, ...otherProperties } = val;
    const ErrorClass = getErrorClass(errorClassType, errorClassName);
    const error = new ErrorClass();
    error.message = message;
    error.stack = stack;
    // "name" is a bit tricky because native Error class implements it as a getter but not a property.
    // setting name explicitly makes it a property. Some behavior may change (for example, JSON.stringify).
    error.name = name;
    for (const key of Object.keys(otherProperties)) {
        error[key] = otherProperties[key];
    }
    return error;
}
