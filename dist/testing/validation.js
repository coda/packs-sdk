"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResult = exports.validateParams = void 0;
const types_1 = require("./types");
const types_2 = require("./types");
const api_types_1 = require("../api_types");
<<<<<<< HEAD
const ensure_1 = require("../helpers/ensure");
=======
const date = __importStar(require("../helpers/date"));
const ensure_1 = require("../helpers/ensure");
const api_1 = require("../api");
const object_utils_1 = require("../helpers/object_utils");
>>>>>>> 64b3e8d (add skeleton for result codaType validation)
const schema_1 = require("../schema");
const object_utils_1 = require("../helpers/object_utils");
const schema_2 = require("../schema");
const api_1 = require("../api");
// TODO: Handle varargs.
function validateParams(formula, params) {
    const numRequiredParams = formula.parameters.filter(param => !param.optional).length;
    if (params.length < numRequiredParams) {
        throw new types_1.ParameterException(`Expected at least ${numRequiredParams} parameter but only ${params.length} were provided.`);
    }
    const errors = [];
    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const paramDef = formula.parameters[i];
        if (!paramDef.optional && !object_utils_1.isDefined(param)) {
            errors.push({
                message: `Param ${i} "${paramDef.name}" is required but a value was not provided.`,
            });
        }
    }
    if (errors.length) {
        const errorMsgs = errors.map(error => error.message);
        throw new types_1.ParameterException(`The following parameter errors were found:\n${errorMsgs.join('\n')}`);
    }
}
exports.validateParams = validateParams;
function validateResult(formula, result) {
    const maybeError = validateResultType(formula.resultType, result);
    if (maybeError) {
        throw types_2.ResultValidationException.fromErrors(formula.name, [maybeError]);
    }
    if (api_1.isObjectPackFormula(formula)) {
        // We've already validated that the result type is valid by this point.
        validateObjectResult(formula, result);
    }
}
exports.validateResult = validateResult;
function validateResultType(resultType, result) {
    if (!object_utils_1.isDefined(result)) {
        return { message: `Expected a ${resultType} result but got ${result}.` };
    }
    const typeOfResult = typeof result;
    switch (resultType) {
        case api_types_1.Type.boolean:
            return checkType(typeOfResult === 'boolean', 'boolean', result);
        case api_types_1.Type.date:
            return checkType(result instanceof Date, 'date', result);
        case api_types_1.Type.html:
            return checkType(typeOfResult === 'string', 'html', result);
        case api_types_1.Type.image:
            return checkType(typeOfResult === 'string', 'image', result);
        case api_types_1.Type.number:
            return checkType(typeOfResult === 'number', 'number', result);
        case api_types_1.Type.object:
            return checkType(typeOfResult === 'object', 'object', result);
        case api_types_1.Type.string:
            return checkType(typeOfResult === 'string', 'string', result);
        default:
            return ensure_1.ensureUnreachable(resultType);
    }
}
function _checkCodaType(resultCodaType, result) {
    if (!object_utils_1.isDefined(result)) {
        return { message: `Expected a ${resultCodaType} result but got ${result}.` };
    }
    switch (resultCodaType) {
        case schema_1.ValueType.Date:
            if (!date.parseDate(result, date.DEFAULT_TIMEZONE)) {
                return { message: `Failed to parse ${result} as a ${schema_1.ValueType.Date}` };
            }
            break;
        case schema_1.ValueType.Time:
            break;
        case schema_1.ValueType.DateTime:
            break;
        case schema_1.ValueType.Duration:
            break;
        case schema_1.ValueType.Person:
            break;
        case schema_1.ValueType.Percent:
            if (result < 0 || result > 100) {
                // error
            }
            break;
        case schema_1.ValueType.Markdown:
            break;
        case schema_1.ValueType.Html:
            break;
        case schema_1.ValueType.Embed:
            break;
        case schema_1.ValueType.Reference:
            break;
        case schema_1.ValueType.Slider:
            break;
        case schema_1.ValueType.Scale:
            break;
        default:
            // no need to coerce current result type
            break;
    }
}
function checkType(typeMatches, expectedResultTypeName, result) {
    if (!typeMatches) {
        const resultValue = typeof result === 'string' ? `"${result}"` : result;
        return { message: `Expected a ${expectedResultTypeName} result but got ${resultValue}.` };
    }
}
function checkPropertyType(typeMatches, expectedPropertyTypeName, propertyValue, propertyKey) {
    if (checkType(typeMatches, expectedPropertyTypeName, propertyValue)) {
        const property = typeof propertyValue === 'string' ? `"${propertyValue}"` : propertyValue;
        return { message: `Expected a ${expectedPropertyTypeName} property for key ${propertyKey} but got ${property}.` };
    }
}
function validateObjectResult(formula, result) {
    const { schema } = formula;
    if (!schema) {
        return;
    }
    if (schema_1.isArray(schema)) {
        // TODO(jonathan): Validate object arrays.
        return;
    }
    if (!schema_2.isObject(schema)) {
        const error = { message: `Expected an object schema, but found ${JSON.stringify(schema)}.` };
        throw types_2.ResultValidationException.fromErrors(formula.name, [error]);
    }
    const errors = [];
    for (const [propertyKey, propertySchema] of Object.entries(schema.properties)) {
        const value = result[propertyKey];
        if (propertySchema.required && !value) {
            errors.push({
                message: `Schema declares required property "${propertyKey}" but this attribute is missing or empty.`,
            });
        }
        const typeCheck = value &&
            checkPropertyType(typeof value === propertySchema.type, propertySchema.type, value, propertyKey);
        if (typeCheck) {
            errors.push(typeCheck);
        }
    }
    if (schema.id && schema.id in result && !result[schema.id]) {
        errors.push({
            message: `Schema declares "${schema.id}" as an id property but an empty value was found in result.`,
        });
    }
    if (errors.length) {
        throw types_2.ResultValidationException.fromErrors(formula.name, errors);
    }
}
