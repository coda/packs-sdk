"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerceParams = void 0;
const api_types_1 = require("../api_types");
const ensure_1 = require("../helpers/ensure");
const api_types_2 = require("../api_types");
const object_utils_1 = require("../helpers/object_utils");
function coerceParams(formula, args) {
    const { parameters, varargParameters } = formula;
    const coerced = [];
    let varargIndex = 0;
    for (let i = 0; i < args.length; i++) {
        const paramDef = parameters[i];
        if (paramDef) {
            coerced.push(coerceParamValue(paramDef, args[i]));
        }
        else {
            if (varargParameters) {
                const varargDef = varargParameters[varargIndex];
                coerced.push(coerceParamValue(varargDef, args[i]));
                varargIndex = (varargIndex + 1) % varargParameters.length;
            }
            else {
                // More args given than are defined, just return them as-is, we'll validate later.
                coerced.push(args[i]);
            }
        }
    }
    return coerced;
}
exports.coerceParams = coerceParams;
function coerceParamValue(paramDef, paramValue) {
    if (!object_utils_1.isDefined(paramValue)) {
        return paramValue;
    }
    if (api_types_2.isArrayType(paramDef.type)) {
        const valuesString = paramValue;
        const value = valuesString.length ? valuesString.split(',') : [];
        return value.map(item => coerceParam(paramDef.type.items, item.trim()));
    }
    return coerceParam(paramDef.type, paramValue);
}
function coerceParam(type, value) {
    switch (type) {
        case api_types_1.Type.boolean:
            return (value || '').toLowerCase() === 'true';
        case api_types_1.Type.date:
            return new Date(value);
        case api_types_1.Type.number:
            return Number(value);
        case api_types_1.Type.object:
            return JSON.parse(value);
        case api_types_1.Type.html:
        case api_types_1.Type.image:
        case api_types_1.Type.string:
            return value;
        default:
            return ensure_1.ensureUnreachable(type);
    }
}
