"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResult = exports.validateParams = void 0;
const types_1 = require("./types");
const types_2 = require("./types");
const api_types_1 = require("../api_types");
const url_1 = require("url");
const schema_1 = require("../schema");
const ensure_1 = require("../helpers/ensure");
const ensure_2 = require("../helpers/ensure");
const schema_2 = require("../schema");
const object_utils_1 = require("../helpers/object_utils");
const string_1 = require("../helpers/string");
const schema_3 = require("../schema");
const api_1 = require("../api");
// TODO: Handle varargs.
function validateParams(formula, params) {
    const numRequiredParams = formula.parameters.filter(param => !param.optional).length;
    if (params.length < numRequiredParams) {
        throw new types_1.ParameterException(`Expected at least ${numRequiredParams} parameter but only ${params.length} were provided.`);
    }
    if (params.length > formula.parameters.length && !formula.varargParameters) {
        throw new types_1.ParameterException(`Formula only accepts ${formula.parameters.length} parameters but ${params.length} were provided.`);
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
            return ensure_2.ensureUnreachable(resultType);
    }
}
function generateErrorFromValidationContext(context, schema, result) {
    const { propertyKey, arrayIndex } = context;
    ensure_1.ensureExists([propertyKey, arrayIndex].some(value => value), 'Must provide at least one of propertyKey, arrayIndex to ValidationContext');
    const resultValue = typeof result === 'string' ? `"${result}"` : result;
    // Validating item within an array property of an objectSchema
    if (propertyKey && arrayIndex) {
        return {
            message: `Expected a ${schema.type} property for array item ${propertyKey}[${arrayIndex}] but got ${resultValue}.`,
        };
    }
    // Validating property of an objectSchema
    if (propertyKey) {
        return {
            message: `Expected a ${schema.type} property for key ${propertyKey} but got ${resultValue}.`,
        };
    }
    // Validating item within an array of objects (sync formula)
    // We don't currently do nested object validation within arrays.
    return {
        message: `Expected a ${schema.type} property for array item at index ${arrayIndex} but got ${resultValue}.`,
    };
}
function checkPropertyTypeAndCodaType(schema, result, validationContext) {
    const errors = [generateErrorFromValidationContext(validationContext, schema, result)];
    switch (schema.type) {
        case schema_1.ValueType.Boolean: {
            const resultValidationError = checkType(typeof result === 'boolean', 'boolean', result);
            return resultValidationError ? errors : [];
        }
        case schema_1.ValueType.Number: {
            const resultValidationError = checkType(typeof result === 'number', 'number', result);
            if (resultValidationError) {
                return errors;
            }
            if (!('codaType' in schema)) {
                return [];
            }
            switch (schema.codaType) {
                case schema_1.ValueType.Slider:
                    const sliderErrorMessage = tryParseSlider(result, schema);
                    return sliderErrorMessage ? [sliderErrorMessage] : [];
                case schema_1.ValueType.Scale:
                    const scaleErrorMessage = tryParseScale(result, schema);
                    return scaleErrorMessage ? [scaleErrorMessage] : [];
                case schema_1.ValueType.Date:
                case schema_1.ValueType.DateTime:
                case schema_1.ValueType.Time:
                case schema_1.ValueType.Percent:
                case schema_1.ValueType.Currency:
                case undefined:
                    // no need to coerce current result type
                    return [];
                default:
                    return ensure_2.ensureUnreachable(schema);
            }
        }
        case schema_1.ValueType.String: {
            const resultValidationError = checkType(typeof result === 'string', 'string', result);
            if (resultValidationError) {
                return errors;
            }
            switch (schema.codaType) {
                case schema_1.ValueType.Attachment:
                case schema_1.ValueType.Embed:
                case schema_1.ValueType.Image:
                case schema_1.ValueType.ImageAttachment:
                case schema_1.ValueType.Url:
                    const urlErrorMessage = tryParseUrl(result, schema);
                    return urlErrorMessage ? [urlErrorMessage] : [];
                case schema_1.ValueType.Date:
                case schema_1.ValueType.DateTime:
                    const dateTimeErrorMessage = tryParseDateTimeString(result, schema);
                    return dateTimeErrorMessage ? [dateTimeErrorMessage] : [];
                case schema_1.ValueType.Duration:
                case schema_1.ValueType.Time:
                    // TODO: investigate how to do this in a lightweight fashion.
                    return [];
                case schema_1.ValueType.Html:
                case schema_1.ValueType.Markdown:
                case undefined:
                    // no need to coerce current result type
                    return [];
                default:
                    ensure_2.ensureUnreachable(schema);
            }
        }
        case schema_1.ValueType.Array:
            return validateArray(result, schema, { propertyKey: validationContext === null || validationContext === void 0 ? void 0 : validationContext.propertyKey });
        case schema_1.ValueType.Object: {
            const resultValidationError = checkType(typeof result === 'object', 'object', result);
            if (resultValidationError) {
                return errors;
            }
            switch (schema.codaType) {
                case schema_1.ValueType.Person:
                    const personErrorMessage = tryParsePerson(result, schema);
                    return personErrorMessage ? [personErrorMessage] : [];
                case schema_1.ValueType.Reference:
                    const referenceErrorMessages = tryParseReference(result, schema);
                    return referenceErrorMessages !== null && referenceErrorMessages !== void 0 ? referenceErrorMessages : [];
                case undefined:
                    // TODO: handle nested object validation.
                    // no need to coerce current result type
                    return [];
                default:
                    ensure_2.ensureUnreachable(schema);
            }
        }
        default:
            return ensure_2.ensureUnreachable(schema);
    }
}
function tryParseDateTimeString(result, schema) {
    const dateTime = result;
    if (isNaN(Date.parse(dateTime))) {
        return { message: `Failed to parse ${dateTime} as a ${schema.codaType}.` };
    }
}
function tryParseUrl(result, schema) {
    const invalidUrlError = {
        message: `Property with codaType "${schema.codaType}" must be a valid HTTP(S) url, but got "${result}".`,
    };
    try {
        const url = new url_1.URL(result);
        if (!(url.protocol === 'http:' || url.protocol === 'https:')) {
            return invalidUrlError;
        }
    }
    catch (error) {
        return invalidUrlError;
    }
}
function tryParseSlider(result, schema) {
    const value = result;
    const { minimum, maximum } = schema;
    if (value < (minimum !== null && minimum !== void 0 ? minimum : 0)) {
        return { message: `Slider value ${result} is below the specified minimum value of ${minimum !== null && minimum !== void 0 ? minimum : 0}.` };
    }
    if (maximum && value > maximum) {
        return { message: `Slider value ${result} is greater than the specified maximum value of ${maximum}.` };
    }
}
function tryParseScale(result, schema) {
    const { maximum } = schema;
    const value = result;
    if (!Number.isInteger(result)) {
        return { message: `Scale value ${result} must be an integer.` };
    }
    if (value < 0) {
        return { message: `Scale value ${result} cannot be below 0.` };
    }
    if (value > maximum) {
        return { message: `Scale value ${result} is greater than the specified maximum value of ${maximum}.` };
    }
}
function tryParsePerson(result, schema) {
    const { id } = schema;
    if (!id) {
        return { message: `Missing "id" field in schema.` };
    }
    const resultMissingIdError = checkFieldIsPresent(result, id, schema_1.ValueType.Person);
    if (resultMissingIdError) {
        return resultMissingIdError;
    }
    if (!string_1.isEmail(result[id])) {
        return { message: `The id field for the person result must be an email string, but got "${result[id]}".` };
    }
}
function tryParseReference(_result, _schema) {
    // TODO: @alan-fang figure out references
    return [];
}
function checkFieldIsPresent(result, field, codaType) {
    if (!(field in result) || !result[field]) {
        return { message: `Codatype ${codaType} is missing required field "${field}".` };
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
    if (schema_2.isArray(schema)) {
        const arrayValidationErrors = validateArray(result, schema);
        if (arrayValidationErrors.length) {
            throw types_2.ResultValidationException.fromErrors(formula.name, arrayValidationErrors);
        }
        return;
    }
    if (!schema_3.isObject(schema)) {
        const error = { message: `Expected an object schema, but found ${JSON.stringify(schema)}.` };
        throw types_2.ResultValidationException.fromErrors(formula.name, [error]);
    }
    const errors = validateObject(result, schema);
    if (errors.length) {
        throw types_2.ResultValidationException.fromErrors(formula.name, errors);
    }
}
function validateObject(result, schema) {
    const errors = [];
    for (const [propertyKey, propertySchema] of Object.entries(schema.properties)) {
        const value = result[propertyKey];
        if (propertySchema.required && !value) {
            errors.push({
                message: `Schema declares required property "${propertyKey}" but this attribute is missing or empty.`,
            });
        }
        if (value) {
            const propertyLevelErrors = checkPropertyTypeAndCodaType(propertySchema, value, { propertyKey });
            errors.push(...propertyLevelErrors);
        }
    }
    if (schema.id && schema.id in result && !result[schema.id]) {
        errors.push({
            message: `Schema declares "${schema.id}" as an id property but an empty value was found in result.`,
        });
    }
    return errors;
}
function validateArray(result, schema, context) {
    if (!Array.isArray(result)) {
        const error = { message: `Expected an ${schema.type} result but got ${result}.` };
        return [error];
    }
    const arrayItemErrors = [];
    const itemType = schema.items;
    for (let i = 0; i < result.length; i++) {
        const item = result[i];
        const propertyLevelErrors = checkPropertyTypeAndCodaType(itemType, item, {
            propertyKey: context === null || context === void 0 ? void 0 : context.propertyKey,
            arrayIndex: i,
        });
        arrayItemErrors.push(...propertyLevelErrors);
    }
    return arrayItemErrors;
}
