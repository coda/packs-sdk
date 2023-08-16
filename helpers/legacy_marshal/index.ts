import {legacyMarshalError} from './marshal_errors';
import {legacyUnmarshalError} from './marshal_errors';
import {marshalBuffer} from './marshal_buffer';
import {marshalDate} from './marshal_dates';
import {marshalNumber} from './marshal_numbers';
import {unmarshalBuffer} from './marshal_buffer';
import {unmarshalDate} from './marshal_dates';
import {unmarshalNumber} from './marshal_numbers';

// This marshaling logic so that the calc service can marshal parameters in a format
// that's understandable by packs that were built at old runtime versions. Newly-built
// packs will use the non-legacy marshaling logic which is far more memory-efficient:
// when this legacy version calls JSON.stringify() on a multi-megabyte value like
// a downloaded image, it can easily run out of memory.

// JSON has no native way to represent `undefined`.
const HACK_UNDEFINED_JSON_VALUE = '__CODA_UNDEFINED__';

const MaxTraverseDepth = 100;

const customMarshalers = [legacyMarshalError, marshalBuffer, marshalNumber, marshalDate];

const customUnmarshalers: Array<(val: any) => any> = [
  legacyUnmarshalError,
  unmarshalBuffer,
  unmarshalNumber,
  unmarshalDate,
];

function serialize(val: any): any {
  for (const marshaler of customMarshalers) {
    const result = marshaler(val);
    if (result !== undefined) {
      return result;
    }
  }

  return val;
}

function deserialize(_: string, val: any): any {
  if (val) {
    for (const unmarshaler of customUnmarshalers) {
      const result = unmarshaler(val);
      if (result !== undefined) {
        return result;
      }
    }
  }

  return val;
}

function processValue(val: any, depth: number = 0): any {
  if (depth >= MaxTraverseDepth) {
    // this is either a circular reference or a super nested value that we mostly likely
    // don't care about marshalling.
    return val;
  }

  if (val === undefined) {
    return HACK_UNDEFINED_JSON_VALUE;
  }

  if (val === null) {
    return val;
  }

  if (Array.isArray(val)) {
    return val.map(item => processValue(item, depth + 1));
  }

  const serializedValue = serialize(val);

  if (typeof serializedValue === 'object') {
    let objectValue = serializedValue;
    if ('toJSON' in serializedValue && typeof serializedValue.toJSON === 'function') {
      objectValue = serializedValue.toJSON();
    }

    // if val has a constructor that isn't recognized by customMarshalers, it will be
    // converted into a plain object.
    const processedValue: {[key: string]: any} = {};
    for (const key of Object.getOwnPropertyNames(objectValue)) {
      processedValue[key] = processValue(objectValue[key], depth + 1);
    }

    return processedValue;
  }

  return serializedValue;
}

export function marshalValueForAnyNodeVersion(val: any): string {
  // Instead of passing a replacer to `JSON.stringify`, we chose to preprocess the value before
  // passing it to `JSON.stringify`. The reason is that `JSON.stringify` may call the object toJSON
  // method before calling the replacer. In many cases, that means the replacer can't tell if the
  // input has been processed by toJSON or not. For example, Date.prototype.toJSON simply returns
  // a date string. The replacer can't identify if the initial value is a Date or a date string.
  //
  // processValue is trying to mimic the object processing of JSON but the behavior may not be
  // identical. It will only serve the purpose of our internal marshaling use case.
  const result = JSON.stringify(processValue(val));

  if (result === undefined) {
    // JSON.stringify() can return undefined if the input was a function, for example.
    return JSON.stringify(processValue(undefined));
  }

  return result;
}

/**
 * Use unmarshalValueFromString() instead. It can determine what type of marshaling was used and
 * call the correct unmarshal function, which gives us more flexibility to swap between marshaling
 * types in the future.
 */
export function internalUnmarshalValueForAnyNodeVersion(marshaledValue: string | undefined): any {
  if (marshaledValue === undefined) {
    return marshaledValue;
  }

  const parsed = JSON.parse(marshaledValue, deserialize);

  // JSON parsing can't populate `undefined` in deserialize b/c it's not a valid JSON value, so we make a 2nd pass.
  return reviveUndefinedValues(parsed);
}

export function legacyWrapError(err: Error): Error {
  // TODO(huayang): we do this for the sdk.
  // if (err.name === 'TypeError' && err.message === `Cannot read property 'body' of undefined`) {
  //   err.message +=
  //     '\nThis means your formula was invoked with a mock fetcher that had no response configured.' +
  //     '\nThis usually means you invoked your formula from the commandline with `coda execute` but forgot to ' +
  //     'add the --fetch flag ' +
  //     'to actually fetch from the remote API.';
  // }

  return new Error(marshalValueForAnyNodeVersion(err));
}

export function legacyUnwrapError(err: Error): Error {
  try {
    const unmarshaledValue = internalUnmarshalValueForAnyNodeVersion(err.message);
    if (unmarshaledValue instanceof Error) {
      return unmarshaledValue;
    }
    return err;
  } catch (_) {
    return err;
  }
}

// Recursively traverses objects/arrays
function reviveUndefinedValues(val: any): any {
  // Check null first b/c typeof null === 'object'
  if (val === null) {
    return val;
  }
  if (val === HACK_UNDEFINED_JSON_VALUE) {
    return undefined;
  }
  if (Array.isArray(val)) {
    return val.map(x => reviveUndefinedValues(x));
  }
  if (typeof val === 'object') {
    for (const key of Object.getOwnPropertyNames(val)) {
      val[key] = reviveUndefinedValues(val[key]);
    }
  }
  return val;
}
