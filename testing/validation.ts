import type {ArraySchema} from '../schema';
import type {BaseStringSchema} from '../schema';
import type {GenericObjectSchema} from '../schema';
import type {ObjectPackFormulaMetadata} from '../api';
import type {ObjectSchemaProperty} from '../schema';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {ParameterError} from './types';
import {ParameterException} from './types';
import type {ProgressBarSchema} from '../schema';
import {ResultValidationContext} from './types';
import {ResultValidationException} from './types';
import type {ScaleSchema} from '../schema';
import type {Schema} from '../schema';
import type {SliderSchema} from '../schema';
import {Type} from '../api_types';
import type {TypedPackFormula} from '../api';
import type {ValidationError} from './types';
import {ValueHintType} from '../schema';
import {ValueType} from '../schema';
import {ensureExists} from '../helpers/ensure';
import {ensureUnreachable} from '../helpers/ensure';
import {isArray} from '../schema';
import {isDefined} from '../helpers/object_utils';
import {isEmail} from '../helpers/string';
import {isObject} from '../schema';
import {isObjectPackFormula} from '../api';
import {objectSchemaHelper} from '../helpers/migration';
import * as objectUtils from '../helpers/object_utils';
import urlParse from 'url-parse';

export function validateParams(formula: TypedPackFormula, args: ParamValues<ParamDefs>): void {
  const {parameters, varargParameters} = formula;
  const numRequiredParams = parameters.filter(param => !param.optional).length;
  if (args.length < numRequiredParams) {
    throw new ParameterException(
      `Expected at least ${numRequiredParams} parameter but only ${args.length} were provided.`,
    );
  }

  if (args.length > parameters.length && !varargParameters) {
    throw new ParameterException(
      `Formula only accepts ${parameters.length} parameters but ${args.length} were provided.`,
    );
  }

  const errors: ParameterError[] = [];
  for (let i = 0; i < parameters.length; i++) {
    const param = args[i];
    const paramDef = parameters[i];
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

function validateResultType<ResultT extends any>(resultType: Type, result: ResultT): ValidationError | undefined {
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
    case Type.file:
      return checkType(typeOfResult === 'string', 'file', result);
    case Type.image:
      return checkType(typeOfResult === 'string', 'image', result);
    case Type.markdown:
      return checkType(typeOfResult === 'string', 'markdown', result);
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
  context: ResultValidationContext,
  schema: Schema,
  result: any,
): ValidationError {
  const resultValue = typeof result === 'string' ? `"${result}"` : result;
  const objectTrace = context.generateFieldPath();

  return {
    message: `Expected a ${schema.type} property for ${objectTrace} but got ${resultValue}.`,
  };
}

function checkPropertyTypeAndCodaType<ResultT extends any>(
  schema: Schema & ObjectSchemaProperty,
  result: ResultT,
  context: ResultValidationContext,
): ValidationError[] {
  const errors = [generateErrorFromValidationContext(context, schema, result)];
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
        case ValueHintType.Slider:
        case ValueHintType.ProgressBar:
          const sliderErrorMessage = tryParseSlider(result, schema);
          return sliderErrorMessage ? [sliderErrorMessage] : [];
        case ValueHintType.Scale:
          const scaleErrorMessage = tryParseScale(result, schema);
          return scaleErrorMessage ? [scaleErrorMessage] : [];
        case ValueHintType.Date:
        case ValueHintType.DateTime:
        case ValueHintType.Duration:
        case ValueHintType.Time:
        case ValueHintType.Percent:
        case ValueHintType.Currency:
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
        case ValueHintType.Attachment:
        case ValueHintType.Embed:
        case ValueHintType.ImageReference:
        case ValueHintType.ImageAttachment:
        case ValueHintType.Url:
          const urlErrorMessage = tryParseUrl(result, schema);
          return urlErrorMessage ? [urlErrorMessage] : [];
        case ValueHintType.Email:
          const emailErrorMessage = tryParseEmail(result, schema);
          return emailErrorMessage ? [emailErrorMessage] : [];
        case ValueHintType.Date:
        case ValueHintType.DateTime:
          const dateTimeErrorMessage = tryParseDateTimeString(result, schema);
          return dateTimeErrorMessage ? [dateTimeErrorMessage] : [];
        case ValueHintType.Duration:
        case ValueHintType.Time:
          // TODO: investigate how to do this in a lightweight fashion.
          return [];
        case ValueHintType.Html:
        case ValueHintType.Markdown:
        case ValueHintType.SelectList:
        case undefined:
          // no need to coerce current result type
          return [];
        case ValueHintType.CodaInternalRichText:
          return [{message: `CodaInternalRichText is not supported in external packs.`}];
        default:
          ensureUnreachable(schema);
      }
    }
    case ValueType.Array:
      return validateArray(result, schema, context);
    case ValueType.Object: {
      const resultValidationError = checkType(typeof result === 'object', 'object', result);
      if (resultValidationError) {
        return errors;
      }
      switch (schema.codaType) {
        case ValueHintType.Person:
          const personErrorMessage = tryParsePerson(result, schema);
          return personErrorMessage ? [personErrorMessage] : [];
        case ValueHintType.Reference:
        // these are validated in the schema creation.
        case ValueHintType.SelectList:
        // SelectList only impacts column display formats, not what values are valid.
        case undefined:
          return validateObject(result as Record<string, unknown>, schema, context);
        default:
          ensureUnreachable(schema);
      }
    }
    default:
      return ensureUnreachable(schema);
  }
}

