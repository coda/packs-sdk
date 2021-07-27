import {marshalBuffer} from './marshal_buffer';
import {marshalDate} from './marshal_dates';
import {marshalError} from './marshal_errors';
import {marshalNumber} from './marshal_numbers';
import {unmarshalBuffer} from './marshal_buffer';
import {unmarshalDate} from './marshal_dates';
import {unmarshalError} from './marshal_errors';
import {unmarshalNumber} from './marshal_numbers';

const MaxTraverseDepth = 100;
const customMarshalers = [marshalError, marshalBuffer, marshalNumber, marshalDate];

const customUnmarshalers: Array<(val: any) => any> = [unmarshalError, unmarshalBuffer, unmarshalNumber, unmarshalDate];

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
    throw new Error('marshaling value is too deep or containing circular strcture');
  }

  if (val === undefined || val === null) {
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

export function marshalValue(val: any): string | undefined {
  // Instead of passing a replacer to `JSON.stringify`, we chose to preprocess the value before
  // passing it to `JSON.stringify`. The reason is that `JSON.stringify` may call the object toJSON
  // method before calling the replacer. In many cases, that means the replacer can't tell if the
  // input has been processed by toJSON or not. For example, Date.prototype.toJSON simply returns
  // a date string. The replacer can't identify if the initial value is a Date or a date string.
  //
  // processValue is trying to mimic the object processing of JSON but the behavior may not be
  // identical. It will only serve the purpose of our internal marshaling use case.
  return JSON.stringify(processValue(val));
}

export function unmarshalValue(marshaledValue: string | undefined): any {
  if (marshaledValue === undefined) {
    return marshaledValue;
  }

  return JSON.parse(marshaledValue, deserialize);
}

export function wrapError(err: Error): Error {
  // TODO(huayang): we do this for the sdk.
  // if (err.name === 'TypeError' && err.message === `Cannot read property 'body' of undefined`) {
  //   err.message +=
  //     '\nThis means your formula was invoked with a mock fetcher that had no response configured.' +
  //     '\nThis usually means you invoked your formula from the commandline with `coda execute` but forgot to ' +
  //     'add the --fetch flag ' +
  //     'to actually fetch from the remote API.';
  // }

  return new Error(marshalValue(err));
}

export function unwrapError(err: Error): Error {
  try {
    const unmarshaledValue = unmarshalValue(err.message);
    if (unmarshaledValue instanceof Error) {
      return unmarshaledValue;
    }
    return err;
  } catch (_) {
    return err;
  }
}
