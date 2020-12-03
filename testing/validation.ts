import type {ArraySchema} from '../schema';
import type {GenericObjectSchema} from '../schema';
import type {NumberHintTypes} from '../schema';
import type {NumberSchema} from '../schema';
import type {ObjectHintTypes} from '../schema';
import type {ObjectPackFormulaMetadata} from '../api';
import type {ObjectSchemaProperty} from '../schema';
import type {ParamDefs} from '../api_types';
import type {ParameterError} from './types';
import {ParameterException} from './types';
import type {ResultValidationError} from './types';
import {ResultValidationException} from './types';
import type {ScaleSchema} from '../schema';
import type {Schema} from '../schema';
import type {SliderSchema} from '../schema';
import type {StringHintTypes} from '../schema';
import type {StringSchema} from '../schema';
import {Type} from '../api_types';
import type {TypedPackFormula} from '../api';
import {URL} from 'url';
import type {ValidationContext} from './types';
import {ValueType} from '../schema';
import {ensureExists} from '../helpers/ensure';
import {ensureUnreachable} from '../helpers/ensure';
import {isArray} from '../schema';
import {isDefined} from '../helpers/object_utils';
import {isEmail} from '../helpers/string';
import {isObject} from '../schema';
import {isObjectPackFormula} from '../api';

// TODO: Handle varargs.
export function validateParams(formula: TypedPackFormula, params: ParamDefs): void {
  const numRequiredParams = formula.parameters.filter(param => !param.optional).length;
  if (params.length < numRequiredParams) {
    throw new ParameterException(
      `Expected at least ${numRequiredParams} parameter but only ${params.length} were provided.`,
    );
  }

  if (params.length > formula.parameters.length && !formula.varargParameters) {
    throw new ParameterException(
      `Formula only accepts ${formula.parameters.length} parameters but ${params.length} were provided.`,
    );
  }

  const errors: ParameterError[] = [];
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    const paramDef = formula.parameters[i];
    if (!paramDef.optional && !isDefined(param)) {
      errors.push({
        message: `Param ${i} "${paramDef.name}" is required but a value was not provided.`,
      });
    }
  }

  if (errors.length) {
    const errorMsgs = errors.map(error => error.message);
    throw new ParameterException(`The following parameter errors were found:\n${errorMsgs.join('\n')}`);
  }
}

export function validateResult<ResultT extends any>(formula: TypedPackFormula, result: ResultT): void {
  const maybeError = validateResultType(formula.resultType, result);
  if (maybeError) {
    throw ResultValidationException.fromErrors(formula.name, [maybeError]);
  }
  if (isObjectPackFormula(formula)) {
    // We've already validated that the result type is valid by this point.
    validateObjectResult(formula, result as Record<string, unknown>);
  }
}

function validateResultType<ResultT extends any>(resultType: Type, result: ResultT): ResultValidationError | undefined {
  if (!isDefined(result)) {
    return {message: `Expected a ${resultType} result but got ${result}.`};
  }
  const typeOfResult = typeof result;
  switch (resultType) {
    case Type.boolean:
      return checkType(typeOfResult === 'boolean', 'boolean', result);
    case Type.date:
      return checkType(result instanceof Date, 'date', result);
    case Type.html:
      return checkType(typeOfResult === 'string', 'html', result);
    case Type.image:
      return checkType(typeOfResult === 'string', 'image', result);
    case Type.number:
      return checkType(typeOfResult === 'number', 'number', result);
    case Type.object:
      return checkType(typeOfResult === 'object', 'object', result);
    case Type.string:
      return checkType(typeOfResult === 'string', 'string', result);
    default:
      return ensureUnreachable(resultType);
  }
}

