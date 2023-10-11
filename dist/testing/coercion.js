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
    if (!(0, object_utils_1.isDefined)(paramValue)) {
        return paramValue;
    }
    if ((0, api_types_2.isArrayType)(paramDef.type)) {
        const valuesString = paramValue;
        const value = valuesString.length ? valuesString.split(',') : [];
        return value.map(item => coerceParam(paramDef.type.items, paramDef.name, item.trim()));
    }
    return coerceParam(paramDef.type, paramDef.name, paramValue);
}
function coerceParam(type, name, value) {
    switch (type) {
        case api_types_1.Type.boolean:
            const maybeBoolean = (value || '').toLowerCase();
            if (maybeBoolean !== 'true' && maybeBoolean !== 'false') {
                throw new Error(`Expected parameter ${name} to be a boolean, but found ${value} (should be one of "true" or "false")`);
            }
            return maybeBoolean === 'true';
        case api_types_1.Type.date:
            const maybeDate = new Date(value);
            // getTime returns NaN if the date is not valid or a number if it is valid
            if (!(maybeDate instanceof Date) || isNaN(maybeDate.getTime())) {
                throw new Error(`Expected parameter ${name} to be a date/time value, but found ${value}`);
            }
            return maybeDate;
        case api_types_1.Type.number:
            if (isNaN(Number(value))) {
                throw new Error(`Expected parameter ${name} to be a number value, but found ${value}`);
            }
            return Number(value);
        case api_types_1.Type.html:
        case api_types_1.Type.file:
        case api_types_1.Type.image:
        case api_types_1.Type.string:
        case api_types_1.Type.markdown:
            return value;
        default:
            return (0, ensure_1.ensureUnreachable)(type);
    }
}
