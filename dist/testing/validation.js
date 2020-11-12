"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResult = exports.validateParams = void 0;
const types_1 = require("./types");
const types_2 = require("./types");
const api_types_1 = require("../api_types");
const api_1 = require("../api");
const object_utils_1 = require("../helpers/object_utils");
const ensure_1 = require("../helpers/ensure");
const schema_1 = require("../schema");
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
function checkType(typeMatches, expectedResultTypeName, result) {
    if (!typeMatches) {
        const resultValue = typeof result === 'string' ? `"${result}"` : result;
        return { message: `Expected a ${expectedResultTypeName} result but got ${resultValue}.` };
    }
}
function validateObjectResult(formula, result) {
    const { schema } = formula;
    if (!schema) {
        return;
    }
    if (!schema_1.isObject(schema)) {
        const error = { message: `Expect an object schema, but found ${JSON.stringify(schema)}.` };
        throw types_2.ResultValidationException.fromErrors(formula.name, [error]);
    }
    const errors = [];
    const resultKeys = new Set(Object.keys(result));
    for (const propertyKey of Object.keys(schema.properties)) {
        if (!resultKeys.has(propertyKey)) {
            errors.push({ message: `Schema declares property "${propertyKey}" but no such attribute was included in result.` });
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
