import {NumberSchema} from '../schema';
import type {ObjectPackFormulaMetadata} from '../api';
import {ObjectSchemaProperty} from '../schema';
import type {ParamDefs} from '../api_types';
import type {ParameterError} from './types';
import {ParameterException} from './types';
import type {ResultValidationError} from './types';
import {ResultValidationException} from './types';
import type {ScaleSchema} from '../schema';
import type {Schema} from '../schema';
import type {SliderSchema} from '../schema';
import {StringSchema} from '../schema';
import {Type} from '../api_types';
import type {TypedPackFormula} from '../api';
import {ValueType} from '../schema';
import {ensureUnreachable} from '../helpers/ensure';
import {isArray} from '../schema';
import {isDefined} from '../helpers/object_utils';
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

function checkPropertyTypeAndCodaType<ResultT extends any>
    (schema: Schema & ObjectSchemaProperty, key: string, result: ResultT): ResultValidationError | undefined {
  const resultValue = typeof result === 'string' ? `"${result}"` : result;
  const typeValidationError = {message: `Expected a ${schema.type} property for key ${key} but got ${resultValue}.`};
  switch (schema.type) {
    case ValueType.Boolean:
      return checkType(typeof result === 'boolean', 'boolean', result);
    case ValueType.Number:
      {
        const resultValidationError = checkType(typeof result === 'number', 'number', result);
        if (resultValidationError) {
          return typeValidationError;
        }
        if(!('codaType' in schema)) {
          return;
        }
        switch (schema.codaType) {
          case ValueType.Slider:
            return tryParseSlider(result, schema);
          case ValueType.Scale:
            return tryParseScale(result, schema);
          case ValueType.Date:
          case ValueType.DateTime:
          case ValueType.Time:
          case ValueType.Percent:
          case ValueType.Currency:
          case undefined:
            // no need to coerce current result type
            return;
          default:
            return ensureUnreachable(schema);
        }
      }
    case ValueType.String:
      {
        const resultValidationError = checkType(typeof result === 'string', 'string', result);
        if (resultValidationError) {
          return typeValidationError;
        }
        switch (schema.codaType) {
          case ValueType.Attachment:
          case ValueType.Embed:
          case ValueType.Image:
          case ValueType.ImageAttachment:
          case ValueType.Url:
            return tryParseUrl(result, schema);
          case ValueType.Date:
          case ValueType.DateTime:
            return tryParseDateTimeString(result, schema);
          case ValueType.Duration:
          case ValueType.Time:
            // TODO: investigate how to do this in a lightweight fashion.
            return;
          case ValueType.Html:
          case ValueType.Markdown:
          case undefined:
            // no need to coerce current result type
            return;
        default:
          ensureUnreachable(schema);
        }
      }
    case ValueType.Array:
      // TODO: handle array
      break;
    case ValueType.Object:
      {
        const resultValidationError = checkType(typeof result === 'object', 'object', result);
        if (resultValidationError) {
          return typeValidationError;
        }
        switch (schema.codaType) {
          case ValueType.Person:
          case ValueType.Reference:
            // TODO: fill these in after adding in type defs for persons and references.
          case undefined:
            // no need to coerce current result type
            return;
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
  const url = result as string;
  if (!url.startsWith('http')) {
    return {message: `${url} must be a url-like string and use HTTP/HTTPS for type ${schema.codaType}.`};
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
    // TODO(jonathan): Validate object arrays.
    return;
  }

  if (!isObject(schema)) {
    const error: ResultValidationError = {message: `Expected an object schema, but found ${JSON.stringify(schema)}.`};
    throw ResultValidationException.fromErrors(formula.name, [error]);
  }
  const errors: ResultValidationError[] = [];

  for (const [propertyKey, propertySchema] of Object.entries(schema.properties)) {
    const value = result[propertyKey];
    if (propertySchema.required && !value) {
      errors.push({
        message: `Schema declares required property "${propertyKey}" but this attribute is missing or empty.`,
      });
    }
    if (value) {
      const propertyLevelError = checkPropertyTypeAndCodaType(propertySchema, propertyKey, value);
      if (propertyLevelError) {
        errors.push(propertyLevelError);
      }
    }
  }

  if (schema.id && schema.id in result && !result[schema.id]) {
    errors.push({
      message: `Schema declares "${schema.id}" as an id property but an empty value was found in result.`,
    });
  }

  if (errors.length) {
    throw ResultValidationException.fromErrors(formula.name, errors);
  }
}
