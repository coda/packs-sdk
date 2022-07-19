"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyUnmarshalError = exports.legacyMarshalError = void 0;
const constants_1 = require("./constants");
const constants_2 = require("./constants");
const api_1 = require("../../api");
const api_2 = require("../../api");
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
    api_2.StatusCodeError,
    api_1.MissingScopesError,
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
function legacyMarshalError(err) {
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
        [constants_2.LegacyMarshalingInjectedKeys.CodaMarshaler]: constants_1.LegacyCodaMarshalerType.Error,
        [constants_2.LegacyMarshalingInjectedKeys.ErrorClassName]: err.constructor.name,
        [constants_2.LegacyMarshalingInjectedKeys.ErrorClassType]: getErrorClassType(err),
        ...args,
    };
}
exports.legacyMarshalError = legacyMarshalError;
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
function legacyUnmarshalError(val) {
    if (typeof val !== 'object' || val[constants_2.LegacyMarshalingInjectedKeys.CodaMarshaler] !== constants_1.LegacyCodaMarshalerType.Error) {
        return;
    }
    const { name, stack, message, [constants_2.LegacyMarshalingInjectedKeys.ErrorClassName]: errorClassName, [constants_2.LegacyMarshalingInjectedKeys.CodaMarshaler]: _, [constants_2.LegacyMarshalingInjectedKeys.ErrorClassType]: errorClassType, ...otherProperties } = val;
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
exports.legacyUnmarshalError = legacyUnmarshalError;
