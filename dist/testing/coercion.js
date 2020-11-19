"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerceParams = void 0;
const api_types_1 = require("../api_types");
const ensure_1 = require("../helpers/ensure");
const object_utils_1 = require("../helpers/object_utils");
// TODO: Handle varargs.
function coerceParams(formula, params) {
    const coerced = [];
    for (let i = 0; i < params.length; i++) {
        const paramDef = formula.parameters[i];
        if (paramDef) {
            coerced.push(coerceParamValue(paramDef, params[i]));
        }
        else {
            // More params given that are defined.
            coerced.push(params[i]);
        }
    }
    return coerced;
}
exports.coerceParams = coerceParams;
function coerceParamValue(paramDef, paramValue) {
    if (!object_utils_1.isDefined(paramValue)) {
        return paramValue;
    }
    if (paramDef.type === 'array') {
        const type = paramDef.type;
        const value = paramValue;
        return value.map(item => coerceParam(type.items, item));
    }
    return coerceParam(paramDef.type, paramValue);
}
function coerceParam(type, value) {
    switch (type) {
        case api_types_1.Type.boolean:
            return Boolean(value);
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