function generateErrorFromValidationContext(
  context: ValidationContext,
  schema: Schema,
  result: any,
): ResultValidationError {
  const {propertyKey, arrayIndex} = context;
  ensureExists(
    [propertyKey, arrayIndex].some(value => value),
    'Must provide at least one of propertyKey, arrayIndex to ValidationContext',
  );
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

function checkPropertyTypeAndCodaType<ResultT extends any>(
  schema: Schema & ObjectSchemaProperty,
  result: ResultT,
  validationContext: ValidationContext,
): ResultValidationError[] {
  const errors = [generateErrorFromValidationContext(validationContext, schema, result)];
  switch (schema.type) {
    case ValueType.Boolean: {
      const resultValidationError = checkType(typeof result === 'boolean', 'boolean', result);
      return resultValidationError ? errors : [];
    }
    case ValueType.Number: {
      const resultValidationError = checkType(typeof result === 'number', 'number', result);
      if (resultValidationError) {
        return errors;
      }
      if (!('codaType' in schema)) {
        return [];
      }
      switch (schema.codaType) {
        case ValueType.Slider:
          const sliderErrorMessage = tryParseSlider(result, schema);
          return sliderErrorMessage ? [sliderErrorMessage] : [];
        case ValueType.Scale:
          const scaleErrorMessage = tryParseScale(result, schema);
          return scaleErrorMessage ? [scaleErrorMessage] : [];
        case ValueType.Date:
        case ValueType.DateTime:
        case ValueType.Time:
        case ValueType.Percent:
        case ValueType.Currency:
        case undefined:
          // no need to coerce current result type
          return [];
        default:
          return ensureUnreachable(schema);
      }
    }
    case ValueType.String: {
      const resultValidationError = checkType(typeof result === 'string', 'string', result);
      if (resultValidationError) {
        return errors;
      }
      switch (schema.codaType) {
        case ValueType.Attachment:
        case ValueType.Embed:
        case ValueType.Image:
        case ValueType.ImageAttachment:
        case ValueType.Url:
          const urlErrorMessage = tryParseUrl(result, schema);
          return urlErrorMessage ? [urlErrorMessage] : [];
        case ValueType.Date:
        case ValueType.DateTime:
          const dateTimeErrorMessage = tryParseDateTimeString(result, schema);
          return dateTimeErrorMessage ? [dateTimeErrorMessage] : [];
        case ValueType.Duration:
        case ValueType.Time:
          // TODO: investigate how to do this in a lightweight fashion.
          return [];
        case ValueType.Html:
        case ValueType.Markdown:
        case undefined:
          // no need to coerce current result type
          return [];
        default:
          ensureUnreachable(schema);
      }
    }
    case ValueType.Array:
      return validateArray(result, schema, {propertyKey: validationContext?.propertyKey});
    case ValueType.Object: {
      const resultValidationError = checkType(typeof result === 'object', 'object', result);
      if (resultValidationError) {
        return errors;
      }
      switch (schema.codaType) {
        case ValueType.Person:
          const personErrorMessage = tryParsePerson(result, schema);
          return personErrorMessage ? [personErrorMessage] : [];
        case ValueType.Reference:
          const referenceErrorMessages = tryParseReference(result, schema);
          return referenceErrorMessages ?? [];
        case undefined:
          // TODO: handle nested object validation.
          // no need to coerce current result type
          return [];
        default:
          ensureUnreachable(schema);
      }
    }
    default:
      return ensureUnreachable(schema);
  }
}

function tryParseDateTimeString(result: unknown, schema: StringSchema) {
  const dateTime = result as string;
  if (isNaN(Date.parse(dateTime))) {
    return {message: `Failed to parse ${dateTime} as a ${schema.codaType}.`};
  }
}

function tryParseUrl(result: unknown, schema: StringSchema) {
  const invalidUrlError = {
    message: `Property with codaType "${schema.codaType}" must be a valid HTTP(S) url, but got "${result}".`,
  };
  try {
    const url = new URL(result as string);

    if (!(url.protocol === 'http:' || url.protocol === 'https:')) {
      return invalidUrlError;
    }
  } catch (error) {
    return invalidUrlError;
  }
}

function tryParseSlider(result: unknown, schema: NumberSchema) {
  const value = result as number;
  const {minimum, maximum} = schema as SliderSchema;
  if (value < (minimum ?? 0)) {
    return {message: `Slider value ${result} is below the specified minimum value of ${minimum ?? 0}.`};
  }
  if (maximum && value > maximum) {
    return {message: `Slider value ${result} is greater than the specified maximum value of ${maximum}.`};
  }
}

function tryParseScale(result: unknown, schema: NumberSchema) {
  const {maximum} = schema as ScaleSchema;
  const value = result as number;
  if (!Number.isInteger(result)) {
    return {message: `Scale value ${result} must be an integer.`};
  }
  if (value < 0) {
    return {message: `Scale value ${result} cannot be below 0.`};
  }
  if (value > maximum) {
    return {message: `Scale value ${result} is greater than the specified maximum value of ${maximum}.`};
  }
}

function tryParsePerson(result: any, schema: GenericObjectSchema) {
  const {id} = schema;
  if (!id) {
    return {message: `Missing "id" field in schema.`};
  }

  const resultMissingIdError = checkFieldIsPresent(result, id, ValueType.Person);
  if (resultMissingIdError) {
    return resultMissingIdError;
  }

  if (!isEmail(result[id] as string)) {
    return {message: `The id field for the person result must be an email string, but got "${result[id]}".`};
  }
}

function tryParseReference(_result: any, _schema: GenericObjectSchema): ResultValidationError[] {
  // TODO: @alan-fang figure out references
  return [];
}

function checkFieldIsPresent(
  result: any,
  field: string,
  codaType: NumberHintTypes | StringHintTypes | ObjectHintTypes,
) {
  if (!(field in result) || !result[field]) {
    return {message: `Codatype ${codaType} is missing required field "${field}".`};
  }
}

function checkType<ResultT extends any>(
  typeMatches: boolean,
  expectedResultTypeName: string,
  result: ResultT,
): ResultValidationError | undefined {
  if (!typeMatches) {
    const resultValue = typeof result === 'string' ? `"${result}"` : result;
    return {message: `Expected a ${expectedResultTypeName} result but got ${resultValue}.`};
  }
}

function validateObjectResult<ResultT extends Record<string, unknown>>(
  formula: ObjectPackFormulaMetadata,
  result: ResultT,
): void {
  const {schema} = formula;
  if (!schema) {
    return;
  }

  if (isArray(schema)) {
    const arrayValidationErrors = validateArray(result, schema);
    if (arrayValidationErrors.length) {
      throw ResultValidationException.fromErrors(formula.name, arrayValidationErrors);
    }
    return;
  }

  if (!isObject(schema)) {
    const error: ResultValidationError = {message: `Expected an object schema, but found ${JSON.stringify(schema)}.`};
    throw ResultValidationException.fromErrors(formula.name, [error]);
  }
  const errors = validateObject(result, schema);

  if (errors.length) {
    throw ResultValidationException.fromErrors(formula.name, errors);
  }
}

function validateObject<ResultT extends Record<string, unknown>>(
  result: ResultT,
  schema: GenericObjectSchema,
): ResultValidationError[] {
  const errors: ResultValidationError[] = [];

  for (const [propertyKey, propertySchema] of Object.entries(schema.properties)) {
    const value = result[propertyKey];
    if (propertySchema.required && !value) {
      errors.push({
        message: `Schema declares required property "${propertyKey}" but this attribute is missing or empty.`,
      });
    }
    if (value) {
      const propertyLevelErrors = checkPropertyTypeAndCodaType(propertySchema, value, {propertyKey});
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

function validateArray<ResultT extends any>(
  result: ResultT,
  schema: ArraySchema<Schema>,
  context?: ValidationContext,
): ResultValidationError[] {
  if (!Array.isArray(result)) {
    const error: ResultValidationError = {message: `Expected an ${schema.type} result but got ${result}.`};
    return [error];
  }

  const arrayItemErrors: ResultValidationError[] = [];
  const itemType = schema.items;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
    const propertyLevelErrors = checkPropertyTypeAndCodaType(itemType, item, {
      propertyKey: context?.propertyKey,
      arrayIndex: i,
    });
    arrayItemErrors.push(...propertyLevelErrors);
  }

  return arrayItemErrors;
}
