import type {ObjectPackFormulaMetadata} from '../api';
import {ObjectSchemaProperty} from '../schema';
import type {ParamDefs} from '../api_types';
import type {ParameterError} from './types';
import {ParameterException} from './types';
import type {ResultValidationError} from './types';
import {ResultValidationException} from './types';
import {ScaleSchema} from '../schema';
import {Schema} from '../schema';
import {SliderSchema} from '../schema';
import {Type} from '../api_types';
import type {TypedPackFormula} from '../api';
import {ValueType} from '../schema';
import {ensure} from '../helpers/ensure';
import {ensureUnreachable} from '../helpers/ensure';
import {isArray} from '../schema';
import {isDefined} from '../helpers/object_utils';
import {isObject} from '../schema';
import {isObjectPackFormula} from '../api';
import {makeReferenceSchemaFromObjectSchema} from '../schema';
import * as schemaHelpers from './helpers/schema';

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

function checkCodaType<ResultT extends any>
    (schema: Schema & ObjectSchemaProperty, result: ResultT): ResultValidationError | undefined {
  switch (schema.codaType) {
    case ValueType.Date:
    case ValueType.DateTime:
      if (isNaN(Date.parse(result as string))) {
        return {message: `Failed to parse ${result} as a ${ValueType.Date}.`};
      }
      break;
    case ValueType.Time:
      // TODO: needs js-core/utils/time
      break;
    case ValueType.Duration:
      // TODO: needs common/formulas/private/duration
      break;
    case ValueType.Person:
      break;
    case ValueType.Markdown:
      // TODO: needs MarkdownRangesParser
      break;
    case ValueType.Embed:
      // TODO: needs modules/common/structured-value/index
      break;
    case ValueType.Reference:
      // TODO: needs modules/common/structured-value/index
      break;
    case ValueType.Image:
    case ValueType.ImageAttachment:
    case ValueType.Attachment:
      // TODO: needs modules/common/structured-value/index
      break;
    case ValueType.Slider:
      const {minimum, maximum} = schema as SliderSchema;
      if ((minimum && result < minimum) || (maximum && result > maximum)) {
        return {message: `Failed to parse ${result} as a ${ValueType.Slider}.`};
      }
      break;
    case ValueType.Scale:
      const {maximum: sliderMax} = schema as ScaleSchema;
      if (result > sliderMax) {
        return {message: `Failed to parse ${result} as a ${ValueType.Scale}.`};
      }
      break;
    case ValueType.Currency:
       // TODO: needs js-core/utils/currency
       break;
    default:
      // no need to coerce current result type
      break;
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

function checkPropertyType<ResultT extends any>(
  typeMatches: boolean,
  expectedPropertyTypeName: string,
  propertyValue: ResultT,
  propertyKey: string,
): ResultValidationError | undefined {
  if (checkType(typeMatches, expectedPropertyTypeName, propertyValue)) {
    const property = typeof propertyValue === 'string' ? `"${propertyValue}"` : propertyValue;
    return {message: `Expected a ${expectedPropertyTypeName} property for key ${propertyKey} but got ${property}.`};
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

    const typeCheck = value && 
      checkPropertyType(typeof value === propertySchema.type, propertySchema.type, value, propertyKey);
    if (typeCheck) {
      errors.push(typeCheck);
    }

    if (propertySchema.codaType) {
      const codaTypeCheck = value && checkCodaType(propertySchema, value);
      if (codaTypeCheck) {
        errors.push(codaTypeCheck);
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
