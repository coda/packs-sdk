"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResult = exports.validateParams = void 0;
const types_1 = require("./types");
const types_2 = require("./types");
const types_3 = require("./types");
const api_types_1 = require("../api_types");
const schema_1 = require("../schema");
const schema_2 = require("../schema");
const ensure_1 = require("../helpers/ensure");
const ensure_2 = require("../helpers/ensure");
const schema_3 = require("../schema");
const object_utils_1 = require("../helpers/object_utils");
const string_1 = require("../helpers/string");
const schema_4 = require("../schema");
const api_1 = require("../api");
const migration_1 = require("../helpers/migration");
const objectUtils = __importStar(require("../helpers/object_utils"));
const url_parse_1 = __importDefault(require("url-parse"));
function validateParams(formula, args) {
    const { parameters, varargParameters } = formula;
    const numRequiredParams = parameters.filter(param => !param.optional).length;
    if (args.length < numRequiredParams) {
        throw new types_1.ParameterException(`Expected at least ${numRequiredParams} parameter but only ${args.length} were provided.`);
    }
    if (args.length > parameters.length && !varargParameters) {
        throw new types_1.ParameterException(`Formula only accepts ${parameters.length} parameters but ${args.length} were provided.`);
    }
    const errors = [];
    for (let i = 0; i < parameters.length; i++) {
        const param = args[i];
        const paramDef = parameters[i];
        if (!paramDef.optional && !(0, object_utils_1.isDefined)(param)) {
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
        throw types_3.ResultValidationException.fromErrors(formula.name, [maybeError]);
    }
    if ((0, api_1.isObjectPackFormula)(formula)) {
        // We've already validated that the result type is valid by this point.
        validateObjectResult(formula, result);
    }
}
exports.validateResult = validateResult;
function validateResultType(resultType, result) {
    if (!(0, object_utils_1.isDefined)(result)) {
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
        case api_types_1.Type.file:
            return checkType(typeOfResult === 'string', 'file', result);
        case api_types_1.Type.image:
            return checkType(typeOfResult === 'string', 'image', result);
        case api_types_1.Type.markdown:
            return checkType(typeOfResult === 'string', 'markdown', result);
        case api_types_1.Type.number:
            return checkType(typeOfResult === 'number', 'number', result);
        case api_types_1.Type.object:
            return checkType(typeOfResult === 'object', 'object', result);
        case api_types_1.Type.string:
            return checkType(typeOfResult === 'string', 'string', result);
        default:
            return (0, ensure_2.ensureUnreachable)(resultType);
    }
}
function generateErrorFromValidationContext(context, schema, result) {
    const resultValue = typeof result === 'string' ? `"${result}"` : result;
    const objectTrace = context.generateFieldPath();
    return {
        message: `Expected a ${schema.type} property for ${objectTrace} but got ${resultValue}.`,
    };
}
function checkPropertyTypeAndCodaType(schema, result, context) {
    const errors = [generateErrorFromValidationContext(context, schema, result)];
    switch (schema.type) {
        case schema_2.ValueType.Boolean: {
            const resultValidationError = checkType(typeof result === 'boolean', 'boolean', result);
            return resultValidationError ? errors : [];
        }
        case schema_2.ValueType.Number: {
            const resultValidationError = checkType(typeof result === 'number', 'number', result);
            if (resultValidationError) {
                return errors;
            }
            if (!('codaType' in schema)) {
                return [];
            }
            switch (schema.codaType) {
                case schema_1.ValueHintType.Slider:
                case schema_1.ValueHintType.ProgressBar:
                    const sliderErrorMessage = tryParseSlider(result, schema);
                    return sliderErrorMessage ? [sliderErrorMessage] : [];
                case schema_1.ValueHintType.Scale:
                    const scaleErrorMessage = tryParseScale(result, schema);
                    return scaleErrorMessage ? [scaleErrorMessage] : [];
                case schema_1.ValueHintType.Date:
                case schema_1.ValueHintType.DateTime:
                case schema_1.ValueHintType.Duration:
                case schema_1.ValueHintType.Time:
                case schema_1.ValueHintType.Percent:
                case schema_1.ValueHintType.Currency:
                case undefined:
                    // no need to coerce current result type
                    return [];
                default:
                    return (0, ensure_2.ensureUnreachable)(schema);
            }
        }
        case schema_2.ValueType.String: {
            const resultValidationError = checkType(typeof result === 'string', 'string', result);
            if (resultValidationError) {
                return errors;
            }
            switch (schema.codaType) {
                case schema_1.ValueHintType.Attachment:
                case schema_1.ValueHintType.Embed:
                case schema_1.ValueHintType.ImageReference:
                case schema_1.ValueHintType.ImageAttachment:
                case schema_1.ValueHintType.Url:
                    const urlErrorMessage = tryParseUrl(result, schema);
                    return urlErrorMessage ? [urlErrorMessage] : [];
                case schema_1.ValueHintType.Email:
                    const emailErrorMessage = tryParseEmail(result, schema);
                    return emailErrorMessage ? [emailErrorMessage] : [];
                case schema_1.ValueHintType.Date:
                case schema_1.ValueHintType.DateTime:
                    const dateTimeErrorMessage = tryParseDateTimeString(result, schema);
                    return dateTimeErrorMessage ? [dateTimeErrorMessage] : [];
                case schema_1.ValueHintType.Duration:
                case schema_1.ValueHintType.Time:
                    // TODO: investigate how to do this in a lightweight fashion.
                    return [];
                case schema_1.ValueHintType.Html:
                case schema_1.ValueHintType.Markdown:
                case schema_1.ValueHintType.SelectList:
                case undefined:
                    // no need to coerce current result type
                    return [];
                case schema_1.ValueHintType.CodaInternalRichText:
                    return [{ message: `CodaInternalRichText is not supported in external packs.` }];
                default:
                    (0, ensure_2.ensureUnreachable)(schema);
            }
        }
        case schema_2.ValueType.Array:
            return validateArray(result, schema, context);
        case schema_2.ValueType.Object: {
            const resultValidationError = checkType(typeof result === 'object', 'object', result);
            if (resultValidationError) {
                return errors;
            }
            switch (schema.codaType) {
                case schema_1.ValueHintType.Person:
                    const personErrorMessage = tryParsePerson(result, schema);
                    return personErrorMessage ? [personErrorMessage] : [];
                case schema_1.ValueHintType.Reference:
                // these are validated in the schema creation.
                case schema_1.ValueHintType.SelectList:
                // SelectList only impacts column display formats, not what values are valid.
                case undefined:
                    return validateObject(result, schema, context);
                default:
                    (0, ensure_2.ensureUnreachable)(schema);
            }
        }
        default:
            return (0, ensure_2.ensureUnreachable)(schema);
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
        message: `Property with codaType "${schema.codaType}" must be a valid HTTPS or data url, but got "${result}".`,
    };
    try {
        const url = (0, url_parse_1.default)(result);
        if (!(url.protocol === 'https:' || url.protocol === 'data:')) {
            return invalidUrlError;
        }
    }
    catch (error) {
        return invalidUrlError;
    }
}
function tryParseEmail(result, schema) {
    const invalidEmailError = {
        message: `Property with codaType "${schema.codaType}" must be a valid email address, but got "${result}".`,
    };
    if (!(0, string_1.isEmail)(result)) {
        return invalidEmailError;
    }
}
function tryParseSlider(result, schema) {
    const value = result;
    const { minimum, maximum } = schema;
    if (typeof minimum !== 'string' && value < (minimum !== null && minimum !== void 0 ? minimum : 0)) {
        return { message: `Slider value ${result} is below the specified minimum value of ${minimum !== null && minimum !== void 0 ? minimum : 0}.` };
    }
    if (typeof maximum !== 'string' && maximum && value > maximum) {
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
    if (maximum && value > maximum) {
        return { message: `Scale value ${result} is greater than the specified maximum value of ${maximum}.` };
    }
}
function tryParsePerson(result, schema) {
    const { id } = (0, migration_1.objectSchemaHelper)(schema);
    const validId = (0, ensure_1.ensureExists)(id);
    const idError = checkFieldInResult(result, validId);
    if (idError) {
        return idError;
    }
    if (!(0, string_1.isEmail)(result[validId])) {
        return { message: `The id field for the person result must be an email string, but got "${result[validId]}".` };
    }
}
function checkFieldInResult(result, property) {
    if (!(property in result) || !result[property]) {
        return {
            message: `Schema declares required property "${property}" but this attribute is missing or empty.`,
        };
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
    const validationContext = new types_2.ResultValidationContext();
    if ((0, schema_3.isArray)(schema)) {
        const arrayValidationErrors = validateArray(result, schema, new types_2.ResultValidationContext().extendForProperty(formula.name));
        if (arrayValidationErrors.length) {
            throw types_3.ResultValidationException.fromErrors(formula.name, arrayValidationErrors);
        }
        return;
    }
    if (!(0, schema_4.isObject)(schema)) {
        const error = { message: `Expected an object schema, but found ${JSON.stringify(schema)}.` };
        throw types_3.ResultValidationException.fromErrors(formula.name, [error]);
    }
    const errors = validateObject(result, schema, validationContext);
    if (errors.length) {
        throw types_3.ResultValidationException.fromErrors(formula.name, errors);
    }
}
const ACCEPTED_FALSY_VALUES = [0];
function validateObject(result, schema, context) {
    const errors = [];
    for (const [propertyKey, propertySchema] of Object.entries(schema.properties)) {
        const value = result[propertyKey];
        if (propertySchema.required && objectUtils.isNil(value)) {
            errors.push({
                message: `Schema declares required property "${propertyKey}" but this attribute is missing or empty.`,
            });
        }
        if (value) {
            const propertyLevelErrors = checkPropertyTypeAndCodaType(propertySchema, value, context.extendForProperty(propertyKey));
            errors.push(...propertyLevelErrors);
        }
    }
    const schemaHelper = (0, migration_1.objectSchemaHelper)(schema);
    const idValue = schemaHelper.id && schemaHelper.id in result ? result[schemaHelper.id] : undefined;
    // Some objects will return an id field of 0, but other falsy values (i.e. '') are more likely to be actual errors
    if (schemaHelper.id &&
        schemaHelper.id in result &&
        (!objectUtils.isDefined(idValue) || (!idValue && !ACCEPTED_FALSY_VALUES.includes(idValue)))) {
        errors.push({
            message: `Schema declares "${schemaHelper.id}" as an id property but an empty value was found in result.`,
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
        const propertyLevelErrors = checkPropertyTypeAndCodaType(itemType, item, context.extendForIndex(i));
        arrayItemErrors.push(...propertyLevelErrors);
    }
    return arrayItemErrors;
}