function tryParseDateTimeString(result: unknown, schema: BaseStringSchema) {
  const dateTime = result as string;
  if (isNaN(Date.parse(dateTime))) {
    return {message: `Failed to parse ${dateTime} as a ${schema.codaType}.`};
  }
}

function tryParseUrl(result: unknown, schema: BaseStringSchema) {
  const invalidUrlError = {
    message: `Property with codaType "${schema.codaType}" must be a valid HTTPS or data url, but got "${result}".`,
  };
  try {
    const url = urlParse(result as string);

    if (!(url.protocol === 'https:' || url.protocol === 'data:')) {
      return invalidUrlError;
    }
  } catch (error: any) {
    return invalidUrlError;
  }
}

function tryParseEmail(result: unknown, schema: BaseStringSchema): ValidationError | undefined {
  const invalidEmailError = {
    message: `Property with codaType "${schema.codaType}" must be a valid email address, but got "${result}".`,
  };
  if (!isEmail(result as string)) {
    return invalidEmailError;
  }
}

function tryParseSlider(result: unknown, schema: SliderSchema | ProgressBarSchema) {
  const value = result as number;
  const {minimum, maximum} = schema;
  if (typeof minimum !== 'string' && value < (minimum ?? 0)) {
    return {message: `Slider value ${result} is below the specified minimum value of ${minimum ?? 0}.`};
  }
  if (typeof maximum !== 'string' && maximum && value > maximum) {
    return {message: `Slider value ${result} is greater than the specified maximum value of ${maximum}.`};
  }
}

function tryParseScale(result: unknown, schema: ScaleSchema) {
  const {maximum} = schema;
  const value = result as number;
  if (!Number.isInteger(result)) {
    return {message: `Scale value ${result} must be an integer.`};
  }
  if (value < 0) {
    return {message: `Scale value ${result} cannot be below 0.`};
  }
  if (maximum && value > maximum) {
    return {message: `Scale value ${result} is greater than the specified maximum value of ${maximum}.`};
  }
}

function tryParsePerson(result: any, schema: GenericObjectSchema) {
  const {id} = objectSchemaHelper(schema);
  const validId = ensureExists(id);
  const idError = checkFieldInResult(result, validId);
  if (idError) {
    return idError;
  }

  if (!isEmail(result[validId] as string)) {
    return {message: `The id field for the person result must be an email string, but got "${result[validId]}".`};
  }
}

function checkFieldInResult(result: any, property: string) {
  if (!(property in result) || !result[property]) {
    return {
      message: `Schema declares required property "${property}" but this attribute is missing or empty.`,
    };
  }
}

function checkType<ResultT extends any>(
  typeMatches: boolean,
  expectedResultTypeName: string,
  result: ResultT,
): ValidationError | undefined {
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
  const validationContext = new ResultValidationContext();

  if (isArray(schema)) {
    const arrayValidationErrors = validateArray(
      result,
      schema,
      new ResultValidationContext().extendForProperty(formula.name),
    );
    if (arrayValidationErrors.length) {
      throw ResultValidationException.fromErrors(formula.name, arrayValidationErrors);
    }
    return;
  }

  if (!isObject(schema)) {
    const error: ValidationError = {message: `Expected an object schema, but found ${JSON.stringify(schema)}.`};
    throw ResultValidationException.fromErrors(formula.name, [error]);
  }
  const errors = validateObject(result, schema, validationContext);

  if (errors.length) {
    throw ResultValidationException.fromErrors(formula.name, errors);
  }
}

const ACCEPTED_FALSY_VALUES: any[] = [0];

function validateObject<ResultT extends Record<string, unknown>>(
  result: ResultT,
  schema: GenericObjectSchema,
  context: ResultValidationContext,
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [propertyKey, propertySchema] of Object.entries(schema.properties)) {
    const value = result[propertyKey];
    if (propertySchema.required && objectUtils.isNil(value)) {
      errors.push({
        message: `Schema declares required property "${propertyKey}" but this attribute is missing or empty.`,
      });
    }
    if (value) {
      const propertyLevelErrors = checkPropertyTypeAndCodaType(
        propertySchema,
        value,
        context.extendForProperty(propertyKey),
      );
      errors.push(...propertyLevelErrors);
    }
  }

  const schemaHelper = objectSchemaHelper(schema);
  const idValue = schemaHelper.id && schemaHelper.id in result ? result[schemaHelper.id] : undefined;
  // Some objects will return an id field of 0, but other falsy values (i.e. '') are more likely to be actual errors
  if (
    schemaHelper.id &&
    schemaHelper.id in result &&
    (!objectUtils.isDefined(idValue) || (!idValue && !ACCEPTED_FALSY_VALUES.includes(idValue)))
  ) {
    errors.push({
      message: `Schema declares "${schemaHelper.id}" as an id property but an empty value was found in result.`,
    });
  }
  return errors;
}

function validateArray<ResultT extends any>(
  result: ResultT,
  schema: ArraySchema<Schema>,
  context: ResultValidationContext,
): ValidationError[] {
  if (!Array.isArray(result)) {
    const error: ValidationError = {message: `Expected an ${schema.type} result but got ${result}.`};
    return [error];
  }
  const arrayItemErrors: ValidationError[] = [];
  const itemType = schema.items;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];

    const propertyLevelErrors = checkPropertyTypeAndCodaType(itemType, item, context.extendForIndex(i));
    arrayItemErrors.push(...propertyLevelErrors);
  }

  return arrayItemErrors;
}
